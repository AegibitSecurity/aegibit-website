import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { getSessionOptions, type AdminSession } from "@/lib/session";
import { verifyPassword } from "@/lib/auth";
import { checkRateLimit, leadLimiter } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

function redirectTo(req: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, req.url), { status: 303 });
}

function isSafeReturnPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(leadLimiter, `login:${ip}`);
  if (!allowed) {
    return redirectTo(req, "/admin/login?error=rate");
  }

  if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD_HASH) {
    return redirectTo(req, "/admin/login?error=config");
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return redirectTo(req, "/admin/login?error=invalid");
  }

  const password = form.get("password");
  const from = form.get("from");
  if (typeof password !== "string" || password.length < 8) {
    return redirectTo(req, "/admin/login?error=invalid");
  }

  const ok = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!ok) {
    return redirectTo(req, "/admin/login?error=invalid");
  }

  const session = await getIronSession<AdminSession>(await cookies(), getSessionOptions());
  session.admin = true;
  session.loggedInAt = Date.now();
  await session.save();

  const target =
    typeof from === "string" && isSafeReturnPath(from) ? from : "/dashboard";
  return redirectTo(req, target);
}
