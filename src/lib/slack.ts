/**
 * Slack Incoming Webhook sender — operational alerts.
 *
 * One channel, two consumers:
 *   1. Hot-lead push (P3-S5) — when /api/leads classifies a lead as
 *      "hot", we POST a Block Kit message so the founder's phone
 *      vibrates within ~1 second of form submit. 9× conversion lift
 *      vs waiting on email.
 *   2. Agent auto-disable alert (P3-S5b, follow-up) — when an agent
 *      hits the consecutive-failure threshold, ping ops so it doesn't
 *      sit dark for hours.
 *
 * Designed defensively:
 *   - SLACK_HOT_LEAD_WEBHOOK_URL absent → no-throw silent skip.
 *     The lead notification email path is independent and still fires.
 *   - Slack 5xx / network error → swallow, log, return false.
 *     A Slack outage must not cascade-fail /api/leads.
 *   - Truncates message text to Slack's 3000-char block limit so
 *     long visitor journeys don't get rejected.
 *
 * Block Kit message format chosen over plain text for two reasons:
 *   (a) Slack mobile push notifications use the "fallback text" field
 *       which we set explicitly, so the lock-screen preview is
 *       readable even when Slack hasn't fetched the full payload.
 *   (b) Color-coded sidebar (red for hot leads) makes the feed
 *       scannable when multiple alerts land.
 *
 * https://api.slack.com/messaging/webhooks
 * https://api.slack.com/block-kit
 */

export interface SlackBlock {
  type: string;
  [key: string]: unknown;
}

export interface SlackMessage {
  /** Plain-text fallback used in mobile push previews + accessibility. */
  text: string;
  /** Optional Block Kit blocks for richer in-app rendering. */
  blocks?: SlackBlock[];
  /** "good" (green) | "warning" (yellow) | "danger" (red) | hex like #F97316. */
  color?: string;
}

export interface SlackResult {
  ok: boolean;
  status: number;
  error?: string;
}

const SLACK_TEXT_LIMIT = 3000;

function truncate(s: string, max = SLACK_TEXT_LIMIT): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function getWebhookUrl(): string | null {
  const url = process.env.SLACK_HOT_LEAD_WEBHOOK_URL;
  if (!url || !url.startsWith("https://hooks.slack.com/")) return null;
  return url;
}

/**
 * Send a message to the Slack incoming webhook.
 *
 * Returns ok:true only when Slack responded 2xx. Returns ok:false on
 * any error (config missing, network, non-2xx). Never throws.
 */
export async function sendSlack(msg: SlackMessage): Promise<SlackResult> {
  const url = getWebhookUrl();
  if (!url) {
    return { ok: false, status: 0, error: "SLACK_HOT_LEAD_WEBHOOK_URL not configured" };
  }

  const text = truncate(msg.text);
  // Body composition rules — learned the hard way (PR #61):
  //
  // Slack rejects `actions` (and a few other block types) when they
  // appear inside `attachments[].blocks[]`. The webhook returns
  // `invalid_attachments` and silently drops the whole message. So:
  //
  //   - When the caller supplies blocks → put them at TOP LEVEL.
  //     This is the modern Block Kit path; it supports every block
  //     type including `actions`. We do not wrap blocks in attachments.
  //
  //   - When the caller supplies only color (no blocks) → use the
  //     legacy text+attachment path so the colored sidebar still works
  //     for plain notifications (e.g. Aira's agent-failure pings).
  //
  //   - When both blocks AND color are supplied → blocks go top-level;
  //     color is currently ignored. The header block in modern Block
  //     Kit gives plenty of visual urgency on its own (the 🔥 emoji
  //     in 🔥 HOT LEAD survives mobile push truncation already).
  const body: Record<string, unknown> = { text };
  if (msg.blocks && msg.blocks.length > 0) {
    body.blocks = msg.blocks;
  } else if (msg.color) {
    body.attachments = [{ color: msg.color, fallback: text.slice(0, 100), text }];
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[slack] ${res.status}: ${errText.slice(0, 200)}`);
      return { ok: false, status: res.status, error: errText };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    const m = err instanceof Error ? err.message : String(err);
    console.error("[slack] network error:", m);
    return { ok: false, status: 0, error: m };
  }
}
