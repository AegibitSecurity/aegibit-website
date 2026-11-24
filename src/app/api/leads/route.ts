import { Resend } from "resend";
import { NextRequest, NextResponse, after } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { leadSchema, sanitizeString } from "@/lib/validators";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";
import { requireAdmin } from "@/lib/auth";
import {
  classifyLead,
  fetchVisitorJourney,
  renderJourneyHtml,
  type LeadHeat,
  type VisitorJourney,
} from "@/lib/hot-lead";
import { notifySlackLead } from "@/lib/slack-hot-lead";
import { sendEnquiryEmail } from "@/lib/send-enquiry-email";
import { SITE_URL } from "@/lib/seo";

const SOURCE_LABELS: Record<string, string> = {
  waitlist:           "Waitlist Signup",
  contact:            "Contact Form",
  demo:               "Demo Request",
  exit_intent:        "Exit Intent Popup",
  paymint_demo:       "PayMint Demo Request",
  voicecore_waitlist: "VoiceCore Early Access",
  aira_waitlist:      "Aira Early Access",
  chat:               "Aira Chat",
  // Free-tool lead-magnet captures (M-1, M-2). Each export through
  // /api/paymint-snapshot/email or /api/mcp-scan/email writes a row
  // here so they show up in /dashboard/leads alongside organic
  // inbound. The page on which the export originated is the source
  // of truth for which product to route the follow-up to.
  snapshot_export:    "PayMint Snapshot Export",
  scan_export:        "MCP Shield Scan Export",
};

