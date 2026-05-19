/**
 * AEG-MCP-002 — Schema Hardness Audit.
 *
 * Faithful TypeScript port of
 *   scanner/aegibit_mcp_shield/checks/schema_hardness.py
 *
 * Detects MCP tool definitions whose JSON Schemas are too permissive
 * to be safely consumed by an AI agent. Loose schemas are the single
 * most common precursor to abuse: an agent can be tricked into
 * passing arbitrary content into a free-form parameter, and the
 * underlying tool implementation has no contract to lean on for
 * sanitization.
 *
 * Sub-detections shipped in the web preview:
 *   1. Tool has no inputSchema at all                          HIGH
 *   2. Path/URL/command parameter without validation           HIGH
 *   3. String parameter with no pattern/enum/maxLength/format  MEDIUM
 *   4. Object parameter without additionalProperties: false    LOW
 */

import type { Finding, ToolDefinition } from "../types";

const PATH_LIKE = /\b(path|file|dir(ectory)?|folder|location|filename)\b/i;
const URL_LIKE = /\b(url|uri|endpoint|href|link|host(name)?|domain)\b/i;
const COMMAND_LIKE = /\b(command|cmd|shell|exec|script|query|sql)\b/i;

const REF_JSON_SCHEMA = "https://json-schema.org/understanding-json-schema/";
const REF_PATH_TRAVERSAL = "https://owasp.org/www-community/attacks/Path_Traversal";
const REF_SSRF = "https://owasp.org/www-community/attacks/Server_Side_Request_Forgery";
const REF_INJECTION = "https://owasp.org/www-community/Injection_Flaws";

export function runSchemaHardness(tools: ToolDefinition[]): Finding[] {
  const findings: Finding[] = [];
  for (const tool of tools) {
    findings.push(...scanTool(tool));
  }
  return findings;
}

