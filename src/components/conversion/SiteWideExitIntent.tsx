"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Site-wide mount point for the exit-intent popup.
 *
 * Why this exists separately from ClientFloatingElements:
 *   ClientFloatingElements is mounted only on the homepage (`/`), which
 *   meant exit-intent capture only fired for visitors on the homepage —
 *   not on /products/paymint, /pricing, /case-studies, or any of the
 *   ~100 programmatic SEO pages where engaged visitors actually arrive
 *   from search. The Conversion Flywheel called this gap out
 *   explicitly; this slice closes it.
 *
 * Why pathname-gated:
 *   The root layout wraps EVERY route — including /admin, /dashboard,
 *   and /api. We do not want a "Get 3 months free!" popup ambushing
 *   the founder mid-session on the leads dashboard. We also don't want
 *   it on /admin/login or auth screens. The list of excluded prefixes
 *   below mirrors what `proxy.ts` treats as non-marketing surfaces.
 *
 * Why dynamic+ssr:false:
 *   ExitIntentPopup uses `window`, `document`, and `sessionStorage` in
 *   its useEffect — none of which exist during SSR. Loading it as a
 *   ssr:false dynamic chunk keeps it out of the LCP path AND avoids
 *   the SSR-hydration mismatch that would otherwise force us to add
 *   layout-level "use client" boundaries.
 *
 * The popup itself has its own internal gates (engaged-visitor score,
 * desktop-only, sessionStorage de-dupe) — see ExitIntentPopup.tsx.
 * This component only decides "is this route a marketing surface?".
 */

const ExitIntentPopup = dynamic(
  () => import("./ExitIntentPopup").then((m) => ({ default: m.ExitIntentPopup })),
  { ssr: false },
);

// Routes that must NEVER show a marketing popup. Match by prefix.
// Keep this list in sync with src/proxy.ts conceptually — anything
// that's "internal surface" or "not a public marketing page" goes here.
const EXCLUDED_PREFIXES = [
  "/admin",
  "/dashboard",
  "/api",
  "/_next",
  "/signup",
  "/login",
] as const;

function isMarketingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return false;
  }
  return true;
}

export function SiteWideExitIntent() {
  const pathname = usePathname();
  if (!isMarketingPath(pathname)) return null;
  return <ExitIntentPopup />;
}
