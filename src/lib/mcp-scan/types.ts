/**
 * MCP Shield web-scanner — shared types.
 *
 * Faithful TypeScript port of the data models in
 *   github.com/AegibitSecurity/mcp-shield → scanner/aegibit_mcp_shield/models.py
 *
 * Why a faithful port (not a re-design):
 *   The Python scanner ships as v0.2.1 MIT and is what the website's
 *   /products/mcp-shield page cites. Keeping the TS shapes identical
 *   means findings produced by the web preview are directly
 *   comparable to CLI findings — a buyer can run both and see the
 *   same `check_id` + `severity` for the same input.
 *
 *   When the Python source adds a sub-detection or a field, the
 *   appropriate next move is to mirror it here, not to invent a
 *   parallel data model.
 */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

/**
 * A single MCP tool definition — what an MCP server returns from its
 * `tools/list` JSON-RPC method, or what a static tool manifest file
 * declares per entry.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  /** The original raw JSON object — preserved so checks can recurse it. */
  raw: Record<string, unknown>;
}

/**
 * An MCP server configuration entry — what claude_desktop_config.json
 * or a similar `mcp.json` file declares per server.
 *
 * `env_keys` / `headers_keys` carry KEY NAMES ONLY, never values —
 * mirrored from the Python scanner's privacy-preserving design. The
 * web scanner takes manifests pasted by visitors, so this guarantee
 * is doubly important: no copy-pasted credential should ever round-
 * trip through our infrastructure.
 */
export interface ServerConfig {
  name: string;
  transport: "stdio" | "http" | "sse" | "unknown";
  command?: string;
  args: string[];
  env_keys: string[];
  url?: string;
  headers_keys: string[];
  raw: Record<string, unknown>;
}

/**
 * A single security finding produced by a check. Shape mirrors the
 * Python `Finding` dataclass (models.py).
 *
 * `tool_name` is overloaded: tool-targeted checks (AEG-MCP-001/002/003)
 * carry the tool name; server-targeted checks (AEG-MCP-004/005) carry
 * the server name. `check_id` disambiguates which namespace.
 */
export interface Finding {
  check_id: string;
  tool_name: string;
  severity: Severity;
  title: string;
  detail: string;
  remediation: string;
  cwe?: string;
  owasp?: string;
  references: string[];
}

/**
 * What kind of manifest the scanner identified the input as.
 */
export type ManifestKind = "tools" | "servers" | "unknown";

export interface ScanResult {
  /** Which shape we identified the manifest as. */
  kind: ManifestKind;
  /** Number of tools or servers we scanned (0 if kind is "unknown"). */
  scanned_count: number;
  /** All findings, sorted by severity desc. */
  findings: Finding[];
  /** Parser warnings — non-fatal issues (e.g., "input was wrapped in extra braces"). */
  warnings: string[];
}

export const ALL_CHECK_IDS = [
  "AEG-MCP-001",
  "AEG-MCP-002",
  "AEG-MCP-003",
  "AEG-MCP-004",
  "AEG-MCP-005",
] as const;
export type CheckId = (typeof ALL_CHECK_IDS)[number];
