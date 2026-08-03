import { NextRequest, NextResponse } from "next/server";
import { recordPresence } from "@/lib/presence";
import { checkRateLimit, presenceLimiter } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/presence, the live-visitor heartbeat.
 *
 * Public (every visitor's browser calls it ~2x/min per open tab while
 * visible). Body: { vid: string }. Responds 204 always on success
 * paths; presence must never surface an error to a visitor.
 *
 * Abuse posture: per-IP rate limit well above the legitimate heartbeat
 * cadence but low enough that a script can't meaningfully inflate the
 * count from one machine, and the vid is length-capped so the sorted
 * set can't be used as a junk store.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed } = await checkRateLimit(presenceLimiter, ip);
  if (!allowed) return new NextResponse(null, { status: 429 });

  let vid = "";
  try {
    const body = (await req.json()) as { vid?: unknown };
    vid = typeof body.vid === "string" ? body.vid.trim() : "";
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!vid || vid.length > 64) return new NextResponse(null, { status: 400 });

  await recordPresence(vid);
  return new NextResponse(null, { status: 204 });
}
