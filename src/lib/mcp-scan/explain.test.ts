/**
 * MCP Shield web-scanner — explain.ts tests.
 *
 * The load-bearing assertion here is the PRIVACY GUARANTEE: the raw
 * manifest a visitor paste must never leave our process unless they
 * sent it to us themselves. The Groq layer can only see what we
 * choose to put in the prompt. These tests pin that contract.
 */

import { describe, it, expect } from "vitest";
import { buildPrompt } from "./explain";
import type { ScanResult } from "./types";

const SENSITIVE_TOKEN = "AKIAIOSFODNN7EXAMPLE";

const fixtureResult: ScanResult = {
  kind: "tools",
  scanned_count: 1,
  warnings: [],
  findings: [
    {
      check_id: "AEG-MCP-003",
      tool_name: "charge",
      severity: "critical",
      title: "AWS Access Key ID embedded in tool definition",
      // The detail field is what we WANT Groq to see — and it's the
      // REDACTED version (the actual check redacts to "AKIA...PLE  (len=20)")
      detail: "Tool charge contains what looks like an AWS Access Key ID: \"AKIA...PLE (len=20)\". Manifests ship to every client.",
      remediation: "Rotate the exposed credential immediately.",
      cwe: "CWE-798",
      owasp: "A07:2021",
      references: [],
    },
  ],
};

describe("buildPrompt — privacy guarantees", () => {
  it("never embeds the raw manifest in the prompt", () => {
    const prompt = buildPrompt(fixtureResult);
    expect(prompt).not.toContain(SENSITIVE_TOKEN);
  });

  it("includes the check_id so Groq can be grounded", () => {
    const prompt = buildPrompt(fixtureResult);
    expect(prompt).toContain("AEG-MCP-003");
  });

  it("includes the severity rollup", () => {
    const prompt = buildPrompt(fixtureResult);
    expect(prompt).toMatch(/1 critical/);
    expect(prompt).toMatch(/0 high/);
  });

  it("caps the number of findings shown to Groq", () => {
    const many: ScanResult = {
      kind: "tools",
      scanned_count: 50,
      warnings: [],
      findings: Array.from({ length: 50 }, (_, i) => ({
        check_id: "AEG-MCP-002",
        tool_name: `tool_${i}`,
        severity: "medium" as const,
        title: `Finding ${i}`,
        detail: `Detail ${i}`,
        remediation: "",
        references: [],
      })),
    };
    const prompt = buildPrompt(many);
    // 20 max per current cap
    expect(prompt).toContain("Finding 19");
    expect(prompt).not.toContain("Finding 25");
    expect(prompt).toContain("more findings omitted");
  });
});
