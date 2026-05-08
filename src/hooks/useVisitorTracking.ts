"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useVisitorStore } from "@/stores/visitor-store";
import { getDeviceType, getBrowser, getOS } from "@/lib/behavior-engine";

export function useVisitorTracking() {
  const pathname = usePathname();
  const store = useVisitorStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

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
        if (data.visitorId) store.setVisitorId(data.visitorId);
        document.cookie = "vc_return=1; max-age=2592000; path=/; SameSite=Lax";
      })
      .catch(() => {});
  }, []);

  // Track page views
  useEffect(() => {
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

  // Scroll depth tracking
  useEffect(() => {
    function onScroll() {
      const scrolled = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
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
  }, [pathname, store.visitorId]);

  // Time on site
  useEffect(() => {
    const interval = setInterval(() => {
      store.incrementTime();
      store.recalculateScore();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
}
