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
import { readFileSync, existsSync, statSync } from "node:fs";
import { collectProposals } from "./collect.mjs";
import { evaluate, commitDecisions, loadObjectives } from "./engine.mjs";
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

// ── REPORT: the Founder Dashboard ───────────────────────────────────
// Rahul's contract: decisions in under a minute. Mode, honest ops
// health with its breakdown, tonight's numbers, ONE top
// recommendation with reasoning and confidence, then the queue.
const objectives = loadObjectives();
const waiting = queue.items.filter((i) => i.status === "awaiting-approval");
const deferred = queue.items.filter((i) => i.status === "deferred");
const autoOk = executed.filter((e) => e.result === "ok").length;

// Ops health, computed from REAL signals only (named honestly: this
// is operational health; business health earns its name when revenue
// and client metrics feed in).
let health = 100;
const healthNotes = [];
const kbPath = join(ROOT, "src/data/aira-kb.json");
if (existsSync(kbPath)) {
  const kbAge = (Date.now() - statSync(kbPath).mtimeMs) / 864e5;
  if (kbAge > 8) { health -= 15; healthNotes.push(`knowledge index stale ${Math.round(kbAge)}d (-15)`); }
}
try {
  const st = JSON.parse(readFileSync(join(ROOT, "automation/state.json"), "utf8"));
  const fails = Object.values(st.consecutiveFailures ?? {}).reduce((a, b) => a + (b || 0), 0);
  if (fails > 0) { const hit = Math.min(fails * 10, 30); health -= hit; healthNotes.push(`${fails} automation failure(s) (-${hit})`); }
} catch { /* state optional */ }
const droughts = waiting.filter((i) => (i.timesProposed ?? 1) >= 3).length;
if (droughts > 0) { const hit = Math.min(droughts * 5, 20); health -= hit; healthNotes.push(`${droughts} approval drought(s) (-${hit})`); }
if (healthNotes.length === 0) healthNotes.push("all monitored signals nominal");

const top = waiting[0] ?? null;

const b = [];
b.push(`# AGOS Morning Brief · ${today}`);
b.push("");
b.push(`**Business mode:** ${objectives.mode} (${objectives.quarter})  `);
b.push(`**Ops health:** ${Math.max(health, 0)}/100 (${healthNotes.join("; ")})  `);
b.push(`**Evaluated tonight:** ${decisions.length} · **auto-executed:** ${autoOk} · **awaiting approval:** ${waiting.length} · **deferred:** ${deferred.length} · **rejected:** ${reject.length}`);
b.push("");
if (top) {
  b.push("## Top recommendation");
  b.push("");
  b.push(`**${top.title}**  `);
  b.push(`Priority ${top.priority} · confidence ${top.confidence}% · est. ${top.etaMinutes} min  `);
  b.push(`Why: highest value-density item in the queue under ${objectives.mode} mode, serving this quarter's objectives. Reply "approved: ${top.id}" to execute.`);
  b.push("");
}
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
