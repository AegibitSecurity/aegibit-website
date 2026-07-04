"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/**
 * DownloadCountBadge, a self-contained client badge showing the exact,
 * live download count for an app (standing rule: real numbers, live
 * synced 24/7). Designed for client-component heroes where the server
 * strip cannot be awaited. Fetches /api/downloads/[app] on mount, on
 * tab focus, and every 45s while visible; renders nothing until a real
 * number arrives, and keeps the last known real number on failure.
 */
export function DownloadCountBadge({ app, source }: { app: string; source?: string }) {
  const [count, setCount] = useState<number | null>(null);

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

  if (count === null) return null;

  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
    >
      <Download size={13} style={{ color: "#F97316" }} />
      <span className="text-sm font-semibold" style={{ color: "#fff" }}>
        {count.toLocaleString("en-IN")}
      </span>
      <span className="text-sm" style={{ color: "#A1A1AA" }}>downloads</span>
      {source ? (
        <span className="text-xs" style={{ color: "#52525B" }}>· {source}</span>
      ) : null}
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#10B981" }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#10B981" }} />
      </span>
      <span className="text-xs" style={{ color: "#10B981" }}>live</span>
    </div>
  );
}
