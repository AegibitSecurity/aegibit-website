/**
 * Outbound cold-email draft generator. Tier T1.
 *
 * Generates `OUTBOUND_DRAFTS_PER_RUN` (default 5) personalized cold-email
 * drafts per run, picking unseen companies from `automation/data/icp-seed.json`.
 *
 * Output: a single markdown file at automation/reports/outbound/<date>.md
 * containing every draft for that run, formatted for human review. The
 * companion GitHub Action opens a PR with this file (NO auto-merge —
 * Rahul reviews before any send).
 *
 * Why drafts and not auto-send:
 *   - Auto-send is tier T3 (touches money / business relationships) per
 *     AUTOMATION_POLICY. Aira authors, Rahul approves and sends.
 *   - Email-finding is a paid service (Hunter.io / Apollo etc.) and we
 *     are zero-spend. Each ICP entry has firstName + role + domain;
 *     Rahul does the email lookup before sending. Drafts are 80% of the
 *     work (subject + body + personalization); the lookup is 20%.
 *   - Compliance: drafts are reviewed against DPDP / GDPR / CAN-SPAM by
 *     Rahul before any contact happens. Templates here include a clear
 *     unsubscribe-equivalent ("just reply 'no thanks' and you'll never
 *     hear from us again") so the cold outreach stays clean.
 *
 * Personalization model:
 *   - One template skeleton with {slots}.
 *   - Industry-specific hook variants (HOOK_BY_INDUSTRY).
 *   - Pain signal verbatim from the seed (recipient sees we did our
 *     homework). NOT inferred — only what the operator wrote.
 *
 * State tracking:
 *   - state.metrics.usedOutboundCompanies: array of company strings
 *     already drafted. Same company never re-drafted.
 *   - When the seed is exhausted, the script logs a warning and exits
 *     cleanly — Rahul tops up the seed file with new ICPs.
 */

import fs from "node:fs";
import path from "node:path";
import { ROOT, AUTOMATION_DIR, loadState, saveState, log, withJob, ensureDir } from "./_lib.mjs";

