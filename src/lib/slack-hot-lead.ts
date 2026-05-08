import { sendSlack, type SlackBlock } from "@/lib/slack";
import type { LeadHeat, VisitorJourney } from "@/lib/hot-lead";

/**
 * Format a hot-lead payload as Block Kit for Slack push.
 *
 * Layout (designed for the iPhone push preview + the in-app feed):
 *   • Header: 🔥 HOT LEAD — name · company
 *   • One-line lead summary (used as fallback push text too)
 *   • Two-column field grid: source, page, score, time-on-site, etc.
 *   • Visitor journey panel: pages + CTAs in code-block formatting
 *   • Action: open mailto / view dashboard
 *
 * Warm leads get a much shorter, less urgent message — keeps the
 * channel from becoming background noise for the founder.
 */
export interface NotifyHotLeadInput {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: string;
  page: string;
  message?: string;
  heat: LeadHeat;
  journey: VisitorJourney | null;
  /** Public site URL (e.g. https://www.aegibit.com) for action links. */
  siteUrl: string;
}

const SOURCE_LABELS: Record<string, string> = {
  waitlist:           "Waitlist Signup",
  contact:            "Contact Form",
  demo:               "Demo Request",
  exit_intent:        "Exit Intent",
  paymint_demo:       "PayMint Demo",
  voicecore_waitlist: "VoiceCore Early Access",
  aira_waitlist:      "Aira Early Access",
  chat:               "Aira Chat",
};

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function buildHotBlocks(input: NotifyHotLeadInput): SlackBlock[] {
  const j = input.journey;
  const sourceLabel = SOURCE_LABELS[input.source] ?? input.source;
  const identity = input.name
    ? `*${input.name}*${input.company ? ` · ${input.company}` : ""}`
    : `*${input.email}*`;

  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: "🔥 HOT LEAD", emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `${identity}\n` +
          `📧 \`${input.email}\`` +
          (input.phone ? `  ·  📞 \`${input.phone}\`` : "") +
          `\n_Industry data: contact within 5 min = ~9× conversion vs 1h._`,
      },
    },
  ];

  // Field grid (Slack section.fields takes pairs)
  const fields: Array<{ type: "mrkdwn"; text: string }> = [
    { type: "mrkdwn", text: `*Source*\n${sourceLabel}` },
    { type: "mrkdwn", text: `*Landing page*\n\`${input.page}\`` },
  ];
  if (j) {
    fields.push(
      { type: "mrkdwn", text: `*Behavior score*\n*${j.behavior_score}* / 100` },
      { type: "mrkdwn", text: `*Time on site*\n${fmtTime(j.time_on_site_seconds)}` },
      { type: "mrkdwn", text: `*Pages viewed*\n${j.pages_viewed.length}` },
      { type: "mrkdwn", text: `*Scroll depth*\n${j.scroll_depth_max}%` },
    );
    if (j.utm_source) {
      fields.push({
        type: "mrkdwn",
        text: `*UTM source*\n${j.utm_source}${j.utm_campaign ? ` · ${j.utm_campaign}` : ""}`,
      });
    }
    if (j.country) {
      fields.push({ type: "mrkdwn", text: `*Country*\n${j.country}` });
    }
  }
  // Slack section limits 10 fields; we're well under.
  blocks.push({ type: "section", fields });

  // Visitor message (truncated)
  if (input.message) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*What they wrote*\n>${input.message.slice(0, 600).replace(/\n/g, "\n>")}`,
      },
    });
  }

  // Visitor journey: pages + CTAs as a single code block (compact, scannable on phone)
  if (j && (j.pages_viewed.length > 0 || j.cta_clicks.length > 0)) {
    const pagesLine =
      j.pages_viewed.length > 0
        ? "Pages: " + j.pages_viewed.slice(0, 8).join(" → ")
        : "";
    const ctasLine =
      j.cta_clicks.length > 0
        ? "CTAs:  " + j.cta_clicks.map((c) => c.cta_id).slice(0, 5).join(" · ")
        : "";
    const expLine =
      j.experiment_exposures.length > 0
        ? "Saw:   " +
          j.experiment_exposures
            .map((e) => `${e.experiment}=${e.variant}`)
            .slice(0, 3)
            .join(" · ")
        : "";
    const journey = [pagesLine, ctasLine, expLine].filter(Boolean).join("\n");
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: "*Visitor journey*\n```" + journey + "```" },
    });
  }

  // Actions: mailto + dashboard. We deliberately do NOT add a tel:
  // button — Slack's button `url` field only accepts http(s):// and
  // mailto: schemes, and a tel: URL fails schema validation with
  // `invalid_blocks`, killing the entire message. The phone number is
  // already displayed in the identity section above; mobile Slack
  // auto-linkifies it so tap-to-call still works without a button.
  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "📧 Reply now", emoji: true },
        url: `mailto:${input.email}`,
        style: "primary",
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Open dashboard", emoji: true },
        url: `${input.siteUrl}/dashboard/leads`,
      },
    ],
  });

  return blocks;
}

function buildWarmBlocks(input: NotifyHotLeadInput): SlackBlock[] {
  const sourceLabel = SOURCE_LABELS[input.source] ?? input.source;
  const identity = input.name
    ? `*${input.name}*${input.company ? ` · ${input.company}` : ""}`
    : `*${input.email}*`;
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🔔 *New ${sourceLabel}*\n${identity}\n📧 \`${input.email}\` · \`${input.page}\``,
      },
    },
  ];
}

/**
 * Send the lead notification to Slack. No-throw — caller doesn't have
 * to handle errors. Returns whether the message was delivered.
 */
export async function notifySlackLead(input: NotifyHotLeadInput): Promise<boolean> {
  const isHot = input.heat === "hot";
  const blocks = isHot ? buildHotBlocks(input) : buildWarmBlocks(input);

  // Fallback text (used in push notifications + accessibility readers).
  // Mobile push truncates ~80 chars, so put the punchline first.
  const fallback = isHot
    ? `🔥 HOT LEAD — ${input.name ?? input.email}${input.company ? ` · ${input.company}` : ""}${input.journey ? ` · ${input.journey.pages_viewed.length} pages · ${Math.floor(input.journey.time_on_site_seconds / 60)}m on site` : ""} — reply now`
    : `🔔 New ${SOURCE_LABELS[input.source] ?? input.source}: ${input.email}`;

  const result = await sendSlack({
    text: fallback,
    blocks,
    color: isHot ? "#EF4444" : "#F97316",
  });

  return result.ok;
}
