import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { buildSnapshot } from "@/lib/paymint-snapshot/snapshot";
import { checkRateLimit, reportExportLimiter } from "@/lib/rate-limiter";
import { renderSnapshotEmailHtml } from "@/lib/report-email/paymint-snapshot";
import { sendReportEmail, writeReportLead } from "@/lib/report-email/send";

/**
 * POST /api/paymint-snapshot/email
 *
 * The email-gated lead-capture endpoint for the PayMint Snapshot
 * tool. After the visitor reviews their inline snapshot, they can
 * request the same report by email. We:
 *
 *   1. Re-run the snapshot from the CSV (cheaper than schlepping
 *      the structured result through the network twice).
 *   2. Render the HTML + plain-text email.
 *   3. Resend send.
 *   4. Write a row to `leads` with source="snapshot_export".
 *
 * Step 4 is the acquisition mechanism: every email-gated export
 * becomes a qualified lead that lands in /dashboard/leads with
 * full context (the CSV's branch count + anomaly count + spend
 * total, stored as the lead's `message`).
 *
 * Request body:
 *   { csv: string, email: string, name?: string }
 *
 * Response (200): { ok: true, lead_id?: string }
 * Response (4xx): { error: string }
 */

interface ExportRequestBody {
  csv?: string;
  email?: string;
  name?: string;
}

const CSV_BYTE_CAP = 512 * 1024;

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

  const csv = typeof body.csv === "string" ? body.csv : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name =
    typeof body.name === "string" && body.name.trim().length > 0
      ? body.name.trim().slice(0, 80)
      : undefined;

  if (!csv) return NextResponse.json({ error: "Missing `csv` field." }, { status: 400 });
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const byteLen =
    typeof TextEncoder !== "undefined" ? new TextEncoder().encode(csv).length : csv.length;
  if (byteLen > CSV_BYTE_CAP) {
    return NextResponse.json({ error: "CSV exceeds 512 KB cap." }, { status: 400 });
  }

  // Re-run the snapshot. The visitor already saw the inline version;
  // we re-compute server-side so the email body reflects the source
  // of truth, not what the client could have tampered with.
  const result = await buildSnapshot(csv);

  const { html, text, subject } = renderSnapshotEmailHtml({
    snapshot: result.snapshot,
    narrative: result.narrative,
    recipientName: name,
  });

  const send = await sendReportEmail({ to: email, subject, html, text });
  if (!send.ok) {
    return NextResponse.json(
      { error: `Email delivery failed: ${send.error ?? "unknown"}` },
      { status: 502 },
    );
  }

  const leadSummary = [
    `PayMint Snapshot export`,
    `Rows: ${result.snapshot.rows_parsed}`,
    `Branches: ${result.snapshot.branches_distinct}`,
    `Total spend: INR ${result.snapshot.total_spend.toLocaleString("en-IN")}`,
    `Anomalies: ${result.snapshot.anomalies.length}`,
    `Missing-branch rows: ${result.snapshot.rows_missing_branch}`,
  ].join(" · ");

  const leadWrite = await writeReportLead({
    email,
    source: "snapshot_export",
    page: "/products/paymint",
    summary: leadSummary,
  });

  // Even if the lead-write fails (DB error) we still confirm the
  // email send — the visitor got value and we have observability via
  // server logs to reconcile later.
  return NextResponse.json({
    ok: true,
    lead_id: leadWrite.ok ? leadWrite.id : undefined,
    lead_write_warning: leadWrite.ok ? undefined : leadWrite.error,
  });
}
