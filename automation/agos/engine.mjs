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
  alignmentEvaluator,
} from "./evaluators.mjs";

const AGOS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEDGER_PATH = join(AGOS_DIR, "decisions.jsonl");

export function loadConfig() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "config.json"), "utf8"));
}
export function loadCapabilities() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "capabilities.json"), "utf8")).capabilities;
}
export function loadDNA() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "dna.json"), "utf8"));
}
export function loadObjectives() {
  return JSON.parse(readFileSync(join(AGOS_DIR, "objectives.json"), "utf8"));
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
  const dna = loadDNA();
  const objectives = loadObjectives();
  const seen = loadLedgerKeys();
  const { valueWeights, valueFloor, autoRiskCeiling, autoCostCeilingMinutes } = config.aggregator;
  // Resource awareness: value asks "is it worth it", resources ask
  // "can we afford it TODAY". Budgets consumed in priority order.
  let founderBudget = objectives.resources?.weeklyFounderMinutes ?? 120;
  let buildBudget = objectives.resources?.weeklyBuildMinutes ?? 900;

  // Board pass 1: independent evaluators per proposal.
  const evaluated = proposals.map((p) => {
    const profile = config.typeProfiles[p.type] ?? config.typeProfiles.default;
    const capability = profile.capability ? capabilities[profile.capability] : null;
    const ctx = { profile, capability, dna, objectives };

    const board = {
      authority: authorityEvaluator(p, ctx),
      revenue: revenueEvaluator(p, ctx),
      geo: geoEvaluator(p, ctx),
      risk: riskEvaluator(p, ctx),
      cost: costEvaluator(p, ctx),
      policy: policyEvaluator(p, ctx),
      alignment: alignmentEvaluator(p, ctx),
    };

    // Strategic alignment shapes value: a task serving this quarter's
    // objectives outranks slightly-better generic ROI (DNA principle).
    const alignW = config.aggregator.alignmentWeight ?? 0.25;
    const value = Math.round(
      (1 - alignW) * (
        valueWeights.authority * board.authority.score +
        valueWeights.geo * board.geo.score +
        valueWeights.revenue * board.revenue.score
      ) + alignW * board.alignment.score,
    );
    const etaMinutes = board.cost.etaMinutes ?? 30;
    const valueDensity = value / Math.max(etaMinutes / 60, 0.05);

    return { p, profile, capability, board, value, etaMinutes, valueDensity, id: p.id };
  });

  // Board pass 2: relative priority across the whole batch.
  const priorities = priorityEvaluator(evaluated, objectives);

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
      (capability?.dependencies ?? []).some((dep) => typeof dep === "string" && dep.startsWith("founder:"))
    ) {
      verdict = "defer";
      reasons.push(`dependency not met: ${(capability.dependencies).find((d) => d.startsWith("founder:"))}`);
    } else if (p.dependsOn && p.dependsOn.length > 0) {
      verdict = "defer";
      reasons.push(`depends on unfinished task(s): ${p.dependsOn.join(", ")}`);
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

    // Resource awareness: even a good verdict defers when this week's
    // capacity is spent. Approvals cost founder minutes (est. 5 each)
    // plus build time; autos cost build time only.
    if (verdict === "auto" || verdict === "approve") {
      const founderCost = verdict === "approve" ? 5 : 0;
      if (verdict === "approve" && founderBudget - founderCost < 0) {
        verdict = "defer";
        reasons.unshift("founder attention budget exhausted this week: deferred to protect the scarcest resource");
      } else if (buildBudget - etaMinutes < 0) {
        verdict = "defer";
        reasons.unshift(`build capacity exhausted this week (${buildBudget}m left < ${etaMinutes}m needed)`);
      } else {
        founderBudget -= founderCost;
        buildBudget -= etaMinutes;
      }
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
        alignment: board.alignment.score,
        priority: priority?.score ?? 50,
        value,
        automation: verdict === "auto" ? 90 : verdict === "approve" ? 50 : 0,
      },
      confidence,
      etaMinutes,
      // Evidence Layer: every score points to its evidence, decisions
      // are explainable and auditable forever, not just numeric.
      evidence: Object.fromEntries(
        Object.entries(board).map(([k, v]) => [k, { score: v.score, confidence: v.confidence, evidence: v.reasons }]),
      ),
      strategicChain: board.alignment.chain ?? null,
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
