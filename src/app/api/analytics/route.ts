import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") ?? "today";

  const now = new Date();
  let since = new Date();
  if (timeframe === "7d")  since.setDate(now.getDate() - 7);
  else if (timeframe === "30d") since.setDate(now.getDate() - 30);
  else since.setHours(0, 0, 0, 0);

  const supabase = getServiceClient();

  const [visitorsRes, leadsRes, activeRes] = await Promise.all([
    supabase.from("visitors").select("id, created_at, behavior_score, device, country", { count: "exact" })
      .gte("created_at", since.toISOString()),
    supabase.from("leads").select("id, created_at, source", { count: "exact" })
      .gte("created_at", since.toISOString()),
    supabase.from("visitors").select("id", { count: "exact" })
      .eq("is_active", true)
      .gte("updated_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()),
  ]);

  const totalVisitors = visitorsRes.count ?? 0;
  const totalLeads = leadsRes.count ?? 0;
  const activeNow = activeRes.count ?? 0;
  const conversionRate = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    totalVisitors,
    totalLeads,
    activeNow,
    conversionRate,
    visitors: visitorsRes.data ?? [],
    leads:    leadsRes.data ?? [],
  });
}
