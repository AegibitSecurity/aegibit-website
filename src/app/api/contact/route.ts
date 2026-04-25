import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase";
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

  if (error) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
