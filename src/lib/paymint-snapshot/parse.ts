/**
 * PayMint Snapshot — CSV parser.
 *
 * Tally CSV exports vary widely in column naming. This parser uses
 * a column-aliases table to map ANY of a known set of header
 * synonyms onto our normalized schema. If a column we expect is
 * missing, we surface a warning but keep parsing — partial data is
 * better than no answer.
 *
 * The parser is intentionally permissive on quoting and date
 * formats. Tally exports come from a 30-year-old Windows app and
 * have edge cases that a strict RFC-4180 reader would reject.
 *
 * No I/O — pure function. The HTTP route enforces size limits.
 */

import type { SnapshotRow } from "./types";

export interface ParsedCsv {
  rows: SnapshotRow[];
  rows_total: number;
  rows_dropped: number;
  warnings: string[];
  /** True if no recognised columns were found at all. */
  empty: boolean;
}

/**
 * Column aliases. Lowercased, whitespace-collapsed. First match wins.
 */
const COLUMN_ALIASES = {
  voucher_no: [
    "vch no",
    "voucher no",
    "voucher number",
    "vchno",
    "voucher",
  ],
  date: [
    "date",
    "vch date",
    "voucher date",
    "txn date",
    "transaction date",
    "posting date",
  ],
  branch: [
    "branch",
    "cost centre",
    "cost center",
    "location",
    "godown",
    "department",
    "branch name",
  ],
  particulars: [
    "particulars",
    "narration",
    "description",
    "details",
    "remarks",
    "memo",
  ],
  debit: [
    "debit",
    "dr",
    "debit amount",
    "debit amt",
    "dr amount",
  ],
  credit: [
    "credit",
    "cr",
    "credit amount",
    "credit amt",
    "cr amount",
  ],
  amount: [
    "amount",
    "amt",
    "value",
    "total",
  ],
} as const;

type Field = keyof typeof COLUMN_ALIASES;

export function parseCsv(input: string): ParsedCsv {
  const text = input.trim();
  if (!text) {
    return { rows: [], rows_total: 0, rows_dropped: 0, warnings: ["Empty CSV input."], empty: true };
  }

  const lines = splitLines(text);
  if (lines.length < 2) {
    return {
      rows: [],
      rows_total: 0,
      rows_dropped: 0,
      warnings: ["CSV has only a header row (or no rows at all)."],
      empty: true,
    };
  }

  const header = parseRow(lines[0]);
  const columnIndex = resolveColumnIndex(header);
  const warnings: string[] = [];

  // No critical columns recognised — bail with a clear warning.
  if (columnIndex.date === -1 && columnIndex.amount === -1 && columnIndex.debit === -1 && columnIndex.credit === -1) {
    return {
      rows: [],
      rows_total: 0,
      rows_dropped: 0,
      warnings: [
        "Could not recognise any expected columns (Date / Amount / Debit / Credit). " +
          `Header was: ${header.slice(0, 10).map((h) => JSON.stringify(h)).join(", ")}`,
      ],
      empty: true,
    };
  }

  if (columnIndex.date === -1) warnings.push("No `Date` column found — date range will be empty.");
  if (columnIndex.branch === -1) warnings.push("No `Branch` / `Cost Centre` column found — branch attribution will be blank.");
  if (columnIndex.amount === -1 && columnIndex.debit === -1 && columnIndex.credit === -1) {
    warnings.push("No `Amount` / `Debit` / `Credit` column found — totals will be 0.");
  }

  const rows: SnapshotRow[] = [];
  let dropped = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = parseRow(line);
    if (cells.length === 0) {
      dropped++;
      continue;
    }
    const raw: Record<string, string> = {};
    for (let c = 0; c < header.length; c++) raw[header[c]] = cells[c] ?? "";

    const date = parseDate(cell(cells, columnIndex.date));
    // SnapshotRow.branch is `string | null` (per types.ts) — trimNonEmpty
    // returns `string | undefined`. Normalise `undefined` → `null` here
    // so consumers see a single absence value.
    const branch = trimNonEmpty(cell(cells, columnIndex.branch)) ?? null;
    const particulars = cell(cells, columnIndex.particulars);
    const voucher_no = trimNonEmpty(cell(cells, columnIndex.voucher_no));
    const amount = computeAmount(
      cell(cells, columnIndex.debit),
      cell(cells, columnIndex.credit),
      cell(cells, columnIndex.amount),
    );

    // Drop completely-empty rows.
    if (!date && !branch && !particulars && amount === 0 && !voucher_no) {
      dropped++;
      continue;
    }

    rows.push({
      index: i - 1,
      voucher_no,
      date,
      branch,
      particulars,
      amount,
      raw,
    });
  }

  return {
    rows,
    rows_total: rows.length + dropped,
    rows_dropped: dropped,
    warnings,
    empty: rows.length === 0,
  };
}

function resolveColumnIndex(header: string[]): Record<Field, number> {
  const result: Record<Field, number> = {
    voucher_no: -1,
    date: -1,
    branch: -1,
    particulars: -1,
    debit: -1,
    credit: -1,
    amount: -1,
  };
  const normalised = header.map(normaliseHeader);
  (Object.keys(COLUMN_ALIASES) as Field[]).forEach((field) => {
    for (const alias of COLUMN_ALIASES[field]) {
      const idx = normalised.indexOf(alias);
      if (idx !== -1) {
        result[field] = idx;
        return;
      }
    }
  });
  return result;
}

function normaliseHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ").replace(/[._]/g, " ");
}

function cell(cells: string[], idx: number): string {
  if (idx === -1) return "";
  return (cells[idx] ?? "").trim();
}

function trimNonEmpty(s: string): string | undefined {
  const t = s.trim();
  return t.length > 0 ? t : undefined;
}

function parseDate(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;

  // DD-MM-YYYY / DD/MM/YYYY (Tally India default).
  const dmy = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(s);
  if (dmy) {
    const dd = pad2(dmy[1]);
    const mm = pad2(dmy[2]);
    let yyyy = dmy[3];
    if (yyyy.length === 2) yyyy = (parseInt(yyyy, 10) >= 50 ? "19" : "20") + yyyy;
    if (isValidIsoDate(`${yyyy}-${mm}-${dd}`)) return `${yyyy}-${mm}-${dd}`;
  }

  // YYYY-MM-DD.
  const ymd = /^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/.exec(s);
  if (ymd) {
    const yyyy = ymd[1];
    const mm = pad2(ymd[2]);
    const dd = pad2(ymd[3]);
    if (isValidIsoDate(`${yyyy}-${mm}-${dd}`)) return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}

function pad2(s: string): string {
  return s.length === 1 ? `0${s}` : s;
}

function isValidIsoDate(s: string): boolean {
  const d = new Date(s + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) === s;
}

function computeAmount(debit: string, credit: string, amount: string): number {
  const d = parseNumber(debit);
  const c = parseNumber(credit);
  if (d > 0 || c > 0) return d - c;
  return parseNumber(amount);
}

function parseNumber(input: string): number {
  if (!input) return 0;
  // Strip currency symbols, commas (Indian or US), and stray spaces.
  const cleaned = input.replace(/[₹$£€,\s]/g, "");
  if (!cleaned || cleaned === "-") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Minimal RFC-4180-compatible row parser. Handles quoted fields,
 * escaped quotes via doubling, and newlines inside quotes.
 */
function parseRow(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  let cur = "";
  let inQuotes = false;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cur += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      out.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += ch;
    i++;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

/**
 * Split CSV text into row-lines while respecting quoted newlines.
 */
function splitLines(text: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      cur += ch;
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}
