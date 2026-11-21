import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabase-admin";
import { growthWindow, knownCount, coveragePercent } from "@/lib/growth-metrics";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const window = growthWindow();
  try {
    const db = getServiceClient();
    const inquiries = () => db.from("leads").select("id", { count: "exact", head: true })
      .in("source", ["contact", "demo", "paymint_demo", "chat"])
      .gte("created_at", window.since).lt("created_at", window.until);
    const results = await Promise.all([
      db.from("visitors").select("id", { count: "exact", head: true }).gte("created_at", window.since).lt("created_at", window.until),
      inquiries(), inquiries().not("visitor_id", "is", null),
      inquiries().in("status", ["qualified", "converted"]),
    ]);
    const [sessions, capturedInquiries, attributedInquiries, qualifiedRecords] = results.map(knownCount);
    return NextResponse.json({ window, refreshedAt: new Date().toISOString(), source: "visitors and leads", partial: results.some(r => r.error || r.count === null), sessions, capturedInquiries, attributedInquiries, qualifiedRecords, attributionCoverage: coveragePercent(attributedInquiries, capturedInquiries) }, { headers });
  } catch {
    return NextResponse.json({ error: "Growth data is unavailable. No zero values have been substituted." }, { status: 503, headers });
  }
}
