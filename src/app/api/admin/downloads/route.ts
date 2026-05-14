import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * /api/admin/downloads — download event intelligence.
 *
 * Auth: cookie session (sign in at /admin/login).
 *
 * Query params:
 *   ?timeframe=today | 7d | 30d | all   (default: 7d)
 *
 * What counts as a "download":
 *   Any `cta_click` event whose `event_data.asset_type` is one of
 *   {"apk", "pdf", "exe"} OR whose `cta_id` matches `*_download_*`.
 *   The asset_type metadata is the primary signal (set by every
 *   instrumented download CTA today: PayMint APK, PayMint brochure,
 *   Aira Windows .exe); the cta_id pattern is a defensive fallback
 *   so any future download CTA that forgets to set asset_type is
 *   still counted.
 *
 * Response shape:
 *   {
 *     timeframe,
 *     since,                              // ISO timestamp
 *     totals: {
 *       total_clicks,                      // every download CTA fire
 *       distinct_visitors,                 // unique people downloading
 *     },
 *     by_product: {                        // grouped by inferred product
 *       paymint: { total_clicks, distinct_visitors },
 *       aira:    { total_clicks, distinct_visitors },
 *       other:   { total_clicks, distinct_visitors },
 *     },
 *     by_asset: Array<{                    // sorted by total_clicks desc
 *       cta_id,
 *       cta_label,
 *       asset_type,                        // "apk" | "pdf" | "exe" | "other"
 *       product,                           // "paymint" | "aira" | "other"
 *       target_url,
 *       total_clicks,
 *       distinct_visitors,
 *       top_pages: Array<{ page, clicks }>,
 *       daily: Array<{ date, clicks }>,    // last 14 days, ISO date strings
 *     }>,
 *   }
 *
 * The dashboard at /dashboard/downloads renders this directly.
 */

interface DownloadEventData {
  cta_id?: string;
  cta_label?: string;
  asset_type?: string;
  target?: string;
}

interface VisitorEvent {
  visitor_id: string;
  event_type: string;
  event_data: DownloadEventData | null;
  page: string;
  timestamp: string;
}

const DOWNLOAD_ASSET_TYPES = new Set(["apk", "pdf", "exe"]);

function sinceFor(timeframe: string): Date {
  const d = new Date();
  if (timeframe === "today") {
    d.setHours(0, 0, 0, 0);
  } else if (timeframe === "30d") {
    d.setDate(d.getDate() - 30);
  } else if (timeframe === "all") {
    // Epoch fallback. visitor_events is bounded so this is safe.
    d.setTime(0);
  } else {
    d.setDate(d.getDate() - 7);
  }
  return d;
}

function inferProduct(ctaId: string): "paymint" | "aira" | "other" {
  if (ctaId.startsWith("paymint")) return "paymint";
  if (ctaId.startsWith("aira")) return "aira";
  return "other";
}

function isDownloadEvent(e: VisitorEvent): boolean {
  if (e.event_type !== "cta_click") return false;
  const data = e.event_data;
  if (!data) return false;
  if (data.asset_type && DOWNLOAD_ASSET_TYPES.has(data.asset_type)) return true;
  // Defensive: catch download CTAs that forgot to set asset_type metadata.
  if (data.cta_id && /_download_/.test(data.cta_id)) return true;
  return false;
}

