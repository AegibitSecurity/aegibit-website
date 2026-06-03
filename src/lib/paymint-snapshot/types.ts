/**
 * PayMint Snapshot, shared types.
 *
 * The Snapshot is a defensible structural read of a Tally-style
 * expense CSV: counts, distinct values, ranges, top-N, variance,
 * outliers. Every number traces back to rows actually present in
 * the visitor's upload, no fabrication, no extrapolation beyond
 * what the data demonstrates.
 *
 * Discipline mirror of src/lib/mcp-scan/: the structural answer is
 * the substance; the Groq narrative is gloss. If Groq is
 * unreachable the visitor still gets the snapshot.
 */

/**
 * One normalized row extracted from the visitor's CSV. Tally
 * exports vary widely in column naming; the parser collapses
 * known-equivalents into this shape and preserves the original
 * row for diagnostic surfaces.
 */
export interface SnapshotRow {
  /** Row index in the original CSV (0-based, header excluded). */
  index: number;
  /** Voucher number if present in the export. */
  voucher_no?: string;
  /** ISO date string YYYY-MM-DD if parseable, else null. */
  date: string | null;
  /** Best-guess branch / cost centre / location attribution. */
  branch: string | null;
  /** Description / particulars / narration. */
  particulars: string;
  /** Net amount: debit minus credit, in the CSV's currency (assumed INR). */
  amount: number;
  /** Original row indexed by column name for downstream inspection. */
  raw: Record<string, string>;
}

export interface BranchAggregate {
  branch: string;
  row_count: number;
  total_amount: number;
  avg_amount: number;
  max_amount: number;
}

export interface AnomalyRow {
  index: number;
  branch: string | null;
  date: string | null;
  particulars: string;
  amount: number;
  z_score: number;
  reason: string;
}

export interface Snapshot {
  /** What the parser recognised. */
  rows_total: number;
  rows_parsed: number;
  rows_dropped: number;
  /** Distinct non-null branches. */
  branches_distinct: number;
  /** First and last parsed dates (ISO strings) or null. */
  date_range: { first: string; last: string } | null;
  /** Sum of all amounts, in INR. */
  total_spend: number;
  /** Top-5 branches by total spend, sorted desc. */
  top_branches: BranchAggregate[];
  /** Coefficient of variation across branch totals (0 = identical, >1 = high variance). */
  branch_variance_cv: number | null;
  /** Top-5 anomaly rows by absolute Z-score within their branch. */
  anomalies: AnomalyRow[];
  /** Number of rows with no branch attribution, operational blind spot. */
  rows_missing_branch: number;
  /** Parser warnings (column name guesses, date parse failures, dropped rows). */
  warnings: string[];
}

export interface SnapshotResult {
  snapshot: Snapshot;
  /** Groq plain-English narrative. null if unreachable / unconfigured. */
  narrative: string | null;
}
