"use client";

import { useEffect, useRef, useState } from "react";
import { useVisitorStore } from "@/stores/visitor-store";
import { track } from "@/lib/track";
import { getCohort, type CohortAssignment } from "@/lib/cohorts";

/**
 * React hook for reading the current visitor's cohort.
 *
 * Returns the default cohort on first render (SSR + first paint) so
 * the served HTML is stable and there's no hydration mismatch. Once
 * the visitor store is populated client-side, the hook re-renders
 * with the actual cohort and fires `experiment_exposure` with
 * { experiment: "cohort", variant: cohortId } so the funnel
 * dashboard groups conversions per-cohort the same way it does
 * per-experiment-variant.
 *
 * Why piggyback on experiment_exposure rather than a new event type:
 * cohorts ARE de facto experiments — different segments seeing
 * different content. The funnel pipeline already groups by
 * experiment_exposure, so personalization gets per-cohort conversion
 * read-out for free.
 */
export function useCohort(): CohortAssignment {
  // Re-run when relevant store fields change.
  const visitorId        = useVisitorStore((s) => s.visitorId);
  const clickedCTA       = useVisitorStore((s) => s.clickedCTA);
  const visitedPricing   = useVisitorStore((s) => s.visitedPricingPage);
  const visitedAlts      = useVisitorStore((s) => s.visitedAlternativesPage);

  const [cohort, setCohort] = useState<CohortAssignment>({ id: "default", reason: "ssr" });
  const exposed = useRef<string | null>(null);

  useEffect(() => {
    const next = getCohort();
    setCohort(next);

    // Fire exposure exactly once per cohort transition. If the
    // visitor moves from default → high_intent during their session
    // we want a second exposure so the dashboard can attribute the
    // post-transition conversion to the new cohort.
    if (visitorId && exposed.current !== next.id) {
      exposed.current = next.id;
      track("experiment_exposure", {
        experiment: "cohort",
        variant: next.id,
        reason: next.reason,
      });
    }
  }, [visitorId, clickedCTA, visitedPricing, visitedAlts]);

  return cohort;
}
