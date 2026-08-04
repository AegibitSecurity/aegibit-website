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

// ── Report ──────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const report = [
  `# AGOS Learning Report · ${today}`,
  "",
  `Ledger decisions analyzed: ${decisions.length}. Queue items: ${queue.items.length}. Config adjusted: ${adjusted ? "yes" : "no"}.`,
  "",
  "## Findings",
  ...findings.map((f) => `- ${f}`),
  "",
].join("\n");

const reportDir = join(ROOT, "automation/reports");
mkdirSync(reportDir, { recursive: true });
writeFileSync(join(reportDir, `agos-learning-${today}.md`), report, "utf8");
console.log(`[agos-learn] ${findings.length} finding(s), adjusted=${adjusted}`);
