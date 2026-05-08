import { getServiceClient } from "@/lib/supabase-admin";

/**
 * Hot-lead detection + visitor-history enrichment.
 *
 * Why this exists: industry data says contacting an inbound lead within
 * 5 minutes is ~9× more likely to convert than within an hour. The
 * default lead notification email is informational — by the time you
 * read it the lead has cooled. This module classifies inbound leads
 * by intent strength and enriches the highest-intent ones with the
 * full visitor session so the founder can act on them in one glance.
 *
 * Hot criteria (any one is sufficient):
 *   - source is paymint_demo (form filled out → highest intent we have)
 *   - source is demo / voicecore_waitlist / aira_waitlist
 *   - message contains intent keywords (demo, quote, buy, pilot, pricing,
 *     interested, evaluate, sales, deploy, trial, contract)
 *   - the visitor's recent event history shows pricing or alternatives
 *     visit + at least one cta_click (consideration signal)
 *
 * Anything else = "warm" — gets the standard notification.
 */

export type LeadHeat = "hot" | "warm";

const HOT_SOURCES = new Set([
  "paymint_demo",
  "demo",
  "voicecore_waitlist",
  "aira_waitlist",
  // Chat leads are by definition high-intent — the visitor had a
  // conversation with Aira and explicitly handed over their email
  // (the bot only escalates on demo/pricing/custom-feature signals,
  // and the user passed the email validation gate). Always hot.
  "chat",
]);

const INTENT_KEYWORDS = [
  "demo",
  "quote",
  "buy",
  "pilot",
  "pricing",
  "interested",
  "evaluate",
  "sales",
  "deploy",
  "trial",
  "contract",
  "purchase",
  "rollout",
];

export interface VisitorJourney {
  visitor_id: string | null;
  pages_viewed: string[];
  time_on_site_seconds: number;
  scroll_depth_max: number;
  behavior_score: number;
  cta_clicks: Array<{ cta_id: string; page: string }>;
  experiment_exposures: Array<{ experiment: string; variant: string }>;
  visited_pricing: boolean;
  visited_alternatives: boolean;
  utm_source: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  device: string | null;
  country: string | null;
}

/**
 * Classify a lead by heat level. Pure function — given the inputs,
 * always returns the same heat. Used by /api/leads to decide which
 * email template to send.
 */
export function classifyLead(input: {
  source: string;
  message?: string;
  journey?: VisitorJourney | null;
}): LeadHeat {
  if (HOT_SOURCES.has(input.source)) return "hot";

  if (input.message) {
    const m = input.message.toLowerCase();
    if (INTENT_KEYWORDS.some((k) => m.includes(k))) return "hot";
  }

  const j = input.journey;
  if (j) {
    // Visited pricing or alternatives + clicked at least one CTA = hot
    if ((j.visited_pricing || j.visited_alternatives) && j.cta_clicks.length > 0) {
      return "hot";
    }
    // Very high behavior score on its own
    if (j.behavior_score >= 75) return "hot";
  }

  return "warm";
}

/**
 * Pull the visitor's journey from Supabase: visitor row + recent events.
 * Returns null if no visitorId or DB error — the caller still sends the
 * email, just without enrichment.
 */
export async function fetchVisitorJourney(
  visitorId: string | null | undefined,
): Promise<VisitorJourney | null> {
  if (!visitorId) return null;

  try {
    const supabase = getServiceClient();
    const [visitorRes, eventsRes] = await Promise.all([
      supabase
        .from("visitors")
        .select(
          "id, pages_viewed, time_on_site_seconds, scroll_depth_max, behavior_score, utm_source, utm_campaign, referrer, device, country",
        )
        .eq("id", visitorId)
        .maybeSingle(),
      supabase
        .from("visitor_events")
        .select("event_type, event_data, page")
        .eq("visitor_id", visitorId)
        .in("event_type", ["cta_click", "experiment_exposure", "pageview"])
        .order("timestamp", { ascending: false })
        .limit(50),
    ]);

    if (visitorRes.error || !visitorRes.data) return null;
    const v = visitorRes.data;

    const events = (eventsRes.data ?? []) as Array<{
      event_type: string;
      event_data: { cta_id?: string; experiment?: string; variant?: string } | null;
      page: string;
    }>;

    const ctaClicks = events
      .filter((e) => e.event_type === "cta_click")
      .map((e) => ({
        cta_id: e.event_data?.cta_id ?? "(unnamed)",
        page: e.page,
      }))
      .slice(0, 10);

    const experimentExposures = events
      .filter((e) => e.event_type === "experiment_exposure")
      .map((e) => ({
        experiment: e.event_data?.experiment ?? "?",
        variant: e.event_data?.variant ?? "?",
      }));

    const pages = (v.pages_viewed as string[] | null) ?? [];

    return {
      visitor_id: v.id,
      pages_viewed: pages,
      time_on_site_seconds: v.time_on_site_seconds ?? 0,
      scroll_depth_max: v.scroll_depth_max ?? 0,
      behavior_score: v.behavior_score ?? 0,
      cta_clicks: ctaClicks,
      experiment_exposures: experimentExposures,
      visited_pricing: pages.some((p) => p.includes("pricing")),
      visited_alternatives: pages.some((p) => p.includes("alternatives")),
      utm_source: v.utm_source ?? null,
      utm_campaign: v.utm_campaign ?? null,
      referrer: v.referrer ?? null,
      device: v.device ?? null,
      country: v.country ?? null,
    };
  } catch (err) {
    console.error("[hot-lead] fetchVisitorJourney error:", err);
    return null;
  }
}

