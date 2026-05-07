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
  /** "good" (green) | "warning" (yellow) | "danger" (red) | hex like #FF6A00. */
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
  // Slack's "attachments" field gets us color-coded sidebar without
  // forcing every block consumer to ship attachments-style blocks.
  const body: Record<string, unknown> = {
    text,
    attachments: msg.color
      ? [{ color: msg.color, blocks: msg.blocks ?? [] }]
      : msg.blocks
        ? [{ blocks: msg.blocks }]
        : undefined,
  };

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
