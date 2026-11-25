import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getServiceClient } from "@/lib/supabase-admin";
import { composeEnquiryEmail } from "@/lib/contextual-enquiry";
import { sendEnquiryEmail } from "@/lib/send-enquiry-email";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const schema = z.object({ leadId: z.string().uuid(), send: z.boolean().default(false), repair: z.boolean().default(false) });
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;
  if (req.headers.get("origin") !== new URL(req.url).origin) return NextResponse.json({ error: "Same-origin request required" }, { status: 403, headers });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400, headers });
  try {
    const db = getServiceClient();
    const { data, error } = await db.from("leads").select("id, email, name, company, message, source").eq("id", parsed.data.leadId).single();
    if (error || !data) return NextResponse.json({ error: "Enquiry unavailable" }, { status: 404, headers });
    if (!["contact", "demo", "paymint_demo"].includes(data.source)) return NextResponse.json({ error: "Manual follow-up is only available for project and demo enquiries" }, { status: 400, headers });
    if (parsed.data.repair) {
      const saved = await Redis.fromEnv().get<{status:string}>(`enquiry-followup:v1:${data.id}`);
      if (saved?.status !== "accepted") return NextResponse.json({error:"No accepted follow-up record. No email was sent."},{status:409,headers});
      const updated = await db.from("leads").update({status:"contacted"}).eq("id",data.id).eq("status","new");
      if (updated.error) return NextResponse.json({error:`Status repair failed (${updated.error.code ?? "unknown"}). No email was sent.`},{status:503,headers});
      return NextResponse.json({message:"Contact status reconciled from the accepted send record. No email was sent."},{headers});
    }
    const preview = composeEnquiryEmail(data, true);
    if (!parsed.data.send) return NextResponse.json({ to: data.email, subject: preview.subject, text: preview.text }, { headers });
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN || !process.env.RESEND_API_KEY) return NextResponse.json({ error: "Safe sending is unavailable. No email was sent." }, { status: 503, headers });
    const redis = Redis.fromEnv();
    const key = `enquiry-followup:v1:${data.id}`;
    // Permanent reservation: prevents concurrent sends and repeats after provider idempotency expires.
    // An interrupted/uncertain send stays blocked for manual provider-log review, never auto-retried.
    const reserved = await redis.set(key, { status: "sending", at: new Date().toISOString() }, { nx: true });
    if (!reserved) return NextResponse.json({ error: "A follow-up was already attempted. Check provider delivery logs before any further action." }, { status: 409, headers });
    try {
      const result = await sendEnquiryEmail(data, { followup: true, idempotencyKey: key });
      await redis.set(key, { status: result.ok ? "accepted" : "rejected", id: result.id ?? null, at: new Date().toISOString() });
      if (!result.ok) return NextResponse.json({ error: "Provider did not accept the email. Review delivery logs; do not resend blindly." }, { status: 502, headers });
      const updated = await db.from("leads").update({ status: "contacted" }).eq("id", data.id).eq("status", "new");
      return NextResponse.json({ accepted: true, statusUpdated: !updated.error, message: "Email accepted by provider. Inbox delivery is not yet verified." }, { headers });
    } catch {
      return NextResponse.json({ error: "Sending outcome is uncertain. Review provider logs. Automatic retries are blocked." }, { status: 503, headers });
    }
  } catch {
    return NextResponse.json({ error: "Follow-up service unavailable. Review provider logs before retrying." }, { status: 503, headers });
  }
}
