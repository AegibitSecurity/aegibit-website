import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * /api/admin/funnel — conversion funnel intelligence.
 *
 * Auth: cookie session (sign in at /admin/login).
 *
 * Query params:
 *   ?timeframe=today | 7d | 30d   (default: 7d)
 *
 * Response shape:
 *   {
 *     timeframe: string,
 *     since:     ISO timestamp,
 *     overall: {
 *       visitors:        number,  // total unique visitor records
 *       cta_clickers:    number,  // distinct visitors who fired any cta_click
 *       form_starters:   number,  // distinct visitors who fired any form_focus
 *       form_submitters: number,  // distinct visitors who fired form_submit
 *       leads_captured:  number,  // rows in leads table (server-side truth)
 *       conversion_rate: number,  // leads_captured / visitors (percent)
 *     },
 *     cta_breakdown: Array<{      // sorted by clicks desc
 *       cta_id:          string,
 *       cta_label:       string,
 *       clicks:          number,
 *       distinct_visitors: number,
 *       top_pages: Array<{ page: string, clicks: number }>,  // top 3
 *     }>,
 *     top_pages: Array<{          // pages by visitor count
 *       page:        string,
 *       visitors:    number,
 *       cta_clicks:  number,
 *       conversions: number,
 *     }>,
 *   }
 *
 * The dashboard at /dashboard/funnel renders this directly.
 */

interface VisitorEvent {
  visitor_id: string;
  event_type: string;
  event_data: { cta_id?: string; cta_label?: string } | null;
  page: string;
}

function sinceFor(timeframe: string): Date {
  const d = new Date();
  if (timeframe === "today") d.setHours(0, 0, 0, 0);
  else if (timeframe === "30d") d.setDate(d.getDate() - 30);
  else d.setDate(d.getDate() - 7);
  return d;
}

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") ?? "7d";
  const since = sinceFor(timeframe);

  const supabase = getServiceClient();

  // Visitors in window — single count query.
  const visitorsRes = await supabase
    .from("visitors")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since.toISOString());

  // Events in window. Pull the columns we need; visitor_events is the
  // hot table so we cap at 50k rows defensively (covers a >70k visitor
  // week before we need to switch to a Postgres aggregate function).
  const eventsRes = await supabase
    .from("visitor_events")
    .select("visitor_id, event_type, event_data, page")
    .gte("timestamp", since.toISOString())
    .in("event_type", ["cta_click", "form_focus", "form_submit", "pageview"])
    .limit(50000);

  // Leads in window — server-side truth on conversions.
  const leadsRes = await supabase
    .from("leads")
    .select("id, source, page", { count: "exact" })
    .gte("created_at", since.toISOString());

  if (visitorsRes.error || eventsRes.error || leadsRes.error) {
    return NextResponse.json(
      {
        error: "Funnel query failed",
        detail:
          visitorsRes.error?.message ||
          eventsRes.error?.message ||
          leadsRes.error?.message,
      },
      { status: 500 },
    );
  }

  const events = (eventsRes.data ?? []) as VisitorEvent[];
  const visitors = visitorsRes.count ?? 0;
  const leadsCaptured = leadsRes.count ?? 0;

  // Distinct-visitors-per-step counts. Using sets so re-firing the
  // same event type by one visitor doesn't double-count them.
  const ctaClickers = new Set<string>();
  const formStarters = new Set<string>();
  const formSubmitters = new Set<string>();
  const ctaTally = new Map<
    string,
    { label: string; clicks: number; visitors: Set<string>; pages: Map<string, number> }
  >();
  const pageTally = new Map<
    string,
    { visitors: Set<string>; ctaClicks: number; conversions: number }
  >();

  for (const e of events) {
    if (e.event_type === "pageview") {
      let p = pageTally.get(e.page);
      if (!p) {
        p = { visitors: new Set(), ctaClicks: 0, conversions: 0 };
        pageTally.set(e.page, p);
      }
      p.visitors.add(e.visitor_id);
      continue;
    }
    if (e.event_type === "cta_click") {
      ctaClickers.add(e.visitor_id);
      const ctaId = e.event_data?.cta_id ?? "(unnamed)";
      const ctaLabel = e.event_data?.cta_label ?? ctaId;
      let bucket = ctaTally.get(ctaId);
      if (!bucket) {
        bucket = { label: ctaLabel, clicks: 0, visitors: new Set(), pages: new Map() };
        ctaTally.set(ctaId, bucket);
      }
      bucket.clicks += 1;
      bucket.visitors.add(e.visitor_id);
      bucket.pages.set(e.page, (bucket.pages.get(e.page) ?? 0) + 1);
      const pPage = pageTally.get(e.page);
      if (pPage) pPage.ctaClicks += 1;
      continue;
    }
    if (e.event_type === "form_focus") formStarters.add(e.visitor_id);
    if (e.event_type === "form_submit") formSubmitters.add(e.visitor_id);
  }

  // Attribute conversions back to the page they happened on.
  for (const lead of leadsRes.data ?? []) {
    const p = pageTally.get(lead.page);
    if (p) p.conversions += 1;
  }

  const ctaBreakdown = [...ctaTally.entries()]
    .map(([cta_id, b]) => ({
      cta_id,
      cta_label: b.label,
      clicks: b.clicks,
      distinct_visitors: b.visitors.size,
      top_pages: [...b.pages.entries()]
        .sort((a, z) => z[1] - a[1])
        .slice(0, 3)
        .map(([page, clicks]) => ({ page, clicks })),
    }))
    .sort((a, z) => z.clicks - a.clicks);

  const topPages = [...pageTally.entries()]
    .map(([page, p]) => ({
      page,
      visitors: p.visitors.size,
      cta_clicks: p.ctaClicks,
      conversions: p.conversions,
    }))
    .sort((a, z) => z.visitors - a.visitors)
    .slice(0, 20);

  return NextResponse.json({
    timeframe,
    since: since.toISOString(),
    overall: {
      visitors,
      cta_clickers: ctaClickers.size,
      form_starters: formStarters.size,
      form_submitters: formSubmitters.size,
      leads_captured: leadsCaptured,
      conversion_rate:
        visitors > 0 ? Number(((leadsCaptured / visitors) * 100).toFixed(2)) : 0,
    },
    cta_breakdown: ctaBreakdown,
    top_pages: topPages,
  });
}
