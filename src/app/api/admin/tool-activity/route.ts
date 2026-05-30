import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * /api/admin/tool-activity — usage telemetry for the two free
 * acquisition tools shipped on /products/paymint and
 * /products/mcp-shield.
 *
 * Closes the observability gap flagged at M-1/M-2 ship time:
 * those two endpoints had no feedback loop. Until this lands,
 * we don't know whether anyone is using them.
 *
 * Auth: cookie session (sign in at /admin/login).
 *
 * Query params:
 *   ?timeframe=today | 7d | 30d | all   (default: 7d)
 *
 * Response shape:
 *   {
 *     timeframe,
 *     since,                            // ISO timestamp
 *     totals: {
 *       runs,                            // sum of Generate-Snapshot + Scan-Manifest clicks
 *       distinct_visitors,
 *       email_exports,                   // lead rows with source IN (...)
 *       conversion_rate_pct,             // email_exports / runs * 100
 *     },
 *     by_tool: {
 *       paymint_snapshot: ToolMetrics,
 *       mcp_shield_scanner: ToolMetrics,
 *     },
 *   }
 *
 *   ToolMetrics: {
 *     name,                              // human-friendly label
 *     funnel: {
 *       sample_loads,                    // clicked Load Sample
 *       uploads,                         // (paymint only) clicked Upload
 *       runs,                            // clicked Generate / Scan
 *       email_clicks,                    // clicked "Email me the report"
 *       email_exports,                   // distinct leads written
 *     },
 *     distinct_visitors,
 *     daily: Array<{ date, runs }>,      // last 14 days
 *     top_source_pages: Array<{ page, runs }>,
 *   }
 *
 * The dashboard at /dashboard/tool-activity renders this.
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

// cta_id matchers per tool. The frontend instrumentation (in
// PayMintSnapshotSection.tsx and McpScannerSection.tsx) is the
// authoritative source of these strings — keep them in sync.
const TOOL_DEFINITIONS: Record<
  ToolKey,
  {
    name: string;
    runId: string;
    sampleIds: string[];
    uploadIds: string[];
    emailClickId: string;
    leadSource: string;
  }
> = {
  paymint_snapshot: {
    name: "PayMint Snapshot",
    runId: "paymint_snapshot_run",
    sampleIds: ["paymint_snapshot_sample"],
    uploadIds: ["paymint_snapshot_upload"],
    emailClickId: "paymint_snapshot_email",
    leadSource: "snapshot_export",
  },
  mcp_shield_scanner: {
    name: "MCP Shield Scanner",
    runId: "mcp_shield_scanner_run",
    sampleIds: [
      "mcp_shield_scanner_sample_tools",
      "mcp_shield_scanner_sample_servers",
    ],
    uploadIds: [], // scanner doesn't have an upload action — paste-only
    emailClickId: "mcp_shield_scanner_email",
    leadSource: "scan_export",
  },
};

interface VisitorEvent {
  visitor_id: string;
  event_type: string;
  event_data: { cta_id?: string } | null;
  page: string;
  timestamp: string;
}

function sinceFor(timeframe: string): Date {
  const d = new Date();
  if (timeframe === "today") {
    d.setHours(0, 0, 0, 0);
  } else if (timeframe === "30d") {
    d.setDate(d.getDate() - 30);
  } else if (timeframe === "all") {
    d.setTime(0);
  } else {
    d.setDate(d.getDate() - 7);
  }
  return d;
}

