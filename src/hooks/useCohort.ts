"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useVisitorStore } from "@/stores/visitor-store";
import { track } from "@/lib/track";
import { getCohort, type CohortAssignment } from "@/lib/cohorts";

/**
 * React hook for reading the current visitor's cohort.
 *
 * Returns the default cohort on the server snapshot (SSR + first paint)
 * so the served HTML is stable and there's no hydration mismatch. Once
 * the visitor store changes client-side, the hook re-derives with the
 * current cohort and fires `experiment_exposure` with
 * { experiment: "cohort", variant: cohortId } so the funnel dashboard
 * groups conversions per-cohort the same way it does per-experiment.
 *
 * Why piggyback on experiment_exposure rather than a new event type:
 * cohorts ARE de facto experiments — different segments seeing
 * different content. The funnel pipeline already groups by
 * experiment_exposure, so personalization gets per-cohort conversion
 * read-out for free.
 *
 * Why useSyncExternalStore (not useState + useEffect):
 *   `cohort` is a *derived value* of the visitor store, not React
 *   state in its own right. The React 18+ canonical pattern for
 *   subscribing to an external mutable store and deriving a snapshot
 *   from it is useSyncExternalStore. This avoids the cascading-render
 *   anti-pattern that `useEffect(() => setCohort(getCohort()), [...])`
 *   trips (react-hooks/set-state-in-effect) while preserving exact
 *   SSR + transition semantics.
 *
 * Why the module-level snapshot cache:
 *   useSyncExternalStore requires getSnapshot() to return a stable
 *   reference when the underlying data hasn't changed — otherwise
 *   React detects a "change" on every render and loops. `getCohort()`
 *   returns a fresh object literal each call, so we cache the last
 *   assignment and only return a new reference when id+reason differ.
 *   Single-tab semantics are correct: every component in this tab
 *   shares the same cache and sees the same identity for the same
 *   logical cohort.
 */

const SSR_DEFAULT: CohortAssignment = { id: "default", reason: "ssr" };

let cachedSnapshot: CohortAssignment = SSR_DEFAULT;

function getClientSnapshot(): CohortAssignment {
  const next = getCohort();
  if (
    cachedSnapshot.id === next.id &&
    cachedSnapshot.reason === next.reason
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return cachedSnapshot;
}

function getServerSnapshot(): CohortAssignment {
  return SSR_DEFAULT;
}

export function useCohort(): CohortAssignment {
  const cohort = useSyncExternalStore(
    useVisitorStore.subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const visitorId = useVisitorStore((s) => s.visitorId);
  const exposed = useRef<string | null>(null);

  useEffect(() => {
    // Fire exposure exactly once per cohort transition. If the visitor
    // moves from default → high_intent during their session we want a
    // second exposure so the dashboard attributes the post-transition
    // conversion to the new cohort. setState is *not* called inside
    // this effect — only track() — so react-hooks/set-state-in-effect
    // does not apply.
    if (visitorId && exposed.current !== cohort.id) {
      exposed.current = cohort.id;
      track("experiment_exposure", {
        experiment: "cohort",
        variant: cohort.id,
        reason: cohort.reason,
      });
    }
  }, [cohort.id, cohort.reason, visitorId]);

  return cohort;
}
