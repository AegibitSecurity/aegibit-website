"use client";

import { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Shield,
  Users,
  Mail,
  Play,
  Target,
  ExternalLink,
} from "lucide-react";

/**
 * /dashboard/tool-activity — usage telemetry for the two free
 * acquisition tools (PayMint Snapshot + MCP Shield Scanner).
 *
 * Closes the observability gap from M-1/M-2: when those tools
 * shipped we had no idea whether anyone was using them. This
 * surface reads /api/admin/tool-activity and renders:
 *   1. Cross-tool totals strip
 *   2. Per-tool sections with funnel breakdown, 14-day bars,
 *      and top source pages
 *
 * Auto-refreshes every 60s. Same auth path as the rest of
 * /dashboard/*.
 *
 * Mirror of /dashboard/downloads' visual + interaction patterns.
 */

type ToolKey = "paymint_snapshot" | "mcp_shield_scanner";

interface ToolMetrics {
  name: string;
  funnel: {
    sample_loads: number;
    uploads: number;
    runs: number;
    email_clicks: number;
    email_exports: number;
  };
  distinct_visitors: number;
  daily: Array<{ date: string; runs: number }>;
  top_source_pages: Array<{ page: string; runs: number }>;
}

interface ActivityData {
  timeframe: string;
  since: string;
  totals: {
    runs: number;
    distinct_visitors: number;
    email_exports: number;
    conversion_rate_pct: number;
  };
  by_tool: Record<ToolKey, ToolMetrics>;
}

const TIMEFRAMES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

const TOOL_COLOR: Record<ToolKey, string> = {
  paymint_snapshot: "#F97316",
  mcp_shield_scanner: "#22C55E",
};

const TOOL_ICON: Record<ToolKey, typeof FileSpreadsheet> = {
  paymint_snapshot: FileSpreadsheet,
  mcp_shield_scanner: Shield,
};

const TOOL_SURFACE: Record<ToolKey, string> = {
  paymint_snapshot: "/products/paymint#snapshot",
  mcp_shield_scanner: "/products/mcp-shield#scanner",
};

