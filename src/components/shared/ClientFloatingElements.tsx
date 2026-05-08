"use client";
import dynamic from "next/dynamic";

/**
 * Homepage-only floating chrome. Mounted by `app/page.tsx`.
 *
 * NOTE: ExitIntentPopup used to be imported here, which meant it only
 * ever fired on `/` — visitors landing on /products/paymint, /pricing,
 * /case-studies, etc. got no exit-intent capture. It now lives in
 * SiteWideExitIntent, mounted at the root layout level with pathname
 * gating, so every marketing page captures abandoning visitors.
 *
 * Other elements remain homepage-only because their copy / placement
 * is tuned for the home experience (welcome greeting, hero scroll
 * progress, etc.). Promote individually as the design demands.
 */

// All client-only, ssr:false — zero LCP impact
const ScrollProgress   = dynamic(() => import("./ScrollProgress").then(m =>                ({ default: m.ScrollProgress })),    { ssr: false });
const LiveBadge        = dynamic(() => import("./LiveBadge").then(m =>                     ({ default: m.LiveBadge })),         { ssr: false });
const SocialProofToast = dynamic(() => import("../conversion/SocialProofToast").then(m =>  ({ default: m.SocialProofToast })),  { ssr: false });
const StickyMobileCTA  = dynamic(() => import("../conversion/StickyMobileCTA").then(m =>   ({ default: m.StickyMobileCTA })),   { ssr: false });
const WelcomeGreeting  = dynamic(() => import("./WelcomeGreeting").then(m =>               ({ default: m.WelcomeGreeting })),   { ssr: false });

export function ClientFloatingElements() {
  return (
    <>
      <WelcomeGreeting />
      <ScrollProgress />
      <StickyMobileCTA />
      <SocialProofToast />
      <LiveBadge />
    </>
  );
}
