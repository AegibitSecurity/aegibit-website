"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * Site-wide marketing chrome — single mount point in the root layout
 * for every floating element that should appear on every marketing
 * page (not just the homepage where ClientFloatingElements lives).
 *
 * Origin: started life as `SiteWideExitIntent` in P3-S6 to fix the gap
 * where the exit-intent popup only fired on `/`. Same gap applied to
 * the rest of the floating chrome (mobile CTA, social-proof toast,
 * scroll progress, live badge) — engaged visitors landing on /pricing
 * or /products/paymint or any of the ~100 programmatic SEO pages from
 * search saw none of them. P3-S8 promotes them all behind the same
 * pathname gate.
 *
 * What this DOES include:
 *   - ScrollProgress    — reading-position bar at the top of the page
 *   - StickyMobileCTA   — fixed bottom "Get Demo" CTA on mobile
 *   - SocialProofToast  — periodic "team from <city> joined" cue
 *   - ExitIntentPopup   — abandon-capture
 *   - LiveBadge         — "N teams evaluating" cue
 *   - ChatWidget        — Aira AI guide (Gemini Flash backbone)
 *
 * What this does NOT include:
 *   - WelcomeGreeting — homepage-specific 2.2s scroll-locked overlay
 *     for first-time visitors. Wrong UX on a direct SEO landing.
 *
 * Why pathname-gated:
 *   The root layout wraps every route — including /admin, /dashboard,
 *   /api, /signup, /login. None of these surfaces should ever show a
 *   "47 teams evaluating" toast or a mobile demo CTA at the founder's
 *   thumb. EXCLUDED_PREFIXES below mirrors what `proxy.ts` treats as
 *   internal/auth-gated.
 *
 * Why ssr:false dynamic imports:
 *   Every child component touches `window`, `document`, or
 *   `localStorage` in its useEffect. Loading them as ssr:false dynamic
 *   chunks keeps them out of the LCP path AND avoids hydration
 *   mismatch from layout-level "use client" boundaries.
 *
 * Each component still has its own internal triggers (engagement
 * score, mobile detection, sessionStorage de-dupe). This wrapper
 * decides only "is this route a marketing surface?".
 */

const ScrollProgress = dynamic(
  () => import("./ScrollProgress").then((m) => ({ default: m.ScrollProgress })),
  { ssr: false },
);

const StickyMobileCTA = dynamic(
  () => import("../conversion/StickyMobileCTA").then((m) => ({ default: m.StickyMobileCTA })),
  { ssr: false },
);

const SocialProofToast = dynamic(
  () => import("../conversion/SocialProofToast").then((m) => ({ default: m.SocialProofToast })),
  { ssr: false },
);

const ExitIntentPopup = dynamic(
  () => import("../conversion/ExitIntentPopup").then((m) => ({ default: m.ExitIntentPopup })),
  { ssr: false },
);

const LiveBadge = dynamic(
  () => import("./LiveBadge").then((m) => ({ default: m.LiveBadge })),
  { ssr: false },
);

const ChatWidget = dynamic(
  () => import("../conversion/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false },
);

// Routes where marketing chrome must NEVER render. Match by prefix.
// Keep this list in sync with src/proxy.ts conceptually — anything
// that's "internal" or "auth-gated" goes here.
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

export function MarketingChrome() {
  const pathname = usePathname();
  if (!isMarketingPath(pathname)) return null;
  return (
    <>
      <ScrollProgress />
      <StickyMobileCTA />
      <SocialProofToast />
      <ExitIntentPopup />
      <LiveBadge />
      <ChatWidget />
    </>
  );
}
