/**
 * PayMint Snapshot — integration tests.
 *
 * Pins three contracts:
 *   1. The parser tolerates Tally's column-naming variation.
 *   2. The analyzer's aggregates match hand-computed values for
 *      small fixtures (so we'd notice any silent arithmetic drift).
 *   3. The Groq prompt builder NEVER includes raw row data.
 *      Same privacy discipline as src/lib/mcp-scan/explain.test.ts.
 */

import { describe, it, expect } from "vitest";
import { parseCsv } from "./parse";
import { analyze } from "./analyze";
import { buildPrompt } from "./explain";

// ── Fixtures ───────────────────────────────────────────────────────

const TALLY_STANDARD = `Date,Vch No.,Particulars,Cost Centre,Debit Amount,Credit Amount
01-04-2026,V001,Branch fuel expense,Howrah Branch,4500,0
02-04-2026,V002,Generator maintenance,Howrah Branch,1200,0
02-04-2026,V003,Staff lunch,Salt Lake Branch,890,0
03-04-2026,V004,Office supplies,Salt Lake Branch,2300,0
04-04-2026,V005,Diesel top-up,Howrah Branch,3800,0
05-04-2026,V006,AC service,Salt Lake Branch,5500,0
06-04-2026,V007,Stationery,Salt Lake Branch,420,0
07-04-2026,V008,Branch security,Howrah Branch,18000,0
07-04-2026,V009,Pest control,Salt Lake Branch,1800,0
`;

const TALLY_ALT_COLUMNS = `Voucher Date,Voucher Number,Description,Branch Name,Amt
2026-04-01,V001,Test row,Branch A,1000
2026-04-02,V002,Another,Branch B,2000
`;

const MISSING_BRANCH = `Date,Particulars,Amount
01-04-2026,Unattributed expense 1,100
02-04-2026,Unattributed expense 2,200
03-04-2026,Branch-coded,500
`;

const SENSITIVE_NARRATION =
  "Acme Corp confidential payment for project Blackbird re: bid 47A-X";

const SENSITIVE_CSV = `Date,Particulars,Cost Centre,Amount
01-04-2026,${SENSITIVE_NARRATION},Mumbai HQ,9999
02-04-2026,Routine,Mumbai HQ,500
03-04-2026,Routine,Mumbai HQ,400
04-04-2026,Routine,Mumbai HQ,400
05-04-2026,Routine,Mumbai HQ,400
`;

// ── Parser ────────────────────────────────────────────────────────

describe("parseCsv", () => {
  it("handles standard Tally headers", () => {
    const r = parseCsv(TALLY_STANDARD);
    expect(r.empty).toBe(false);
    expect(r.rows).toHaveLength(9);
    expect(r.rows[0].branch).toBe("Howrah Branch");
    expect(r.rows[0].amount).toBe(4500);
    expect(r.rows[0].date).toBe("2026-04-01");
  });

  it("handles alternative column names", () => {
    const r = parseCsv(TALLY_ALT_COLUMNS);
    expect(r.empty).toBe(false);
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].branch).toBe("Branch A");
    expect(r.rows[0].amount).toBe(1000);
  });

  it("warns when branch column is missing", () => {
    const r = parseCsv(MISSING_BRANCH);
    expect(r.warnings.some((w) => /Branch/i.test(w))).toBe(true);
    expect(r.rows.every((row) => row.branch === undefined || row.branch === null)).toBe(true);
  });

  it("returns empty:true for unrecognised header", () => {
    const r = parseCsv("foo,bar\n1,2");
    expect(r.empty).toBe(true);
    expect(r.warnings[0]).toMatch(/Could not recognise/);
  });

  it("returns empty:true for whitespace input", () => {
    const r = parseCsv("   ");
    expect(r.empty).toBe(true);
  });
});

// ── Analyzer ──────────────────────────────────────────────────────

