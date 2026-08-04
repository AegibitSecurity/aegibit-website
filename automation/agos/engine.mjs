/**
 * AGOS Decision Aggregator (Phase B). The engine is no longer a
 * monolith: judgment lives in the Evaluator Board (evaluators.mjs),
 * weights and thresholds live in config.json (tuned by the Learning
 * Engine within bounds), powers live in the Capability Registry
 * (capabilities.json). This file only ORCHESTRATES:
 *
 *   proposal -> board evaluation -> aggregate under config rules ->
 *   verdict (auto / approve / reject) -> auditable ledger entry
 *
 * Verdict rules, in order:
 *   1. Policy veto            -> reject (compliance is a boundary)
 *   2. Duplicate (30d window) -> reject
 *   3. Value below floor      -> reject (improve existing work instead)
 *   4. auto only when: capability.allowAuto AND not outward AND
 *      risk <= ceiling AND eta <= auto cost ceiling
 *   5. otherwise              -> approve (founder queue)
 */

import { readFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  authorityEvaluator, revenueEvaluator, geoEvaluator,
  riskEvaluator, costEvaluator, policyEvaluator, priorityEvaluator,
} from "./evaluators.mjs";

const AGOS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEDGER_PATH = join(AGOS_DIR, "decisions.jsonl");

export function loadConfig() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "config.json"), "utf8"));
}
export function loadCapabilities() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "capabilities.json"), "utf8")).capabilities;
}

function loadLedgerKeys() {
  if (!existsSync(LEDGER_PATH)) return new Set();
  const keys = new Set();
  for (const line of readFileSync(LEDGER_PATH, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const d = JSON.parse(line);
      if (d.verdict !== "reject" && Date.now() - new Date(d.at).getTime() < 30 * 864e5) {
        keys.add(d.dedupeKey);
      }
    } catch { /* tolerate corrupt lines, ledger is append-only */ }
  }
  return keys;
}

/**
 * Evaluate proposals through the board. Returns decisions with the
 * full per-evaluator breakdown (auditable, and the Learning Engine's
 * raw material).
 */
export function evaluate(proposals) {
  const config = loadConfig();
  const capabilities = loadCapabilities();
  const seen = loadLedgerKeys();
  const { valueWeights, valueFloor, autoRiskCeiling, autoCostCeilingMinutes } = config.aggregator;

  // Board pass 1: independent evaluators per proposal.
  const evaluated = proposals.map((p) => {
    const profile = config.typeProfiles[p.type] ?? config.typeProfiles.default;
    const capability = profile.capability ? capabilities[profile.capability] : null;
    const ctx = { profile, capability };

    const board = {
      authority: authorityEvaluator(p, ctx),
      revenue: revenueEvaluator(p, ctx),
      geo: geoEvaluator(p, ctx),
      risk: riskEvaluator(p, ctx),
      cost: costEvaluator(p, ctx),
      policy: policyEvaluator(p, ctx),
    };

    const value = Math.round(
      valueWeights.authority * board.authority.score +
      valueWeights.geo * board.geo.score +
      valueWeights.revenue * board.revenue.score,
    );
    const etaMinutes = board.cost.etaMinutes ?? 30;
    const valueDensity = value / Math.max(etaMinutes / 60, 0.05);

    return { p, profile, capability, board, value, etaMinutes, valueDensity, id: p.id };
  });

  // Board pass 2: relative priority across the whole batch.
  const priorities = priorityEvaluator(evaluated);

  // Aggregate.
  return evaluated.map(({ p, profile, capability, board, value, etaMinutes, valueDensity }) => {
    const priority = priorities.get(p.id);
    const reasons = [];
    let verdict;

    if (board.policy.veto) {
      verdict = "reject";
      reasons.push(`policy veto: ${board.policy.reasons[0]}`);
    } else if (p.dedupeKey && seen.has(p.dedupeKey)) {
      verdict = "reject";
      reasons.push("duplicate: same dedupeKey accepted within 30 days");
    } else if (value < valueFloor) {
      verdict = "reject";
      reasons.push(`value ${value} below floor ${valueFloor}: improve existing assets instead`);
    } else if (
      capability?.allowAuto && !p.outward &&
      board.risk.score <= autoRiskCeiling && etaMinutes <= autoCostCeilingMinutes
    ) {
      verdict = "auto";
      reasons.push(`capability "${profile.capability}" allows auto, risk ${board.risk.score} <= ${autoRiskCeiling}, eta ${etaMinutes}m <= ${autoCostCeilingMinutes}m`);
    } else {
      verdict = "approve";
      reasons.push(
        p.outward
          ? "outward-facing: founder approval required (governance rule 4)"
          : capability && !capability.allowAuto
            ? `capability "${profile.capability}" is PR/founder-gated by registry`
            : `risk ${board.risk.score} or cost ${etaMinutes}m exceeds auto ceilings`,
      );
    }

    // Confidence of the decision = weakest confidence on the axes that
    // mattered. Honest aggregate: a chain is as sure as its least-sure link.
    const confidence = Math.min(
      board.authority.confidence, board.geo.confidence,
      board.revenue.confidence, board.risk.confidence,
    );

    return {
      at: new Date().toISOString(),
      id: p.id,
      worker: p.worker,
      type: p.type,
      capability: profile.capability,
      title: p.title,
      dedupeKey: p.dedupeKey ?? null,
      scores: {
        authority: board.authority.score,
        geo: board.geo.score,
        revenue: board.revenue.score,
        risk: board.risk.score,
        cost: board.cost.score,
        priority: priority?.score ?? 50,
        value,
        automation: verdict === "auto" ? 90 : verdict === "approve" ? 50 : 0,
      },
      confidence,
      etaMinutes,
      board: Object.fromEntries(
        Object.entries(board).map(([k, v]) => [k, { score: v.score, confidence: v.confidence, reasons: v.reasons }]),
      ),
      priorityReasons: priority?.reasons ?? [],
      verdict,
      reasons,
      outcome: null,
    };
  });
}

/** Append decisions to the auditable ledger. */
export function commitDecisions(decisions) {
  mkdirSync(dirname(LEDGER_PATH), { recursive: true });
  const lines = decisions.map((d) => JSON.stringify(d)).join("\n") + "\n";
  appendFileSync(LEDGER_PATH, lines, "utf8");
}
