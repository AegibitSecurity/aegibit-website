/**
 * Daily @aegibitsec post delivery.
 *
 * Finds today's pre-rendered post in social/queue/ and emails it to the
 * operator via Resend: the HD image as an attachment + the caption in
 * the body, ready to copy-paste. The operator downloads the image,
 * copies the caption, and posts to X — ~30 seconds, full human control.
 *
 * Zero new infrastructure: reuses RESEND_API_KEY (already a secret) and
 * sends to SOCIAL_NOTIFY_EMAIL (or contact@aegibit.com fallback). The
 * cron NEVER renders — it only reads the committed PNG + caption, so
 * there are no headless-font failure modes.
 *
 * Exit behaviour:
 *   - today has a queued post  -> email it, exit 0
 *   - today has none           -> email a "queue empty, refill" notice
 *   - RESEND_API_KEY missing    -> log + exit 0 (no-op, never fails CI)
 *
 * Run by .github/workflows/social-daily.yml on a daily cron, or
 * manually: node automation/scripts/social-daily-send.mjs [YYYY-MM-DD]
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const QUEUE = join(ROOT, "social", "queue");

// Today's date in IST (the brand's home timezone) so the "day" boundary
// matches when the founder actually posts. Cron is set ~02:30 UTC = 08:00 IST.
function istDateString(argDate) {
  if (argDate) return argDate;
  const nowUtcMs = Date.now();
  const istMs = nowUtcMs + 5.5 * 60 * 60 * 1000;
  return new Date(istMs).toISOString().slice(0, 10);
}

const RECIPIENT =
  process.env.SOCIAL_NOTIFY_EMAIL ||
  process.env.TEAM_NOTIFY_EMAILS?.split(",")[0]?.trim() ||
  "contact@aegibit.com";

async function sendEmail({ subject, html, text, attachments }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[social-daily] RESEND_API_KEY not set — no-op.");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AEGIBIT Social <noreply@aegibit.com>",
      to: [RECIPIENT],
      reply_to: ["contact@aegibit.com"],
      subject,
      html,
      text,
      attachments,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[social-daily] Resend ${res.status}: ${body.slice(0, 300)}`);
    return false;
  }
  console.log(`[social-daily] sent to ${RECIPIENT}`);
  return true;
}

const date = istDateString(process.argv[2]);
const pngPath = join(QUEUE, `${date}.png`);
const txtPath = join(QUEUE, `${date}.txt`);

if (!existsSync(pngPath) || !existsSync(txtPath)) {
  await sendEmail({
    subject: `⚠️ @aegibitsec queue is empty for ${date}`,
    text:
      `No queued post found for ${date} in social/queue/.\n\n` +
      `Ask Aira to refill the queue: re-run automation/scripts/render-social-queue.mjs ` +
      `after adding new entries to automation/data/social-posts.json.`,
    html:
      `<p>No queued post found for <b>${date}</b>.</p>` +
      `<p>Ask Aira to refill the queue (add entries to <code>automation/data/social-posts.json</code> and re-render).</p>`,
  });
  console.log(`[social-daily] no post queued for ${date} — sent refill notice.`);
  process.exit(0);
}

const caption = readFileSync(txtPath, "utf8");
const png = readFileSync(pngPath);
const captionHtml = caption
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\n/g, "<br>");

const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#111;">
    <p style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#F97316;font-weight:700;margin:0 0 4px;">Today's @aegibitsec post</p>
    <h2 style="margin:0 0 16px;font-weight:600;">Download the image, copy the caption, post.</h2>
    <p style="margin:0 0 8px;font-size:13px;color:#666;">1) Save the attached HD image &nbsp; 2) Copy the caption below &nbsp; 3) Post to X with the image</p>
    <div style="background:#0D0D0D;color:#E4E4E7;border-radius:10px;padding:18px 20px;line-height:1.6;font-size:15px;white-space:normal;">
      ${captionHtml}
    </div>
    <p style="margin:16px 0 4px;font-size:12px;color:#999;">Image attached: <code>${date}.png</code> (1600×900). Alt text suggestion: an AEGIBIT post on a black background with the brand mark and headline.</p>
    <p style="margin:0;font-size:12px;color:#bbb;">AEGIBIT social engine · queued + pre-approved · zero-spend</p>
  </div>`;

await sendEmail({
  subject: `📣 Post for @aegibitsec — ${date}`,
  html,
  text: `Today's @aegibitsec post (${date}).\n\nDownload the attached image, copy the caption below, post to X.\n\n--- CAPTION ---\n\n${caption}\n`,
  attachments: [{ filename: `aegibit-${date}.png`, content: png.toString("base64") }],
});

console.log(`[social-daily] delivered ${date}.`);
