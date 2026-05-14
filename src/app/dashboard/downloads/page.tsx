"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, FileText, Monitor, Users, ExternalLink } from "lucide-react";

/**
 * /dashboard/downloads — download event intelligence.
 *
 * Reads /api/admin/downloads and renders:
 *   1. Total downloads + distinct visitors over the selected window
 *   2. Per-product breakdown (PayMint / Aira / Other)
 *   3. Per-asset cards with daily activity (last 14 days) and source-
 *      page breakdown
 *
 * Auto-refreshes every 60s. Same auth / route-guard story as the
 * other dashboard surfaces (cookie session via /admin/login).
 *
 * What "download" means here: any cta_click event whose event_data
 * has asset_type ∈ {apk, pdf, exe} OR whose cta_id matches *_download_*.
 * See /api/admin/downloads route header for the full contract.
 */

interface DailyPoint {
  date: string; // YYYY-MM-DD
  clicks: number;
}

interface AssetRow {
  cta_id: string;
  cta_label: string;
  asset_type: string;
  product: "paymint" | "aira" | "other";
  target_url: string;
  total_clicks: number;
  distinct_visitors: number;
  top_pages: Array<{ page: string; clicks: number }>;
  daily: DailyPoint[];
}

interface DownloadsData {
  timeframe: string;
  since: string;
  totals: {
    total_clicks: number;
    distinct_visitors: number;
  };
  by_product: {
    paymint: { total_clicks: number; distinct_visitors: number };
    aira:    { total_clicks: number; distinct_visitors: number };
    other:   { total_clicks: number; distinct_visitors: number };
  };
  by_asset: AssetRow[];
}

const TIMEFRAMES = [
  { value: "today", label: "Today" },
  { value: "7d",    label: "Last 7 days" },
  { value: "30d",   label: "Last 30 days" },
  { value: "all",   label: "All time" },
];

const ASSET_ICON: Record<string, typeof Smartphone> = {
  apk: Smartphone,
  pdf: FileText,
  exe: Monitor,
  other: Download,
};

const PRODUCT_COLOR: Record<"paymint" | "aira" | "other", string> = {
  paymint: "#F97316",
  aira:    "#A855F7",
  other:   "#6B7280",
};