function isoDate(ts: string): string {
  return ts.slice(0, 10);
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") ?? "7d";
  const since = sinceFor(timeframe);

  const supabase = getServiceClient();

  // All cta_ids that map to any of the two tools' instrumentation.
  const allCtaIds = Array.from(
    new Set(
      Object.values(TOOL_DEFINITIONS).flatMap((t) => [
        t.runId,
        ...t.sampleIds,
        ...t.uploadIds,
        t.emailClickId,
      ]),
    ),
  );

  const eventsRes = await supabase
    .from("visitor_events")
    .select("visitor_id, event_type, event_data, page, timestamp")
    .gte("timestamp", since.toISOString())
    .eq("event_type", "cta_click")
    .limit(50000);

  if (eventsRes.error) {
    return NextResponse.json(
      { error: "Tool activity query failed", detail: eventsRes.error.message },
      { status: 500 },
    );
  }

  const leadsRes = await supabase
    .from("leads")
    .select("id, source, page, created_at")
    .gte("created_at", since.toISOString())
    .in("source", ["snapshot_export", "scan_export"]);

  if (leadsRes.error) {
    return NextResponse.json(
      { error: "Tool activity leads query failed", detail: leadsRes.error.message },
      { status: 500 },
    );
  }

  const events = ((eventsRes.data ?? []) as VisitorEvent[]).filter((e) => {
    const id = e.event_data?.cta_id;
    return typeof id === "string" && allCtaIds.includes(id);
  });

  // 14-day daily-window cutoff.
  const dailyCutoff = new Date();
  dailyCutoff.setDate(dailyCutoff.getDate() - 14);
  dailyCutoff.setHours(0, 0, 0, 0);
  const dailyCutoffIso = dailyCutoff.toISOString();

  const byTool: Record<ToolKey, ToolMetrics> = {
    paymint_snapshot: emptyToolMetrics(TOOL_DEFINITIONS.paymint_snapshot.name),
    mcp_shield_scanner: emptyToolMetrics(TOOL_DEFINITIONS.mcp_shield_scanner.name),
  };

  // Working sets keyed per-tool so distinct visitors are deduped
  // correctly across page reloads.
  const visitorSets: Record<ToolKey, Set<string>> = {
    paymint_snapshot: new Set(),
    mcp_shield_scanner: new Set(),
  };
  const pagesMaps: Record<ToolKey, Map<string, number>> = {
    paymint_snapshot: new Map(),
    mcp_shield_scanner: new Map(),
  };
  const dailyMaps: Record<ToolKey, Map<string, number>> = {
    paymint_snapshot: new Map(),
    mcp_shield_scanner: new Map(),
  };

  for (const e of events) {
    const ctaId = e.event_data?.cta_id;
    if (!ctaId) continue;
    const tool = resolveToolForCta(ctaId);
    if (!tool) continue;
    const def = TOOL_DEFINITIONS[tool];
    const m = byTool[tool];

    if (def.sampleIds.includes(ctaId)) m.funnel.sample_loads += 1;
    else if (def.uploadIds.includes(ctaId)) m.funnel.uploads += 1;
    else if (ctaId === def.runId) {
      m.funnel.runs += 1;
      // Source page tally + daily series only count actual runs.
      pagesMaps[tool].set(e.page, (pagesMaps[tool].get(e.page) ?? 0) + 1);
      if (e.timestamp >= dailyCutoffIso) {
        const d = isoDate(e.timestamp);
        dailyMaps[tool].set(d, (dailyMaps[tool].get(d) ?? 0) + 1);
      }
    } else if (ctaId === def.emailClickId) m.funnel.email_clicks += 1;

    visitorSets[tool].add(e.visitor_id);
  }

  // Attribute email-exported leads (the actual conversions) per tool.
  for (const lead of leadsRes.data ?? []) {
    if (lead.source === "snapshot_export") {
      byTool.paymint_snapshot.funnel.email_exports += 1;
    } else if (lead.source === "scan_export") {
      byTool.mcp_shield_scanner.funnel.email_exports += 1;
    }
  }

  for (const tool of ["paymint_snapshot", "mcp_shield_scanner"] as ToolKey[]) {
    byTool[tool].distinct_visitors = visitorSets[tool].size;
    byTool[tool].daily = [...dailyMaps[tool].entries()]
      .sort((a, z) => a[0].localeCompare(z[0]))
      .map(([date, runs]) => ({ date, runs }));
    byTool[tool].top_source_pages = [...pagesMaps[tool].entries()]
      .sort((a, z) => z[1] - a[1])
      .slice(0, 5)
      .map(([page, runs]) => ({ page, runs }));
  }

  const totalRuns =
    byTool.paymint_snapshot.funnel.runs + byTool.mcp_shield_scanner.funnel.runs;
  const totalVisitors =
    byTool.paymint_snapshot.distinct_visitors +
    byTool.mcp_shield_scanner.distinct_visitors;
  const totalExports =
    byTool.paymint_snapshot.funnel.email_exports +
    byTool.mcp_shield_scanner.funnel.email_exports;
  const conversion = totalRuns > 0 ? (totalExports / totalRuns) * 100 : 0;

  return NextResponse.json({
    timeframe,
    since: since.toISOString(),
    totals: {
      runs: totalRuns,
      distinct_visitors: totalVisitors,
      email_exports: totalExports,
      conversion_rate_pct: Number(conversion.toFixed(2)),
    },
    by_tool: byTool,
  });
}

function emptyToolMetrics(name: string): ToolMetrics {
  return {
    name,
    funnel: {
      sample_loads: 0,
      uploads: 0,
      runs: 0,
      email_clicks: 0,
      email_exports: 0,
    },
    distinct_visitors: 0,
    daily: [],
    top_source_pages: [],
  };
}

function resolveToolForCta(ctaId: string): ToolKey | null {
  if (
    ctaId === TOOL_DEFINITIONS.paymint_snapshot.runId ||
    TOOL_DEFINITIONS.paymint_snapshot.sampleIds.includes(ctaId) ||
    TOOL_DEFINITIONS.paymint_snapshot.uploadIds.includes(ctaId) ||
    ctaId === TOOL_DEFINITIONS.paymint_snapshot.emailClickId
  ) {
    return "paymint_snapshot";
  }
  if (
    ctaId === TOOL_DEFINITIONS.mcp_shield_scanner.runId ||
    TOOL_DEFINITIONS.mcp_shield_scanner.sampleIds.includes(ctaId) ||
    TOOL_DEFINITIONS.mcp_shield_scanner.uploadIds.includes(ctaId) ||
    ctaId === TOOL_DEFINITIONS.mcp_shield_scanner.emailClickId
  ) {
    return "mcp_shield_scanner";
  }
  return null;
}