export default function ToolActivityDashboard() {
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/tool-activity?timeframe=${timeframe}`, {
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

  const t = data?.totals;
  const empty = data && data.totals.runs === 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-1">Tool Activity</h1>
          <p className="text-sm text-[#6B7280]">
            Usage telemetry for the two free acquisition tools.
            PayMint Snapshot and MCP Shield Scanner. Auto-refreshes every 60s.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background:
                  timeframe === tf.value
                    ? "rgba(249,115,22,0.15)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  timeframe === tf.value
                    ? "rgba(249,115,22,0.40)"
                    : "rgba(255,255,255,0.06)"
                }`,
                color: timeframe === tf.value ? "#F97316" : "#A1A1AA",
              }}
            >
              {tf.label}
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
        <div className="text-[#6B7280] text-sm py-8">Loading tool activity…</div>
      )}

      {data && (
        <>
          {/* Totals strip */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Kpi
              icon={Play}
              label="Total runs"
              value={t!.runs}
              caption={`since ${shortDate(data.since)}`}
              accent="#F97316"
            />
            <Kpi
              icon={Users}
              label="Distinct visitors"
              value={t!.distinct_visitors}
              caption="deduped across both tools"
              accent="#60A5FA"
            />
            <Kpi
              icon={Mail}
              label="Email exports"
              value={t!.email_exports}
              caption="lead rows written"
              accent="#22C55E"
            />
            <Kpi
              icon={Target}
              label="Conversion rate"
              value={`${t!.conversion_rate_pct}%`}
              caption="exports ÷ runs"
              accent="#A855F7"
              isString
            />
          </div>

          {empty ? (
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0D0D0D] p-8 text-center text-sm text-[#6B7280]">
              No tool runs recorded in this window yet. When the first
              visitor clicks Generate Snapshot or Scan Manifest, the runs
              will appear here.
            </div>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
                By tool
              </h2>
              <div className="space-y-5">
                {(
                  ["paymint_snapshot", "mcp_shield_scanner"] as ToolKey[]
                ).map((k) => (
                  <ToolCard
                    key={k}
                    toolKey={k}
                    metrics={data.by_tool[k]}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Component pieces
// ─────────────────────────────────────────────────────────────────

function Kpi({
  icon: Icon,
  label,
  value,
  caption,
  accent,
  isString,
}: {
  icon: typeof Play;
  label: string;
  value: number | string;
  caption: string;
  accent: string;
  isString?: boolean;
}) {
  const display =
    isString || typeof value === "string"
      ? String(value)
      : (value as number).toLocaleString();
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} style={{ color: accent }} />
        <p
          className="text-xs uppercase tracking-wider"
          style={{ color: "#9CA3AF" }}
        >
          {label}
        </p>
      </div>
      <p className="text-3xl font-bold text-[#F9FAFB] mb-1">{display}</p>
      <p className="text-xs" style={{ color: "#6B7280" }}>
        {caption}
      </p>
    </div>
  );
}

function ToolCard({
  toolKey,
  metrics,
}: {
  toolKey: ToolKey;
  metrics: ToolMetrics;
}) {
  const color = TOOL_COLOR[toolKey];
  const Icon = TOOL_ICON[toolKey];
  const surface = TOOL_SURFACE[toolKey];
  const maxDaily = Math.max(1, ...metrics.daily.map((d) => d.runs));
  const runRate = metrics.funnel.runs > 0
    ? ((metrics.funnel.email_exports / metrics.funnel.runs) * 100).toFixed(1)
    : "0.0";

  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.06)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-md"
            style={{
              width: "36px",
              height: "36px",
              background: `${color}1A`,
              border: `1px solid ${color}40`,
            }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <p
              className="text-sm font-semibold text-[#F9FAFB]"
              style={{ marginBottom: "0.2rem" }}
            >
              {metrics.name}
            </p>
            <a
              href={surface}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] inline-flex items-center gap-1 underline-offset-2 hover:underline"
              style={{ color: "#6B7280" }}
            >
              {surface} <ExternalLink size={9} />
            </a>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#F9FAFB]">
            {metrics.funnel.runs.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            runs · {metrics.distinct_visitors.toLocaleString()} unique
          </p>
        </div>
      </div>

      {/* Funnel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        <FunnelStep
          label="Sample loads"
          value={metrics.funnel.sample_loads}
          color={color}
        />
        {/* Uploads only relevant to PayMint (scanner is paste-only). */}
        <FunnelStep
          label="Uploads"
          value={metrics.funnel.uploads}
          color={color}
          showZero={toolKey === "paymint_snapshot"}
        />
        <FunnelStep label="Runs" value={metrics.funnel.runs} color={color} highlight />
        <FunnelStep
          label="Email clicks"
          value={metrics.funnel.email_clicks}
          color={color}
        />
        <FunnelStep
          label="Exports"
          value={metrics.funnel.email_exports}
          color={color}
          highlight
          caption={`${runRate}%`}
        />
      </div>

      {/* Daily bars */}
      {metrics.daily.length > 0 && (
        <div className="mb-4">
          <p
            className="text-[10px] uppercase tracking-wider mb-2"
            style={{ color: "#6B7280" }}
          >
            Last 14 days · runs
          </p>
          <ul className="space-y-1">
            {metrics.daily.map((d) => (
              <li
                key={d.date}
                className="grid grid-cols-[80px_1fr_auto] items-center gap-3"
              >
                <span
                  className="text-[11px] font-mono"
                  style={{ color: "#9CA3AF" }}
                >
                  {d.date}
                </span>
                <span
                  className="rounded-sm"
                  style={{
                    height: "6px",
                    background: color,
                    width: `${(d.runs / maxDaily) * 100}%`,
                    minWidth: "2px",
                    opacity: 0.7,
                  }}
                  aria-hidden
                />
                <span
                  className="text-[11px] font-mono text-[#F9FAFB] tabular-nums w-8 text-right"
                >
                  {d.runs}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source pages */}
      {metrics.top_source_pages.length > 0 && (
        <div>
          <p
            className="text-[10px] uppercase tracking-wider mb-2"
            style={{ color: "#6B7280" }}
          >
            Top source pages
          </p>
          <ul className="space-y-1">
            {metrics.top_source_pages.map((p) => (
              <li
                key={p.page}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-mono truncate" style={{ color: "#A1A1AA" }}>
                  {p.page}
                </span>
                <span
                  className="font-mono tabular-nums ml-3"
                  style={{ color: "#9CA3AF" }}
                >
                  {p.runs.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FunnelStep({
  label,
  value,
  color,
  highlight,
  showZero = true,
  caption,
}: {
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
  showZero?: boolean;
  caption?: string;
}) {
  if (!showZero && value === 0) {
    return (
      <div
        className="rounded p-3"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.06)",
        }}
      >
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: "#52525B" }}
        >
          {label}
        </p>
        <p className="text-sm" style={{ color: "#52525B" }}>
          —
        </p>
      </div>
    );
  }
  return (
    <div
      className="rounded p-3"
      style={{
        background: highlight ? `${color}10` : "rgba(255,255,255,0.03)",
        border: `1px solid ${highlight ? `${color}30` : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-wider"
        style={{ color: highlight ? color : "#9CA3AF" }}
      >
        {label}
      </p>
      <p
        className="text-lg font-bold tabular-nums"
        style={{ color: "#F9FAFB" }}
      >
        {value.toLocaleString()}
      </p>
      {caption && (
        <p
          className="text-[10px] mt-0.5"
          style={{ color: highlight ? color : "#6B7280" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (d.getTime() < 1000) return "launch";
  return d.toISOString().slice(0, 10);
}
