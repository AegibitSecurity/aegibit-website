/**
 * PayMint Snapshot report, HTML email renderer.
 *
 * Renders a Snapshot into an email body designed to be forwarded
 * in Slack / Teams / email threads. No tracking pixels. No
 * marketing footers beyond a single "PayMint demo" link at the
 * bottom.
 *
 * Design discipline:
 *   - All values come from the Snapshot. No fabrication.
 *   - Inline-only CSS (Gmail / Outlook stripping-friendly).
 *   - Plain-text fallback exported separately so Resend can attach
 *     both parts.
 */

import type { Snapshot } from "@/lib/paymint-snapshot/types";

const BRAND_ORANGE = "#F97316";
const SURFACE = "#0A0A0A";
const TEXT = "#E4E4E7";
const MUTED = "#A1A1AA";

function inr(n: number): string {
  return `INR ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function renderSnapshotEmailHtml(args: {
  snapshot: Snapshot;
  narrative: string | null;
  recipientName?: string;
}): { html: string; text: string; subject: string } {
  const { snapshot, narrative, recipientName } = args;
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";

  const dateRange = snapshot.date_range
    ? `${snapshot.date_range.first} → ${snapshot.date_range.last}`
    : "no parseable date range";

  const subject = `Your PayMint Snapshot, ${snapshot.branches_distinct} branches, ${snapshot.anomalies.length} anomaly row${snapshot.anomalies.length === 1 ? "" : "s"}`;

  const topBranchesHtml = snapshot.top_branches
    .map(
      (b, i) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:${MUTED};font-size:13px;">${i + 1}.</td>
          <td style="padding:6px 0;color:${TEXT};font-size:14px;">${escapeHtml(b.branch)}</td>
          <td style="padding:6px 0;color:${MUTED};font-size:13px;text-align:right;">${b.row_count} rows</td>
          <td style="padding:6px 0 6px 16px;color:${TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${inr(b.total_amount)}</td>
        </tr>`,
    )
    .join("");

  const anomaliesHtml =
    snapshot.anomalies.length === 0
      ? `<p style="margin:0;color:${MUTED};font-size:14px;">No statistical outliers (|Z| ≥ 2.0). Day-to-day spend looks consistent within each branch.</p>`
      : `
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
          ${snapshot.anomalies
            .map(
              (a) => `
            <tr>
              <td style="padding:6px 12px 6px 0;color:${MUTED};font-size:13px;white-space:nowrap;">${a.date ?? "(no date)"}</td>
              <td style="padding:6px 0;color:${TEXT};font-size:14px;">${escapeHtml(a.branch ?? "(unknown)")}</td>
              <td style="padding:6px 0 6px 16px;color:${TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${inr(a.amount)}</td>
              <td style="padding:6px 0 6px 12px;color:${BRAND_ORANGE};font-size:13px;font-variant-numeric:tabular-nums;">Z=${a.z_score.toFixed(1)}</td>
            </tr>`,
            )
            .join("")}
        </table>`;

  const narrativeBlock = narrative
    ? `
        <div style="background:${SURFACE};border:1px solid rgba(249,115,22,0.20);border-radius:8px;padding:18px;margin:24px 0;">
          <p style="margin:0 0 8px;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Plain-English summary</p>
          <p style="margin:0;color:${TEXT};font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(narrative)}</p>
        </div>`
    : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0D0D0D;border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;">PayMint Snapshot</p>
                <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:300;line-height:1.25;">Your branch snapshot is ready.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0;">
                <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">${greeting}</p>
                <p style="margin:12px 0 0;color:${TEXT};font-size:15px;line-height:1.6;">Here is the snapshot you just generated on /products/paymint. Every number below traces to rows in the CSV you uploaded, we did not store the CSV, the parsed rows, or this report after sending it.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:18px;">
                  <tr>
                    <td style="padding:4px 0;color:${MUTED};font-size:13px;width:50%;">Rows parsed</td>
                    <td style="padding:4px 0;color:${TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${snapshot.rows_parsed.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:${MUTED};font-size:13px;">Distinct branches</td>
                    <td style="padding:4px 0;color:${TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${snapshot.branches_distinct}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:${MUTED};font-size:13px;">Date range</td>
                    <td style="padding:4px 0;color:${TEXT};font-size:14px;text-align:right;">${escapeHtml(dateRange)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:${MUTED};font-size:13px;">Total spend</td>
                    <td style="padding:4px 0;color:${TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${inr(snapshot.total_spend)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:${MUTED};font-size:13px;">Rows missing branch tag</td>
                    <td style="padding:4px 0;color:${snapshot.rows_missing_branch > 0 ? BRAND_ORANGE : TEXT};font-size:14px;text-align:right;font-variant-numeric:tabular-nums;">${snapshot.rows_missing_branch}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${narrativeBlock}
            <tr>
              <td style="padding:0 28px;">
                <p style="margin:0 0 12px;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Top branches by spend</p>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">${topBranchesHtml}</table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 0;">
                <p style="margin:0 0 12px;color:${BRAND_ORANGE};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;">Anomaly rows</p>
                ${anomaliesHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px 28px;">
                <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
                  <p style="margin:0 0 14px;color:${TEXT};font-size:14px;line-height:1.6;">For a 12-minute walkthrough on your real numbers with the AEGIBIT team, request a PayMint demo:</p>
                  <a href="https://www.aegibit.com/products/paymint/demo?utm_source=snapshot_email&utm_medium=email&utm_campaign=snapshot_report" style="display:inline-block;background:${BRAND_ORANGE};color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Book a PayMint demo →</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">AEGIBIT Global Consulting • Built in India • contact@aegibit.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = renderSnapshotEmailText(snapshot, narrative, recipientName);
  return { html, text, subject };
}

export function renderSnapshotEmailText(
  snapshot: Snapshot,
  narrative: string | null,
  recipientName?: string,
): string {
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";
  const dr = snapshot.date_range
    ? `${snapshot.date_range.first} → ${snapshot.date_range.last}`
    : "no parseable date range";

  const lines: string[] = [
    "PayMint Snapshot, your branch snapshot is ready.",
    "",
    greeting,
    "",
    "Here is the snapshot you just generated on /products/paymint. Every number below traces to rows in the CSV you uploaded, we did not store the CSV, the parsed rows, or this report after sending it.",
    "",
    `Rows parsed:           ${snapshot.rows_parsed}`,
    `Distinct branches:     ${snapshot.branches_distinct}`,
    `Date range:            ${dr}`,
    `Total spend:           ${inr(snapshot.total_spend)}`,
    `Rows missing branch:   ${snapshot.rows_missing_branch}`,
    "",
  ];

  if (narrative) {
    lines.push("Plain-English summary", "", narrative, "");
  }

  if (snapshot.top_branches.length > 0) {
    lines.push("Top branches by spend:");
    snapshot.top_branches.forEach((b, i) => {
      lines.push(`  ${i + 1}. ${b.branch}  ${b.row_count} rows  ${inr(b.total_amount)}`);
    });
    lines.push("");
  }

  if (snapshot.anomalies.length === 0) {
    lines.push("No statistical outliers (|Z| ≥ 2.0).");
  } else {
    lines.push("Anomaly rows:");
    snapshot.anomalies.forEach((a) => {
      lines.push(
        `  ${a.date ?? "(no date)"}  ${a.branch ?? "(unknown)"}  ${inr(a.amount)}  Z=${a.z_score.toFixed(1)}`,
      );
    });
    lines.push("");
  }

  lines.push(
    "Request a PayMint demo: https://www.aegibit.com/products/paymint/demo?utm_source=snapshot_email&utm_medium=email&utm_campaign=snapshot_report",
    "",
    "AEGIBIT Global Consulting, contact@aegibit.com",
  );

  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