/**
 * Render the visitor-journey panel for embedding in the hot-lead email.
 * Plain inline-styled HTML — no template engine, works in every mail
 * client (Gmail strips many CSS features, hence inline).
 */
export function renderJourneyHtml(j: VisitorJourney): string {
  const minutes = Math.floor(j.time_on_site_seconds / 60);
  const seconds = j.time_on_site_seconds % 60;
  const time = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const pagesList = j.pages_viewed
    .slice(0, 8)
    .map(
      (p) =>
        `<div style="font-family:monospace;font-size:11px;color:#A1A1AA;padding:2px 0;">→ ${escape(p)}</div>`,
    )
    .join("");

  const ctaList = j.cta_clicks.length
    ? j.cta_clicks
        .slice(0, 5)
        .map(
          (c) =>
            `<div style="font-family:monospace;font-size:11px;color:#F97316;padding:2px 0;">▸ ${escape(c.cta_id)} <span style="color:#52525B;">on ${escape(c.page)}</span></div>`,
        )
        .join("")
    : `<div style="font-family:monospace;font-size:11px;color:#52525B;padding:2px 0;">no CTA clicks recorded yet</div>`;

  const expList = j.experiment_exposures.length
    ? j.experiment_exposures
        .slice(0, 3)
        .map(
          (e) =>
            `<span style="display:inline-block;font-family:monospace;font-size:10px;color:#C084FC;background:rgba(168,85,247,0.10);border:1px solid rgba(168,85,247,0.25);border-radius:4px;padding:2px 6px;margin-right:4px;">${escape(e.experiment)}=${escape(e.variant)}</span>`,
        )
        .join("")
    : "";

  return `
    <div style="margin-top:24px;background:#0D0D0D;border:1px solid rgba(255,255,255,0.10);border-radius:10px;padding:18px;">
      <div style="font-size:10px;color:#F97316;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:14px;font-weight:700;">
        Visitor Journey
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
        <tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Time on site</td><td style="padding:4px 0;color:#fff;font-size:12px;font-weight:600;">${time}</td></tr>
        <tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Scroll depth</td><td style="padding:4px 0;color:#fff;font-size:12px;">${j.scroll_depth_max}%</td></tr>
        <tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Behavior score</td><td style="padding:4px 0;color:#F97316;font-size:12px;font-weight:700;">${j.behavior_score} / 100</td></tr>
        <tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Device</td><td style="padding:4px 0;color:#fff;font-size:12px;">${escape(j.device ?? "—")}</td></tr>
        ${j.country ? `<tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Country</td><td style="padding:4px 0;color:#fff;font-size:12px;">${escape(j.country)}</td></tr>` : ""}
        ${j.utm_source ? `<tr><td style="padding:4px 0;color:#71717A;font-size:11px;">UTM source</td><td style="padding:4px 0;color:#fff;font-size:12px;">${escape(j.utm_source)}${j.utm_campaign ? ` · ${escape(j.utm_campaign)}` : ""}</td></tr>` : ""}
        ${j.referrer ? `<tr><td style="padding:4px 0;color:#71717A;font-size:11px;">Referrer</td><td style="padding:4px 0;color:#fff;font-size:12px;font-family:monospace;word-break:break-all;">${escape(j.referrer)}</td></tr>` : ""}
      </table>
      <div style="margin-bottom:12px;">
        <div style="font-size:10px;color:#71717A;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px;">Pages viewed (${j.pages_viewed.length})</div>
        ${pagesList}
      </div>
      <div style="margin-bottom:12px;">
        <div style="font-size:10px;color:#71717A;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px;">CTAs clicked</div>
        ${ctaList}
      </div>
      ${expList ? `<div><div style="font-size:10px;color:#71717A;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px;">Variants seen</div>${expList}</div>` : ""}
    </div>
  `;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
