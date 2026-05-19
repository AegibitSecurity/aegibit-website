/**
 * AEG-MCP-004 — STDIO Launch Hardening.
 *
 * Faithful TypeScript port of
 *   scanner/aegibit_mcp_shield/checks/stdio_hardening.py
 *
 * Detects unsafe launch patterns in MCP server configurations that
 * use the stdio transport. This is the family of risks the OX
 * Security April 2026 disclosure (CVE-2026-30615 and related)
 * demonstrated against 200,000+ production MCP servers.
 *
 * Sub-detections shipped in the web preview:
 *   1. Shell wrappers (`bash -c`, `cmd /c`, `powershell -c`)       CRITICAL
 *   2. Unpinned package-runner launches (npx/uvx/pipx/bunx/pnpx)   HIGH
 *   3. Pinned package-runner launches                              MEDIUM
 *   4. Executable paths under user-writable locations              HIGH
 *   5. Suspicious credential-bearing env keys                      MEDIUM
 */

import type { Finding, ServerConfig } from "../types";

const PACKAGE_RUNNERS = new Set(["npx", "uvx", "pipx", "bunx", "pnpx"]);

const SHELL_INTERPRETERS = new Set([
  "bash",
  "sh",
  "zsh",
  "fish",
  "cmd",
  "cmd.exe",
  "powershell",
  "powershell.exe",
  "pwsh",
]);

const SHELL_EXEC_FLAGS = new Set(["-c", "/c", "/C", "-Command", "-EncodedCommand"]);

const USER_WRITABLE_PREFIXES: string[] = [
  "/tmp/",
  "/var/tmp/",
  "C:\\Temp\\",
  "C:\\Users\\Public\\",
];

const USER_WRITABLE_HOMEDIR: RegExp[] = [
  /^~\/Downloads\//i,
  /^~\/Desktop\//i,
  /^\/Users\/[^/]+\/Downloads\//i,
  /^C:\\Users\\[^\\]+\\Downloads\\/i,
];

const CREDENTIAL_VALUE_TOKENS = new Set([
  "TOKEN", "TOKENS",
  "KEY", "KEYS",
  "SECRET", "SECRETS",
  "PASSWORD", "PASSWD", "PASSPHRASE",
  "CREDENTIAL", "CREDENTIALS", "CREDS",
  "PAT", "JWT", "BEARER",
  "AUTH",
]);

const CREDENTIAL_PROVIDER_TOKENS = new Set([
  "AWS",
  "GITHUB", "GITLAB", "BITBUCKET",
  "STRIPE",
  "OPENAI", "ANTHROPIC", "GOOGLE", "GEMINI",
  "GCP", "AZURE",
  "SLACK", "DISCORD",
  "DATABASE", "DB", "MONGO", "REDIS", "POSTGRES", "MYSQL", "MARIADB",
  "OAUTH", "API",
  "DATABRICKS", "SUPABASE", "VERCEL", "RESEND", "SENDGRID",
  "TWILIO", "MAILGUN", "FIREBASE", "DOCKER", "NPM", "PYPI",
]);

const CREDENTIAL_STANDALONE_TOKENS = new Set(["PASSWORD", "PASSWD", "PASSPHRASE"]);

const REF_OX_DISCLOSURE =
  "https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-" +
  "critical-systemic-vulnerability-at-the-core-of-the-mcp/";
const REF_CWE_829 = "https://cwe.mitre.org/data/definitions/829.html"; // unverified inclusion
const REF_CWE_77 = "https://cwe.mitre.org/data/definitions/77.html"; // command injection

export function runStdioHardening(servers: ServerConfig[]): Finding[] {
  const findings: Finding[] = [];
  for (const server of servers) {
    findings.push(...scanServer(server));
  }
  return findings;
}

