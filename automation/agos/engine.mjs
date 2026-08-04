/**
 * AGOS Decision Engine, the evaluation gate of AEGIBIT's Autonomous
 * Growth Operating System (Rahul's architecture, 2026-08-02).
 *
 * PRINCIPLE
 * Nothing executes because a cron fired. Every proposed action is
 * scored, policy-gated, dedupe-checked, and either:
 *   - "auto"    cleared for autonomous execution (safe, reversible,
 *               inside existing guardrails like PR + CI gates),
 *   - "approve" queued for Rahul (outward-facing or judgment calls),
 *   - "reject"  refused, with the reason logged.
 * Every verdict lands in an append-only ledger with its full scoring
 * rationale, the system must be auditable, not vibes.
 *
 * HONESTY CONTRACT FOR SCORES
 * At our scale (weeks of GSC data) precise traffic predictions would
 * be pseudo-science. Scores are 0-100 HEURISTICS with the reasoning
 * attached, coarse but honest. The feedback loop (Phase B: measure
 * shipped actions against GSC/analytics) recalibrates these weights
 * with real data as it accumulates.
 *
 * Score axes (per Rahul's spec):
 *   authority  does it deepen provable expertise?
 *   geo        does it improve AI-model citability?
 *   revenue    plausible path to money?
 *   risk       policy gate (DPDP/GDPR, copyright, spam, security,
 *              honesty). HIGH RISK ALWAYS WINS: any hard-gate hit
 *              rejects regardless of other scores.
 *   automation composite: should this run without a human?
 */

import { readFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AGOS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEDGER_PATH = join(AGOS_DIR, "decisions.jsonl");

/* ------------------------------------------------------------------ */
/* Policy gates (hard rules, encode governance + covenants)            */
/* ------------------------------------------------------------------ */

const HARD_GATES = [
  {
    id: "no-contact-scraping",
    hits: (p) => /scrape|harvest.*(email|phone|contact)|enrich.*person/i.test(p.title + " " + p.detail),
    reason: "Personal-contact harvesting violates DPDP/GDPR posture and platform ToS.",
  },
  {
    id: "no-autopost-social",
    hits: (p) => p.type === "social-post" && p.execution === "auto",
    reason: "Outward social publishing is founder-gated (governance rule 4). Draft only.",
  },
  {
    id: "no-invented-claims",
    hits: (p) => /fake|invent|fabricat|backfill.*(count|metric|review)/i.test(p.title + " " + p.detail),
    reason: "Honesty covenant: no fabricated metrics, reviews, or claims. Ever.",
  },
  {
    id: "no-paid-tools",
    hits: (p) => /ahrefs|semrush|paid api|credit card|subscription/i.test(p.detail),
    reason: "Zero-spend policy: no paid tooling without explicit founder approval.",
  },
];

/* ------------------------------------------------------------------ */
/* Heuristic scoring by proposal type                                  */
/* ------------------------------------------------------------------ */

const TYPE_PROFILES = {
  // Refreshing Aira's knowledge index: pure infrastructure, reversible,
  // inside CI guardrails. The canonical safe-auto action.
  "kb-refresh":      { authority: 40, geo: 80, revenue: 20, autoSafe: true },
  // New grounded content on an existing noindexed section: flips dead
  // pages into indexable, citable assets. High authority + GEO.
  "coverage-gap":    { authority: 85, geo: 90, revenue: 55, autoSafe: false },
  // Refresh of an aging article: cheaper than new content, protects
  // existing rankings. Google rewards freshness.
  "stale-refresh":   { authority: 60, geo: 55, revenue: 60, autoSafe: false },
  // Daily editorial article via the existing content pipeline (which
  // already ships behind a PR + CI gate + auto-merge policy).
  "daily-content":   { authority: 70, geo: 65, revenue: 55, autoSafe: true },
  // Outward-facing drafts: valuable but always founder-gated.
  "social-post":     { authority: 30, geo: 25, revenue: 70, autoSafe: false },
  "outreach-draft":  { authority: 10, geo: 5,  revenue: 90, autoSafe: false },
  // Fallback for unknown types: conservative, never auto.
  "default":         { authority: 30, geo: 30, revenue: 30, autoSafe: false },
};

function riskScore(p) {
  // Higher = riskier. Starts low; outward-facing and irreversible
  // actions carry structural risk.
  let score = 10;
  const reasons = [];
  if (p.outward) { score += 30; reasons.push("outward-facing (+30)"); }
  if (p.irreversible) { score += 40; reasons.push("irreversible (+40)"); }
  if ((p.detail || "").length < 20) { score += 10; reasons.push("thin specification (+10)"); }
  return { score: Math.min(score, 100), reasons };
}

/* ------------------------------------------------------------------ */
/* Dedupe against the ledger                                           */
/* ------------------------------------------------------------------ */

function loadLedgerKeys() {
  if (!existsSync(LEDGER_PATH)) return new Set();
  const keys = new Set();
  for (const line of readFileSync(LEDGER_PATH, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const d = JSON.parse(line);
      // A proposal is duplicate work if the same dedupeKey was accepted
      // (auto or approve) in the last 30 days.
      if (d.verdict !== "reject" && Date.now() - new Date(d.at).getTime() < 30 * 864e5) {
        keys.add(d.dedupeKey);
      }
    } catch { /* tolerate a corrupt line, the ledger is append-only */ }
  }
  return keys;
}

/* ------------------------------------------------------------------ */
/* The evaluation                                                      */
/* ------------------------------------------------------------------ */

/**
 * Evaluate proposals -> decisions. Pure-ish (reads ledger for dedupe);
 * append happens in commitDecisions so tests can evaluate dry.
 *
 * Proposal shape: { id, type, worker, title, detail, dedupeKey,
 *                   outward?, irreversible?, execution? }
 */
export function evaluate(proposals) {
  const seen = loadLedgerKeys();
  const decisions = [];

  for (const p of proposals) {
    const profile = TYPE_PROFILES[p.type] ?? TYPE_PROFILES.default;
    const risk = riskScore(p);
    const reasons = [];
    let verdict;

    // 1. Hard policy gates: one hit = rejected, no negotiation.
    const gate = HARD_GATES.find((g) => g.hits(p));
    if (gate) {
      verdict = "reject";
      reasons.push(`policy gate [${gate.id}]: ${gate.reason}`);
    }
    // 2. Duplicate work check.
    else if (p.dedupeKey && seen.has(p.dedupeKey)) {
      verdict = "reject";
      reasons.push("duplicate: same dedupeKey accepted within 30 days");
    }
    // 3. Worth doing at all? (composite value floor)
    else {
      const value = Math.round(
        0.35 * profile.authority + 0.35 * profile.geo + 0.3 * profile.revenue,
      );
      if (value < 35) {
        verdict = "reject";
        reasons.push(`value floor: composite ${value} < 35, improve existing assets instead`);
      } else if (profile.autoSafe && !p.outward && risk.score <= 25) {
        verdict = "auto";
        reasons.push(`auto-safe type, risk ${risk.score} <= 25, runs inside PR/CI guardrails`);
      } else {
        verdict = "approve";
        reasons.push(
          p.outward
            ? "outward-facing: founder approval required (governance rule 4)"
            : `risk ${risk.score} or type requires judgment: queued for founder`,
        );
      }
    }

    decisions.push({
      at: new Date().toISOString(),
      id: p.id,
      worker: p.worker,
      type: p.type,
      title: p.title,
      dedupeKey: p.dedupeKey ?? null,
      scores: {
        authority: profile.authority,
        geo: profile.geo,
        revenue: profile.revenue,
        risk: risk.score,
        automation: verdict === "auto" ? 90 : verdict === "approve" ? 50 : 0,
      },
      riskReasons: risk.reasons,
      verdict,
      reasons,
    });
  }
  return decisions;
}

/** Append decisions to the auditable ledger. */
export function commitDecisions(decisions) {
  mkdirSync(dirname(LEDGER_PATH), { recursive: true });
  const lines = decisions.map((d) => JSON.stringify(d)).join("\n") + "\n";
  appendFileSync(LEDGER_PATH, lines, "utf8");
}