export default function DownloadsDashboard() {
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [data, setData] = useState<DownloadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/downloads?timeframe=${timeframe}`, {
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

  const totals = data?.totals;
  const byProduct = data?.by_product;

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#F9FAFB] mb-1">Downloads</h1>
          <p className="text-sm text-[#6B7280]">
            Every PayMint APK, brochure, and Aira .exe download captured site-wide.
            Auto-refreshes every 60s.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
        <div className="text-[#6B7280] text-sm py-8">Loading downloads…</div>
      )}

      {data && (
        <>
          {/* ── Totals strip ───────────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <KpiTile
              icon={Download}
              label="Total downloads"
              value={totals?.total_clicks ?? 0}
              caption={`since ${shortDate(data.since)}`}
              accent="#F97316"
            />
            <KpiTile
              icon={Users}
              label="Distinct visitors downloading"
              value={totals?.distinct_visitors ?? 0}
              caption="unique people, deduped"
              accent="#60A5FA"
            />
          </div>

          {/* ── By product ─────────────────────────────────────────── */}
          {byProduct && (
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <ProductTile
                name="PayMint"
                clicks={byProduct.paymint.total_clicks}
                visitors={byProduct.paymint.distinct_visitors}
                color={PRODUCT_COLOR.paymint}
              />
              <ProductTile
                name="Aira"
                clicks={byProduct.aira.total_clicks}
                visitors={byProduct.aira.distinct_visitors}
                color={PRODUCT_COLOR.aira}
              />
              <ProductTile
                name="Other"
                clicks={byProduct.other.total_clicks}
                visitors={byProduct.other.distinct_visitors}
                color={PRODUCT_COLOR.other}
              />
            </div>
          )}

          {/* ── Per-asset cards ────────────────────────────────────── */}
          <h2 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
            By asset
          </h2>
          {data.by_asset.length === 0 ? (
            <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0D0D0D] p-8 text-center text-sm text-[#6B7280]">
              No downloads recorded in this window yet. When the first APK,
              brochure, or .exe download fires, it will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {data.by_asset.map((a) => (
                <AssetCard key={a.cta_id} asset={a} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Component pieces
// ─────────────────────────────────────────────────────────────────────

function KpiTile({
  icon: Icon,
  label,
  value,
  caption,
  accent,
}: {
  icon: typeof Download;
  label: string;
  value: number;
  caption: string;
  accent: string;
}) {
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
        <p className="text-xs uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
          {label}
        </p>
      </div>
      <p className="text-3xl font-bold text-[#F9FAFB] mb-1">{value.toLocaleString()}</p>
      <p className="text-xs" style={{ color: "#6B7280" }}>
        {caption}
      </p>
    </div>
  );
}

function ProductTile({
  name,
  clicks,
  visitors,
  color,
}: {
  name: string;
  clicks: number;
  visitors: number;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
          }}
        />
        <p className="text-sm font-medium text-[#F9FAFB]">{name}</p>
      </div>
      <p className="text-2xl font-bold text-[#F9FAFB]">{clicks.toLocaleString()}</p>
      <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
        {visitors.toLocaleString()} distinct visitor{visitors === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function AssetCard({ asset }: { asset: AssetRow }) {
  const Icon = ASSET_ICON[asset.asset_type] ?? Download;
  const productColor = PRODUCT_COLOR[asset.product];
  const maxDaily = Math.max(1, ...asset.daily.map((d) => d.clicks));

  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-md"
            style={{
              width: "36px",
              height: "36px",
              background: `${productColor}1A`,
              border: `1px solid ${productColor}40`,
            }}
          >
            <Icon size={16} style={{ color: productColor }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F9FAFB]">{asset.cta_label}</p>
            <p className="text-xs font-mono mt-0.5" style={{ color: "#6B7280" }}>
              {asset.cta_id}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider"
                style={{
                  background: `${productColor}1A`,
                  color: productColor,
                  border: `1px solid ${productColor}40`,
                }}
              >
                {asset.product}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono uppercase"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#9CA3AF",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                .{asset.asset_type}
              </span>
              {asset.target_url && (
                <a
                  href={asset.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] underline-offset-2 hover:underline"
                  style={{ color: "#6B7280" }}
                >
                  target <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#F9FAFB]">
            {asset.total_clicks.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {asset.distinct_visitors.toLocaleString()} unique
          </p>
        </div>
      </div>

      {/* Daily bar list — last 14 days */}
      {asset.daily.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
            Last 14 days
          </p>
          <ul className="space-y-1">
            {asset.daily.map((d) => (
              <li key={d.date} className="grid grid-cols-[80px_1fr_auto] items-center gap-3">
                <span className="text-[11px] font-mono" style={{ color: "#9CA3AF" }}>
                  {d.date}
                </span>
                <span
                  className="rounded-sm"
                  style={{
                    height: "6px",
                    background: productColor,
                    width: `${(d.clicks / maxDaily) * 100}%`,
                    minWidth: "2px",
                    opacity: 0.7,
                  }}
                  aria-hidden
                />
                <span className="text-[11px] font-mono text-[#F9FAFB] tabular-nums w-8 text-right">
                  {d.clicks}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source pages */}
      {asset.top_pages.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
            Top source pages
          </p>
          <ul className="space-y-1">
            {asset.top_pages.map((p) => (
              <li
                key={p.page}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-mono truncate" style={{ color: "#A1A1AA" }}>
                  {p.page}
                </span>
                <span className="font-mono tabular-nums ml-3" style={{ color: "#9CA3AF" }}>
                  {p.clicks.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function shortDate(iso: string): string {
  // Render the "since" timestamp as a friendly local date. For "all"
  // time the API returns the epoch — render that as "launch."
  const d = new Date(iso);
  if (d.getTime() < 1000) return "launch";
  return d.toISOString().slice(0, 10);
}