function scanServer(server: ServerConfig): Finding[] {
  if (server.transport !== "stdio") return [];

  const out: Finding[] = [];
  const command = (server.command ?? "").trim();
  const args = server.args ?? [];

  if (!command) return out;

  const commandBasename = basename(command).toLowerCase();

  // 1. Shell wrapper.
  if (SHELL_INTERPRETERS.has(commandBasename)) {
    const hasShellExec = args.some((a) => SHELL_EXEC_FLAGS.has(a));
    if (hasShellExec) {
      out.push({
        check_id: "AEG-MCP-004",
        tool_name: server.name,
        severity: "critical",
        title: `Server ${q(server.name)} launches via shell wrapper`,
        detail:
          `Server ${q(server.name)} launches with command ${q(commandBasename)} ` +
          `and a shell-exec flag (${args.filter((a) => SHELL_EXEC_FLAGS.has(a)).join(" ")}). ` +
          "Shell-wrapped launches surface every argument to the shell's parser — " +
          "any tampering with args, environment, or the encoded command becomes " +
          "an arbitrary-code-execution vector.",
        remediation:
          "Launch the MCP server directly by its executable path instead of " +
          "through a shell. If you need shell semantics for environment setup, " +
          "use the MCP server config's `env` field rather than a shell command.",
        cwe: "CWE-77",
        owasp: "A03:2021 — Injection",
        references: [REF_OX_DISCLOSURE, REF_CWE_77],
      });
    }
  }

  // 2 + 3. Package runners.
  if (PACKAGE_RUNNERS.has(commandBasename)) {
    const pkgArg = args.find((a) => !a.startsWith("-")) ?? "";
    const isPinned = /@[\w.\-]+(?:\.\d+)*$/.test(pkgArg) && !pkgArg.endsWith("@latest");

    out.push({
      check_id: "AEG-MCP-004",
      tool_name: server.name,
      severity: isPinned ? "medium" : "high",
      title: isPinned
        ? `Server ${q(server.name)} runs ${commandBasename} (pinned)`
        : `Server ${q(server.name)} runs ${commandBasename} without a version pin`,
      detail: isPinned
        ? `Server ${q(server.name)} launches via ${commandBasename} ${q(pkgArg)}. ` +
          "The package is version-pinned, which reduces supply-chain risk, but " +
          "an attacker who compromises the package registry account can still " +
          "publish a new version under the same name."
        : `Server ${q(server.name)} launches via ${commandBasename} ${q(pkgArg)} ` +
          "with no version pin. Every server start re-resolves the package — " +
          "if the upstream account is compromised, your machine pulls the " +
          "attacker's code on the next start. This was the dominant attack " +
          "shape in the April 2026 OX disclosure.",
      remediation: isPinned
        ? "Pin to a specific version AND verify the package publisher's identity. " +
          "Consider vendoring the package into your repo for the highest assurance."
        : `Pin the package version explicitly (e.g., ${commandBasename} ${pkgArg || "<pkg>"}@1.2.3) ` +
          "and verify the publisher's identity before adopting. Best practice is " +
          "to vendor critical MCP servers into your repo.",
      cwe: "CWE-829",
      references: [REF_OX_DISCLOSURE, REF_CWE_829],
    });
  }

  // 4. User-writable executable paths.
  const fullPath = command;
  const isWritable =
    USER_WRITABLE_PREFIXES.some((p) => fullPath.startsWith(p)) ||
    USER_WRITABLE_HOMEDIR.some((re) => re.test(fullPath));
  if (isWritable) {
    out.push({
      check_id: "AEG-MCP-004",
      tool_name: server.name,
      severity: "high",
      title: `Server ${q(server.name)} launches from a user-writable path`,
      detail:
        `Server ${q(server.name)} launches from ${q(fullPath)}. User-writable ` +
        "locations (`/tmp`, `~/Downloads`, etc.) are the easiest place for " +
        "malware to drop and re-launch — every restart of the MCP client " +
        "loads whatever binary sits at that path.",
      remediation:
        "Move the server binary to a read-only system location (e.g., " +
        "`/usr/local/bin`, `C:\\Program Files\\`) and reference it from there. " +
        "If the binary must live in user-space, verify its hash before each " +
        "launch.",
      references: [REF_OX_DISCLOSURE],
    });
  }

  // 5. Credential-bearing env keys.
  for (const key of server.env_keys) {
    if (looksLikeCredentialEnvKey(key)) {
      out.push({
        check_id: "AEG-MCP-004",
        tool_name: server.name,
        severity: "medium",
        title: `Credential-looking env key ${q(key)}`,
        detail:
          `Server ${q(server.name)} declares the env key ${q(key)} — its name ` +
          "suggests it carries a credential. We did not see the value (the " +
          "manifest paste pipeline strips env values), but the presence of " +
          "this key is worth auditing: ensure the value comes from a secrets " +
          "manager, not a plaintext config file checked into version control.",
        remediation:
          "Source credentialed env vars from a secrets manager at runtime " +
          "(macOS Keychain, Windows Credential Locker, 1Password CLI, Vault, " +
          "etc.). Never check the value into the MCP config file.",
        references: [],
      });
    }
  }

  return out;
}

function looksLikeCredentialEnvKey(key: string): boolean {
  const parts = key
    .toUpperCase()
    .split(/[_\-.]+/)
    .filter(Boolean);
  const partsSet = new Set(parts);

  const hasProvider = parts.some((p) => CREDENTIAL_PROVIDER_TOKENS.has(p));
  const hasValue = parts.some((p) => CREDENTIAL_VALUE_TOKENS.has(p));
  if (hasProvider && hasValue) return true;

  const valueCount = parts.filter((p) => CREDENTIAL_VALUE_TOKENS.has(p)).length;
  if (valueCount >= 2) return true;

  for (const standalone of CREDENTIAL_STANDALONE_TOKENS) {
    if (partsSet.has(standalone)) return true;
  }
  return false;
}

function basename(p: string): string {
  if (!p) return "";
  const seg = p.replace(/\\/g, "/").split("/");
  return seg[seg.length - 1] ?? "";
}

function q(s: string): string {
  return JSON.stringify(s);
}
