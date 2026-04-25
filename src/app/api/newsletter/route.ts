import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";
import { z } from "zod";
import { sanitizeString } from "@/lib/validators";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(50).default("newsletter"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(leadLimiter, `nl_${ip}`);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from("leads").insert({
    email:  parsed.data.email.toLowerCase().trim(),
    source: sanitizeString(parsed.data.source),
    page:   "/newsletter",
    status: "new",
  });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
