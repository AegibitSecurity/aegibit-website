/**
 * PayMint Snapshot, Groq narrative layer.
 *
 * Takes a Snapshot and asks Groq Llama 3.3 70B to produce a calm,
 * 3-paragraph operator summary in AEGIBIT brand voice. The
 * narrative tells the visitor:
 *
 *   Para 1: what the data actually demonstrates (counts, ranges,
 *           top branches)
 *   Para 2: where the operational risk shows up (variance,
 *           anomalies, missing-branch rows)
 *   Para 3: which PayMint capability addresses each risk, in
 *           one sentence, never pitching beyond what the data
 *           justifies
 *
 * Privacy: Groq sees ONLY the aggregated Snapshot, never the raw
 * rows or particulars. The buyer can paste real CSVs without their
 * line-level transactions ever leaving the request boundary.
 * Pinned by explain.test.ts.
 */

import type { Snapshot } from "./types";

const MODEL = "llama-3.3-70b-versatile";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are PayMint Snapshot's plain-English explainer. You translate a structured branch-expense snapshot into a calm, three-paragraph operator summary in AEGIBIT brand voice.

VOICE
- Calm authority. No hyperbole. No exclamation marks.
- Specific over generic: name the actual branches, dates, anomaly counts.
- Two-to-three sentences per paragraph. 110-160 words total.
- Never invent numbers the snapshot doesn't contain.
- Never claim PayMint will reduce a number by a specific amount.

PARAGRAPH 1, What this data shows
- State the row count, branch count, and date range.
- Name the top branch by total spend.

PARAGRAPH 2, Where the operational risk is
- If branch variance CV > 0.5, say "concentration risk" and name it.
- If there are anomalies, state the count and the top branch they cluster in.
- If rows_missing_branch > 0, call it out as "rows without a branch tag", the audit gap PayMint closes.

PARAGRAPH 3, Where PayMint fits
- One sentence per risk identified above, naming the PayMint capability that addresses it (branch-coded voucher capture, real-time sync, audit-grade attribution, Tally-ready exports).
- End with: "For a 12-minute walkthrough on your real numbers, request a PayMint demo."

NEVER include code blocks, markdown, bullet lists, or quote characters in your output. Plain prose only.`;

export async function explainSnapshot(snapshot: Snapshot): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const userMessage = buildPrompt(snapshot);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.2,
      }),
    });
    if (!res.ok) {
      console.error(`[paymint-snapshot/explain] Groq ${res.status}`);
      return null;
    }
    type GroqResp = { choices?: { message?: { content?: string } }[] };
    const data: GroqResp = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    return raw.trim() || null;
  } catch (err) {
    console.error(
      "[paymint-snapshot/explain] network error:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}

/**
 * Build the user message for Groq. Pure function, exported for
 * testing. Includes ONLY structural aggregates; never raw row data.
 *
 * Privacy contract: this function's output is the entire surface
 * Groq sees. If a visitor's CSV contains sensitive line items, those
 * must never appear in this string. See explain.test.ts for the
 * pinned assertion.
 */
export function buildPrompt(snapshot: Snapshot): string {
  const dr = snapshot.date_range
    ? `${snapshot.date_range.first} to ${snapshot.date_range.last}`
    : "no parseable dates";

  const topBranches = snapshot.top_branches
    .slice(0, 3)
    .map(
      (b) =>
        `${b.branch} (${b.row_count} rows, total INR ${b.total_amount.toLocaleString("en-IN")})`,
    )
    .join("; ");

  const anomalyHeadline =
    snapshot.anomalies.length === 0
      ? "0 statistical outliers (per-branch |Z| >= 2.0)"
      : `${snapshot.anomalies.length} statistical outlier(s) (per-branch |Z| >= 2.0), top in branch ${
          snapshot.anomalies[0].branch ?? "(unknown)"
        }`;

  const varianceLine =
    snapshot.branch_variance_cv === null
      ? "Branch variance: not computable (fewer than 2 branches)"
      : `Branch variance CV: ${snapshot.branch_variance_cv.toFixed(2)} ${snapshot.branch_variance_cv > 0.5 ? "(high, concentration risk)" : "(within normal range)"}`;

  return [
    `Rows parsed: ${snapshot.rows_parsed}`,
    `Distinct branches: ${snapshot.branches_distinct}`,
    `Date range: ${dr}`,
    `Total spend: INR ${snapshot.total_spend.toLocaleString("en-IN")}`,
    `Top branches by spend: ${topBranches || "(none)"}`,
    varianceLine,
    anomalyHeadline,
    `Rows missing branch attribution: ${snapshot.rows_missing_branch}`,
  ].join("\n");
}
