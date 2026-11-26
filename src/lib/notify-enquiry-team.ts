import { Resend } from "resend";
import { sanitizeString } from "./validators";
import { renderJourneyHtml, type LeadHeat, type VisitorJourney } from "./hot-lead";
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

export async function notifyTeam(data: {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;
  page: string;
  message?: string;
  heat: LeadHeat;
  journey: VisitorJourney | null;
  idempotencyKey?: string;
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
    }, data.idempotencyKey ? { idempotencyKey: data.idempotencyKey } : undefined);

    if (result.error) {
      const msg = JSON.stringify(result.error);
      console.error("[email][team] Resend API error:", msg);
      return { ok: false, error: msg };
    }
    console.log(`[email][team] sent (${data.heat}). id:`, result.data?.id);
    return { ok: Boolean(result.data?.id), id: result.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email][team] exception:", msg);
    return { ok: false, error: msg };
  }
}