function isoDate(ts: string): string {
  return ts.slice(0, 10); // "YYYY-MM-DD"
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") ?? "7d";
  const since = sinceFor(timeframe);

  const supabase = getServiceClient();

  // Pull cta_click events in window. Same 50k defensive cap as
  // /api/admin/funnel — covers a >70k-visitor week before we'd need
  // to move this to a Postgres aggregate function.
  const eventsRes = await supabase
    .from("visitor_events")
    .select("visitor_id, event_type, event_data, page, timestamp")
    .gte("timestamp", since.toISOString())
    .eq("event_type", "cta_click")
    .limit(50000);

  if (eventsRes.error) {
    return NextResponse.json(
      { error: "Downloads query failed", detail: eventsRes.error.message },
      { status: 500 },
    );
  }

  const events = (eventsRes.data ?? []) as VisitorEvent[];
  const downloads = events.filter(isDownloadEvent);

  // Compute the 14-day daily-window cutoff once. Events older than this
  // get aggregated into the per-asset total but skip the daily list.
  const dailyCutoff = new Date();
  dailyCutoff.setDate(dailyCutoff.getDate() - 14);
  dailyCutoff.setHours(0, 0, 0, 0);
  const dailyCutoffIso = dailyCutoff.toISOString();

  // Per-asset aggregation, keyed by cta_id (so the two PayMint APK
  // surfaces — hero + bottom — show up as distinct rows the operator
  // can compare).
  const assets = new Map<
    string,
    {
      cta_label: string;
      asset_type: string;
      product: "paymint" | "aira" | "other";
      target_url: string;
      total_clicks: number;
      distinct_visitors: Set<string>;
      pages: Map<string, number>;
      daily: Map<string, number>;
    }
  >();

  // Cross-asset totals.
  const allVisitors = new Set<string>();
  const byProduct: Record<"paymint" | "aira" | "other", { clicks: number; visitors: Set<string> }> =
    {
      paymint: { clicks: 0, visitors: new Set() },
      aira:    { clicks: 0, visitors: new Set() },
      other:   { clicks: 0, visitors: new Set() },
    };

  for (const e of downloads) {
    const data = e.event_data ?? {};
    const ctaId = data.cta_id ?? "(unnamed_download)";
    const product = inferProduct(ctaId);

    let bucket = assets.get(ctaId);
    if (!bucket) {
      bucket = {
        cta_label: data.cta_label ?? ctaId,
        asset_type: data.asset_type ?? "other",
        product,
        target_url: data.target ?? "",
        total_clicks: 0,
        distinct_visitors: new Set(),
        pages: new Map(),
        daily: new Map(),
      };
      assets.set(ctaId, bucket);
    }
    bucket.total_clicks += 1;
    bucket.distinct_visitors.add(e.visitor_id);
    bucket.pages.set(e.page, (bucket.pages.get(e.page) ?? 0) + 1);

    if (e.timestamp >= dailyCutoffIso) {
      const d = isoDate(e.timestamp);
      bucket.daily.set(d, (bucket.daily.get(d) ?? 0) + 1);
    }

    allVisitors.add(e.visitor_id);
    byProduct[product].clicks += 1;
    byProduct[product].visitors.add(e.visitor_id);
  }

  const byAsset = [...assets.entries()]
    .map(([cta_id, b]) => ({
      cta_id,
      cta_label: b.cta_label,
      asset_type: b.asset_type,
      product: b.product,
      target_url: b.target_url,
      total_clicks: b.total_clicks,
      distinct_visitors: b.distinct_visitors.size,
      top_pages: [...b.pages.entries()]
        .sort((a, z) => z[1] - a[1])
        .slice(0, 3)
        .map(([page, clicks]) => ({ page, clicks })),
      daily: [...b.daily.entries()]
        .sort((a, z) => a[0].localeCompare(z[0]))
        .map(([date, clicks]) => ({ date, clicks })),
    }))
    .sort((a, z) => z.total_clicks - a.total_clicks);

  return NextResponse.json({
    timeframe,
    since: since.toISOString(),
    totals: {
      total_clicks: downloads.length,
      distinct_visitors: allVisitors.size,
    },
    by_product: {
      paymint: {
        total_clicks: byProduct.paymint.clicks,
        distinct_visitors: byProduct.paymint.visitors.size,
      },
      aira: {
        total_clicks: byProduct.aira.clicks,
        distinct_visitors: byProduct.aira.visitors.size,
      },
      other: {
        total_clicks: byProduct.other.clicks,
        distinct_visitors: byProduct.other.visitors.size,
      },
    },
    by_asset: byAsset,
  });
}