function scanTool(tool: ToolDefinition): Finding[] {
  const out: Finding[] = [];
  const schema = extractInputSchema(tool);

  // 1. No inputSchema at all.
  if (schema === null) {
    out.push({
      check_id: "AEG-MCP-002",
      tool_name: tool.name,
      severity: "high",
      title: "Tool has no inputSchema",
      detail:
        `Tool ${q(tool.name)} declares no input schema. Without a schema, ` +
        `the agent has no contract for what parameters this tool accepts — ` +
        `every invocation is a free-form trust decision, and there is no ` +
        `programmatic way to sanitise inputs at the agent layer.`,
      remediation:
        "Every MCP tool should declare an inputSchema with explicit types " +
        "and constraints, even if the constraints are loose to start. A " +
        "minimum-viable schema:\n\n" +
        '  "inputSchema": {\n' +
        '    "type": "object",\n' +
        '    "properties": { /* … */ },\n' +
        '    "additionalProperties": false\n' +
        "  }",
      cwe: "CWE-20",
      references: [REF_JSON_SCHEMA],
    });
    return out;
  }

  if (typeof schema !== "object" || Array.isArray(schema)) {
    out.push({
      check_id: "AEG-MCP-002",
      tool_name: tool.name,
      severity: "medium",
      title: "inputSchema is not an object schema",
      detail:
        `Tool ${q(tool.name)} declares an inputSchema that is not a JSON ` +
        `object schema. Non-standard shapes can't be reasoned about and may ` +
        `not validate at all in the agent's JSON-Schema implementation.`,
      remediation:
        'Set inputSchema to a JSON-Schema object with `"type": "object"` at ' +
        "the top level.",
      references: [REF_JSON_SCHEMA],
    });
    return out;
  }

  const props = (schema.properties && typeof schema.properties === "object")
    ? (schema.properties as Record<string, unknown>)
    : {};

  // 2 + 3. Per-property checks.
  for (const [propName, raw] of Object.entries(props)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const prop = raw as Record<string, unknown>;
    const type = prop.type;

    if (type === "string") {
      const tooPermissive =
        prop.pattern === undefined &&
        prop.enum === undefined &&
        prop.maxLength === undefined &&
        prop.format === undefined;

      const isPath = PATH_LIKE.test(propName);
      const isUrl = URL_LIKE.test(propName);
      const isCommand = COMMAND_LIKE.test(propName);

      if (tooPermissive && (isPath || isUrl || isCommand)) {
        const kind = isPath ? "path" : isUrl ? "URL" : "command";
        out.push({
          check_id: "AEG-MCP-002",
          tool_name: tool.name,
          severity: "high",
          title: `Unvalidated ${kind}-like parameter ${q(propName)}`,
          detail:
            `Parameter ${q(propName)} on tool ${q(tool.name)} accepts any ` +
            `string. The parameter name suggests it carries a ${kind}, which ` +
            `is the highest-risk class of free-form input: ` +
            (isPath
              ? "directory-traversal attack surface."
              : isUrl
              ? "server-side request forgery (SSRF) attack surface."
              : "command-injection attack surface."),
          remediation:
            `Constrain ${q(propName)} with at least one of: a strict ` +
            "`pattern` regex, an `enum` of allowed values, a `format` " +
            "(e.g., `uri`, `hostname`), or a `maxLength`. If the parameter " +
            "must accept arbitrary input, document the threat model in the " +
            "tool description.",
          cwe: isPath ? "CWE-22" : isUrl ? "CWE-918" : "CWE-78",
          references: [
            isPath ? REF_PATH_TRAVERSAL : isUrl ? REF_SSRF : REF_INJECTION,
            REF_JSON_SCHEMA,
          ],
        });
      } else if (tooPermissive) {
        out.push({
          check_id: "AEG-MCP-002",
          tool_name: tool.name,
          severity: "medium",
          title: `Permissive string parameter ${q(propName)}`,
          detail:
            `Parameter ${q(propName)} accepts any string with no length cap, ` +
            "pattern, or enum. The agent has no way to validate input before " +
            "passing it on.",
          remediation:
            "Add `pattern`, `enum`, `format`, or `maxLength` so the parameter " +
            "has a programmatic contract.",
          references: [REF_JSON_SCHEMA],
        });
      }
    } else if (type === "object") {
      if (prop.additionalProperties !== false) {
        out.push({
          check_id: "AEG-MCP-002",
          tool_name: tool.name,
          severity: "low",
          title: `Object parameter ${q(propName)} accepts extra properties`,
          detail:
            `Parameter ${q(propName)} does not set ` +
            "`additionalProperties: false`. Without this, an attacker can " +
            "smuggle extra fields the tool implementation may inadvertently " +
            "read.",
          remediation:
            "Set `additionalProperties: false` on every object schema.",
          references: [REF_JSON_SCHEMA],
        });
      }
    } else if (type === "array") {
      if (!prop.items || typeof prop.items !== "object") {
        out.push({
          check_id: "AEG-MCP-002",
          tool_name: tool.name,
          severity: "low",
          title: `Array parameter ${q(propName)} has no items schema`,
          detail:
            `Parameter ${q(propName)} is declared as an array but has no ` +
            "`items` schema. The array can contain anything.",
          remediation:
            "Declare `items: { type: ... }` so the agent knows what shape " +
            "each element should have.",
          references: [REF_JSON_SCHEMA],
        });
      }
    }
  }

  // 4. Whole-tool additionalProperties check.
  if (schema.additionalProperties !== false) {
    out.push({
      check_id: "AEG-MCP-002",
      tool_name: tool.name,
      severity: "low",
      title: "Top-level schema accepts extra properties",
      detail:
        `Tool ${q(tool.name)} does not set ` +
        "`additionalProperties: false` at the top level of its inputSchema. " +
        "Extra-parameter smuggling is possible.",
      remediation:
        "Set `additionalProperties: false` on the top-level inputSchema.",
      references: [REF_JSON_SCHEMA],
    });
  }

  return out;
}

function extractInputSchema(tool: ToolDefinition): Record<string, unknown> | null {
  const raw = tool.raw;
  if (!raw || typeof raw !== "object") return null;
  const schema = (raw as Record<string, unknown>).inputSchema;
  if (schema === undefined || schema === null) return null;
  if (typeof schema !== "object" || Array.isArray(schema)) {
    // Caller will detect non-object schema via the type-check upstream.
    return schema as never;
  }
  return schema as Record<string, unknown>;
}

function q(s: string): string {
  return JSON.stringify(s);
}
