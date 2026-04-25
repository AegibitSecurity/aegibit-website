import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { visitorSchema, sanitizeString } from "@/lib/validators";
import { checkRateLimit, visitorLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(visitorLimiter, ip);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = visitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = getServiceClient();

  const { data: visitor, error } = await supabase
    .from("visitors")
    .insert({
      session_id:   data.sessionId,
      ip_address:   sanitizeString(ip).slice(0, 45),
      user_agent:   sanitizeString(data.userAgent).slice(0, 500),
      device:       data.device,
      browser:      sanitizeString(data.browser),
      os:           sanitizeString(data.os),
      referrer:     sanitizeString(data.referrer),
      utm_source:   sanitizeString(data.utmSource ?? ""),
      utm_medium:   sanitizeString(data.utmMedium ?? ""),
      utm_campaign: sanitizeString(data.utmCampaign ?? ""),
      landing_page: sanitizeString(data.landingPage),
      pages_viewed: [sanitizeString(data.landingPage)],
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const response = NextResponse.json({ visitorId: visitor.id }, { status: 201 });

  // HttpOnly cookie: stores visitor ID server-side, not readable by JS
  response.cookies.set("vc_vid", visitor.id, {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 30, // 30 days
    secure:   process.env.NODE_ENV === "production",
  });

  // Non-httpOnly return-visitor flag (readable by client for behavior scoring)
  response.cookies.set("vc_return", "1", {
    httpOnly: false,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 30,
    secure:   process.env.NODE_ENV === "production",
  });

  return response;
}
