import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabase-admin";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const db = getServiceClient();
    const [pending, recent] = await Promise.all([
      db.from("leads").select("id", { count: "exact", head: true }).eq("status", "new").in("source", ["contact", "demo", "paymint_demo", "chat"]),
      db.from("leads").select("id, source, status, created_at").in("source", ["contact", "demo", "paymint_demo", "chat"]).order("created_at", { ascending: false }).limit(8),
    ]);
    return NextResponse.json({
      pending: pending.error ? null : pending.count,
      recent: recent.error ? null : recent.data,
      partial: Boolean(pending.error || recent.error || pending.count === null),
      refreshedAt: new Date().toISOString(),
    }, { headers });
  } catch {
    return NextResponse.json({ error: "Enquiry activity is unavailable." }, { status: 503, headers });
  }
}
