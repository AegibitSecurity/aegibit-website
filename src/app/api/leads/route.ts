import { randomUUID } from "node:crypto";
import { queueEnquiry, processEnquiry, enquiryDelivery } from "@/lib/enquiry-outbox";
import { NextRequest, NextResponse, after } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { leadSchema, sanitizeString } from "@/lib/validators";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";
import { requireAdmin } from "@/lib/auth";
import {
  classifyLead,
  fetchVisitorJourney,
} from "@/lib/hot-lead";
import { notifySlackLead } from "@/lib/slack-hot-lead";
import { SITE_URL } from "@/lib/seo";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(leadLimiter, ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = getServiceClient();

  const enquiryId = randomUUID();
  try { await queueEnquiry(enquiryId); } catch { return NextResponse.json({ error: "Enquiry delivery is temporarily unavailable. Please retry or email contact@aegibit.com." }, { status: 503 }); }
  const { error } = await supabase.from("leads").insert({
    id: enquiryId,
    name:       sanitizeString(data.name),
    email:      data.email.toLowerCase().trim(),
    company:    sanitizeString(data.company),
    phone:      sanitizeString(data.phone),
    team_size:  sanitizeString(data.teamSize),
    message:    sanitizeString(data.source === "chat" ? `[Chat follow-up consent recorded ${new Date().toISOString()}; no marketing subscription]\n${data.message ?? ""}` : data.message),
    source:     data.source,
    page:       sanitizeString(data.page),
    visitor_id: data.visitorId ?? null,
    status:     "new",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "An enquiry already exists for this email. Please reply to your acknowledgement or email contact@aegibit.com with your additional requirements." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  // Return only after persistence succeeds. Notification work runs within
  // Next's managed post-response lifetime; provider latency cannot strand the form.
  after(async () => {
    // Pull the visitor's session before composing the team email so the
    // hot-lead enrichment has data to work with. Best-effort, null
    // journey just falls back to the standard email body.
    const emailWork = processEnquiry(enquiryId).catch(() => ({ ok: false }));
    const journey = await fetchVisitorJourney(data.visitorId ?? null).catch(() => null);
    const heat = classifyLead({
      source: data.source,
      message: data.message,
      journey,
    });

    // Fire team email + Slack push + lead confirmation email in parallel.
    // All three are best-effort, lead capture has already succeeded by
    // this point and a downstream notifier outage must not 500 the form.
    // Slack only fires when SLACK_HOT_LEAD_WEBHOOK_URL is set; absent =
    // silent skip.
    const results = await Promise.allSettled([
      emailWork,
      notifySlackLead({
        email:   data.email,
        name:    data.name,
        company: data.company,
        phone:   data.phone,
        source:  data.source,
        page:    data.page,
        message: data.message,
        heat,
        journey,
        siteUrl: SITE_URL,
      }),
    ]);

    console.info("[enquiry-notifications]", results.map((result, index) => ({
      channel: ["email_queue", "slack"][index],
      ok: result.status === "fulfilled" && (typeof result.value === "boolean" ? result.value : result.value.ok),
    })));
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  const leads = await Promise.all((data ?? []).map(async lead => ({ ...lead, delivery: await enquiryDelivery(lead.id).catch(() => ({ acknowledgement: "unavailable", ownerNotification: "unavailable", followup: "unavailable" })) })));
  return NextResponse.json({ leads }, { headers: { "Cache-Control": "private, no-store" } });
}
