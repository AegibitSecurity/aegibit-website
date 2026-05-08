import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { sendSlack, type SlackBlock } from "@/lib/slack";
import { buildHotBlocks } from "@/lib/slack-hot-lead";

/**
 * /api/admin/slack-debug — short-lived diagnostic for the hot-lead push.
 *
 * Lives behind the same DASHBOARD_SECRET bearer auth as deploy-notify
 * (server-to-server only — never reachable from a browser bundle).
 *
 * Returns:
 *   - masked state of `SLACK_HOT_LEAD_WEBHOOK_URL` (length, prefix, suffix —
 *     never the full secret) so we can confirm Vercel env propagation.
 *   - the actual Slack response for three increasingly complex payloads:
 *       1. plain text only          (matches Slack's Sample-curl test)
 *       2. minimal Block Kit        (one section, no attachments wrapper)
 *       3. attachments + Block Kit  (the exact wrapper our hot-lead sender uses)
 *
 * If (1) succeeds but (2) or (3) fails, the bug is in the block / wrapper
 * shape, not the env. Slack returns a human-readable `error` body
 * (e.g. `invalid_blocks`, `no_text`, `invalid_payload`) which our
 * sendSlack already captures into SlackResult.error.
 *
 * Once the hot-lead flow is verified end-to-end, this endpoint can stay
 * (it's a useful permanent ops surface) or be deleted.
 */

function maskUrl(url: string | undefined): {
  present: boolean;
  length: number;
  prefix: string;
  suffix: string;
  hostOk: boolean;
} {
  if (!url) {
    return { present: false, length: 0, prefix: "", suffix: "", hostOk: false };
  }
  return {
    present: true,
    length: url.length,
    prefix: url.slice(0, 36),
    suffix: url.slice(-4),
    hostOk: url.startsWith("https://hooks.slack.com/services/"),
  };
}

/**
 * Mask GEMINI_API_KEY for safe diagnostic dumping. Reports presence,
 * length, prefix shape (Google keys start with "AIza"), trailing
 * 4 chars, and a `hasWhitespace` flag — the #1 silent bug when
 * pasting keys into Vercel from the Google AI Studio UI.
 *
 * Also fires a real Gemini call with the key so we know it WORKS,
 * not just that it's syntactically valid.
 */
function maskGeminiKey(key: string | undefined): {
  present: boolean;
  length: number;
  prefix: string;
  suffix: string;
  shapeOk: boolean;
  hasLeadingWhitespace: boolean;
  hasTrailingWhitespace: boolean;
} {
  if (!key) {
    return {
      present: false,
      length: 0,
      prefix: "",
      suffix: "",
      shapeOk: false,
      hasLeadingWhitespace: false,
      hasTrailingWhitespace: false,
    };
  }
  return {
    present: true,
    length: key.length,
    prefix: key.slice(0, 6),  // "AIzaSy..." is the standard Google key shape
    suffix: key.slice(-4),
    shapeOk: key.trim().startsWith("AIza"),
    hasLeadingWhitespace: key !== key.trimStart(),
    hasTrailingWhitespace: key !== key.trimEnd(),
  };
}

async function probeGemini(): Promise<{ ok: boolean; status: number; error?: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, status: 0, error: "no_key" };
  try {
    // Match the model used by aira-bot.ts so the probe reflects the
    // same free-tier quota the chat route is subject to.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key.trim())}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "ping — reply with one word: pong" }] }],
        generationConfig: { maxOutputTokens: 8 },
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: errText.slice(0, 200) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * List the models the API key is actually allowed to call. When a
 * generateContent probe returns 404, this tells us in one call which
 * model names ARE valid — instead of trial-and-error redeploying the
 * chat route every time Google deprecates a model.
 *
 * Returns just the model `name` strings (e.g. "models/gemini-2.5-flash")
 * filtered to those that support generateContent. Capped to 30 entries
 * so the JSON response stays readable.
 */
async function listGeminiModels(): Promise<{ ok: boolean; status: number; models?: string[]; error?: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, status: 0, error: "no_key" };
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key.trim())}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: errText.slice(0, 200) };
    }
    type Model = { name: string; supportedGenerationMethods?: string[] };
    const data = (await res.json().catch(() => ({}))) as { models?: Model[] };
    const supported = (data.models ?? [])
      .filter((m) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
      .map((m) => m.name)
      .slice(0, 30);
    return { ok: true, status: res.status, models: supported };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.DASHBOARD_SECRET || auth !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const env = maskUrl(process.env.SLACK_HOT_LEAD_WEBHOOK_URL);

  // Probe 1 — plain text only. Mirrors Slack's "Sample curl" exactly.
  const text = await sendSlack({
    text: "🩺 slack-debug probe 1 — plain text",
  });

  // Probe 2 — minimal Block Kit, no attachments wrapper, no color.
  const minimalBlocks: SlackBlock[] = [
    {
      type: "section",
      text: { type: "mrkdwn", text: "🩺 slack-debug probe 2 — minimal Block Kit" },
    },
  ];
  const blockMinimal = await sendSlack({
    text: "🩺 slack-debug probe 2 fallback",
    blocks: minimalBlocks,
  });

  // Probe 3 — attachments + color (the exact wrapper notifySlackLead uses).
  const blockColored = await sendSlack({
    text: "🩺 slack-debug probe 3 fallback",
    blocks: minimalBlocks,
    color: "#EF4444",
  });

  // Probe 4 — same blocks our hot-lead path produces, sent through
  // sendSlack so we capture Slack's actual error body (notifySlackLead
  // discards it in favor of a boolean return).
  const hotLeadBlocks = buildHotBlocks({
    email: "slack-debug@aegibit.com",
    name: "🩺 slack-debug probe 4",
    company: "AEGIBIT diag",
    phone: "+10000000000",
    source: "demo",
    page: "/__diag/slack",
    message: "Probe 4 — synthetic hot-lead Block Kit firing through buildHotBlocks.",
    heat: "hot",
    journey: null,
    siteUrl: "https://www.aegibit.com",
  });
  const hotLead = await sendSlack({
    text: "🩺 slack-debug probe 4 — full hot-lead Block Kit",
    blocks: hotLeadBlocks,
    color: "#EF4444",
  });

  // Gemini env-state diagnostic. Surfaces the masked shape of
  // GEMINI_API_KEY, hits Gemini directly with that key (probe), and
  // lists the models the key is allowed to call (models). Three
  // signals in one call → no more trial-and-error redeploys.
  const [probe, models] = await Promise.all([probeGemini(), listGeminiModels()]);
  const gemini = {
    env: maskGeminiKey(process.env.GEMINI_API_KEY),
    probe,
    models,
  };

  return NextResponse.json({
    env,
    probes: { text, blockMinimal, blockColored, hotLead },
    hotLeadBlockCount: hotLeadBlocks.length,
    gemini,
  });
}
