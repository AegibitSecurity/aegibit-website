/**
 * AGOS Work Queue. The scaling problem is not generating ideas, it is
 * choosing among hundreds of good ones. The queue holds every accepted
 * task ranked by priority so AGOS (and Rahul's briefing) always answer
 * one question: "what is the single highest-ROI action right now?"
 *
 * Statuses: auto-approved -> executed | failed
 *           awaiting-approval -> approved (founder) -> executed
 *           anything -> dropped (with reason)
 * Persisted in queue.json (committed, so the queue survives runs and
 * its history is inspectable in git).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const QUEUE_PATH = join(dirname(fileURLToPath(import.meta.url)), "queue.json");

export function loadQueue() {
  if (!existsSync(QUEUE_PATH)) return { items: [] };
  try {
    return JSON.parse(readFileSync(QUEUE_PATH, "utf8"));
  } catch {
    return { items: [] };
  }
}

export function saveQueue(queue) {
  queue.items.sort((a, b) => b.priority - a.priority);
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 1) + "\n", "utf8");
}

/** Merge fresh decisions into the queue (idempotent by task id). */
export function enqueueDecisions(queue, decisions) {
  const byId = new Map(queue.items.map((i) => [i.id, i]));
  for (const d of decisions) {
    if (d.verdict === "reject") continue;
    const status =
      d.verdict === "auto" ? "auto-approved"
      : d.verdict === "defer" ? "deferred"
      : "awaiting-approval";
    const existing = byId.get(d.id);
    if (existing && ["executed", "approved"].includes(existing.status)) continue;
    byId.set(d.id, {
      id: d.id,
      title: d.title,
      worker: d.worker,
      capability: d.capability,
      priority: d.scores.priority,
      confidence: d.confidence,
      etaMinutes: d.etaMinutes,
      status: existing?.status === "awaiting-approval" ? "awaiting-approval" : status,
      firstSeen: existing?.firstSeen ?? d.at,
      updatedAt: d.at,
      timesProposed: (existing?.timesProposed ?? 0) + 1,
    });
  }
  queue.items = [...byId.values()];
  return queue;
}

/** Mark a task's terminal state after execution. */
export function markStatus(queue, id, status, note) {
  const item = queue.items.find((i) => i.id === id);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (note) item.note = note;
  }
  return queue;
}

/** Render the queue as the briefing's markdown table. */
export function renderQueueTable(queue, limit = 8) {
  const active = queue.items
    .filter((i) => !["executed", "dropped", "failed"].includes(i.status))
    .slice(0, limit);
  if (active.length === 0) return "(queue is empty, all caught up)";
  const rows = [
    "| Task | Priority | Confidence | ETA | Status |",
    "| --- | ---: | ---: | ---: | --- |",
    ...active.map((i) =>
      `| ${i.title} | ${i.priority} | ${i.confidence} | ${i.etaMinutes} min | ${i.status} |`,
    ),
  ];
  return rows.join("\n");
}
