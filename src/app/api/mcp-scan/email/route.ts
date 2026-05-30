import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { scanManifest } from "@/lib/mcp-scan/scan";
import { explainFindings } from "@/lib/mcp-scan/explain";
import { checkRateLimit, reportExportLimiter } from "@/lib/rate-limiter";
import { renderScanReportHtml } from "@/lib/report-email/mcp-scan";
import { sendReportEmail, writeReportLead } from "@/lib/report-email/send";

/**
 * POST /api/mcp-scan/email
 *
 * The email-gated lead-capture endpoint for the MCP Shield scanner
 * (M-2 in the acquisition automation plan). After a visitor scans
 * a manifest inline, they can request an emailable report. We:
 *
 *   1. Re-run the scan from the manifest (server-side source of
 *      truth, prevents client tampering).
 *   2. Re-call Groq for the narrative.
 *   3. Render HTML + plain-text report and Resend send.
 *   4. Write a row to `leads` with source="scan_export".
 *
 * Step 4 is the acquisition mechanism: every email-gated export
 * becomes a lead in /dashboard/leads with full context (kind,
 * finding count by severity, top check_id).
 *
 * Request body:
 *   { manifest: string, email: string, name?: string }
 */

interface ExportRequestBody {
  manifest?: string;
  email?: string;
  name?: string;
}

const MANIFEST_BYTE_CAP = 256 * 1024;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(reportExportLimiter, ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many export requests this hour.", retryAfter },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ExportRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const manifest = typeof body.manifest === "string" ? body.manifest : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim().slice(0, 80)
      : undefined;

  if (!manifest) {
    return NextResponse.json({ error: "Missing `manifest` field." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const byteLen =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(manifest).length
      : manifest.length;
  if (byteLen > MANIFEST_BYTE_CAP) {
    return NextResponse.json({ error: "Manifest exceeds 256 KB cap." }, { status: 400 });
  }

  const result = scanManifest(manifest);
  const summary =
    result.kind !== "unknown" && result.findings.length > 0
      ? await explainFindings(result)
      : null;

  const { html, text, subject } = renderScanReportHtml({
    kind: result.kind,
    scanned_count: result.scanned_count,
    findings: result.findings,
    summary,
    recipientName: name,
  });

  const send = await sendReportEmail({ to: email, subject, html, text });
  if (!send.ok) {
    return NextResponse.json(
      { error: `Email delivery failed: ${send.error ?? "unknown"}` },
      { status: 502 },
    );
  }

  const severityCounts: Record<string, number> = {};
  for (const f of result.findings) severityCounts[f.severity] = (severityCounts[f.severity] ?? 0) + 1;
  const leadSummary = [
    `MCP Shield scan export`,
    `Kind: ${result.kind}`,
    `Scanned: ${result.scanned_count}`,
    `Findings: ${result.findings.length}`,
    Object.entries(severityCounts)
      .map(([sev, n]) => `${n} ${sev}`)
      .join(", ") || "no findings",
  ].join(" · ");

  const leadWrite = await writeReportLead({
    email,
    source: "scan_export",
    page: "/products/mcp-shield",
    summary: leadSummary,
  });

  return NextResponse.json({
    ok: true,
    lead_id: leadWrite.ok ? leadWrite.id : undefined,
    lead_write_warning: leadWrite.ok ? undefined : leadWrite.error,
  });
}
