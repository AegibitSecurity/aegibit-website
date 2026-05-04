import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-level canonical-host enforcement.
 *
 * Reason: Vercel auto-publishes every deploy under a `*.vercel.app`
 * hostname in addition to your custom domain. If Googlebot crawls those
 * preview URLs, they get indexed as a separate "site", splitting search
 * authority and showing duplicate (uglier) results in the SERP.
 *
 * Fix: every request whose host ends in `.vercel.app` is redirected
 * permanently (HTTP 308) to the same path on www.aegibit.com. Real users
 * never see vercel.app URLs in their address bar; Googlebot follows the
 * redirect and consolidates indexing on the canonical domain.
 *
 * The matcher excludes `_next/`, `api/`, and well-known static assets so
 * Next.js's internal pipeline keeps working.
 */

const CANONICAL_HOST = "www.aegibit.com";

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();

  // Allow localhost / dev / direct IP access untouched.
  if (host === CANONICAL_HOST) return NextResponse.next();

  // Redirect any vercel.app preview/production hostname to the canonical
  // domain, preserving path + query string verbatim. Also stamp a noindex
  // robots header on the redirect response itself — belt-and-braces signal
  // to Googlebot that even if it doesn't follow the 308 immediately, the
  // vercel.app URL must drop out of the index.
  if (host.endsWith(".vercel.app")) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    const res = NextResponse.redirect(url, 308);
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Apex aegibit.com → www.aegibit.com (single canonical, helps SEO).
  if (host === "aegibit.com") {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on every path EXCEPT Next internals and common public assets.
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