describe("analyze", () => {
  it("aggregates branch totals correctly", () => {
    const { rows } = parseCsv(TALLY_STANDARD);
    const snap = analyze(rows, []);
    expect(snap.branches_distinct).toBe(2);
    const howrah = snap.top_branches.find((b) => b.branch === "Howrah Branch");
    expect(howrah).toBeDefined();
    // Sum: 4500 + 1200 + 3800 + 18000 = 27500
    expect(howrah!.total_amount).toBe(27500);
  });

  it("computes date range", () => {
    const { rows } = parseCsv(TALLY_STANDARD);
    const snap = analyze(rows, []);
    expect(snap.date_range).toEqual({ first: "2026-04-01", last: "2026-04-07" });
  });

  it("flags missing-branch rows", () => {
    const { rows } = parseCsv(MISSING_BRANCH);
    const snap = analyze(rows, []);
    expect(snap.rows_missing_branch).toBe(3);
    expect(snap.warnings.some((w) => /branch attribution/i.test(w))).toBe(true);
  });

  it("detects Z-score anomalies on a realistic-size fixture", () => {
    // 8 routine rows around INR 1000-1500 plus one clear INR 80000
    // outlier — with N=9 the std stabilises enough that the outlier's
    // Z-score clears the 2.0 threshold. Mirrors what a real PayMint
    // CSV looks like (many small rows, occasional unusual entry).
    const csv = `Date,Particulars,Cost Centre,Amount
01-04-2026,fuel,Howrah,1000
02-04-2026,fuel,Howrah,1100
03-04-2026,fuel,Howrah,1200
04-04-2026,fuel,Howrah,1300
05-04-2026,fuel,Howrah,1000
06-04-2026,fuel,Howrah,1400
07-04-2026,fuel,Howrah,1500
08-04-2026,fuel,Howrah,1100
09-04-2026,unusual large item,Howrah,80000
`;
    const { rows } = parseCsv(csv);
    const snap = analyze(rows, []);
    expect(snap.anomalies.length).toBeGreaterThanOrEqual(1);
    const top = snap.anomalies[0];
    expect(top.branch).toBe("Howrah");
    expect(Math.abs(top.amount)).toBe(80000);
  });

  it("returns null branch_variance_cv with a single branch", () => {
    const csv = `Date,Particulars,Cost Centre,Amount
01-04-2026,a,Solo,100
02-04-2026,b,Solo,200
`;
    const { rows } = parseCsv(csv);
    const snap = analyze(rows, []);
    expect(snap.branch_variance_cv).toBeNull();
  });

  it("returns an empty snapshot for zero rows", () => {
    const snap = analyze([], []);
    expect(snap.rows_parsed).toBe(0);
    expect(snap.total_spend).toBe(0);
    expect(snap.top_branches).toHaveLength(0);
  });
});

// ── Groq prompt privacy contract ──────────────────────────────────

describe("buildPrompt — privacy", () => {
  it("never includes raw row narration text", () => {
    const { rows } = parseCsv(SENSITIVE_CSV);
    const snap = analyze(rows, []);
    const prompt = buildPrompt(snap);
    // Must not contain the line-item narration.
    expect(prompt).not.toContain(SENSITIVE_NARRATION);
    expect(prompt).not.toContain("Blackbird");
    expect(prompt).not.toContain("bid 47A-X");
    // Should contain only aggregates.
    expect(prompt).toContain("Distinct branches: 1");
  });

  it("includes the branch variance summary for downstream narrative", () => {
    const { rows } = parseCsv(TALLY_STANDARD);
    const snap = analyze(rows, []);
    const prompt = buildPrompt(snap);
    expect(prompt).toMatch(/Branch variance CV/);
  });

  it("communicates 'no anomalies' explicitly when none exceed threshold", () => {
    const flat = `Date,Particulars,Cost Centre,Amount
01-04-2026,a,A,100
02-04-2026,b,A,100
03-04-2026,c,A,100
04-04-2026,d,A,100
05-04-2026,e,A,100
`;
    const { rows } = parseCsv(flat);
    const snap = analyze(rows, []);
    const prompt = buildPrompt(snap);
    expect(prompt).toMatch(/0 statistical outliers/);
  });
});
