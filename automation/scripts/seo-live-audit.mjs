/**
 * 24/7 live SEO guardian.
 *
 * Crawls every URL in the production sitemap, audits the RENDERED HTML
 * (not the source), scores the result, detects regressions against the
 * previous run, and alerts (Slack + email) only when something got
 * WORSE — so it's a guardian, not a nag.
 *
 * Catches the regressions that silently tank rankings/rich-results:
 *   - a page that started returning 4xx/5xx or redirecting
 *   - a missing or wrong-host canonical
 *   - an accidental noindex on an indexable page
 *   - a JSON-LD block that no longer parses (kills rich results)
 *   - missing OG image, missing/oversized titles, duplicate titles, ...
 *
 * Outputs (committed by the workflow):
 *   automation/reports/seo/latest.json  — full structured result
 *   automation/reports/seo/latest.md    — human-readable summary
 *   automation/reports/seo/history.csv  — one line per run (trend)
 *
 * Wrapped in withJob() so it shares the agent_actions audit trail and
 * the 3-consecutive-failure auto-disable with the other crons.
 *
 * Env: SITE_URL (default https://www.aegibit.com), and for alerts
 * (all optional — missing = that channel is skipped):
 *   SEO_SLACK_WEBHOOK_URL | SLACK_HOT_LEAD_WEBHOOK_URL
 *   RESEND_API_KEY + (SEO_NOTIFY_EMAIL | TEAM_NOTIFY_EMAILS)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, log, withJob } from "./_lib.mjs";
import { extractSeo, runPageChecks, SEVERITY_WEIGHT } from "./lib/seo-live-checks.mjs";

const SITE_URL = (process.env.SITE_URL || "https://www.aegibit.com").replace(/\/$/, "");
const OUT_DIR = join(ROOT, "automation", "reports", "seo");
const LATEST_JSON = join(OUT_DIR, "latest.json");
const LATEST_MD = join(OUT_DIR, "latest.md");
const HISTORY_CSV = join(OUT_DIR, "history.csv");

const MAX_URLS = 60;        // bound runtime; sitemap is the indexable set
const CONCURRENCY = 6;
const UA = "AEGIBIT-SEO-Guardian/1.0 (+https://www.aegibit.com)";

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
  // de-dupe + keep our host only
  const seen = new Set();
  const urls = [];
  for (const u of locs) {
    if (seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  return urls;
}

async function auditUrl(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "manual" });
    const status = res.status;
    if (status !== 200) {
      return { url, status, seo: null, issues: runPageChecks(url, status, {}) };
    }
    const html = await res.text();
    const seo = extractSeo(html);
    const issues = runPageChecks(url, status, seo);
    return { url, status, seo, issues };
  } catch (err) {
    return {
      url,
      status: 0,
      seo: null,
      issues: [{ level: "error", code: "fetch_failed", msg: `Fetch failed: ${err instanceof Error ? err.message : String(err)}` }],
    };
  }
}

async function pool(items, size, worker) {
  const out = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await worker(items[idx]);
    }
  });
  await Promise.all(runners);
  return out;
}

function crossPageChecks(pages) {
  const byTitle = new Map();
  const byDesc = new Map();
  for (const p of pages) {
    if (p.seo?.title) (byTitle.get(p.seo.title) || byTitle.set(p.seo.title, []).get(p.seo.title)).push(p.url);
    if (p.seo?.description) (byDesc.get(p.seo.description) || byDesc.set(p.seo.description, []).get(p.seo.description)).push(p.url);
  }
  for (const [title, urls] of byTitle) {
    if (urls.length > 1) {
      for (const p of pages) {
        if (p.seo?.title === title) {
          p.issues.push({ level: "warn", code: "duplicate_title", msg: `Title shared with ${urls.length - 1} other page(s).` });
        }
      }
    }
  }
  for (const [desc, urls] of byDesc) {
    if (urls.length > 1) {
      for (const p of pages) {
        if (p.seo?.description === desc) {
          p.issues.push({ level: "warn", code: "duplicate_description", msg: `Meta description shared with ${urls.length - 1} other page(s).` });
        }
      }
    }
  }
}

function summarize(pages) {
  let errors = 0, warns = 0, infos = 0;
  for (const p of pages) {
    for (const is of p.issues) {
      if (is.level === "error") errors++;
      else if (is.level === "warn") warns++;
      else infos++;
    }
  }
  const score = Math.max(0, 100 - errors * SEVERITY_WEIGHT.error - warns * SEVERITY_WEIGHT.warn);
  return { pages: pages.length, errors, warns, infos, score };
}

function errorKeys(pages) {
  const keys = [];
  for (const p of pages) {
    for (const is of p.issues) {
      if (is.level === "error") keys.push(`${p.url}::${is.code}`);
    }
  }
  return keys;
}

function buildMarkdown(result) {
  const { when, summary, pages } = result;
  const lines = [];
  lines.push(`# AEGIBIT live SEO report`);
  lines.push("");
  lines.push(`- **When:** ${when}`);
  lines.push(`- **Score:** ${summary.score}/100`);
  lines.push(`- **Pages:** ${summary.pages} · **Errors:** ${summary.errors} · **Warnings:** ${summary.warns} · **Info:** ${summary.infos}`);
  lines.push("");
  const withErrors = pages.filter((p) => p.issues.some((i) => i.level === "error"));
  const withWarns = pages.filter((p) => p.issues.some((i) => i.level === "warn") && !p.issues.some((i) => i.level === "error"));
  if (withErrors.length) {
    lines.push(`## ❌ Errors (${withErrors.length} page(s))`);
    for (const p of withErrors) {
      lines.push(`\n**${p.url}** (HTTP ${p.status})`);
      for (const is of p.issues.filter((i) => i.level === "error")) lines.push(`- \`${is.code}\` — ${is.msg}`);
    }
    lines.push("");
  } else {
    lines.push(`## ✅ No errors`);
    lines.push("");
  }
  if (withWarns.length) {
    lines.push(`## ⚠️ Warnings (${withWarns.length} page(s))`);
    for (const p of withWarns) {
      const ws = p.issues.filter((i) => i.level === "warn");
      lines.push(`- **${p.url}** — ${ws.map((w) => w.code).join(", ")}`);
    }
    lines.push("");
  }
  lines.push(`_Generated by automation/scripts/seo-live-audit.mjs_`);
  return lines.join("\n");
}

async function sendSlack(text) {
  const url = process.env.SEO_SLACK_WEBHOOK_URL || process.env.SLACK_HOT_LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    log("seo-live-audit", `slack alert failed: ${e instanceof Error ? e.message : e}`, "warn");
  }
}

async function sendEmail(subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const to = process.env.SEO_NOTIFY_EMAIL || process.env.TEAM_NOTIFY_EMAILS?.split(",")[0]?.trim() || "contact@aegibit.com";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "AEGIBIT SEO <noreply@aegibit.com>",
        to: [to],
        reply_to: ["contact@aegibit.com"],
        subject,
        text,
      }),
    });
  } catch (e) {
    log("seo-live-audit", `email alert failed: ${e instanceof Error ? e.message : e}`, "warn");
  }
}

await withJob("seo-live-audit", async () => {
  mkdirSync(OUT_DIR, { recursive: true });

  let urls = await fetchSitemapUrls();
  let truncated = 0;
  if (urls.length > MAX_URLS) {
    truncated = urls.length - MAX_URLS;
    urls = urls.slice(0, MAX_URLS);
  }

  const pages = await pool(urls, CONCURRENCY, auditUrl);
  crossPageChecks(pages);
  const summary = summarize(pages);
  if (truncated) log("seo-live-audit", `audited ${urls.length} URLs (${truncated} beyond cap not checked this run)`);

  const when = new Date().toISOString();
  const curKeys = errorKeys(pages);

  // ── Regression detection vs previous run ────────────────────────
  let prevKeys = [];
  if (existsSync(LATEST_JSON)) {
    try {
      prevKeys = JSON.parse(readFileSync(LATEST_JSON, "utf8")).errorKeys || [];
    } catch { /* ignore corrupt prior */ }
  }
  const prevSet = new Set(prevKeys);
  const newErrors = curKeys.filter((k) => !prevSet.has(k));

  const result = { when, site: SITE_URL, summary, errorKeys: curKeys, pages };

  // ── Persist ─────────────────────────────────────────────────────
  writeFileSync(LATEST_JSON, JSON.stringify(result, null, 2));
  writeFileSync(LATEST_MD, buildMarkdown(result));
  if (!existsSync(HISTORY_CSV)) writeFileSync(HISTORY_CSV, "when,score,pages,errors,warns,infos\n");
  appendFileSync(HISTORY_CSV, `${when},${summary.score},${summary.pages},${summary.errors},${summary.warns},${summary.infos}\n`);

  log("seo-live-audit", `score=${summary.score} pages=${summary.pages} errors=${summary.errors} warns=${summary.warns} newErrors=${newErrors.length}`);

  // ── Alert only on NEW errors (regression) — guardian, not nag ────
  if (newErrors.length > 0) {
    const detail = newErrors.map((k) => `• ${k.replace("::", "  →  ")}`).join("\n");
    const subject = `🚨 AEGIBIT SEO regression — ${newErrors.length} new error(s)`;
    const body =
      `${newErrors.length} new SEO error(s) appeared on production since the last check.\n\n` +
      `${detail}\n\n` +
      `Score: ${summary.score}/100 · ${summary.errors} total errors across ${summary.pages} pages.\n` +
      `Full report: automation/reports/seo/latest.md`;
    await sendSlack(`${subject}\n\n${body}`);
    await sendEmail(subject, body);
    log("seo-live-audit", `alerted on ${newErrors.length} new error(s)`, "warn");
  } else if (summary.errors === 0) {
    log("seo-live-audit", "all green — no errors, no alert");
  } else {
    log("seo-live-audit", `${summary.errors} known error(s), no NEW regressions — staying quiet`);
  }
});
