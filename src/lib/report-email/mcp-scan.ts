/**
 * MCP Shield scan report — HTML email renderer.
 *
 * Renders a ScanResult into an email body designed to be forwarded
 * to a security team. Same design discipline as the PayMint snapshot
 * email: every finding traces to the structured ScanResult, no
 * fabrication, inline-only CSS, no tracking pixels.
 */

import type { Finding, Severity } from "@/lib/mcp-scan/types";

const BRAND_ORANGE = "#F97316";
const TEXT = "#E4E4E7";
const MUTED = "#A1A1AA";

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#F87171",
  high: "#F97316",
  medium: "#FACC15",
  low: "#60A5FA",
  info: "#A1A1AA",
};

export interface ScanReportInput {
  kind: "tools" | "servers" | "unknown";
  scanned_count: number;
  findings: Finding[];
  summary: string | null;
  recipientName?: string;
}

export function renderScanReportHtml(input: ScanReportInput): {
  html: string;
  text: string;
  subject: string;
} {
  const { kind, scanned_count, findings, summary, recipientName } = input;
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";

  const counts = countBySeverity(findings);
  const subject =
    findings.length === 0
      ? `MCP Shield report — no findings on ${scanned_count} ${kind === "servers" ? "server" : "tool"}${scanned_count === 1 ? "" : "s"}`
      : `MCP Shield report — ${counts.critical} critical, ${counts.high} high (${findings.length} total)`;

  const findingsHtml = findings
    .slice(0, 30)
    .map((f) => {
      const color = SEVERITY_COLOR[f.severity];
      return `
        <tr>
          <td style="padding:14px 0;border-top:1px solid rgba(255,255,255,0.06);">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="font-size:11px;color:${color};font-weight:600;letter-spacing:0.10em;text-transform:uppercase;padding-bottom:6px;">${f.severity.toUpperCase()} · ${escapeHtml(f.check_id)}${f.cwe ? " · " + escapeHtml(f.cwe) : ""}</td>
              </tr>
              <tr>
                <td style="font-size:15px;color:#fff;font-weight:500;line-height:1.4;padding-bottom:4px;">${escapeHtml(f.title)}</td>
              </tr>
              <tr>
                <td style="font-size:12px;color:${MUTED};padding-bottom:8px;font-family:ui-monospace,monospace;">${escapeHtml(f.tool_name)}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:${TEXT};line-height:1.55;padding-bottom:10px;">${escapeHtml(f.detail)}</td>
              </tr>
              ${
                f.remediation
                  ? `<tr>
                       <td style="background:#000;border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px 12px;font-family:ui-monospace,monospace;font-size:12px;color:#D4D4D8;white-space:pre-wrap;">${escapeHtml(f.remediation)}</td>
                     </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>`;
    })
    .join("");

  const truncatedNote =
    findings.length > 30
      ? `<p style="margin:14px 0 0;color:${MUTED};font-size:12px;">${findings.length - 30} additional finding(s) omitted from the email. View the full result on /products/mcp-shield, or run the CLI for SARIF output.</p>`
      : "";

  const summaryBlock = summary
    ? `
      <div style="background:#0A0A0A;border:1px solid rgba(249,115,22,0.20);border-radius:8px;padding:18px;margin:24px 0;">
        <p style="margin:0 0 8px;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Plain-English summary</p>
        <p style="margin:0;color:${TEXT};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(summary)}</p>
      </div>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0D0D0D;border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">MCP Shield · Web preview · v0.2.1</p>
                <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:300;line-height:1.25;">Your MCP Shield report</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0;">
                <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">${greeting}</p>
                <p style="margin:12px 0 0;color:${TEXT};font-size:15px;line-height:1.6;">Here is the scan you just ran on /products/mcp-shield. Every finding below traces to a documented check in the open-source repo at github.com/AegibitSecurity/mcp-shield. We did not store the manifest or this report after sending it.</p>
              </td>
            </tr>
            ${summaryBlock}
            <tr>
              <td style="padding:0 28px;">
                <p style="margin:0 0 4px;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Findings (${findings.length} total)</p>
                <p style="margin:0 0 4px;color:${MUTED};font-size:12px;">Kind: ${kind} · Scanned: ${scanned_count} ${kind === "servers" ? "server" : "tool"}${scanned_count === 1 ? "" : "s"}</p>
                ${findings.length === 0 ? `<p style="margin:16px 0 0;color:${TEXT};font-size:14px;">No findings — the manifest passed all five AEG-MCP checks in the web-preview set.</p>` : ""}
                <table cellpadding="0" cellspacing="0" border="0" width="100%">${findingsHtml}</table>
                ${truncatedNote}
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 28px;">
                <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
                  <p style="margin:0 0 14px;color:${TEXT};font-size:14px;line-height:1.6;">For SARIF output, CI integration, and live MCP-server probing, install the CLI:</p>
                  <pre style="margin:0;background:#000;border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px 12px;font-family:ui-monospace,monospace;font-size:12px;color:${BRAND_ORANGE};white-space:pre-wrap;">pip install aegibit-mcp-shield && aegibit-mcp scan path/to/manifest.json</pre>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">AEGIBIT Security Pvt. Ltd. • Built in India • contact@aegibit.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = renderScanReportText(input);
  return { html, text, subject };
}

function renderScanReportText(input: ScanReportInput): string {
  const { kind, scanned_count, findings, summary, recipientName } = input;
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";

  const lines: string[] = [
    "MCP Shield · Web preview · v0.2.1",
    "Your MCP Shield report",
    "",
    greeting,
    "",
    "Here is the scan you just ran on /products/mcp-shield. Every finding traces to a documented check in the open-source repo. We did not store the manifest or this report after sending it.",
    "",
    `Kind: ${kind} · Scanned: ${scanned_count} ${kind === "servers" ? "server" : "tool"}${scanned_count === 1 ? "" : "s"}`,
    `Findings: ${findings.length} total`,
    "",
  ];

  if (summary) lines.push("Plain-English summary:", "", summary, "");

  if (findings.length === 0) {
    lines.push("No findings — the manifest passed all five AEG-MCP checks in the web-preview set.");
  } else {
    findings.slice(0, 30).forEach((f) => {
      lines.push(
        `[${f.severity.toUpperCase()}] ${f.check_id}${f.cwe ? " · " + f.cwe : ""} — ${f.tool_name}`,
      );
      lines.push(`  ${f.title}`);
      lines.push(`  ${f.detail}`);
      if (f.remediation) lines.push(`  Remediation: ${f.remediation}`);
      lines.push("");
    });
    if (findings.length > 30) {
      lines.push(
        `${findings.length - 30} additional finding(s) omitted. View the full result on /products/mcp-shield.`,
      );
    }
  }

  lines.push(
    "",
    "CLI install: pip install aegibit-mcp-shield && aegibit-mcp scan path/to/manifest.json",
    "",
    "AEGIBIT Security Pvt. Ltd. — contact@aegibit.com",
  );
  return lines.join("\n");
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
