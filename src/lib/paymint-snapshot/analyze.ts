/**
 * PayMint Snapshot — analyzer.
 *
 * Turns parsed CSV rows into the defensible Snapshot structure
 * surfaced on /products/paymint. Every aggregate traces to rows
 * that exist in the visitor's upload:
 *
 *   - branch totals: sum over rows where row.branch === b
 *   - branch variance: coefficient of variation across branch totals
 *   - anomalies: per-branch Z-score on amount, top-5 by |Z|
 *   - rows_missing_branch: count of rows with no branch attribution —
 *     PayMint's wedge; this is the "you can't audit what you can't
 *     attribute" gap that the platform closes
 *
 * No I/O, no globals — pure function. Tested in analyze.test.ts.
 */

import type {
  AnomalyRow,
  BranchAggregate,
  Snapshot,
  SnapshotRow,
} from "./types";

const TOP_N_BRANCHES = 5;
const TOP_N_ANOMALIES = 5;
const ANOMALY_Z_THRESHOLD = 2.0;

export function analyze(rows: SnapshotRow[], parseWarnings: string[]): Snapshot {
  const warnings: string[] = [...parseWarnings];

  if (rows.length === 0) {
    return {
      rows_total: 0,
      rows_parsed: 0,
      rows_dropped: 0,
      branches_distinct: 0,
      date_range: null,
      total_spend: 0,
      top_branches: [],
      branch_variance_cv: null,
      anomalies: [],
      rows_missing_branch: 0,
      warnings,
    };
  }

  // ── Date range ─────────────────────────────────────────────────
  const datedRows = rows.filter((r): r is SnapshotRow & { date: string } => r.date !== null);
  let dateRange: Snapshot["date_range"] = null;
  if (datedRows.length > 0) {
    const sorted = [...datedRows].sort((a, b) => a.date.localeCompare(b.date));
    dateRange = { first: sorted[0].date, last: sorted[sorted.length - 1].date };
  }

  // ── Branch aggregates ──────────────────────────────────────────
  const byBranch = new Map<string, SnapshotRow[]>();
  let missingBranch = 0;
  for (const r of rows) {
    if (r.branch) {
      const list = byBranch.get(r.branch) ?? [];
      list.push(r);
      byBranch.set(r.branch, list);
    } else {
      missingBranch++;
    }
  }
  const branchTotals: BranchAggregate[] = [];
  for (const [branch, list] of byBranch.entries()) {
    const total = list.reduce((sum, r) => sum + r.amount, 0);
    const maxAmt = list.reduce((m, r) => Math.max(m, Math.abs(r.amount)), 0);
    branchTotals.push({
      branch,
      row_count: list.length,
      total_amount: total,
      avg_amount: total / list.length,
      max_amount: maxAmt,
    });
  }
  branchTotals.sort((a, b) => Math.abs(b.total_amount) - Math.abs(a.total_amount));
  const topBranches = branchTotals.slice(0, TOP_N_BRANCHES);

  // ── Branch variance (coefficient of variation) ─────────────────
  const branchVarianceCv = computeCV(branchTotals.map((b) => b.total_amount));

  // ── Anomalies (per-branch Z-score) ─────────────────────────────
  const anomalies: AnomalyRow[] = [];
  for (const [branch, list] of byBranch.entries()) {
    if (list.length < 4) continue; // Z-score is unstable below N=4.
    const amounts = list.map((r) => Math.abs(r.amount));
    const mean = amounts.reduce((s, n) => s + n, 0) / amounts.length;
    const variance =
      amounts.reduce((s, n) => s + (n - mean) ** 2, 0) / amounts.length;
    const std = Math.sqrt(variance);
    if (std === 0) continue;
    for (const r of list) {
      const z = (Math.abs(r.amount) - mean) / std;
      if (Math.abs(z) >= ANOMALY_Z_THRESHOLD) {
        anomalies.push({
          index: r.index,
          branch,
          date: r.date,
          particulars: r.particulars.slice(0, 120),
          amount: r.amount,
          z_score: Number(z.toFixed(2)),
          reason: `|Z| ≥ ${ANOMALY_Z_THRESHOLD.toFixed(1)} for branch ${JSON.stringify(branch)}`,
        });
      }
    }
  }
  anomalies.sort((a, b) => Math.abs(b.z_score) - Math.abs(a.z_score));
  const topAnomalies = anomalies.slice(0, TOP_N_ANOMALIES);

  // ── Totals ─────────────────────────────────────────────────────
  const totalSpend = rows.reduce((s, r) => s + r.amount, 0);

  if (missingBranch > 0) {
    warnings.push(
      `${missingBranch} row(s) have no branch attribution — PayMint's branch-coded ` +
        "voucher capture eliminates this gap by tagging branch at the moment of expense.",
    );
  }

  return {
    rows_total: rows.length,
    rows_parsed: rows.length,
    rows_dropped: 0, // dropped tracked separately at parse-time
    branches_distinct: byBranch.size,
    date_range: dateRange,
    total_spend: round2(totalSpend),
    top_branches: topBranches.map((b) => ({
      branch: b.branch,
      row_count: b.row_count,
      total_amount: round2(b.total_amount),
      avg_amount: round2(b.avg_amount),
      max_amount: round2(b.max_amount),
    })),
    branch_variance_cv: branchVarianceCv === null ? null : Number(branchVarianceCv.toFixed(3)),
    anomalies: topAnomalies.map((a) => ({ ...a, amount: round2(a.amount) })),
    rows_missing_branch: missingBranch,
    warnings,
  };
}

function computeCV(values: number[]): number | null {
  if (values.length < 2) return null;
  const abs = values.map((v) => Math.abs(v));
  const mean = abs.reduce((s, n) => s + n, 0) / abs.length;
  if (mean === 0) return null;
  const variance = abs.reduce((s, n) => s + (n - mean) ** 2, 0) / abs.length;
  const std = Math.sqrt(variance);
  return std / mean;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
