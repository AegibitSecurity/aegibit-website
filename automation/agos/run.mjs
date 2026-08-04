#!/usr/bin/env node
/**
 * AGOS nightly orchestrator (Phase B): observe -> board-evaluate ->
 * queue -> act -> report. The executive summary the briefing opens
 * with is the long-term contract: "evaluated N opportunities, rejected
 * R, executed A autonomously, these K await your approval."
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { collectProposals } from "./collect.mjs";
import { evaluate, commitDecisions } from "./engine.mjs";
import { loadQueue, saveQueue, enqueueDecisions, markStatus, renderQueueTable } from "./queue.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const today = new Date().toISOString().slice(0, 10);

console.log("[agos] observe...");
const proposals = collectProposals();

console.log("[agos] board evaluation...");
const decisions = evaluate(proposals);
commitDecisions(decisions);

const auto = decisions.filter((d) => d.verdict === "auto");
const approve = decisions.filter((d) => d.verdict === "approve");
const reject = decisions.filter((d) => d.verdict === "reject");
console.log(`[agos] verdicts: auto=${auto.length} approve=${approve.length} reject=${reject.length}`);

// ── Queue: merge tonight's decisions with everything still waiting ──
let queue = enqueueDecisions(loadQueue(), decisions);

// ── ACT on auto-approved queue items with wired executors ───────────
const executed = [];
for (const d of auto) {
  try {
    if (d.type === "kb-refresh") {
      console.log("[agos] act: refreshing Aira knowledge index...");
      execFileSync("node", [join(ROOT, "automation/scripts/build-aira-kb.mjs")], {
        stdio: "inherit", timeout: 10 * 60 * 1000,
      });
      execFileSync("node", [join(ROOT, "automation/scripts/check-no-emdash.mjs")], {
        stdio: "inherit", timeout: 60 * 1000,
      });
      executed.push({ ...d, result: "ok" });
      queue = markStatus(queue, d.id, "executed", "kb refreshed");
    } else {
      executed.push({ ...d, result: "no executor wired yet" });
    }
  } catch (e) {
    executed.push({ ...d, result: `failed: ${e.message?.slice(0, 120)}` });
    queue = markStatus(queue, d.id, "failed", e.message?.slice(0, 120));
  }
}
saveQueue(queue);

// ── REPORT: the executive briefing ──────────────────────────────────
const waiting = queue.items.filter((i) => i.status === "awaiting-approval").length;
const b = [];
b.push(`# AGOS Morning Briefing · ${today}`);
b.push("");
b.push(
  `Last night I evaluated ${decisions.length} opportunit${decisions.length === 1 ? "y" : "ies"}. ` +
  `I rejected ${reject.length} (low value, duplicate, or policy), executed ${executed.filter((e) => e.result === "ok").length} low-risk task(s) autonomously inside guardrails, ` +
  `and ${waiting} action(s) await your approval, ranked by expected business impact below.`,
);
b.push("");
b.push("## The work queue (highest ROI first)");
b.push("");
b.push(renderQueueTable(queue));
b.push("");
if (executed.length) {
  b.push("## Executed autonomously");
  for (const e of executed) b.push(`- ${e.title} -> ${e.result}`);
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
writeFileSync(join(reportDir, `agos-briefing-${today}.md`), b.join("\n"), "utf8");
console.log(`[agos] briefing -> automation/reports/agos-briefing-${today}.md`);
