"use client";
import dynamic from "next/dynamic";

/**
 * Homepage-only floating chrome. Mounted by `app/page.tsx`.
 *
 * As of P3-S8, every floating element that should appear on every
 * marketing page (ScrollProgress, StickyMobileCTA, SocialProofToast,
 * ExitIntentPopup, LiveBadge) lives in `MarketingChrome` mounted at
 * the root layout. The only thing left here is `WelcomeGreeting` —
 * which is intentionally homepage-only because it's a 2.2s
 * scroll-locked first-visit overlay; firing it on a direct SEO
 * landing on /pricing or /products/paymint would be jarring and
 * actively conversion-hostile.
 *
 * If WelcomeGreeting ever moves to "fire on first visit, anywhere"
 * the right move is to fold it into MarketingChrome and delete this
 * file. Until then, this stays as the homepage-specific seam.
 */

const WelcomeGreeting = dynamic(
  () => import("./WelcomeGreeting").then((m) => ({ default: m.WelcomeGreeting })),
  { ssr: false },
);

export function ClientFloatingElements() {
  return <WelcomeGreeting />;
}
