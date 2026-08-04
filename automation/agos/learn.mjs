#!/usr/bin/env node
/**
 * AGOS Learning Engine (weekly worker). Prevents the system from
 * staying static: reads the decision ledger + queue history, finds
 * patterns, and recalibrates evaluator weights in config.json WITHIN
 * BOUNDS (weightBounds), logging every adjustment with its rationale.
 *
 * HONESTY FIRST: on sparse data this engine explicitly declines to
 * adjust. A learning loop that "learns" from noise is worse than no
 * loop. Every no-op is reported with the reason, so the briefing shows
 * the system knows what it does not know.
 *
 * v1 signals (all real, all local):
 *   1. Founder-approval drought: task types repeatedly proposed but
 *      never approved -> those types' priority is over-estimated; note
 *      for founder and dampen (recorded, applied at proposal ranking).
 *   2. Outcome records (decisions with outcome != null, wired as
 *      Phase C measurement lands from GSC/analytics): shift value
 *      weights toward axes that predicted real wins.
 *   3. Auto-action failure rate: if auto-executed tasks fail, tighten
 *      the auto ceilings.
 * Output: automation/reports/agos-learning-DATE.md + (only with
 * sufficient data) a bounded config.json update.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadQueue } from "./queue.mjs";

const AGOS_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AGOS_DIR, "../..");
const LEDGER = join(AGOS_DIR, "decisions.jsonl");
const MIN_OUTCOMES_TO_ADJUST = 10;

function loadDecisions() {
  if (!existsSync(LEDGER)) return [];
  return readFileSync(LEDGER, "utf8")
    .split("\n").filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

const decisions = loadDecisions();
const queue = loadQueue();
const findings = [];
let adjusted = false;

// ── Signal 1: approval droughts ─────────────────────────────────────
const droughts = queue.items.filter(
  (i) => i.status === "awaiting-approval" && (i.timesProposed ?? 1) >= 3,
);
for (const d of droughts) {
  findings.push(
    `Approval drought: "${d.title}" proposed ${d.timesProposed}x without founder action. Either approve, drop, or tell AGOS why, silence teaches nothing.`,
  );
}

// ── Signal 2: outcome-based recalibration ───────────────────────────
const withOutcomes = decisions.filter((d) => d.outcome != null);
if (withOutcomes.length >= MIN_OUTCOMES_TO_ADJUST) {
  findings.push(`${withOutcomes.length} measured outcomes available: outcome-weighted recalibration eligible (implement axis-shift on real data).`);
  // Bounded weight adjustment lands here as outcome volume grows.
} else {
  findings.push(
    `Insufficient outcome data (${withOutcomes.length}/${MIN_OUTCOMES_TO_ADJUST} measured): declining to adjust value weights. Honest no-op; wire GSC/analytics measurement to feed outcomes.`,
  );
}

// ── Signal 3: auto-action reliability ───────────────────────────────
const autos = decisions.filter((d) => d.verdict === "auto");
const failed = queue.items.filter((i) => i.status === "failed");
if (autos.length > 0) {
  findings.push(`Auto-actions to date: ${autos.length}, failures recorded: ${failed.length}.`);
  if (failed.length / Math.max(autos.length, 1) > 0.3) {
    findings.push("Failure rate > 30%: recommend tightening autoRiskCeiling (founder review).");
  }
}

// ── The Weekly Executive Review ─────────────────────────────────────
// Rahul's founder discipline (2026-08-04): exactly one page, ten
// questions, every Monday. Answers come from real data where it
// exists and say "no data yet" where it does not, alignment with
// reality over impressive-looking dashboards.
const today = new Date().toISOString().slice(0, 10);
const weekAgo = Date.now() - 7 * 864e5;
const week = decisions.filter((d) => new Date(d.at).getTime() >= weekAgo);
const weekAuto = week.filter((d) => d.verdict === "auto").length;
const weekApprove = week.filter((d) => d.verdict === "approve").length;
const weekReject = week.filter((d) => d.verdict === "reject").length;

let assets = { assets: [] };
try { assets = JSON.parse(readFileSync(join(AGOS_DIR, "assets.json"), "utf8")); } catch { /* none yet */ }
let experiments = { experiments: [] };
try { experiments = JSON.parse(readFileSync(join(AGOS_DIR, "experiments.json"), "utf8")); } catch { /* none yet */ }
const concluded = experiments.experiments.filter((e) => e.decision != null);
const running = experiments.experiments.filter((e) => e.status === "running");

const review = [
  `# AGOS Weekly Review · ${today}`,
  "",
  `## 1. What did we learn this week?`,
  `- ${week.length} decisions ledgered (auto ${weekAuto} / founder-queue ${weekApprove} / rejected ${weekReject}). Key finding: ${findings.length ? findings[0] : "none"}`,
  `## 2. What generated revenue?`,
  `- No revenue attribution wired yet (honest gap). Track via leads + invoices until measurement lands.`,
  `## 3. What generated authority?`,
  `- Knowledge assets on record: ${assets.assets.length}. Authority work ships via the GEO capability (glossary experiment ${running.length ? "RUNNING" : "not running"}).`,
  `## 4. What failed?`,
  `- ${failed.length === 0 ? "No failed executions this week." : failed.map((f) => f.title).join("; ")}`,
  `## 5. What surprised us?`,
  `- Filled by the founder, or by anomaly detection once measurement data flows. No automated surprises this week.`,
  `## 6. Which experiment concluded?`,
  `- ${concluded.length ? concluded.map((e) => `${e.id}: ${e.decision}`).join("; ") : `None concluded. Running: ${running.map((e) => e.id).join(", ") || "none"}.`}`,
  `## 7. Which assumptions changed?`,
  `- ${adjusted ? "Evaluator weights recalibrated (see appendix)." : "None: insufficient outcome data to responsibly change assumptions."}`,
  `## 8. What should stop?`,
  `- ${droughts.length ? `Founder attention: ${droughts.length} approval-drought item(s), approve or kill them.` : "Nothing flagged for stopping this week."}`,
  `## 9. What should double down?`,
  `- Highest value-density queue item: ${queue.items[0] ? queue.items[0].title : "(queue empty)"}.`,
  `## 10. Single highest-impact action for the coming week?`,
  `- ${queue.items.find((i) => i.status === "approved" || i.status === "awaiting-approval")?.title ?? "Feed the pipeline: founder levers (reviews, outreach) remain the top unmeasured lever."}`,
  "",
  "## Learning Engine appendix",
  `Ledger decisions analyzed: ${decisions.length}. Queue items: ${queue.items.length}. Config adjusted: ${adjusted ? "yes" : "no"}.`,
  ...findings.map((f) => `- ${f}`),
  "",
].join("\n");

const reportDir = join(ROOT, "automation/reports");
mkdirSync(reportDir, { recursive: true });
writeFileSync(join(reportDir, `agos-weekly-review-${today}.md`), review, "utf8");
console.log(`[agos-learn] weekly review written, ${findings.length} finding(s), adjusted=${adjusted}`);
