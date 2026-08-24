"use client";

import { TrackedLink } from "@/components/shared/TrackedLink";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * DPDP cookie-consent banner.
 *
 * Shows once, only when the visitor has made no choice yet. Analytics
 * and behavioural tracking stay OFF until the visitor accepts (see
 * useVisitorTracking + ConsentedAnalytics, both gated on
 * hasAnalyticsConsent()). Declining is a first-class button, equal in
 * weight to accepting, no dark-pattern nudging. The essential security
 * session cookie is unaffected either way.
 */
export function ConsentBanner() {
  // useConsent returns null on the server and during the first client
  // paint (server snapshot), so SSR and hydration agree; after mount it
  // reflects the real cookie and hides the banner if a choice exists.
  const consent = useConsent();

  if (consent !== null) return null;

  const choose = (state: "granted" | "denied") => {
    setConsent(state);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl p-5 sm:p-6"
        style={{
          background: "#0D0D0D",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
            We use first-party cookies for analytics that help us improve
            the site. Essential cookies for security always stay on.
            You can accept or decline the rest. See our{" "}
            <TrackedLink
              href="/privacy"
              ctaId="consent_privacy_link"
              ctaLabel="Privacy Policy"
              ctaSection="consent_banner"
              className="underline underline-offset-4"
              style={{ color: "#fff" }}
            >
              Privacy Policy
            </TrackedLink>
            .
          </p>
          <div className="flex flex-shrink-0 gap-3">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              style={{ color: "#D4D4D8", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-lg px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#F97316", color: "#000" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
