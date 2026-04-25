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
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
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
