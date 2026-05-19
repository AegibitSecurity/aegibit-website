/**
 * MCP Shield web-scanner — manifest parser.
 *
 * Auto-detects which of the two MCP manifest shapes the visitor
 * pasted, normalises into ToolDefinition[] OR ServerConfig[], and
 * returns parser warnings (never throws — every error surfaces as a
 * caller-readable string).
 *
 * Supported shapes:
 *
 *   1. Tool manifest — flat array of `{ name, description?, inputSchema? }`
 *      objects, OR an object with `tools: [...]` (mcp tools/list JSON-RPC
 *      response shape).
 *
 *   2. Server config — object with `mcpServers: { name: { ... }, ... }`
 *      (claude_desktop_config.json shape) OR object with `servers: { ... }`
 *      (some mcp.json variants).
 *
 * Mirror of: scanner/aegibit_mcp_shield/scanner.py (Python's `_load_manifest`).
 */

import type {
  ManifestKind,
  ServerConfig,
  ToolDefinition,
} from "./types";

export interface ParseResult {
  kind: ManifestKind;
  tools: ToolDefinition[];
  servers: ServerConfig[];
  warnings: string[];
  error?: string;
}

export function parseManifest(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      kind: "unknown",
      tools: [],
      servers: [],
      warnings: [],
      error: "Empty input.",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return {
      kind: "unknown",
      tools: [],
      servers: [],
      warnings: [],
      error: `Not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (parsed === null || typeof parsed !== "object") {
    return {
      kind: "unknown",
      tools: [],
      servers: [],
      warnings: [],
      error: "Expected a JSON object or array at the top level.",
    };
  }

  // Branch A — flat array of tool definitions.
  if (Array.isArray(parsed)) {
    return { ...extractTools(parsed, []), kind: "tools" };
  }

  const obj = parsed as Record<string, unknown>;

  // Branch B — { tools: [...] } (MCP tools/list response shape).
  if (Array.isArray(obj.tools)) {
    return { ...extractTools(obj.tools, []), kind: "tools" };
  }

  // Branch C — { mcpServers: { ... } } (claude_desktop_config.json shape).
  if (obj.mcpServers && typeof obj.mcpServers === "object") {
    return {
      ...extractServers(obj.mcpServers as Record<string, unknown>, []),
      kind: "servers",
    };
  }

  // Branch D — { servers: { ... } } (some mcp.json variants).
  if (obj.servers && typeof obj.servers === "object") {
    return {
      ...extractServers(obj.servers as Record<string, unknown>, []),
      kind: "servers",
    };
  }

  // Branch E — single tool definition object (the visitor pasted just one).
  if (typeof obj.name === "string") {
    return {
      ...extractTools([obj], [
        "Input looked like a single tool. If you meant to scan a manifest, " +
          "wrap it in an array or in `{ tools: [...] }`.",
      ]),
      kind: "tools",
    };
  }

  return {
    kind: "unknown",
    tools: [],
    servers: [],
    warnings: [],
    error:
      "Could not identify this as an MCP tool manifest or server config. " +
      "Expected top-level `tools: [...]`, `mcpServers: { ... }`, or a flat " +
      "array of tool definitions.",
  };
}

function extractTools(
  arr: unknown[],
  warnings: string[],
): Omit<ParseResult, "kind"> {
  const tools: ToolDefinition[] = [];
  for (let i = 0; i < arr.length; i++) {
    const entry = arr[i];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      warnings.push(`tools[${i}] is not an object — skipped.`);
      continue;
    }
    const obj = entry as Record<string, unknown>;
    const name = typeof obj.name === "string" ? obj.name : `tool_${i}`;
    const description =
      typeof obj.description === "string" ? obj.description : "";
    tools.push({ name, description, raw: obj });
  }
  return { tools, servers: [], warnings };
}

function extractServers(
  map: Record<string, unknown>,
  warnings: string[],
): Omit<ParseResult, "kind"> {
  const servers: ServerConfig[] = [];
  for (const [name, value] of Object.entries(map)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      warnings.push(`Server ${r(name)} is not an object — skipped.`);
      continue;
    }
    const obj = value as Record<string, unknown>;

    const url = typeof obj.url === "string" ? obj.url : undefined;
    const command = typeof obj.command === "string" ? obj.command : undefined;
    const args = Array.isArray(obj.args)
      ? obj.args.filter((a): a is string => typeof a === "string")
      : [];

    let transport: ServerConfig["transport"] = "unknown";
    if (typeof obj.transport === "string") {
      const t = obj.transport.toLowerCase();
      if (t === "stdio" || t === "http" || t === "sse") {
        transport = t;
      }
    } else if (url) {
      transport = url.startsWith("http") ? "http" : "unknown";
    } else if (command) {
      transport = "stdio";
    }

    const envObj =
      obj.env && typeof obj.env === "object" && !Array.isArray(obj.env)
        ? (obj.env as Record<string, unknown>)
        : {};
    const env_keys = Object.keys(envObj);

    const headersObj =
      obj.headers && typeof obj.headers === "object" && !Array.isArray(obj.headers)
        ? (obj.headers as Record<string, unknown>)
        : {};
    const headers_keys = Object.keys(headersObj);

    servers.push({
      name,
      transport,
      command,
      args,
      env_keys,
      url,
      headers_keys,
      raw: obj,
    });
  }
  return { tools: [], servers, warnings };
}

// Helper to JSON-quote a name in a warning message — pulled out so the
// emit is visually consistent across this file.
function r(s: string): string {
  return JSON.stringify(s);
}
