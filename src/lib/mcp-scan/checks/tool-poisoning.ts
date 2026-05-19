/**
 * AEG-MCP-001 — Tool Poisoning Detection.
 *
 * Faithful TypeScript port of
 *   scanner/aegibit_mcp_shield/checks/tool_poisoning.py
 *
 * Detects the class of attacks disclosed by OX Security in April 2026
 * against Anthropic's Model Context Protocol, where MCP server tool
 * definitions can hide malicious instructions that hijack the AI
 * assistant when the tools are loaded.
 *
 * Sub-detections (web preview ships 1–4; the Python CLI also covers
 * #5 "dangerous parameter names" which the schema-hardness check
 * partially overlaps here):
 *   1. Hidden Unicode characters (zero-width + tag chars U+E0000–U+E007F)
 *   2. Prompt injection / instruction-override patterns in description
 *   3. Suspiciously long descriptions (≥ 4000 chars)
 *   4. Dangerous capability patterns in name or description
 */

import type { Finding, ToolDefinition } from "../types";

const REF_OX_DISCLOSURE =
  "https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-" +
  "critical-systemic-vulnerability-at-the-core-of-the-mcp/";
const REF_TAG_STEGANOGRAPHY =
  "https://embracethered.com/blog/posts/2024/" +
  "hiding-and-finding-text-with-unicode-tags/";

const ZERO_WIDTH_CODEPOINTS = new Set<number>([
  0x200b, 0x200c, 0x200d, 0xfeff, 0x2060, 0x2061, 0x2062, 0x2063, 0x2064,
]);

const INSTRUCTION_OVERRIDE_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i,
  /you\s+are\s+now\s+/i,
  /disregard\s+(your|the|all|any)\s+/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /print\s+(your|the)\s+(system\s+)?prompt/i,
  /forget\s+everything/i,
  /new\s+task\s*:/i,
  /<\|im_start\|>/,
  /<\|im_end\|>/,
  /<\|system\|>/,
  /<\|endoftext\|>/,
  /\[INST\]/,
  /\[\/INST\]/,
];

const DANGEROUS_CAPABILITY_PATTERNS: RegExp[] = [
  /\bexec(ute)?\b/i,
  /\bshell\b/i,
  /\beval\b/i,
  /\bsubprocess\b/i,
  /\bos\.system\b/i,
  /\bshell_exec\b/i,
  /\bsystem\(\)/i,
];

const LONG_DESCRIPTION_THRESHOLD = 4000;

interface HiddenCharHit {
  codepoint: number;
  label: string;
}

export function detectHiddenChars(text: string): HiddenCharHit[] {
  const hits: HiddenCharHit[] = [];
  for (const ch of text) {
    const codepoint = ch.codePointAt(0);
    if (codepoint === undefined) continue;
    if (ZERO_WIDTH_CODEPOINTS.has(codepoint)) {
      hits.push({
        codepoint,
        label: `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")} (zero-width)`,
      });
    } else if (codepoint >= 0xe0000 && codepoint <= 0xe007f) {
      hits.push({
        codepoint,
        label: `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")} (TAG character — known steganography vector)`,
      });
    }
  }
  return hits;
}

export function runToolPoisoning(tools: ToolDefinition[]): Finding[] {
  const findings: Finding[] = [];
  for (const tool of tools) {
    findings.push(...scanTool(tool));
  }
  return findings;
}

