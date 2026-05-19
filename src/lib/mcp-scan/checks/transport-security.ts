/**
 * AEG-MCP-005 — Transport Security.
 *
 * Faithful TypeScript port of
 *   scanner/aegibit_mcp_shield/checks/transport_security.py
 *
 * Detects insecure transport configurations on HTTP- and SSE-transport
 * MCP servers. Any MCP server handling non-trivial work over HTTP must
 * use TLS, must not embed credentials in the URL, and must not silently
 * disable certificate validation.
 *
 * Sub-detections shipped in the web preview:
 *   1. http:// (no TLS) for non-localhost host                CRITICAL
 *   2. Userinfo embedded in URL (https://user:pass@host)      CRITICAL
 *   3. Disabled-TLS hints in raw config                       HIGH
 *   4. URL declared but missing                               MEDIUM
 *   5. URL fails to parse                                     MEDIUM
 *   6. http:// localhost (dev pattern, but warn in prod)      INFO
 */

import type { Finding, ServerConfig } from "../types";

const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);

interface DisabledTlsHint {
  key: string;
  trueValue: boolean; // does `true` mean "disabled"?
}

const DISABLED_TLS_HINTS: DisabledTlsHint[] = [
  { key: "insecure", trueValue: true },
  { key: "skipTlsVerify", trueValue: true },
  { key: "skip_tls_verify", trueValue: true },
  { key: "allowInsecure", trueValue: true },
  { key: "verify_tls", trueValue: false },
  { key: "verifyTls", trueValue: false },
  { key: "verify_ssl", trueValue: false },
  { key: "verifySsl", trueValue: false },
  { key: "rejectUnauthorized", trueValue: false },
];

const REF_CWE_319 = "https://cwe.mitre.org/data/definitions/319.html";
const REF_CWE_295 = "https://cwe.mitre.org/data/definitions/295.html";
const REF_OWASP_CRYPTO = "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/";

export function runTransportSecurity(servers: ServerConfig[]): Finding[] {
  const findings: Finding[] = [];
  for (const server of servers) {
    findings.push(...scanServer(server));
  }
  return findings;
}

function scanServer(server: ServerConfig): Finding[] {
  const out: Finding[] = [];

  if (server.transport !== "http" && server.transport !== "sse") return out;

  const url = (server.url ?? "").trim();

  // 4. URL declared but missing.
  if (!url) {
    out.push({
      check_id: "AEG-MCP-005",
      tool_name: server.name,
      severity: "medium",
      title: `${server.transport.toUpperCase()} transport without URL`,
      detail:
        `Server ${q(server.name)} declares transport=${q(server.transport)} ` +
        "but provides no URL. The server cannot be reached, and the silent " +
        "failure mode means a misconfiguration may go unnoticed.",
      remediation:
        `Add an explicit URL (e.g., "url": "https://mcp.example.com/v1"). ` +
        "If the server is meant to be local, use stdio transport.",
      references: [],
    });
    return out;
  }

  // 5. URL parsing.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (err) {
    out.push({
      check_id: "AEG-MCP-005",
      tool_name: server.name,
      severity: "medium",
      title: "URL fails to parse",
      detail:
        `Server ${q(server.name)} declares URL ${q(url)} which fails to parse. ` +
        (err instanceof Error ? err.message : String(err)),
      remediation:
        "Replace the URL with a syntactically valid one (must include scheme " +
        "and host). Examples: `https://api.example.com/mcp`, " +
        "`https://mcp.example.com:8443/v1`.",
      references: [],
    });
    return out;
  }

  const host = parsed.hostname.toLowerCase();
  const isLocalhost = LOCALHOST_HOSTS.has(host);

  // 2. Userinfo in URL.
  if (parsed.username || parsed.password) {
    out.push({
      check_id: "AEG-MCP-005",
      tool_name: server.name,
      severity: "critical",
      title: `Credentials embedded in URL`,
      detail:
        `Server ${q(server.name)} declares a URL with embedded ${parsed.password ? "credentials" : "user info"}. ` +
        "URL-embedded credentials end up in browser history, server access " +
        "logs, error reports, and process listings — every layer of the stack " +
        "treats the URL as non-sensitive.",
      remediation:
        "Remove the userinfo from the URL. Pass credentials via an " +
        "`Authorization` header (in the server config's `headers` field) " +
        "sourced from a secrets manager at runtime.",
      cwe: "CWE-598",
      references: [REF_OWASP_CRYPTO],
    });
  }

  // 1 + 6. HTTP without TLS.
  if (parsed.protocol === "http:") {
    if (isLocalhost) {
      out.push({
        check_id: "AEG-MCP-005",
        tool_name: server.name,
        severity: "info",
        title: "Plain HTTP localhost — dev pattern",
        detail:
          `Server ${q(server.name)} connects over plain HTTP to ${host}. ` +
          "This is the standard dev-loopback pattern; flagging only to confirm " +
          "this config is not being shipped to a production environment.",
        remediation:
          "Confirm that this config never ships to a shared / production " +
          "environment. If it does, migrate to TLS even for localhost.",
        references: [],
      });
    } else {
      out.push({
        check_id: "AEG-MCP-005",
        tool_name: server.name,
        severity: "critical",
        title: "Plain HTTP — no TLS",
        detail:
          `Server ${q(server.name)} connects to ${host} over plain HTTP. ` +
          "Tool invocations, parameters, and responses are visible to anyone " +
          "on the network path between client and server. Credentials passed " +
          "in headers travel in cleartext.",
        remediation:
          "Switch the scheme to https://. If the upstream MCP server does " +
          "not yet support TLS, front it with a TLS-terminating proxy (Caddy, " +
          "nginx, Cloudflare Tunnel) before exposing it.",
        cwe: "CWE-319",
        owasp: "A02:2021 — Cryptographic Failures",
        references: [REF_CWE_319, REF_OWASP_CRYPTO],
      });
    }
  }

  // 3. Disabled-TLS hints in raw config.
  for (const hint of DISABLED_TLS_HINTS) {
    if (!(hint.key in server.raw)) continue;
    const rawVal = server.raw[hint.key];
    let disabled = false;
    if (typeof rawVal === "boolean") {
      disabled = hint.trueValue ? rawVal === true : rawVal === false;
    } else if (typeof rawVal === "string") {
      const truthy = ["true", "1", "yes"].includes(rawVal.toLowerCase());
      const falsy = ["false", "0", "no"].includes(rawVal.toLowerCase());
      disabled = hint.trueValue ? truthy : falsy;
    }
    if (disabled) {
      out.push({
        check_id: "AEG-MCP-005",
        tool_name: server.name,
        severity: "high",
        title: `TLS validation disabled (${hint.key})`,
        detail:
          `Server ${q(server.name)} sets ${q(hint.key)}=${JSON.stringify(rawVal)} ` +
          "— which disables certificate validation on the connection. Without " +
          "validation, a network attacker can impersonate the server.",
        remediation:
          `Remove the ${q(hint.key)} flag (or set it to the secure default). ` +
          "If the upstream server is using a self-signed certificate during " +
          "development, add the certificate to your trust store rather than " +
          "disabling validation globally.",
        cwe: "CWE-295",
        owasp: "A02:2021 — Cryptographic Failures",
        references: [REF_CWE_295, REF_OWASP_CRYPTO],
      });
    }
  }

  return out;
}

function q(s: string): string {
  return JSON.stringify(s);
}
