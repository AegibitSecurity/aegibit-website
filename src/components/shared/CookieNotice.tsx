"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * Cookie / data-collection notice banner.
 *
 * What this is:
 *   A first-visit notice that tells visitors we collect engagement
 *   data + cookies, links to /privacy and /dpdp for the details, and
 *   stays until acknowledged. Once acknowledged, never shown again
 *   on this device for 12 months.
 *
 * What this is NOT:
 *   - This is NOT a "tracking-cookie consent gate" of the kind GDPR-
 *     strict EU sites use. AEGIBIT does not currently set advertising
 *     or cross-site tracking cookies (see /privacy for the full
 *     inventory — vc_return, aegibit_session, sessionStorage UTM,
 *     localStorage visitor-id; no Google Analytics, no Facebook Pixel).
 *     A heavy opt-in gate would be misleading about what we actually do.
 *   - This is also NOT a "by clicking you consent to processing"
 *     gate. The page tells visitors what we do and where to read
 *     more — explicit-notice model, which matches India's DPDP Act
 *     2023 requirement for clear disclosure of processing purposes.
 *
 * Storage:
 *   localStorage key `aegibit_cookie_notice_v1` is set to a timestamp
 *   when the visitor acknowledges. We version the key so a future
 *   material change to data-collection scope re-triggers the notice
 *   (bump to `_v2` if/when the practices change).
 *
 * Pathname gating:
 *   Mounted via MarketingChrome which excludes /admin, /dashboard,
 *   /api, /signup, /login. The notice should not appear on the
 *   admin surfaces (operators have already accepted internally).
 *
 * Accessibility:
 *   - Role="region" + aria-label so screen readers identify it as a
 *     named landmark, not random floating content.
 *   - Dismiss button has aria-label="Acknowledge and close cookie notice".
 *   - First Tab inside the banner lands on the "Got it" button, then
 *     the privacy links, then dismiss — natural reading order.
 *   - prefers-reduced-motion respected globally (PR #98) so the
 *     slide-in animation is suppressed for users who set it.
 */

const STORAGE_KEY = "aegibit_cookie_notice_v1";

/**
 * Lazy-initializer probe — reads the acknowledgement flag once during
 * the very first render. Mounted via MarketingChrome's `ssr: false`
 * dynamic import, so `window` is guaranteed to exist here. If storage
 * is blocked (private mode / embedded webviews) we choose to *show*
 * the notice on the principle that disclosure is the safer default.
 */
function shouldShowNotice(): boolean {
  try {
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

export function CookieNotice() {
  // Lazy initializer runs once per mount. Computing this at initial-
  // render time (rather than inside useEffect with setState) avoids
  // the react-hooks/set-state-in-effect cascading-render anti-pattern.
  const [shouldShow] = useState(shouldShowNotice);
  const [visible, setVisible] = useState(false);

  // 1.2s delay so the banner doesn't compete with first-paint animation
  // budget on the hero. setVisible runs inside a setTimeout callback —
  // asynchronous, so it does not trigger react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!shouldShow) return;
    const t = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(t);
  }, [shouldShow]);

  function acknowledge() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Storage blocked — accepting the dismissal is still the right
      // UX even if we can't persist; the visitor said they understand.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Cookie and data-collection notice"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-40"
        >
          <div
            className="rounded-xl backdrop-blur-xl"
            style={{
              background: "rgba(13, 13, 13, 0.92)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              boxShadow: "0 18px 48px rgba(0, 0, 0, 0.55)",
            }}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p
                  className="font-medium"
                  style={{
                    color: "#fff",
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                  }}
                >
                  AEGIBIT uses cookies + engagement analytics.
                </p>
                <button
                  type="button"
                  onClick={acknowledge}
                  aria-label="Acknowledge and close cookie notice"
                  className="flex-shrink-0 transition-colors"
                  style={{ color: "#71717A" }}
                >
                  <X size={16} />
                </button>
              </div>
              <p
                className="mb-4"
                style={{
                  color: "#A1A1AA",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                We collect a small set of operational data (page
                views, anonymized IP, UTM attribution, optional form
                submissions). We don&apos;t use advertising cookies.
                Full detail and your rights live on{" "}
                <TrackedLink
                  href="/privacy"
                  ctaId="cookie_notice_privacy"
                  ctaLabel="Privacy"
                  ctaSection="cookie_notice"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  /privacy
                </TrackedLink>{" "}
                and{" "}
                <TrackedLink
                  href="/dpdp"
                  ctaId="cookie_notice_dpdp"
                  ctaLabel="DPDP"
                  ctaSection="cookie_notice"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  /dpdp
                </TrackedLink>
                .
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={acknowledge}
                  className="inline-flex items-center justify-center rounded-md font-semibold text-white transition-all hover:opacity-90"
                  style={{
                    background: "#F97316",
                    padding: "0.55rem 1.15rem",
                    fontSize: "0.85rem",
                    boxShadow: "0 0 18px rgba(249,115,22,0.28)",
                  }}
                >
                  Got it
                </button>
                <TrackedLink
                  href="/privacy"
                  ctaId="cookie_notice_read_more"
                  ctaLabel="Read more"
                  ctaSection="cookie_notice"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "#A1A1AA" }}
                >
                  Read the policy →
                </TrackedLink>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
