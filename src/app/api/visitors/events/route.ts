import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase-admin";
import { visitorEventSchema } from "@/lib/validators";
import { checkRateLimit, eventLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed } = await checkRateLimit(eventLimiter, ip);
  if (!allowed) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = visitorEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const { visitorId, eventType, eventData, page } = parsed.data;
  const supabase = getServiceClient();

  await supabase.from("visitor_events").insert({
    visitor_id: visitorId,
    event_type: eventType,
    event_data: eventData ?? null,
    page,
  });

  // Update visitor aggregates
  if (eventType === "scroll" && eventData?.depth) {
    void supabase.rpc("update_visitor_scroll", {
      p_visitor_id: visitorId,
      p_depth: eventData.depth as number,
    });
  }

  return NextResponse.json({ ok: true });
}
