import { NextRequest, NextResponse } from "next/server";
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
};

// Confirmation email sent to the lead themselves so they know the request
// was received + sets warm next-step expectations. Premium tone, brand-grade.
async function sendConfirmation(data: {
  email: string;
  name?: string;
  source: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] confirmation skipped — RESEND_API_KEY not set");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const isPayMint = data.source === "paymint_demo";
  const subject = isPayMint
    ? "Your PayMint demo is being prepared — AEGIBIT"
    : "We received your request — AEGIBIT";
  const heading = isPayMint
    ? "Your PayMint demo is on the way."
    : "Thanks — we received your request.";
  const intro = isPayMint
    ? "A PayMint specialist will reach out within 24 business hours to schedule a 20-minute live demo, walk you through multi-branch expense management, and answer anything specific to your operation."
    : "A member of the AEGIBIT team will reach out within 24 business hours.";

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "AEGIBIT <noreply@aegibit.com>",
      to: [data.email],
      replyTo: ["contact@aegibit.com"],
      subject,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#000;color:#fff;padding:40px 32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
            <div style="width:32px;height:32px;border-radius:7px;background:#000;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(249,115,22,0.4);">
              <span style="color:#F97316;font-size:18px;font-weight:700;">✓</span>
            </div>
            <span style="font-size:16px;font-weight:300;letter-spacing:0.18em;">
              <span style="color:#fff;">AEGI</span><span style="color:#F97316;">BIT</span>
            </span>
          </div>
          <h1 style="font-size:26px;font-weight:300;line-height:1.2;margin:0 0 18px;letter-spacing:-0.01em;color:#fff;">
            ${heading}
          </h1>
          <p style="font-size:15px;line-height:1.6;color:#A1A1AA;margin:0 0 28px;">
            ${data.name ? "Hi " + data.name + "," : "Hi,"}<br/><br/>
            ${intro}
          </p>
          ${
            isPayMint
              ? `<div style="background:#0D0D0D;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:18px;margin-bottom:28px;">
                  <p style="font-size:13px;color:#A1A1AA;margin:0 0 12px;font-weight:600;">While you wait — try the live web app:</p>
                  <a href="https://nibir-vault.web.app" style="display:inline-block;background:linear-gradient(135deg,#F97316,#EA6C0A);color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.01em;">Launch PayMint →</a>
                </div>`
              : ""
          }
          <p style="font-size:13px;color:#52525B;line-height:1.6;margin:0;">
            Questions? Reply directly to this email — it routes to the AEGIBIT team inbox.
          </p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;"/>
          <p style="font-size:11px;color:#52525B;margin:0;">
            AEGIBIT Security · <a href="https://www.aegibit.com" style="color:#F97316;text-decoration:none;">www.aegibit.com</a><br/>
            Securing Tomorrow, Today
          </p>
        </div>
      `,
    });
    if (result.error) {
      const msg = JSON.stringify(result.error);
      console.error("[email][confirmation] Resend API error:", msg);
      return { ok: false, error: msg };
    }
    console.log("[email][confirmation] sent. id:", result.data?.id);
    return { ok: true, id: result.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email][confirmation] exception:", msg);
    return { ok: false, error: msg };
  }
}

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
    console.error("[email][team] skipped — RESEND_API_KEY not set");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { Resend } = await import("resend");
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
      ? `🔥 HOT LEAD — ${data.name ? `${data.name} · ` : ""}${data.email}${data.journey ? ` · ${data.journey.pages_viewed.length} pages · ${Math.floor(data.journey.time_on_site_seconds / 60)}m on site` : ""}`
      : `🔔 New ${label} — ${data.email}`;

    const heatBadge = isHot
      ? `<span style="background:#EF4444;color:#fff;font-weight:700;padding:4px 10px;border-radius:6px;font-size:12px;letter-spacing:0.1em;">🔥 HOT LEAD</span>`
      : `<span style="background:#F97316;color:#000;font-weight:700;padding:4px 10px;border-radius:6px;font-size:12px;">${label.toUpperCase()}</span>`;

    const headline = isHot
      ? `Drop what you're doing. Reply in the next 5 minutes.`
      : `New lead from aegibit.com`;

    const subhead = isHot
      ? `<p style="color:#FCA5A5;font-size:13px;margin:0 0 20px;line-height:1.6;">Inbound leads contacted within 5 minutes are ~9× more likely to convert vs. within an hour. The visitor's session below shows what they cared about — open with that.</p>`
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
    message:    sanitizeString(data.message),
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

  // Pull the visitor's session before composing the team email so the
  // hot-lead enrichment has data to work with. Best-effort — null
  // journey just falls back to the standard email body.
  const journey = await fetchVisitorJourney(data.visitorId ?? null);
  const heat = classifyLead({
    source: data.source,
    message: data.message,
    journey,
  });

  // Fire team email + Slack push + lead confirmation email in parallel.
  // All three are best-effort — lead capture has already succeeded by
  // this point and a downstream notifier outage must not 500 the form.
  // Slack only fires when SLACK_HOT_LEAD_WEBHOOK_URL is set; absent =
  // silent skip.
  const [teamResult, confResult, slackOk] = await Promise.all([
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
    sendConfirmation({
      email:  data.email,
      name:   data.name,
      source: data.source,
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

  // Email diagnostics are surfaced to the response only for an
  // authenticated admin session (httpOnly cookie). The previous
  // x-admin-token header path leaked into client bundles and is gone.
  const adminGuard = await requireAdmin();
  const debugAllowed = adminGuard === null;

  const response: Record<string, unknown> = { ok: true, heat };
  if (debugAllowed) {
    response._debug = {
      lead_saved: true,
      team_email: teamResult,
      confirmation_email: confResult,
      slack_pushed: slackOk,
      heat,
      journey_pages: journey?.pages_viewed.length ?? null,
      journey_score: journey?.behavior_score ?? null,
    };
  }

  return NextResponse.json(response, { status: 201 });
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
  return NextResponse.json({ leads: data });
}
