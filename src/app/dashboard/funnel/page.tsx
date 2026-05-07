"use client";

import { useEffect, useState } from "react";
import { Users, MousePointerClick, FileText, CheckCircle2, TrendingDown, Sparkles } from "lucide-react";

/**
 * /dashboard/funnel — Conversion funnel intelligence.
 *
 * Reads /api/admin/funnel and renders:
 *   1. Five-step funnel: visitors → CTA-click → form-start → form-submit → lead
 *   2. Per-CTA breakdown: which CTAs drive the most clicks, top pages each
 *   3. Per-page table: visitors, CTA clicks, conversions per landing page
 *
 * Auto-refreshes every 60s.
 *
 * Auth: cookie session (route guarded by proxy + requireAdmin in API).
 */

interface FunnelData {
  timeframe: string;
  since: string;
  overall: {
    visitors: number;
    cta_clickers: number;
    form_starters: number;
    form_submitters: number;
    leads_captured: number;
    conversion_rate: number;
  };
  cta_breakdown: Array<{
    cta_id: string;
    cta_label: string;
    clicks: number;
    distinct_visitors: number;
    top_pages: Array<{ page: string; clicks: number }>;
  }>;
  top_pages: Array<{
    page: string;
    visitors: number;
    cta_clicks: number;
    conversions: number;
  }>;
}

const TIMEFRAMES = [
  { value: "today", label: "Today" },
  { value: "7d",    label: "Last 7 days" },
  { value: "30d",   label: "Last 30 days" },
];

export default function FunnelDashboard() {
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/funnel?timeframe=${timeframe}`, {
          credentials: "include",
          cache: "no-store",
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? `HTTP ${res.status}`);
          setData(null);
        } else {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [timeframe]);

  const o = data?.overall;
  const steps = o
    ? [
        { label: "Visitors",      value: o.visitors,        icon: Users,             color: "#60A5FA" },
        { label: "Clicked CTA",   value: o.cta_clickers,    icon: MousePointerClick, color: "#F97316" },
        { label: "Started Form",  value: o.form_starters,   icon: FileText,          color: "#FBBF24" },
        { label: "Submitted",     value: o.form_submitters, icon: CheckCircle2,      color: "#34D399" },
        { label: "Lead Captured", value: o.leads_captured,  icon: Sparkles,          color: "#A855F7" },
      ]
    : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-1">Conversion Funnel</h1>
          <p className="text-sm text-[#6B7280]">
            Live visitor → click → form → lead pipeline. Auto-refreshes every 60s.
          </p>
        </div>
        <div className="flex gap-2">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeframe(t.value)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background:
                  timeframe === t.value ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  timeframe === t.value ? "rgba(249,115,22,0.40)" : "rgba(255,255,255,0.06)"
                }`,
                color: timeframe === t.value ? "#F97316" : "#A1A1AA",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-[#6B7280] text-sm py-8">Loading funnel…</div>
      )}

      {data && (
        <>
          {/* Funnel steps */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {steps.map((s, i) => {
              const next = steps[i + 1];
              const dropPct =
                next && s.value > 0 ? Math.round((1 - next.value / s.value) * 100) : 0;
              return (
                <div
                  key={s.label}
                  className="rounded-xl p-4"
                  style={{
                    background: "#070d1a",
                    border: "1px solid rgba(37,99,235,0.15)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">
                      {s.label}
                    </span>
                    <s.icon size={14} style={{ color: s.color }} />
                  </div>
                  <div className="text-2xl font-light text-[#F9FAFB]">
                    {s.value.toLocaleString()}
                  </div>
                  {next && s.value > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-[#52525B]">
                      <TrendingDown size={10} />
                      {dropPct}% drop to {next.label.toLowerCase()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Conversion-rate banner */}
          <div
            className="mb-6 p-4 rounded-xl flex items-center justify-between"
            style={{
              background: "rgba(168,85,247,0.06)",
              border: "1px solid rgba(168,85,247,0.18)",
            }}
          >
            <div>
              <div className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-1">
                Visitor → Lead conversion
              </div>
              <div className="text-2xl font-light text-[#F9FAFB]">
                {o?.conversion_rate ?? 0}%
              </div>
            </div>
            <div className="text-right text-xs text-[#6B7280]">
              {o?.leads_captured ?? 0} leads / {o?.visitors ?? 0} visitors
              <div className="text-[10px] mt-0.5">
                window: {data.timeframe} · since {new Date(data.since).toLocaleString()}
              </div>
            </div>
          </div>

          {/* CTA breakdown */}
          <div
            className="rounded-xl p-5 mb-6"
            style={{ background: "#070d1a", border: "1px solid rgba(37,99,235,0.15)" }}
          >
            <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
              <h2 className="text-sm font-semibold text-[#F9FAFB]">
                CTAs by clicks ({data.cta_breakdown.length})
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Which buttons people actually press. Empty = those CTAs haven&apos;t been
                clicked yet in this window.
              </p>
            </div>
            {data.cta_breakdown.length === 0 ? (
              <div className="text-xs text-[#6B7280] py-6 text-center">
                No CTA clicks recorded in this window. Either nobody clicked anything, or
                the cta_click instrumentation hasn&apos;t reached this CTA yet (we&apos;re
                rolling out coverage).
              </div>
            ) : (
              <div className="space-y-3">
                {data.cta_breakdown.slice(0, 12).map((c) => (
                  <div key={c.cta_id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-[#D1D5DB] truncate">
                          {c.cta_label}
                        </span>
                        <span className="font-mono text-[10px] text-[#52525B]">
                          {c.cta_id}
                        </span>
                      </div>
                      <div className="text-sm text-[#A1A1AA] flex-shrink-0">
                        <span className="text-[#F97316] font-semibold">{c.clicks}</span>{" "}
                        clicks · {c.distinct_visitors} visitors
                      </div>
                    </div>
                    {c.top_pages.length > 0 && (
                      <div className="text-[10px] text-[#52525B] font-mono truncate">
                        on:{" "}
                        {c.top_pages
                          .map((p) => `${p.page} (${p.clicks})`)
                          .join(" · ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pages */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#070d1a", border: "1px solid rgba(37,99,235,0.15)" }}
          >
            <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
              <h2 className="text-sm font-semibold text-[#F9FAFB]">Top pages</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                By distinct visitors in this window. Conversion = leads attributed to a
                form submitted FROM this page.
              </p>
            </div>
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.05)] text-[10px] uppercase tracking-wider text-[#6B7280]">
                    <th className="text-left px-5 py-3 font-medium">Page</th>
                    <th className="text-right px-5 py-3 font-medium">Visitors</th>
                    <th className="text-right px-5 py-3 font-medium">CTA clicks</th>
                    <th className="text-right px-5 py-3 font-medium">Conversions</th>
                    <th className="text-right px-5 py-3 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_pages.map((p) => {
                    const rate = p.visitors > 0
                      ? ((p.conversions / p.visitors) * 100).toFixed(2)
                      : "0.00";
                    return (
                      <tr
                        key={p.page}
                        className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      >
                        <td className="px-5 py-3 text-xs font-mono text-[#D1D5DB] truncate max-w-md">
                          {p.page}
                        </td>
                        <td className="px-5 py-3 text-xs text-right text-[#D1D5DB]">
                          {p.visitors.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-xs text-right text-[#F97316]">
                          {p.cta_clicks.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-xs text-right text-[#34D399]">
                          {p.conversions.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-xs text-right text-[#A1A1AA]">
                          {rate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
