#!/usr/bin/env node
/**
 * AGOS nightly orchestrator: observe -> reason -> decide -> act ->
 * report. This is the "03:00, nobody logs in, the business improves"
 * loop, Phase A.
 *
 *   1. COLLECT   real signals -> proposals (collect.mjs)
 *   2. DECIDE    score + policy-gate every proposal (engine.mjs),
 *                append to the auditable decisions ledger
 *   3. ACT       execute ONLY verdict="auto" actions, each of which
 *                still runs inside existing guardrails (PRs, CI).
 *                v1 executor: kb-refresh (Aira index + llms.txt).
 *   4. REPORT    write the morning executive briefing to
 *                automation/reports/, committed by the workflow so
 *                Rahul reads it with coffee.
 *
 * Approve-queue items are surfaced in the briefing; they wait for the
 * founder (governance rule 4). Nothing outward ships autonomously.
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectProposals } from "./collect.mjs";
import { evaluate, commitDecisions } from "./engine.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const today = new Date().toISOString().slice(0, 10);

console.log("[agos] observe...");
const proposals = collectProposals();
console.log(`[agos] ${proposals.length} proposal(s) from collectors`);

console.log("[agos] decide...");
const decisions = evaluate(proposals);
commitDecisions(decisions);

const auto = decisions.filter((d) => d.verdict === "auto");
const approve = decisions.filter((d) => d.verdict === "approve");
const reject = decisions.filter((d) => d.verdict === "reject");

console.log(`[agos] verdicts: auto=${auto.length} approve=${approve.length} reject=${reject.length}`);

// ── ACT: execute cleared autonomous actions ─────────────────────────
const executed = [];
for (const d of auto) {
  try {
    if (d.type === "kb-refresh") {
      console.log("[agos] act: refreshing Aira knowledge index...");
      execFileSync("node", [join(ROOT, "automation/scripts/build-aira-kb.mjs")], {
        stdio: "inherit", timeout: 10 * 60 * 1000,
      });
      // Guard: generated index must respect the no-dash rule before commit.
      execFileSync("node", [join(ROOT, "automation/scripts/check-no-emdash.mjs")], {
        stdio: "inherit", timeout: 60 * 1000,
      });
      executed.push({ ...d, result: "ok" });
    } else {
      executed.push({ ...d, result: "skipped: no executor wired for this type yet" });
    }
  } catch (e) {
    executed.push({ ...d, result: `failed: ${e.message?.slice(0, 120)}` });
  }
}

// ── REPORT: morning executive briefing ──────────────────────────────
const b = [];
b.push(`# AGOS Morning Briefing · ${today}`);
b.push("");
b.push(`Observed ${proposals.length} signal(s). Decisions: ${auto.length} autonomous, ${approve.length} awaiting founder approval, ${reject.length} rejected. Full rationale in automation/agos/decisions.jsonl.`);
b.push("");
if (executed.length) {
  b.push("## Executed autonomously (inside guardrails)");
  for (const e of executed) b.push(`- ${e.title} -> ${e.result}`);
  b.push("");
}
if (approve.length) {
  b.push("## Awaiting your approval");
  for (const d of approve) {
    b.push(`- **${d.title}** (worker: ${d.worker}, authority ${d.scores.authority} · geo ${d.scores.geo} · revenue ${d.scores.revenue} · risk ${d.scores.risk})`);
    b.push(`  ${d.reasons[0]}`);
  }
  b.push("");
}
if (reject.length) {
  b.push("## Rejected (with reasons)");
  for (const d of reject) b.push(`- ${d.title}: ${d.reasons[0]}`);
  b.push("");
}
b.push("## Standing founder levers (unchanged until done)");
b.push("- Google reviews from Nibir / SS Auto / Burimar / OJAS");
b.push("- 5 LinkedIn DMs today (the Leevams play)");
b.push("- Directory listings · Instagram first post");
b.push("");

const reportDir = join(ROOT, "automation/reports");
mkdirSync(reportDir, { recursive: true });
const reportPath = join(reportDir, `agos-briefing-${today}.md`);
writeFileSync(reportPath, b.join("\n"), "utf8");
console.log(`[agos] briefing -> ${reportPath}`);