async function notifyTeam(data: {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;
  page: string;
  message?: string;
  heat: LeadHeat;
  journey: VisitorJourney | null;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email][team] skipped, RESEND_API_KEY not set");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const label = SOURCE_LABELS[data.source] ?? data.source;
    const isHot = data.heat === "hot";

    // Comma-separated recipient list from env so we can fan out alerts
    // to multiple founders/inboxes without redeploys.
    const teamRecipients = (process.env.TEAM_NOTIFY_EMAILS ?? "contact@aegibit.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Subject line tells the founder, in one line, whether to drop
    // everything. Hot leads include time-on-site + scroll depth so the
    // urgency is obvious from the inbox preview alone.
    const subject = isHot
      ? `🔥 HOT LEAD, ${data.name ? `${data.name} · ` : ""}${data.email}${data.journey ? ` · ${data.journey.pages_viewed.length} pages · ${Math.floor(data.journey.time_on_site_seconds / 60)}m on site` : ""}`
      : `🔔 New ${label}, ${data.email}`;

    const heatBadge = isHot
      ? `<span style="background:#EF4444;color:#fff;font-weight:700;padding:4px 10px;border-radius:6px;font-size:12px;letter-spacing:0.1em;">🔥 HOT LEAD</span>`
      : `<span style="background:#F97316;color:#000;font-weight:700;padding:4px 10px;border-radius:6px;font-size:12px;">${label.toUpperCase()}</span>`;

    const headline = isHot
      ? `Drop what you're doing. Reply in the next 5 minutes.`
      : `New lead from aegibit.com`;

    const subhead = isHot
      ? `<p style="color:#FCA5A5;font-size:13px;margin:0 0 20px;line-height:1.6;">Inbound leads contacted within 5 minutes are ~9× more likely to convert vs. within an hour. The visitor's session below shows what they cared about, open with that.</p>`
      : "";

    const replyButton = isHot
      ? `<a href="mailto:${data.email}" style="background:#EF4444;color:#fff;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block;letter-spacing:0.02em;">📞 Reply to ${data.email} now</a>`
      : `<a href="mailto:${data.email}" style="background:#F97316;color:#000;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;display:inline-block;">Reply to ${data.email}</a>`;

    const html = `
        <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#eaeaea;padding:28px;border-radius:10px;border:1px solid ${isHot ? "rgba(239,68,68,0.4)" : "#222"};${isHot ? "box-shadow:0 0 40px rgba(239,68,68,0.15);" : ""}">
          <div style="margin-bottom:20px;">${heatBadge}</div>
          <h2 style="color:#fff;margin:0 0 12px;font-size:${isHot ? "20px" : "18px"};line-height:1.3;">${headline}</h2>
          ${subhead}
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <tr style="border-bottom:1px solid #222;">
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;width:90px;">Email</td>
              <td style="padding:10px 0;font-size:13px;"><a href="mailto:${data.email}" style="color:#F97316;text-decoration:none;">${data.email}</a></td>
            </tr>
            ${data.name    ? `<tr style="border-bottom:1px solid #222;"><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Name</td><td style="padding:10px 0;font-size:13px;">${sanitizeString(data.name)}</td></tr>` : ""}
            ${data.company ? `<tr style="border-bottom:1px solid #222;"><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Company</td><td style="padding:10px 0;font-size:13px;">${sanitizeString(data.company)}</td></tr>` : ""}
            ${data.phone   ? `<tr style="border-bottom:1px solid #222;"><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Phone</td><td style="padding:10px 0;font-size:13px;"><a href="tel:${sanitizeString(data.phone)}" style="color:#F97316;text-decoration:none;">${sanitizeString(data.phone)}</a></td></tr>` : ""}
            <tr style="border-bottom:1px solid #222;">
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;">Source</td>
              <td style="padding:10px 0;font-size:13px;">${label}</td>
            </tr>
            <tr ${data.message ? 'style="border-bottom:1px solid #222;"' : ""}>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;">Page</td>
              <td style="padding:10px 0;font-size:13px;color:#6b7280;">${sanitizeString(data.page)}</td>
            </tr>
            ${data.message ? `<tr><td style="padding:10px 0;color:#9ca3af;font-size:13px;vertical-align:top;">Message</td><td style="padding:10px 0;font-size:13px;color:#cbd5e1;line-height:1.5;">${sanitizeString(data.message).replace(/\n/g, "<br>")}</td></tr>` : ""}
          </table>
          ${data.journey ? renderJourneyHtml(data.journey) : ""}
          <div style="margin-top:24px;">${replyButton}</div>
          <p style="color:#374151;font-size:11px;margin:20px 0 0;">aegibit.com · Auto-notification${isHot ? " · classified as HOT by /api/leads" : ""}</p>
        </div>
      `;

    const result = await resend.emails.send({
      from:    "AEGIBIT <noreply@aegibit.com>",
      to:      teamRecipients,
      replyTo: [data.email],
      subject,
      html,
    });

    if (result.error) {
      const msg = JSON.stringify(result.error);
      console.error("[email][team] Resend API error:", msg);
      return { ok: false, error: msg };
    }
    console.log(`[email][team] sent (${data.heat}). id:`, result.data?.id);
    return { ok: true, id: result.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email][team] exception:", msg);
    return { ok: false, error: msg };
  }
}

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

  const { error } = await supabase.from("leads").insert({
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
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  // Return only after persistence succeeds. Notification work runs within
  // Next's managed post-response lifetime; provider latency cannot strand the form.
  after(async () => {
    // Pull the visitor's session before composing the team email so the
    // hot-lead enrichment has data to work with. Best-effort, null
    // journey just falls back to the standard email body.
    const journey = await fetchVisitorJourney(data.visitorId ?? null);
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
      notifyTeam({
        email:   data.email,
        name:    data.name,
        company: data.company,
        phone:   data.phone,
        source:  data.source,
        page:    data.page,
        message: data.message,
        heat,
        journey,
      }),
      sendEnquiryEmail({
        email:  data.email,
        name:   data.name,
        source: data.source,
        company: data.company,
        message: data.message,
      }),
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
      channel: ["team_email", "confirmation_email", "slack"][index],
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
  return NextResponse.json({ leads: data }, { headers: { "Cache-Control": "private, no-store" } });
}
