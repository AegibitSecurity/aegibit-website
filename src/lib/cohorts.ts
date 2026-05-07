/**
 * AEGIBIT cohort engine — segment-based personalization.
 *
 * Design philosophy
 *   - Cohort assignment is computed CLIENT-SIDE from the existing
 *     visitor-store signals. No new endpoint, no server roundtrip,
 *     no new schema.
 *   - Cohorts are SEGMENT-based, never per-user fingerprinted —
 *     respects the charter's privacy posture (no PII to LLMs, no
 *     individual targeting).
 *   - Decisions are explainable: getCohort() returns the matched
 *     cohort id AND the reason. Audit-friendly, debuggable.
 *   - Hard fallback: when no cohort matches, return "default" and
 *     render the canonical experience.
 *
 * Active cohorts (in matching priority order — first match wins)
 *   1. high_intent  — visitor clicked any CTA + visited /pricing or
 *                     /alternatives. Signal: ready to convert.
 *   2. returning    — has the vc_return cookie set by useVisitorTracking
 *                     on a prior session.
 *   3. default      — first-time visitor, no signal yet.
 *
 * Future cohorts (filed for P2-S3.5)
 *   - geo:india / geo:us — needs IP-geo lookup (server-side header)
 *   - device:mobile / device:desktop — already in store, just unused
 *   - utm:google_ads / utm:linkedin — campaign source attribution
 *   - role:engineer / role:founder — needs explicit signal (form data)
 */

import { useVisitorStore } from "@/stores/visitor-store";

export const COHORT_IDS = ["high_intent", "returning", "default"] as const;
export type CohortId = (typeof COHORT_IDS)[number];

export interface CohortAssignment {
  id: CohortId;
  reason: string;
}

/**
 * Assign the current visitor to exactly one cohort. Pure function —
 * given the same store state, always returns the same cohort. The
 * reason string is for the operator dashboard ("why did this visitor
 * see variant X?").
 *
 * The function reads from the zustand store directly so it works
 * outside React. For React components, prefer useCohort().
 */
export function getCohort(): CohortAssignment {
  if (typeof window === "undefined") {
    // SSR no-op — render default and let client-side hydration do
    // the assignment. Stops hydration mismatches.
    return { id: "default", reason: "ssr" };
  }

  const s = useVisitorStore.getState();

  // High intent: clicked at least one CTA AND walked the funnel
  // toward consideration (pricing or alternatives).
  if (s.clickedCTA && (s.visitedPricingPage || s.visitedAlternativesPage)) {
    return {
      id: "high_intent",
      reason: `clickedCTA=true, visited${s.visitedPricingPage ? "Pricing" : "Alternatives"}`,
    };
  }

  // Returning: cookie set by the visitor-tracking initial POST on a
  // prior visit. Cookie persists for 30 days (vc_return=1).
  if (typeof document !== "undefined" && document.cookie.includes("vc_return=1")) {
    return { id: "returning", reason: "vc_return cookie present" };
  }

  return { id: "default", reason: "first-time visitor, no signal" };
}
