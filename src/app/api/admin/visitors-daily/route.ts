import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * /api/admin/visitors-daily, visitor counts per day.
 *
 * Auth: cookie session (sign in at /admin/login).
 *
 * Answers "how many visitors yesterday / on any day" from our own
 * visitors table. Buckets by IST calendar day (the business runs in
 * India), returns the last 30 days plus today, yesterday, and 7 and
 * 30-day totals. Honest by construction: every row is one recorded
 * visit session.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function istDate(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const supabase = getServiceClient();
  const now = Date.now();
  const startIso = new Date(now - 30 * DAY_MS).toISOString();

  const { data, error } = await supabase
    .from("visitors")
    .select("created_at")
    .gte("created_at", startIso)
    .limit(100000);

  if (error) {
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const key = istDate(new Date(row.created_at as string).getTime());
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const key = istDate(now - i * DAY_MS);
    days.push({ date: key, count: counts[key] ?? 0 });
  }

  const last7 = days.slice(-7).reduce((a, b) => a + b.count, 0);
  const last30 = days.reduce((a, b) => a + b.count, 0);

  return NextResponse.json(
    {
      today: counts[istDate(now)] ?? 0,
      yesterday: counts[istDate(now - DAY_MS)] ?? 0,
      last7,
      last30,
      days,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
