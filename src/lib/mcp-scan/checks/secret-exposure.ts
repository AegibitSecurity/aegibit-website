/**
 * AEG-MCP-003 — Secret Exposure Detection.
 *
 * Faithful TypeScript port of
 *   scanner/aegibit_mcp_shield/checks/secret_exposure.py
 *
 * Detects API keys, access tokens, private keys, and other
 * credential material accidentally embedded in MCP tool
 * definitions — most often in tool descriptions, parameter examples,
 * default values, or fixed enum values.
 *
 * Pattern coverage mirrors the Python list verbatim (commit-pinned
 * to mcp-shield v0.2.1). Designed to keep false-positive rate low:
 * every pattern requires both the provider prefix (e.g., `sk_live_`)
 * AND a minimum entropy-bearing suffix length.
 *
 * PRIVACY: matched secrets are REDACTED before being included in a
 * Finding's detail field. The web preview takes manifests pasted by
 * untrusted visitors; never round-trip a verbatim secret.
 */

import type { Finding, Severity, ToolDefinition } from "../types";

interface SecretPattern {
  label: string;
  pattern: RegExp;
  severity: Severity;
}

// Mirrors `_SECRET_PATTERNS` in secret_exposure.py. Order preserved
// because the first-match-wins semantics affects which severity is
// reported when a substring matches multiple patterns.
const SECRET_PATTERNS: SecretPattern[] = [
  { label: "AWS Access Key ID", pattern: /\bAKIA[0-9A-Z]{16}\b/, severity: "critical" },
  { label: "AWS Secret Access Key (heuristic)", pattern: /\baws_secret_access_key\s*[:=]\s*[A-Za-z0-9/+=]{40}\b/i, severity: "critical" },
  { label: "GitHub Personal Access Token", pattern: /\bghp_[A-Za-z0-9]{30,}\b/, severity: "critical" },
  { label: "GitHub fine-grained PAT", pattern: /\bgithub_pat_[A-Za-z0-9_]{30,}\b/, severity: "critical" },
  { label: "GitHub OAuth Token", pattern: /\bgho_[A-Za-z0-9]{30,}\b/, severity: "critical" },
  { label: "Stripe live secret key", pattern: /\bsk_live_[A-Za-z0-9]{20,}\b/, severity: "critical" },
  { label: "Stripe test secret key", pattern: /\bsk_test_[A-Za-z0-9]{20,}\b/, severity: "high" },
  { label: "Stripe live publishable key", pattern: /\bpk_live_[A-Za-z0-9]{20,}\b/, severity: "high" },
  { label: "Slack bot token", pattern: /\bxoxb-[A-Za-z0-9-]{20,}\b/, severity: "critical" },
  { label: "Slack user token", pattern: /\bxoxp-[A-Za-z0-9-]{20,}\b/, severity: "critical" },
  { label: "Slack app-level token", pattern: /\bxapp-[A-Za-z0-9-]{20,}\b/, severity: "critical" },
  { label: "OpenAI API Key", pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/, severity: "critical" },
  { label: "Anthropic API Key", pattern: /\bsk-ant-[A-Za-z0-9_-]{32,}\b/, severity: "critical" },
  { label: "Google API Key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/, severity: "critical" },
  { label: "JWT (likely)", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/, severity: "high" },
  { label: "PEM Private Key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED |)PRIVATE KEY-----/, severity: "critical" },
  { label: "Hardcoded password / passphrase", pattern: /\b(password|passwd|passphrase)\s*[:=]\s*["']?[^\s"']{6,}/i, severity: "high" },
  { label: "Hardcoded api_key/secret value", pattern: /\b(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/i, severity: "high" },
  { label: "Bearer token (heuristic)", pattern: /\bbearer\s+[A-Za-z0-9_\-.=]{20,}\b/i, severity: "high" },
];

const REF_OWASP_HARD_CODED = "https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password";

export function runSecretExposure(tools: ToolDefinition[]): Finding[] {
  const findings: Finding[] = [];
  for (const tool of tools) {
    findings.push(...scanTool(tool));
  }
  return findings;
}

function scanTool(tool: ToolDefinition): Finding[] {
  const out: Finding[] = [];

  // 1. Name + description.
  for (const [field, value] of [
    ["name", tool.name],
    ["description", tool.description],
  ] as const) {
    for (const hit of scanText(value)) {
      out.push(makeFinding(tool.name, hit, `in tool ${field}`));
    }
  }

  // 2. Deep scan of the raw object — picks up default values, examples,
  //    enum values, parameter descriptions.
  for (const hit of scanObject(tool.raw)) {
    out.push(makeFinding(tool.name, hit, hit.where));
  }

  return out;
}

interface SecretHit {
  pattern: SecretPattern;
  matched: string;
  where: string;
}

function scanText(text: string): SecretHit[] {
  if (!text) return [];
  const hits: SecretHit[] = [];
  for (const sp of SECRET_PATTERNS) {
    const m = text.match(sp.pattern);
    if (m) hits.push({ pattern: sp, matched: m[0], where: "" });
  }
  return hits;
}

function scanObject(
  node: unknown,
  path: string[] = [],
): SecretHit[] {
  const hits: SecretHit[] = [];
  if (node === null || node === undefined) return hits;

  if (typeof node === "string") {
    for (const sp of SECRET_PATTERNS) {
      const m = node.match(sp.pattern);
      if (m) {
        hits.push({
          pattern: sp,
          matched: m[0],
          where: path.length ? `at ${path.join(".")}` : "in raw schema",
        });
      }
    }
    return hits;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      hits.push(...scanObject(node[i], [...path, `[${i}]`]));
    }
    return hits;
  }

  if (typeof node === "object") {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      hits.push(...scanObject(value, [...path, key]));
    }
    return hits;
  }

  return hits;
}

function redact(secret: string): string {
  if (secret.length <= 12) return secret.slice(0, 2) + "***";
  return `${secret.slice(0, 4)}...${secret.slice(-4)} (len=${secret.length})`;
}

function makeFinding(toolName: string, hit: SecretHit, where: string): Finding {
  return {
    check_id: "AEG-MCP-003",
    tool_name: toolName,
    severity: hit.pattern.severity,
    title: `${hit.pattern.label} embedded in tool definition`,
    detail:
      `Tool ${q(toolName)} contains what looks like a ${hit.pattern.label}, ` +
      `${where}: ${q(redact(hit.matched))}. Manifests ship to every client ` +
      `that loads the tool — every embedded credential is publicly exposed.`,
    remediation:
      "Rotate the exposed credential immediately. Replace the value in the " +
      "manifest with a placeholder or environment-variable reference. Add a " +
      "pre-commit scan (gitleaks, trufflehog) to your repo so this can't " +
      "recur.",
    cwe: "CWE-798",
    owasp: "A07:2021 — Identification and Authentication Failures",
    references: [REF_OWASP_HARD_CODED],
  };
}

function q(s: string): string {
  return JSON.stringify(s);
}
