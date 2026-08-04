/**
 * AGOS Asset Registry. Most systems forget after execution; AGOS
 * remembers forever. Every completed task becomes an ASSET with a
 * lifecycle and metric slots, so the company manages a portfolio of
 * measurable things, not a folder of forgotten files.
 *
 * Lifecycle (Rahul's Phase C):
 *   idea -> proposal -> approved -> executing -> completed ->
 *   observed -> measured -> learned -> archived
 * The queue covers proposal..executing; the registry owns
 * completed..archived. Metric slots stay null until real measurement
 * (GSC/analytics wiring) fills them, honest empty over invented.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ASSETS_PATH = join(dirname(fileURLToPath(import.meta.url)), "assets.json");

export function loadAssets() {
  if (!existsSync(ASSETS_PATH)) return { assets: [] };
  try { return JSON.parse(readFileSync(ASSETS_PATH, "utf8")); } catch { return { assets: [] }; }
}

export function saveAssets(reg) {
  writeFileSync(ASSETS_PATH, JSON.stringify(reg, null, 1) + "\n", "utf8");
}

/**
 * Register (or touch) the asset a completed task produced.
 * assetKey keeps re-executions (like weekly KB refreshes) as ONE
 * asset with an update history, not a pile of duplicates.
 */
export function recordAsset(reg, { assetKey, type, title, paths, taskId, strategicChain }) {
  const now = new Date().toISOString();
  let asset = reg.assets.find((a) => a.assetKey === assetKey);
  if (asset) {
    asset.lastRefreshed = now;
    asset.refreshCount = (asset.refreshCount ?? 0) + 1;
    asset.sourceTasks = [...new Set([...(asset.sourceTasks ?? []), taskId])];
    asset.lifecycle = "completed";
  } else {
    asset = {
      assetId: `${type.toUpperCase()}-${now.slice(0, 10)}-${String(reg.assets.length + 1).padStart(3, "0")}`,
      assetKey,
      type,
      title,
      paths: paths ?? [],
      createdAt: now,
      lastRefreshed: now,
      refreshCount: 0,
      sourceTasks: [taskId],
      strategicChain: strategicChain ?? null,
      owner: "aira",
      lifecycle: "completed",
      metrics: {
        traffic: null, impressions: null, conversions: null,
        revenueGenerated: null, aiCitations: null, internalLinks: null,
      },
      measuredAt: null,
    };
    reg.assets.push(asset);
  }
  return asset;
}

/** Advance an asset's lifecycle stage (observed -> measured -> learned -> archived). */
export function advanceLifecycle(reg, assetKey, stage, note) {
  const asset = reg.assets.find((a) => a.assetKey === assetKey);
  if (asset) {
    asset.lifecycle = stage;
    asset.lifecycleNote = note ?? asset.lifecycleNote;
    if (stage === "measured") asset.measuredAt = new Date().toISOString();
  }
  return reg;
}
