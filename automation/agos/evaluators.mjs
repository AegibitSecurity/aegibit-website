/**
 * The AGOS Evaluator Board (Rahul's refinement, 2026-08-04): the
 * Decision Engine is not a monolith, it is a board of specialized
 * evaluators, each with ONE responsibility, each independently
 * evolvable, combined by the aggregator under configurable weights.
 *
 * Contract: every evaluator returns { score, confidence, reasons }.
 *   score       0-100 on the evaluator's own axis
 *   confidence  0-100, how much data backs this judgment (heuristics
 *               on a young company are honest about being heuristics;
 *               confidence rises as the Learning Engine feeds real
 *               outcome data back in)
 *   reasons     human-readable rationale, always logged
 * The Policy evaluator alone may VETO ({ veto: true }), compliance is
 * not a weighted preference, it is a boundary.
 */

/* ── Authority: does this deepen provable expertise? ─────────────── */
export function authorityEvaluator(p, ctx) {
  const base = ctx.profile.authority;
  const reasons = [`type baseline ${base}`];
  let score = base;
  if (/glossary|definition|whitepaper|case stud|research/i.test(p.title)) {
    score = Math.min(100, score + 8);
    reasons.push("reference-grade format (+8)");
  }
  return { score, confidence: 70, reasons };
}

/* ── Revenue: plausible path to money? ───────────────────────────── */
export function revenueEvaluator(p, ctx) {
  const base = ctx.profile.revenue;
  const reasons = [`type baseline ${base}`];
  // Honesty: without conversion history, revenue is the least certain
  // axis. Low confidence until the Learning Engine has outcome data.
  return { score: base, confidence: 40, reasons };
}

/* ── GEO: does this improve AI discoverability / entity strength? ── */
export function geoEvaluator(p, ctx) {
  const base = ctx.profile.geo;
  const reasons = [`type baseline ${base}`];
  let score = base;
  if (/noindex|schema|llms|entity|faq/i.test(p.title + " " + p.detail)) {
    score = Math.min(100, score + 6);
    reasons.push("direct machine-readability improvement (+6)");
  }
  return { score, confidence: 65, reasons };
}

/* ── Risk: legal, security, hallucination, copyright, spam ───────── */
export function riskEvaluator(p) {
  let score = 10;
  const reasons = [];
  if (p.outward) { score += 30; reasons.push("outward-facing (+30)"); }
  if (p.irreversible) { score += 40; reasons.push("irreversible (+40)"); }
  if ((p.detail || "").length < 20) { score += 10; reasons.push("thin spec (+10)"); }
  if (/client|customer.*data|personal/i.test(p.detail)) {
    score += 20; reasons.push("touches personal/client data (+20)");
  }
  if (reasons.length === 0) reasons.push("internal, reversible, well-specified");
  return { score: Math.min(score, 100), confidence: 85, reasons };
}

/* ── Cost: compute, API, and engineering-time expense ────────────── */
export function costEvaluator(p, ctx) {
  const eta = ctx.profile.etaMinutes ?? 30;
  // Score is cheapness: quick actions score high. All current
  // capabilities are zero-cash (free tiers), so time is the cost axis.
  const score = eta <= 10 ? 95 : eta <= 30 ? 75 : eta <= 90 ? 50 : 25;
  return {
    score,
    confidence: 80,
    reasons: [`estimated ${eta} min, zero cash cost (free-tier stack)`],
    etaMinutes: eta,
  };
}

/* ── Policy: constitutional compliance (VETO power) ──────────────── */
/**
 * The Policy evaluator does not "remember" rules, it READS THE
 * CONSTITUTION. Machine-checkable gates live in dna.json
 * (machineGates); this code only enforces them, plus two structural
 * gates that are shape-based rather than text-based. Amending policy
 * = amending the DNA file under founder review, never editing code.
 */
const STRUCTURAL_GATES = [
  {
    id: "no-autopost-social",
    hits: (p) => p.type === "social-post" && p.execution === "auto",
    reason: "DNA security standard: human approval required for external publishing. Draft only.",
  },
];

export function policyEvaluator(p, ctx) {
  const text = p.title + " " + p.detail;
  for (const g of ctx.dna?.machineGates ?? []) {
    if (new RegExp(g.pattern, "i").test(text)) {
      return { veto: true, score: 0, confidence: 100, reasons: [`[${g.id}] ${g.reason}`] };
    }
  }
  const gate = STRUCTURAL_GATES.find((g) => g.hits(p));
  if (gate) {
    return { veto: true, score: 0, confidence: 100, reasons: [`[${gate.id}] ${gate.reason}`] };
  }
  if (!ctx.capability) {
    return {
      veto: true, score: 0, confidence: 100,
      reasons: [`unregistered capability for type "${p.type}", register it in capabilities.json first`],
    };
  }
  return { score: 100, confidence: 100, reasons: ["passes constitutional gates (dna.json) and registry"] };
}

/* ── Strategic Alignment: does this serve THIS quarter? ──────────── */
/**
 * A company does not optimize forever, it optimizes for the current
 * quarter (objectives.json). Tasks matching active objectives outrank
 * generically-good work.
 */
export function alignmentEvaluator(p, ctx) {
  const text = (p.title + " " + p.detail + " " + p.type).toLowerCase();
  const hits = (ctx.objectives?.objectives ?? []).filter((o) =>
    o.keywords.some((k) => text.includes(k.toLowerCase())),
  );
  if (hits.length === 0) {
    return { score: 30, confidence: 70, reasons: ["matches no current-quarter objective (generic value only)"] };
  }
  const score = Math.min(100, 55 + hits.length * 20);
  return {
    score,
    confidence: 75,
    reasons: [`serves ${hits.length} objective(s): ${hits.map((h) => h.id).join(", ")}`],
  };
}

/* ── Priority: highest-value action relative to everything waiting ─ */
/**
 * Unlike the others, priority is RELATIVE: it runs over the whole
 * batch plus the standing queue. Value density = weighted value per
 * unit time, so a 2-minute schema fix can outrank a 90-minute build.
 */
export function priorityEvaluator(items, objectives) {
  const mode = objectives?.mode ?? "growth";
  const mult = objectives?.modes?.[mode] ?? {};
  const workerKey = (w) => ({ geo: "geo", seo: "seo", content: "content", sales: "sales", product: "product" }[w] ?? "ops");
  for (const item of items) {
    const m = mult[workerKey(item.worker)] ?? 1;
    item.valueDensity = item.valueDensity * m;
    item.modeMultiplier = m;
  }
  const ranked = [...items].sort((a, b) => b.valueDensity - a.valueDensity);
  const n = ranked.length;
  const out = new Map();
  ranked.forEach((item, i) => {
    const score = n === 1 ? 90 : Math.round(95 - (i * 70) / Math.max(1, n - 1));
    out.set(item.id, {
      score,
      confidence: 75,
      reasons: [`rank ${i + 1}/${n} by value density ${item.valueDensity.toFixed(1)}/hr (mode x${item.modeMultiplier ?? 1})`],
    });
  });
  return out;
}
