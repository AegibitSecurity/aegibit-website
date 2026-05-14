"use client";

import { useEffect, useRef } from "react";
import { useVisitorStore } from "@/stores/visitor-store";
import { track } from "@/lib/track";
import {
  EXPERIMENTS,
  getExperimentVariant,
  type ExperimentId,
  type ExperimentVariant,
} from "@/lib/experiments";

/**
 * React hook for reading an A/B variant.
 *
 * Returns the variant assigned to the current visitor. Always returns
 * the control on first render (server / before visitorId is known) so
 * SSR is stable and there's no hydration mismatch. Once visitorId
 * resolves on the client, the hook re-renders with the actual
 * assignment AND fires `experiment_exposure` exactly once.
 *
 * Usage
 *   const variant = useExperiment("hero_cta_copy");
 *   if (variant === "variant_demo") return <Button>Get a demo</Button>;
 *   return <Button>Explore Our Products</Button>;
 *
 * The exposure event is the load-bearing piece for stats analysis —
 * sample size = distinct visitors with experiment_exposure for this
 * (experiment, variant) pair. Conversion rate = leads attributed to
 * each variant's distinct cta_id. The dashboard funnel view already
 * shows this without any new code.
 *
 * Why compute on render (not useState + useEffect):
 *   The variant is a deterministic function of (visitorId, experimentId)
 *   via FNV-1a bucketing in `getExperimentVariant` — a pure function.
 *   Computing on render with `visitorId` as a Zustand-tracked dependency
 *   gives correct re-render semantics without the cascading-render
 *   anti-pattern that `useEffect(setState)` trips
 *   (react-hooks/set-state-in-effect). Exposure tracking remains in a
 *   useEffect because it's a side effect, not a derived value.
 */
export function useExperiment<E extends ExperimentId>(
  experimentId: E,
): ExperimentVariant<E> {
  const visitorId = useVisitorStore((s) => s.visitorId);
  const exp = EXPERIMENTS[experimentId];
  const control = exp.variants[0] as ExperimentVariant<E>;

  // Derived value: until visitorId resolves (SSR + first client paint
  // before useVisitorTracking has populated the store), return control
  // so the served HTML and the first client render match. After
  // hydration, getExperimentVariant returns the deterministic bucket
  // assignment and the component re-renders with the actual variant.
  const variant: ExperimentVariant<E> = visitorId
    ? ((getExperimentVariant(visitorId, experimentId) ?? control) as ExperimentVariant<E>)
    : control;

  const exposed = useRef(false);

  useEffect(() => {
    if (!visitorId || exposed.current || !exp.enabled) return;
    exposed.current = true;
    track("experiment_exposure", {
      experiment: experimentId,
      variant,
    });
  }, [visitorId, experimentId, exp.enabled, variant]);

  return variant;
}
