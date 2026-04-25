import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { leadSchema, sanitizeString } from "@/lib/validators";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";

const SOURCE_LABELS: Record<string, string> = {
  waitlist:    "Waitlist Signup",
  contact:     "Contact Form",
  demo:        "Demo Request",
  exit_intent: "Exit Intent Popup",
};

async function notifyTeam(data: {
  email: string;
  name?: string;
  company?: string;
  source: string;
  page: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping notification");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const label = SOURCE_LABELS[data.source] ?? data.source;

    const result = await resend.emails.send({
      from:    "AEGIBIT <noreply@aegibit.com>",
      to:      ["contact@aegibit.com"],
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
      console.error("[email] Resend API error:", JSON.stringify(result.error));
    } else {
      console.log("[email] Sent successfully. ID:", result.data?.id);
    }
  } catch (err) {
    console.error("[email] Exception sending notification:", err);
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

  // Send notification — awaited so we can see errors in terminal
  await notifyTeam({
    email:   data.email,
    name:    data.name,
    company: data.company,
    source:  data.source,
    page:    data.page,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
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
