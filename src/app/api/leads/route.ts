import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { leadSchema, sanitizeString } from "@/lib/validators";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";

const SOURCE_LABELS: Record<string, string> = {
  waitlist:           "Waitlist Signup",
  contact:            "Contact Form",
  demo:               "Demo Request",
  exit_intent:        "Exit Intent Popup",
  paymint_demo:       "PayMint Demo Request",
  voicecore_waitlist: "VoiceCore Early Access",
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
            Questions? Reply directly to this email — it routes to our founders' inbox.
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
  source: string;
  page: string;
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

    // Comma-separated recipient list from env so we can fan out alerts
    // to multiple founders/inboxes without redeploys. Belt-and-braces:
    // Hostinger inbound mail filtering on aegibit.com → aegibit.com
    // self-sends has been observed to silently route to spam, so we
    // always also send to a Gmail fallback.
    const teamRecipients = (process.env.TEAM_NOTIFY_EMAILS ?? "contact@aegibit.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = await resend.emails.send({
      from:    "AEGIBIT <noreply@aegibit.com>",
      to:      teamRecipients,
      replyTo: [data.email],
      subject: `🔔 New ${label} — ${data.email}`,
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;background:#0a0a0a;color:#eaeaea;padding:28px;border-radius:10px;border:1px solid #222;">
          <div style="margin-bottom:20px;">
            <span style="background:#F97316;color:#000;font-weight:700;padding:4px 10px;border-radius:6px;font-size:12px;">${label.toUpperCase()}</span>
          </div>
          <h2 style="color:#fff;margin:0 0 20px;font-size:18px;">New lead from aegibit.com</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #222;">
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;width:90px;">Email</td>
              <td style="padding:10px 0;font-size:13px;"><a href="mailto:${data.email}" style="color:#F97316;text-decoration:none;">${data.email}</a></td>
            </tr>
            ${data.name    ? `<tr style="border-bottom:1px solid #222;"><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Name</td><td style="padding:10px 0;font-size:13px;">${sanitizeString(data.name)}</td></tr>` : ""}
            ${data.company ? `<tr style="border-bottom:1px solid #222;"><td style="padding:10px 0;color:#9ca3af;font-size:13px;">Company</td><td style="padding:10px 0;font-size:13px;">${sanitizeString(data.company)}</td></tr>` : ""}
            <tr style="border-bottom:1px solid #222;">
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;">Source</td>
              <td style="padding:10px 0;font-size:13px;">${label}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#9ca3af;font-size:13px;">Page</td>
              <td style="padding:10px 0;font-size:13px;color:#6b7280;">${sanitizeString(data.page)}</td>
            </tr>
          </table>
          <div style="margin-top:24px;">
            <a href="mailto:${data.email}" style="background:#F97316;color:#000;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;display:inline-block;">Reply to ${data.email}</a>
          </div>
          <p style="color:#374151;font-size:11px;margin:20px 0 0;">aegibit.com · Auto-notification</p>
        </div>
      `,
    });

    if (result.error) {
      const msg = JSON.stringify(result.error);
      console.error("[email][team] Resend API error:", msg);
      return { ok: false, error: msg };
    }
    console.log("[email][team] sent. id:", result.data?.id);
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

  // Fire team notification + lead confirmation in parallel — both are
  // best-effort; lead capture has already succeeded by this point.
  const [teamResult, confResult] = await Promise.all([
    notifyTeam({
      email:   data.email,
      name:    data.name,
      company: data.company,
      source:  data.source,
      page:    data.page,
    }),
    sendConfirmation({
      email:  data.email,
      name:   data.name,
      source: data.source,
    }),
  ]);

  // Email diagnostics are surfaced to the response when an admin token is
  // provided (so we can debug from the live form without exposing details
  // to ordinary users / scrapers).
  const adminToken = req.headers.get("x-admin-token");
  const debugAllowed =
    adminToken && process.env.DASHBOARD_SECRET && adminToken === process.env.DASHBOARD_SECRET;

  const response: Record<string, unknown> = { ok: true };
  if (debugAllowed) {
    response._debug = {
      lead_saved: true,
      team_email: teamResult,
      confirmation_email: confResult,
    };
  }

  return NextResponse.json(response, { status: 201 });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ leads: data });
}
