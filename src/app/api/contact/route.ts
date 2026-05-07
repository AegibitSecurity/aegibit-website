import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { z } from "zod";
import { sanitizeString } from "@/lib/validators";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";

const contactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email().max(200),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  page:    z.string().max(500).default("/contact"),
});

async function sendEmailNotification(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // skip if not configured

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from:    "AEGIBIT <noreply@aegibit.com>",
      to:      ["contact@aegibit.com"],
      replyTo: data.email,
      subject: `New enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#eaeaea;padding:32px;border-radius:12px;">
          <h2 style="color:#F97316;margin-top:0;">New Contact Enquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9ca3af;width:100px;">Name</td><td style="padding:8px 0;color:#eaeaea;">${sanitizeString(data.name)}</td></tr>
            <tr><td style="padding:8px 0;color:#9ca3af;">Email</td><td style="padding:8px 0;color:#eaeaea;"><a href="mailto:${data.email}" style="color:#F97316;">${data.email}</a></td></tr>
            ${data.company ? `<tr><td style="padding:8px 0;color:#9ca3af;">Company</td><td style="padding:8px 0;color:#eaeaea;">${sanitizeString(data.company)}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#9ca3af;vertical-align:top;">Message</td><td style="padding:8px 0;color:#eaeaea;">${sanitizeString(data.message).replace(/\n/g, "<br>")}</td></tr>
          </table>
          <hr style="border-color:#222;margin:24px 0;">
          <p style="color:#52525b;font-size:12px;margin:0;">Sent from www.aegibit.com contact form</p>
        </div>
      `,
    });
  } catch (err) {
    // Email failure shouldn't block form submission
    console.error("Email send failed:", err);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(leadLimiter, ip);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = getServiceClient();

  const { error } = await supabase.from("leads").insert({
    name:    sanitizeString(data.name),
    email:   data.email.toLowerCase().trim(),
    company: sanitizeString(data.company),
    message: sanitizeString(data.message),
    source:  "contact",
    page:    sanitizeString(data.page),
    status:  "new",
  });

  if (error) return NextResponse.json({ error: "Failed to save" }, { status: 500 });

  // Send email notification to contact@aegibit.com (non-blocking)
  await sendEmailNotification({
    name:    data.name,
    email:   data.email,
    company: data.company,
    message: data.message,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
