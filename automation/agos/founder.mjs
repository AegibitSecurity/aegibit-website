#!/usr/bin/env node
/**
 * The Founder Twin. Not a chatbot, not an agent: a model of HOW RAHUL
 * DECIDES, learned from his actual decisions, used to pre-rank
 * proposals and reduce his cognitive load. It NEVER replaces him:
 * governance-gated actions always wait for the human, the twin only
 * predicts and prioritizes.
 *
 * HONESTY CONTRACT: below MIN_OBSERVATIONS per task type the twin
 * reports "learning (n=X)" instead of a percentage. A confident
 * prediction from three data points would be a lie wearing math.
 *
 * Every founder decision is recorded here (the observation stream):
 *   node automation/agos/founder.mjs approve <taskId> [note]
 *   node automation/agos/founder.mjs reject <taskId> [note]
 * Aira runs this when Rahul says "approved: <id>" / "rejected: <id>",
 * which simultaneously updates the queue and teaches the twin.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadQueue, saveQueue, markStatus } from "./queue.mjs";

const MODEL_PATH = join(dirname(fileURLToPath(import.meta.url)), "founder-model.json");
const MIN_OBSERVATIONS = 8;

export function loadModel() {
  if (!existsSync(MODEL_PATH)) return { observations: [] };
  try { return JSON.parse(readFileSync(MODEL_PATH, "utf8")); } catch { return { observations: [] }; }
}
export function saveModel(m) {
  writeFileSync(MODEL_PATH, JSON.stringify(m, null, 1) + "\n", "utf8");
}

/** Record one founder decision (the twin's training signal). */
export function recordDecision(model, { taskId, taskType, worker, decision, latencyDays, note }) {
  model.observations.push({
    at: new Date().toISOString(),
    taskId, taskType, worker, decision,
    latencyDays: latencyDays ?? null,
    note: note ?? null,
  });
  return model;
}

/**
 * Predict founder-fit for a task type. Returns either
 * { known: true, approveProbability, n } or { known: false, n }.
 */
export function predictApproval(model, taskType) {
  const obs = model.observations.filter((o) => o.taskType === taskType);
  if (obs.length < MIN_OBSERVATIONS) return { known: false, n: obs.length };
  const approvals = obs.filter((o) => o.decision === "approve").length;
  return {
    known: true,
    approveProbability: Math.round((approvals / obs.length) * 100),
    n: obs.length,
  };
}

/** Twin summary for briefings: what it has learned so far, honestly. */
export function twinSummary(model) {
  const byType = new Map();
  for (const o of model.observations) {
    const t = byType.get(o.taskType) ?? { n: 0, approvals: 0 };
    t.n += 1;
    if (o.decision === "approve") t.approvals += 1;
    byType.set(o.taskType, t);
  }
  if (byType.size === 0) return "Founder Twin: learning (0 observations). Every approve/reject teaches it.";
  const parts = [...byType.entries()].map(([type, t]) =>
    t.n >= MIN_OBSERVATIONS
      ? `${type}: ${Math.round((t.approvals / t.n) * 100)}% approval (n=${t.n})`
      : `${type}: learning (n=${t.n})`,
  );
  return `Founder Twin: ${parts.join(" · ")}`;
}

/* ── CLI: record a decision and update the queue ─────────────────── */
const [, , cmd, taskId, ...noteParts] = process.argv;
if (cmd === "approve" || cmd === "reject") {
  if (!taskId) { console.error("usage: founder.mjs approve|reject <taskId> [note]"); process.exit(1); }
  let queue = loadQueue();
  const item = queue.items.find((i) => i.id === taskId);
  if (!item) { console.error(`task not found in queue: ${taskId}`); process.exit(1); }

  const latencyDays = item.firstSeen
    ? Math.round(((Date.now() - new Date(item.firstSeen).getTime()) / 864e5) * 10) / 10
    : null;

  const model = recordDecision(loadModel(), {
    taskId,
    taskType: item.id.startsWith("coverage") ? "coverage-gap" : (item.capability ?? "unknown"),
    worker: item.worker,
    decision: cmd === "approve" ? "approve" : "reject",
    latencyDays,
    note: noteParts.join(" ") || null,
  });
  saveModel(model);

  queue = markStatus(queue, taskId, cmd === "approve" ? "approved" : "dropped",
    cmd === "approve" ? "founder approved" : `founder rejected: ${noteParts.join(" ") || "no reason given"}`);
  saveQueue(queue);
  console.log(`[founder-twin] recorded ${cmd} for ${taskId} (latency ${latencyDays}d). ${twinSummary(model)}`);
}
