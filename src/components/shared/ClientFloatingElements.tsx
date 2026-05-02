"use client";
import dynamic from "next/dynamic";

// All client-only, ssr:false — zero LCP impact
const ScrollProgress   = dynamic(() => import("./ScrollProgress").then(m =>                      ({ default: m.ScrollProgress })),             { ssr: false });
const LiveBadge        = dynamic(() => import("./LiveBadge").then(m =>                           ({ default: m.LiveBadge })),                 { ssr: false });
const ExitIntentPopup  = dynamic(() => import("../conversion/ExitIntentPopup").then(m =>         ({ default: m.ExitIntentPopup })),            { ssr: false });
const SocialProofToast = dynamic(() => import("../conversion/SocialProofToast").then(m =>        ({ default: m.SocialProofToast })),           { ssr: false });
const StickyMobileCTA  = dynamic(() => import("../conversion/StickyMobileCTA").then(m =>         ({ default: m.StickyMobileCTA })),            { ssr: false });
const WelcomeGreeting  = dynamic(() => import("./WelcomeGreeting").then(m =>                     ({ default: m.WelcomeGreeting })),            { ssr: false });

export function ClientFloatingElements() {
  return (
    <>
      <WelcomeGreeting />
      <ScrollProgress />
      <StickyMobileCTA />
      <SocialProofToast />
      <ExitIntentPopup />
      <LiveBadge />
    </>
  );
}
