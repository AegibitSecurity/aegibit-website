"use client";

import { useVisitorStore } from "@/stores/visitor-store";
import type { VisitorEventType } from "@/lib/validators";

/**
 * Public client-side telemetry helper.
 *
 * Why this exists: the codebase had three separate places firing
 * `fetch("/api/visitors/events", ...)` inline (useVisitorTracking
 * for pageview/scroll, ad-hoc CTAs, etc.). One typo in the URL or
 * one missing visitorId guard and the event silently drops on the
 * floor. Centralizing here gives us:
 *
 *   - one place to add retry / batching / queueing later
 *   - one place to add console-debug toggling
 *   - typed event_type via the VisitorEventType enum
 *   - guaranteed no-throw (telemetry never breaks the user flow)
 *   - automatic page enrichment from window.location
 *
 * Usage:
 *   import { track } from "@/lib/track";
 *   <button onClick={() => { track("cta_click", { cta_id: "hero_explore" }); ... }}>
 *
 * Or via React hook for components that need typed access:
 *   const track = useTrack();
 *   track("cta_click", { cta_id: "hero_explore" });
 */

interface TrackData {
  [key: string]: unknown;
}

let _warned = false;

export function track(
  eventType: VisitorEventType,
  data?: TrackData,
  pageOverride?: string,
): void {
  if (typeof window === "undefined") return; // SSR no-op

  // Read visitorId from the zustand store directly — works outside
  // React components (e.g. inline event handlers in server-rendered
  // markup that hydrate later).
  const visitorId = useVisitorStore.getState().visitorId;
  if (!visitorId) {
    if (!_warned && process.env.NODE_ENV !== "production") {
      _warned = true;
      console.warn(
        "[track] visitorId not yet available — early CTAs may be dropped. " +
          "This is expected on the first 100ms of a fresh visit.",
      );
    }
    return;
  }

  const page = pageOverride ?? window.location.pathname;

  // Fire-and-forget. Telemetry must never throw or block the UI.
  // Using fetch() with keepalive so events fire on page-leave too
  // (clicking a link that navigates away would otherwise drop the
  // request as the page unloads).
  void fetch("/api/visitors/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId, eventType, eventData: data, page }),
    keepalive: true,
  }).catch(() => {
    /* swallow — telemetry is best-effort */
  });

  // Update local visitor store for the behavior-score recalc, so the
  // exit-intent / popup engine sees the new signal immediately
  // without waiting for the round trip.
  if (eventType === "cta_click") useVisitorStore.getState().setClickedCTA();
  if (eventType === "form_focus") useVisitorStore.getState().setStartedForm();
  if (eventType === "form_submit") useVisitorStore.getState().setSubmittedForm();
  if (eventType === "click") useVisitorStore.getState().incrementClicks();
}

/**
 * React-friendly wrapper. Returns a stable callback identity so
 * useEffect dependency lists don't churn.
 */
export function useTrack(): typeof track {
  return track;
}