function scanTool(tool: ToolDefinition): Finding[] {
  const out: Finding[] = [];

  // 1. Hidden Unicode in name or description.
  for (const [field, text] of [
    ["name", tool.name],
    ["description", tool.description],
  ] as const) {
    const hits = detectHiddenChars(text);
    if (hits.length > 0) {
      out.push({
        check_id: "AEG-MCP-001",
        tool_name: tool.name,
        severity: "critical",
        title: `Hidden Unicode in tool ${field}`,
        detail:
          `Tool ${q(tool.name)} contains ${hits.length} hidden Unicode ` +
          `character(s) in its ${field}: ${hits.map((h) => h.label).join(", ")}. ` +
          `Zero-width and TAG-range characters are invisible to a human reviewer ` +
          `but consumed verbatim by the LLM — a documented steganography vector ` +
          `for instruction smuggling.`,
        remediation:
          "Strip all U+200B–U+200D, U+FEFF, U+2060–U+2064, and U+E0000–U+E007F " +
          "characters from tool definitions before publishing the manifest. " +
          "Most editors will show these as zero-width gaps when configured to " +
          "render invisible characters.",
        cwe: "CWE-94",
        owasp: "A03:2021 — Injection",
        references: [REF_OX_DISCLOSURE, REF_TAG_STEGANOGRAPHY],
      });
    }
  }

  // 2. Instruction-override / prompt-injection patterns in description.
  for (const pattern of INSTRUCTION_OVERRIDE_PATTERNS) {
    const match = tool.description.match(pattern);
    if (match) {
      out.push({
        check_id: "AEG-MCP-001",
        tool_name: tool.name,
        severity: "critical",
        title: "Prompt-injection pattern in tool description",
        detail:
          `Tool ${q(tool.name)} description contains the pattern ${q(match[0])}, ` +
          `which is a well-known instruction-override marker. When the LLM ` +
          `loads this tool definition, the embedded instructions become part of ` +
          `its working prompt and can override the agent's intended behavior.`,
        remediation:
          "Remove instruction-override phrasing from tool descriptions. Tool " +
          "descriptions should describe what the tool does, never instruct the " +
          "LLM how to behave. If you need to influence agent behavior, do it in " +
          "the agent's system prompt — not inside tool metadata that ships with " +
          "the server.",
        cwe: "CWE-94",
        owasp: "A03:2021 — Injection",
        references: [REF_OX_DISCLOSURE],
      });
      break; // one finding per tool is enough — operator gets the signal
    }
  }

  // 3. Suspiciously long descriptions.
  if (tool.description.length >= LONG_DESCRIPTION_THRESHOLD) {
    out.push({
      check_id: "AEG-MCP-001",
      tool_name: tool.name,
      severity: "medium",
      title: "Unusually long tool description",
      detail:
        `Tool ${q(tool.name)} has a description of ${tool.description.length} ` +
        `characters. Descriptions over ${LONG_DESCRIPTION_THRESHOLD} chars are a ` +
        `common hiding place for prompt-injection payloads — the wall of legitimate ` +
        `text obscures a small embedded instruction.`,
      remediation:
        "Tool descriptions should be 1–3 sentences. If a tool needs deeper " +
        "documentation, host it externally and link to it from the description.",
      references: [REF_OX_DISCLOSURE],
    });
  }

  // 4. Dangerous capability patterns.
  for (const pattern of DANGEROUS_CAPABILITY_PATTERNS) {
    const where =
      pattern.test(tool.name) ? "name"
      : pattern.test(tool.description) ? "description"
      : null;
    if (where) {
      out.push({
        check_id: "AEG-MCP-001",
        tool_name: tool.name,
        severity: "high",
        title: `Dangerous capability hint in tool ${where}`,
        detail:
          `Tool ${q(tool.name)} ${where} matches a dangerous-capability pattern ` +
          `(${pattern.source}). Tools that execute arbitrary commands or evaluate ` +
          `code are the highest-risk class of MCP tool — they should require ` +
          `explicit allow-listing in the agent's tool policy, not be silently ` +
          `available based on their presence in the manifest.`,
        remediation:
          "If this tool legitimately executes commands, document the threat " +
          "model and require it to be explicitly enabled. If not, rename the " +
          "tool so its capability hint matches what it actually does.",
        cwe: "CWE-78",
        owasp: "A03:2021 — Injection",
        references: [REF_OX_DISCLOSURE],
      });
      break;
    }
  }

  return out;
}

function q(s: string): string {
  return JSON.stringify(s);
}
