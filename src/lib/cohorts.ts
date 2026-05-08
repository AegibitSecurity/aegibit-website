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
 *                     /alternatives. Strongest signal: ready to convert.
 *                     Overrides UTM because engagement on-site beats
 *                     where they came from.
 *   2. from_paid    — utm_medium=cpc OR utm_source ∈ {google_ads,
 *                     google, facebook, meta, bing}. They clicked a
 *                     paid placement based on a search/intent signal.
 *                     Copy validates the intent: "you searched for X,
 *                     here's how we deliver X."
 *   3. from_social  — utm_source ∈ {linkedin, twitter, x, instagram,
 *                     youtube}. They clicked a thought-leadership /
 *                     org-social post. Copy is more relationship-led
 *                     because trust precedes intent here.
 *   4. from_email   — utm_medium=email. They clicked through from our
 *                     own newsletter / nurture sequence. Already-warm
 *                     tone — no need to re-introduce AEGIBIT.
 *   5. returning    — has the vc_return cookie set by useVisitorTracking
 *                     on a prior session. Generic "you've been here
 *                     before" — used only if no UTM identifies WHY.
 *   6. default      — first-time visitor, no UTM, no signal yet.
 *
 * Future cohorts (still on backlog)
 *   - geo:india / geo:us — needs IP-geo lookup (server-side header)
 *   - device:mobile / device:desktop — already in store, just unused
 *   - role:engineer / role:founder — needs explicit signal (form data)
 */

import { useVisitorStore } from "@/stores/visitor-store";

export const COHORT_IDS = [
  "high_intent",
  "from_paid",
  "from_social",
  "from_email",
  "returning",
  "default",
] as const;
export type CohortId = (typeof COHORT_IDS)[number];

export interface CohortAssignment {
  id: CohortId;
  reason: string;
}

interface UtmInputs {
  source: string | null;
  medium: string | null;
  campaign: string | null;
}

const PAID_SOURCES = new Set(["google_ads", "google", "googleads", "adwords", "facebook", "meta", "bing", "yahoo"]);
const SOCIAL_SOURCES = new Set(["linkedin", "twitter", "x", "instagram", "youtube", "reddit"]);

/**
 * Pure UTM → cohort matcher. Exported so the test suite can assert
 * the priority order and string-matching without touching the zustand
 * store. Returns null if no UTM cohort matches.
 */
export function classifyUtm(utm: UtmInputs): CohortAssignment | null {
  const source = (utm.source ?? "").toLowerCase().trim();
  const medium = (utm.medium ?? "").toLowerCase().trim();

  if (medium === "cpc" || PAID_SOURCES.has(source)) {
    return { id: "from_paid", reason: `utm_medium=${medium || "n/a"} utm_source=${source || "n/a"}` };
  }
  if (SOCIAL_SOURCES.has(source)) {
    return { id: "from_social", reason: `utm_source=${source}` };
  }
  if (medium === "email") {
    return { id: "from_email", reason: `utm_medium=email utm_source=${source || "n/a"}` };
  }
  return null;
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

  // 1. High intent: clicked at least one CTA AND walked the funnel
  //    toward consideration (pricing or alternatives). Strongest signal,
  //    beats UTM (on-site engagement > acquisition channel).
  if (s.clickedCTA && (s.visitedPricingPage || s.visitedAlternativesPage)) {
    return {
      id: "high_intent",
      reason: `clickedCTA=true, visited${s.visitedPricingPage ? "Pricing" : "Alternatives"}`,
    };
  }

  // 2-4. UTM-based cohorts. These tell us WHY the visitor is here today
  //      — more useful for fresh personalization than just "you've been
  //      here before". Beats `returning` for that reason.
  const utm = classifyUtm({
    source: s.utmSource,
    medium: s.utmMedium,
    campaign: s.utmCampaign,
  });
  if (utm) return utm;

  // 5. Returning: cookie set by the visitor-tracking initial POST on
  //    a prior visit. Cookie persists for 30 days (vc_return=1).
  if (typeof document !== "undefined" && document.cookie.includes("vc_return=1")) {
    return { id: "returning", reason: "vc_return cookie present" };
  }

  return { id: "default", reason: "first-time visitor, no signal" };
}
