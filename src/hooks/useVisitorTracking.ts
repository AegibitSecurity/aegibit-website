"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useVisitorStore } from "@/stores/visitor-store";
import { getDeviceType, getBrowser, getOS } from "@/lib/behavior-engine";

/**
 * Site-wide visitor-tracking hook.
 *
 * Four useEffects:
 *   1. One-shot init (UTM resolution + POST /api/visitors)
 *   2. Page-view tracking on route change
 *   3. Scroll-depth milestone tracking
 *   4. 30-second timer to age behavior score
 *
 * Why `useVisitorStore.getState()` inside effects instead of the
 * destructured `store` object:
 *   The previous shape was `const store = useVisitorStore()` which
 *   returns an unstable reference and trips
 *   react-hooks/exhaustive-deps unless we add `store` to every dep
 *   array — which then re-runs each effect on every store change,
 *   breaking the intended one-shot / on-change-only semantics.
 *
 *   The idiomatic Zustand pattern is to subscribe to the *specific
 *   reactive values* via selectors and fire actions via the static
 *   `getState()` accessor, which doesn't participate in re-rendering.
 *   This satisfies the lint rule without compromising the effect
 *   semantics.
 */
export function useVisitorTracking() {
  const pathname = usePathname();
  // visitorId is the only reactive store value this hook needs to
  // re-subscribe to — when it transitions from null to a server-issued
  // id after the first /api/visitors response, the scroll effect needs
  // to start posting events. sessionId is read inline via getState()
  // because it's set once at store init and never changes.
  const visitorId = useVisitorStore((s) => s.visitorId);
  const initialized = useRef(false);

  // ── 1. One-shot init ──────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const store = useVisitorStore.getState();
    const params = new URLSearchParams(window.location.search);

    // UTM resolution priority: URL on first paint > sessionStorage from
    // an earlier paint > null. URL params are present only on the
    // entry page; sessionStorage carries them across SPA navigations
    // and tab refreshes, dies on tab close (which matches per-visit
    // semantics — UTM identifies WHY they're here today, not WHO).
    const utmSource =
      params.get("utm_source") ?? sessionStorage.getItem("aegibit_utm_source");
    const utmMedium =
      params.get("utm_medium") ?? sessionStorage.getItem("aegibit_utm_medium");
    const utmCampaign =
      params.get("utm_campaign") ?? sessionStorage.getItem("aegibit_utm_campaign");

    if (utmSource) sessionStorage.setItem("aegibit_utm_source", utmSource);
    if (utmMedium) sessionStorage.setItem("aegibit_utm_medium", utmMedium);
    if (utmCampaign) sessionStorage.setItem("aegibit_utm_campaign", utmCampaign);

    // Mirror into the zustand store so the cohort engine + any
    // UTM-aware UI can read them without touching sessionStorage
    // directly. Cohort lookup happens on every render of CTA components,
    // so a synchronous in-memory read matters.
    store.setUtmParams({ source: utmSource, medium: utmMedium, campaign: utmCampaign });

    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: store.sessionId,
        userAgent: navigator.userAgent,
        device: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        referrer: document.referrer || null,
        utmSource,
        utmMedium,
        utmCampaign,
        landingPage: pathname,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.visitorId) useVisitorStore.getState().setVisitorId(data.visitorId);
        document.cookie = "vc_return=1; max-age=2592000; path=/; SameSite=Lax";
      })
      .catch(() => {});
    // Intentionally one-shot. `pathname` is captured at first mount
    // (landing page); subsequent route changes are handled by the
    // page-view effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Page-view tracking ─────────────────────────────────────────
  useEffect(() => {
    const store = useVisitorStore.getState();
    store.addPage(pathname);
    store.recalculateScore();

    if (store.visitorId) {
      fetch("/api/visitors/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: store.visitorId,
          eventType: "pageview",
          page: pathname,
        }),
      }).catch(() => {});
    }
  }, [pathname]);

  // ── 3. Scroll depth tracking ──────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      const scrolled = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      const store = useVisitorStore.getState();
      const prev = store.scrollDepthMax;
      const milestones = [25, 50, 75, 100];
      const hit = milestones.find((m) => scrolled >= m && prev < m);

      store.updateScrollDepth(scrolled);
      store.recalculateScore();

      if (hit && store.visitorId) {
        fetch("/api/visitors/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: store.visitorId,
            eventType: "scroll",
            eventData: { depth: hit },
            page: pathname,
          }),
        }).catch(() => {});
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, visitorId]);

  // ── 4. Time on site ───────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const store = useVisitorStore.getState();
      store.incrementTime();
      store.recalculateScore();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
}
