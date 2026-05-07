/**
 * AEGIBIT experiment engine — minimum viable A/B layer.
 *
 * Design philosophy
 *   - Experiments are typed config objects defined in this file (one
 *     source of truth, reviewable in PRs, no hidden runtime state).
 *   - Variant assignment is deterministic per visitor: same visitorId
 *     always sees the same variant within an experiment, even across
 *     sessions. Implemented via a stable hash, no server roundtrip.
 *   - Exposure tracking piggybacks on the telemetry layer from
 *     P2-S1A (track + visitor_events). No new database table.
 *   - Conversions are attributed to variants via the existing CTA
 *     event pipeline: each variant uses a distinct cta_id, so the
 *     funnel dashboard already shows per-variant performance for free.
 *
 * Lifecycle of an experiment
 *   1. Add an entry to EXPERIMENTS below with id, variants, and
 *      hypothesis. Default `enabled: true` and a 50/50 split for an
 *      A/B (or three-way for A/B/C).
 *   2. Use the variant in the UI via `getExperimentVariant(visitorId, id)`
 *      or the React hook `useExperiment(id)`. Render different copy /
 *      CTA / layout per variant.
 *   3. Fire `track("experiment_exposure", { experiment, variant })`
 *      once per visitor per experiment so the dashboard can compute
 *      sample sizes. The hook does this automatically.
 *   4. Each variant's CTA emits a distinct cta_id (convention:
 *      `${cta_id}_v${variantIndex}`). The funnel dashboard groups
 *      conversions by cta_id, so per-variant metrics show up there
 *      without any new code.
 *   5. When a winner is clear, set `enabled: false`, migrate the UI
 *      to use the winning variant unconditionally, and delete the
 *      experiment in a follow-up PR. Keep a comment with the result
 *      for the institutional memory.
 *
 * Out of scope (filed for P2-S2.5+)
 *   - Per-experiment dashboard view (current funnel suffices)
 *   - Statistical-significance tests (eyeball check + min sample size
 *     guardrail is enough until we have real volume)
 *   - SSR-time variant rendering (current impl is client-only; a
 *     brief flicker is acceptable for marketing CTAs)
 *   - Targeting rules (audience filters, geo, device — none needed
 *     yet; the global 50/50 split serves us until traffic >10k/day)
 */

export interface Experiment {
  id: string;
  hypothesis: string;
  enabled: boolean;
  variants: readonly string[]; // first entry is the control
  /** % of traffic in the experiment. 100 = everyone, 50 = half. */
  trafficPercent?: number;
}

export const EXPERIMENTS = {
  hero_cta_copy: {
    id: "hero_cta_copy",
    hypothesis:
      "A more direct CTA ('Get a demo' vs the current 'Explore Our Products') will lift form-submit rate from /products/* pages.",
    enabled: true,
    variants: ["control_explore", "variant_demo"] as const,
    trafficPercent: 100,
  },
} satisfies Record<string, Experiment>;

export type ExperimentId = keyof typeof EXPERIMENTS;
export type ExperimentVariant<E extends ExperimentId> =
  (typeof EXPERIMENTS)[E]["variants"][number];

/**
 * FNV-1a 32-bit hash. Good enough for bucketing — uniform-ish
 * distribution, no deps, ~10ns per call. We never use this for
 * anything security-sensitive, only deterministic 0..99 buckets.
 */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministic bucket assignment for (visitorId, experimentId).
 * Returns the variant string for this visitor, or null if the
 * experiment is disabled / visitor falls outside trafficPercent.
 */
export function getExperimentVariant<E extends ExperimentId>(
  visitorId: string | null,
  experimentId: E,
): ExperimentVariant<E> | null {
  const exp = EXPERIMENTS[experimentId];
  if (!exp.enabled) return exp.variants[0] as ExperimentVariant<E>;

  // No visitorId yet (first-paint, before useVisitorTracking POSTs):
  // serve control. Avoids variant flicker on first render.
  if (!visitorId) return exp.variants[0] as ExperimentVariant<E>;

  const bucket = fnv1a(`${experimentId}:${visitorId}`) % 100;

  // Traffic gate. trafficPercent=100 → everyone in. 50 → half opted
  // out and see control without exposure event firing.
  const traffic = exp.trafficPercent ?? 100;
  if (bucket >= traffic) return exp.variants[0] as ExperimentVariant<E>;

  // Even split across variants. Three-way A/B/C: bucket / (100 / 3).
  const idx = Math.floor((bucket / traffic) * exp.variants.length);
  return exp.variants[Math.min(idx, exp.variants.length - 1)] as ExperimentVariant<E>;
}
