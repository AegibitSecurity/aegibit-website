/**
 * MCP Shield web-scanner — dispatcher.
 *
 * One entry point: `scanManifest(raw)` takes a JSON string, parses it
 * into either a tool manifest or a server config, runs the
 * appropriate AEG-MCP-* checks, and returns sorted findings.
 *
 * Findings are sorted by severity (critical → info) then by check_id
 * so the operator sees the highest-leverage items first.
 *
 * Pure function — no I/O, no globals, no network. The HTTP layer
 * (src/app/api/mcp-scan/route.ts) is responsible for auth, rate
 * limiting, payload caps, and observability; this module is purely
 * "given a manifest, return findings."
 */

import type { Finding, ScanResult } from "./types";
import { SEVERITY_RANK } from "./types";
import { parseManifest } from "./parse";
import { runToolPoisoning } from "./checks/tool-poisoning";
import { runSchemaHardness } from "./checks/schema-hardness";
import { runSecretExposure } from "./checks/secret-exposure";
import { runStdioHardening } from "./checks/stdio-hardening";
import { runTransportSecurity } from "./checks/transport-security";

export function scanManifest(raw: string): ScanResult {
  const parsed = parseManifest(raw);

  if (parsed.error) {
    return {
      kind: "unknown",
      scanned_count: 0,
      findings: [],
      warnings: [parsed.error],
    };
  }

  const findings: Finding[] = [];

  if (parsed.kind === "tools") {
    findings.push(...runToolPoisoning(parsed.tools));
    findings.push(...runSchemaHardness(parsed.tools));
    findings.push(...runSecretExposure(parsed.tools));
    return {
      kind: "tools",
      scanned_count: parsed.tools.length,
      findings: sortFindings(findings),
      warnings: parsed.warnings,
    };
  }

  if (parsed.kind === "servers") {
    findings.push(...runStdioHardening(parsed.servers));
    findings.push(...runTransportSecurity(parsed.servers));
    return {
      kind: "servers",
      scanned_count: parsed.servers.length,
      findings: sortFindings(findings),
      warnings: parsed.warnings,
    };
  }

  return {
    kind: "unknown",
    scanned_count: 0,
    findings: [],
    warnings: parsed.warnings,
  };
}

function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    const sevDelta = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (sevDelta !== 0) return sevDelta;
    if (a.check_id !== b.check_id) return a.check_id.localeCompare(b.check_id);
    return a.tool_name.localeCompare(b.tool_name);
  });
}
