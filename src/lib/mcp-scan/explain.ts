/**
 * MCP Shield web-scanner — Groq narrative layer.
 *
 * Takes a structured ScanResult and asks Groq Llama 3.3 70B to
 * produce a plain-English 2-paragraph summary for the operator:
 *   1. What the scanner found, ranked by what to fix first.
 *   2. What the manifest looks safe-enough to do.
 *
 * Constraints:
 *   - Best-effort. If GROQ_API_KEY is missing, Groq is over-quota,
 *     or any error occurs, we return null and the caller renders
 *     just the structured findings. The summary is gloss, not
 *     substance.
 *   - Knowledge boundary: Groq sees ONLY the structured findings
 *     and the manifest kind. The raw manifest is NOT included in
 *     the prompt — that's the privacy guarantee for visitors who
 *     paste sensitive configs. Groq cannot hallucinate findings
 *     because it has no manifest to reference.
 *   - Voice: matches the AEGIBIT brand voice — calm authority, no
 *     hyperbole, no exclamation marks. Same system-prompt
 *     discipline as the Aira chatbot.
 */

import type { Finding, ScanResult, Severity } from "./types";

const MODEL = "llama-3.3-70b-versatile";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are AEGIBIT MCP Shield's plain-English explainer. You translate structured security findings into a calm, two-paragraph operator summary.

VOICE
- Calm authority. No hyperbole. No exclamation marks. Two paragraphs maximum.
- Specific over generic: name the check IDs, name the tools or servers.
- Do NOT invent findings the structured list doesn't contain.
- Do NOT recommend products. The findings already include remediation guidance.

PARAGRAPH 1 — "What to fix first"
- Open with the count of CRITICAL and HIGH findings.
- Identify the single most urgent finding and explain it in one sentence.
- If there are no CRITICAL/HIGH findings, say so plainly.

PARAGRAPH 2 — "What looks reasonable"
- Note any structural good practices the manifest demonstrates (well-constrained schemas, version-pinned packages, TLS in use, etc.). If none apply, say "Nothing further to call out at this severity level."

FORMAT
- Plain prose. No bullet lists. No markdown. No code blocks.
- 60-120 words total.
- Never address the operator as "you" more than once per paragraph.

If the structured findings list is empty: respond with exactly "No findings at this severity. The manifest passed all five AEG-MCP checks."`;

export async function explainFindings(result: ScanResult): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  // Build the user message — structured findings only, never the
  // raw manifest. Cap by character length so a pathological manifest
  // with hundreds of findings doesn't blow our token budget.
  const userMessage = buildPrompt(result);

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
        max_tokens: 250,
        temperature: 0.2, // Low — we want grounded restatement, not creative writing.
      }),
    });

    if (!res.ok) {
      console.error(`[mcp-scan/explain] Groq ${res.status}`);
      return null;
    }

    type GroqResp = { choices?: { message?: { content?: string } }[] };
    const data: GroqResp = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const trimmed = raw.trim();
    return trimmed || null;
  } catch (err) {
    console.error(
      "[mcp-scan/explain] network error:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}

const MAX_FINDINGS_IN_PROMPT = 20;

/**
 * Build the user message for Groq. Pure function — exported for
 * testing. Includes only structured fields; never the raw manifest.
 */
export function buildPrompt(result: ScanResult): string {
  const counts = countBySeverity(result.findings);
  const headline =
    `Manifest kind: ${result.kind}. Scanned ${result.scanned_count} ` +
    `${result.kind === "tools" ? "tool(s)" : "server(s)"}. ` +
    `Findings by severity: ${counts.critical} critical, ${counts.high} high, ` +
    `${counts.medium} medium, ${counts.low} low, ${counts.info} info.`;

  const top = result.findings.slice(0, MAX_FINDINGS_IN_PROMPT).map((f, i) => {
    const sev = f.severity.toUpperCase();
    return (
      `${i + 1}. [${f.check_id}] [${sev}] ${f.tool_name}: ${f.title}\n` +
      `   ${oneLine(f.detail)}`
    );
  });

  const more =
    result.findings.length > MAX_FINDINGS_IN_PROMPT
      ? `\n(${result.findings.length - MAX_FINDINGS_IN_PROMPT} more findings omitted — same severity-or-lower as those listed.)`
      : "";

  return `${headline}\n\nTop findings (already sorted by severity):\n${top.join("\n")}${more}`;
}

function countBySeverity(findings: Finding[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  for (const f of findings) counts[f.severity] += 1;
  return counts;
}

function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim().slice(0, 200);
}