const DRAFTS_PER_RUN = (() => {
  const v = parseInt(process.env.OUTBOUND_DRAFTS_PER_RUN ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : 5;
})();

const SEED_PATH = path.join(AUTOMATION_DIR, "data", "icp-seed.json");
const REPORT_DIR = path.join(AUTOMATION_DIR, "reports", "outbound");

// Industry-specific hook openings. The hook is the FIRST sentence the
// recipient reads — it has to feel hand-typed for a specific company.
// Each value is a function so the closure can use the seed entry's
// painSignal verbatim. NEVER fabricate a signal — only render what the
// operator wrote.
const HOOK_BY_INDUSTRY = {
  automotive: ({ company, painSignal }) =>
    `Saw that ${company} ${painSignal} — congrats. The thing nobody tells you about scaling past 5 branches: branch-level expense visibility breaks before the headcount does.`,
  pharma: ({ company, painSignal }) =>
    `Quick note — ${company} ${painSignal}. Distributor compliance audits in this segment have gone from quarterly to monthly in the past 18 months, and most multi-warehouse ops we talk to are still on Excel.`,
  hospitality: ({ company, painSignal }) =>
    `${company} ${painSignal} — that's the textbook signal of cash leakage from petty-cash drift. Across our customer base, multi-outlet F&B loses ₹4–8 lakh/year per outlet to "miscellaneous" line items.`,
  fintech: ({ company, painSignal }) =>
    `Quick context — ${company} ${painSignal}. Fintech operators we work with hit a recurring wall around 50 employees: SOC2 needs centralized expense + vendor data, Excel doesn't, and consultants quote ₹15L for what's mostly software work.`,
  healthcare: ({ company, painSignal }) =>
    `${company} ${painSignal} — that's the inflection point where most multi-clinic groups discover their audit trail isn't actually an audit trail.`,
  retail: ({ company, painSignal }) =>
    `${company} ${painSignal} — the moment a retail chain crosses 5 branches, manual reconciliation becomes the bottleneck nobody assigned themselves to fix.`,
  generic: ({ company, painSignal }) =>
    `${company} ${painSignal}. That's a signal we recognize — multi-branch operators usually hit a visibility wall right around this stage.`,
};

const TEMPLATE = ({ firstName, hookLine, signoffLine }) => `Subject: A 12-min question about how ${"{company}"} runs branch expenses

Hi ${firstName},

${hookLine}

We built PayMint for exactly this — multi-branch expense capture with same-day visibility, audit-grade trail, and a 30-second voucher capture flow that branch managers actually use. One of our customers (Nibir Motors, 7 dealerships in West Bengal) reclaimed 12 hrs/week and went 100% audit-ready in 30 days.

I'm not asking for a meeting yet. ${signoffLine}

If this isn't a fit, just reply "no thanks" and I'll never email you again.

Best,
Rahul Mondal
Co-founder, AEGIBIT
www.aegibit.com
`;

// Soft-CTA variants (rotate per draft so the inbox doesn't see a pattern
// across multiple recipients at the same company).
const SIGNOFFS = [
  "Worth a 12-minute call to see if PayMint fits how you actually run branch ops?",
  "Curious enough to see a 4-minute Loom of how Nibir Motors uses it day-to-day?",
  "If you're free, I'd love to send you a 1-page case study from a dealer group your size.",
  "Open to a 12-min call this or next week to see whether the wedge is real for you?",
];

function rotate(arr, key) {
  // Deterministic but per-recipient rotation: same company always gets
  // the same signoff if drafted twice (it won't, dedupe ensures that).
  let h = 0;
  for (let i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  return arr[Math.abs(h) % arr.length];
}

function loadSeed() {
  if (!fs.existsSync(SEED_PATH)) {
    throw new Error(`ICP seed missing at ${SEED_PATH}. Populate before running.`);
  }
  const json = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  if (!Array.isArray(json.companies)) {
    throw new Error(`ICP seed malformed — expected { companies: [...] }`);
  }
  // Safety: skip placeholder examples that ship with the scaffolding.
  // The first cron run after merge will see only placeholders, and
  // we'd rather no-op than spam the repo with PRs full of drafts to
  // "Example Multi-Branch Auto Co". When Rahul replaces the examples
  // with real ICPs (no "Example " prefix), drafts start flowing.
  return json.companies.filter((e) => !String(e.company ?? "").startsWith("Example "));
}

function buildDraft(entry) {
  const hookFn = HOOK_BY_INDUSTRY[entry.industry] ?? HOOK_BY_INDUSTRY.generic;
  const hookLine = hookFn(entry);
  const signoffLine = rotate(SIGNOFFS, `${entry.company}|${entry.role}`);
  const body = TEMPLATE({
    firstName: entry.firstName,
    hookLine,
    signoffLine,
  }).replaceAll("{company}", entry.company);
  return body;
}

function renderReport(date, drafts) {
  const header = [
    `# Outbound drafts — ${date}`,
    "",
    `> ${drafts.length} draft${drafts.length === 1 ? "" : "s"} generated by Aira (tier T1, no-auto-send).`,
    "> Review each draft, find the recipient's email, edit as needed, and send manually.",
    "> Drafts are NOT sent automatically. This file lands in a PR for human review per AUTOMATION_POLICY.",
    "",
    "---",
    "",
  ].join("\n");

  const sections = drafts.map(({ entry, body }, i) => [
    `## ${i + 1}. ${entry.company} — ${entry.role}${entry.city ? ` · ${entry.city}` : ""}`,
    "",
    `**Recipient:** ${entry.firstName} (${entry.role})  `,
    `**Domain:** \`${entry.domain}\`  `,
    `**Pain signal we cited:** ${entry.painSignal}  `,
    `**Operator notes (private):** ${entry.notes ?? "_none_"}`,
    "",
    "```",
    body.trim(),
    "```",
    "",
    "---",
    "",
  ].join("\n"));

  return header + sections.join("\n");
}

await withJob("outbound-draft", async () => {
  const seed = loadSeed();
  const state = loadState();
  const used = new Set(state.metrics?.usedOutboundCompanies ?? []);

  const fresh = seed.filter((e) => !used.has(e.company));
  if (fresh.length === 0) {
    log("outbound-draft", `Seed exhausted (${used.size} companies already drafted). Top up automation/data/icp-seed.json.`, "warn");
    return;
  }

  const picks = fresh.slice(0, DRAFTS_PER_RUN);
  const drafts = picks.map((entry) => ({ entry, body: buildDraft(entry) }));

  const date = new Date().toISOString().split("T")[0];
  const report = renderReport(date, drafts);

  ensureDir(REPORT_DIR);
  const reportPath = path.join(REPORT_DIR, `${date}.md`);
  fs.writeFileSync(reportPath, report);

  log("outbound-draft", `Wrote ${drafts.length} drafts to ${path.relative(ROOT, reportPath)}`);

  state.metrics ??= {};
  state.metrics.usedOutboundCompanies = [
    ...(state.metrics.usedOutboundCompanies ?? []),
    ...picks.map((e) => e.company),
  ];
  state.metrics.outboundDraftsTotal = (state.metrics.outboundDraftsTotal ?? 0) + drafts.length;
  saveState(state);
});
