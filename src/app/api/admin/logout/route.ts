import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { getSessionOptions, type AdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getIronSession<AdminSession>(
      await cookies(),
      getSessionOptions(),
    );
    session.destroy();
  } catch {
    // SESSION_SECRET missing or invalid — fall through to redirect anyway.
  }
  return NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });
}
