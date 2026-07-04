"use client";

import { useEffect, useState } from "react";

/**
 * LiveDownloadCount, the client half of the live-synced download
 * counter (standing rule: the number must increase the moment anyone
 * downloads, 24/7). Server renders the initial exact count for SEO and
 * first paint; this component then re-fetches /api/downloads/[app]
 * (no-store) on mount, on tab focus, and every 45 seconds while the tab
 * is visible. On fetch failure it keeps the last known real number
 * rather than inventing one.
 */
export function LiveDownloadCount({ app, initial }: { app: string; initial: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    let stopped = false;

    const refresh = async () => {
      try {
        const res = await fetch(`/api/downloads/${app}`, { cache: "no-store" });
        if (!res.ok) return;
        const data: { count?: number | null } = await res.json();
        if (!stopped && typeof data.count === "number") setCount(data.count);
      } catch {
        // Keep the last known real number.
      }
    };

    refresh();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 45_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [app]);

  return <>{count.toLocaleString("en-IN")}</>;
}
