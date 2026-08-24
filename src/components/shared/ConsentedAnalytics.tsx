"use client";

import { Analytics } from "@vercel/analytics/react";
import { useConsent } from "@/lib/consent";

/**
 * Renders Vercel Analytics only after the visitor grants consent, and
 * reacts live when they change their choice. Before consent, nothing
 * from @vercel/analytics loads or fires. DPDP-aligned.
 */
export function ConsentedAnalytics() {
  return useConsent() === "granted" ? <Analytics /> : null;
}
