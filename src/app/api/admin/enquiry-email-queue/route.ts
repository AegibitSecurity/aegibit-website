import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { drainEnquiries } from "@/lib/enquiry-outbox";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function POST(req: NextRequest) {
  const expected = process.env.DASHBOARD_SECRET;
  const actual = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!expected || !actual || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) return NextResponse.json({error:"Unauthorized"},{status:401});
  try { return NextResponse.json(await drainEnquiries(),{headers:{"Cache-Control":"no-store"}}); }
  catch { return NextResponse.json({error:"Email queue unavailable"},{status:503}); }
}
