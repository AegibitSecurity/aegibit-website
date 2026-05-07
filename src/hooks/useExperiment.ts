"use client";

import { useEffect, useRef, useState } from "react";
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
 */
export function useExperiment<E extends ExperimentId>(
  experimentId: E,
): ExperimentVariant<E> {
  const visitorId = useVisitorStore((s) => s.visitorId);
  const exp = EXPERIMENTS[experimentId];
  const control = exp.variants[0] as ExperimentVariant<E>;
  const [variant, setVariant] = useState<ExperimentVariant<E>>(control);
  const exposed = useRef(false);

  useEffect(() => {
    if (!visitorId) return;
    const assigned = getExperimentVariant(visitorId, experimentId);
    const final = (assigned ?? control) as ExperimentVariant<E>;
    setVariant(final);

    if (!exposed.current && exp.enabled) {
      exposed.current = true;
      track("experiment_exposure", {
        experiment: experimentId,
        variant: final,
      });
    }
  }, [visitorId, experimentId, exp.enabled, control]);

  return variant;
}
