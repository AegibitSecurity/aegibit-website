import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLiveCount } from "@/lib/presence";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/visitors-now, the real-time visitor count.
 *
 * Auth: cookie session (sign in at /admin/login).
 *
 * Returns { now } where now = number of distinct visitors whose
 * browser heartbeated within the last 75 seconds. The dashboard polls
 * this every few seconds for a live tile. Null count (Redis down)
 * degrades to now: null so the UI can show a dash instead of a lie.
 */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const now = await getLiveCount();
  return NextResponse.json(
    { now },
    { headers: { "Cache-Control": "no-store" } },
  );
}
