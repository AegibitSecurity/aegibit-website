import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { POST as saveEnquiry } from "../leads/route";
export const dynamic = "force-dynamic";
const contactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email().max(200),
  company: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  page:    z.string().max(500).default("/contact"),
});

export async function POST(req: NextRequest) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  return saveEnquiry(new NextRequest(req.url, { method: "POST", headers: req.headers, body: JSON.stringify({ ...parsed.data, source: "contact" }) }));
}
