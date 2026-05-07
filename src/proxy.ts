import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { shouldGateProtectedApi } from "@/lib/proxy-gate";

/**
 * AEGIBIT proxy (Next 16+ replacement for middleware.ts).
 *
 * Two responsibilities, in order:
 *
 * 1. Canonical-host enforcement (PRODUCTION ONLY)
 *    - apex `aegibit.com` → `www.aegibit.com` (308)
 *    - any `*.vercel.app` → `www.aegibit.com` (308 + X-Robots-Tag noindex)
 *    - Skipped on preview/dev so we can smoke-test PR previews from
 *      scripts and so localhost continues to work. Production behavior
 *      is unchanged.
 *
 * 2. Admin gate (defence in depth)
 *    - `/dashboard/*` without session cookie → 303 to /admin/login?from=...
 *    - `/api/leads`, `/api/analytics`, and `/api/admin/health` are still
 *      authoritatively guarded by `requireAdmin` inside each route handler.
 *      The proxy only exists to short-circuit the obvious pre-auth case
 *      before it hits Node + DB.
 *    - `/api/leads` POST is the PUBLIC lead-capture endpoint — every form
 *      on the marketing site submits to it. It is explicitly exempted in
 *      `shouldGateProtectedApi` (see src/lib/proxy-gate.ts). Only the admin
 *      GET / PATCH / DELETE methods are proxy-gated.
 *    - `/api/admin/login` is intentionally NOT gated (you need to be able
 *      to authenticate without already being authenticated).
 *    - `/api/admin/deploy-notify` runs its own server-to-server bearer
 *      check; cookie auth doesn't apply to it.
 */

const CANONICAL_HOST = "www.aegibit.com";

const DASHBOARD_PREFIX = "/dashboard";

const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

function hasSessionCookie(req: NextRequest): boolean {
  const cookie = req.cookies.get(SESSION_COOKIE);
  return Boolean(cookie?.value);
}

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const { pathname } = req.nextUrl;

  // ── 1. Canonical-host redirect (production only) ───────────────────
  // Preview/dev: leave hosts alone so we can curl-test PR previews and
  // localhost. Preview URLs are protected from search-engine indexing
  // by Vercel's Deployment Protection auth wall (Googlebot can't crawl
  // them), so SEO authority is safe even without the redirect.
  if (IS_PRODUCTION) {
    if (host.endsWith(".vercel.app")) {
      const url = req.nextUrl.clone();
      url.host = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      const res = NextResponse.redirect(url, 308);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return res;
    }
    if (host === "aegibit.com") {
      const url = req.nextUrl.clone();
      url.host = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return NextResponse.redirect(url, 308);
    }
  }

  // ── 2. Admin gate ──────────────────────────────────────────────────
  // (canonical host or localhost dev — fall through to admin checks)
  if (pathname.startsWith(DASHBOARD_PREFIX) && !hasSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?from=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url, 303);
  }

  if (shouldGateProtectedApi(pathname, req.method, hasSessionCookie(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
