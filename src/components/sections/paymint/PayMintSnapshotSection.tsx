"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
} from "lucide-react";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { track } from "@/lib/track";

/**
 * PayMint Snapshot, interactive lead-magnet on /products/paymint.
 *
 * Mirror of McpScannerSection: paste-or-upload CSV → POST to
 * /api/paymint-snapshot → render structured snapshot + Groq
 * narrative. After the visitor reviews it, an inline "Email this
 * report to my team" form gates the lead capture (M-1 + M-2 pattern).
 *
 * Honest framing throughout:
 *   - "Web preview" badge
 *   - "We do not store the CSV, the rows, or your IP"
 *   - Inline link to /products/paymint/demo for the full picture
 */

interface BranchAggregate {
  branch: string;
  row_count: number;
  total_amount: number;
  avg_amount: number;
  max_amount: number;
}

interface AnomalyRow {
  index: number;
  branch: string | null;
  date: string | null;
  particulars: string;
  amount: number;
  z_score: number;
  reason: string;
}

interface Snapshot {
  rows_total: number;
  rows_parsed: number;
  rows_dropped: number;
  branches_distinct: number;
  date_range: { first: string; last: string } | null;
  total_spend: number;
  top_branches: BranchAggregate[];
  branch_variance_cv: number | null;
  anomalies: AnomalyRow[];
  rows_missing_branch: number;
  warnings: string[];
}

interface SnapshotResponse {
  snapshot: Snapshot;
  narrative: string | null;
}

const SAMPLE_CSV = `Date,Vch No.,Particulars,Cost Centre,Debit Amount,Credit Amount
01-04-2026,V001,Fuel,Howrah Branch,4500,0
01-04-2026,V002,Stationery,Howrah Branch,820,0
02-04-2026,V003,Generator maintenance,Howrah Branch,1200,0
02-04-2026,V004,Staff lunch,Salt Lake Branch,890,0
03-04-2026,V005,Office supplies,Salt Lake Branch,2300,0
03-04-2026,V006,Pest control,Howrah Branch,1100,0
04-04-2026,V007,Diesel top-up,Howrah Branch,3800,0
04-04-2026,V008,Internet,Salt Lake Branch,5500,0
05-04-2026,V009,AC service,Salt Lake Branch,5500,0
05-04-2026,V010,Conveyance,Howrah Branch,1400,0
06-04-2026,V011,Stationery,Salt Lake Branch,420,0
07-04-2026,V012,Branch security,Howrah Branch,18000,0
07-04-2026,V013,Tea/coffee,Salt Lake Branch,1800,0
08-04-2026,V014,Cleaning supplies,Howrah Branch,950,0
08-04-2026,V015,Repair,Salt Lake Branch,3400,0
09-04-2026,V016,Unaccounted expense,2200,0
10-04-2026,V017,Fuel,Howrah Branch,4200,0
11-04-2026,V018,Misc,1500,0
12-04-2026,V019,Office milk,Salt Lake Branch,650,0
13-04-2026,V020,Bonus payment,Salt Lake Branch,42000,0
`;

function fmtInr(n: number): string {
  return `INR ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function PayMintSnapshotSection() {
  const [csv, setCsv] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SnapshotResponse | null>(null);

  // Email gate
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  async function handleScan() {
    if (!csv.trim()) return;
    setStatus("scanning");
    setError(null);
    setResult(null);
    setEmailStatus("idle");
    setEmailError(null);
    track("cta_click", {
      cta_id: "paymint_snapshot_run",
      cta_label: "Generate snapshot",
      cta_section: "paymint_snapshot",
    });
    try {
      const res = await fetch("/api/paymint-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      setResult(json as SnapshotResponse);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  function loadSample() {
    setCsv(SAMPLE_CSV);
    setStatus("idle");
    setResult(null);
    setError(null);
    setEmailStatus("idle");
    setEmailError(null);
    track("cta_click", {
      cta_id: "paymint_snapshot_sample",
      cta_label: "Load sample CSV",
      cta_section: "paymint_snapshot",
    });
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const txt = typeof reader.result === "string" ? reader.result : "";
      setCsv(txt);
      setStatus("idle");
      setResult(null);
      setError(null);
    };
    reader.readAsText(f);
    track("cta_click", {
      cta_id: "paymint_snapshot_upload",
      cta_label: "Upload CSV",
      cta_section: "paymint_snapshot",
    });
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setError(null);
    setEmailStatus("idle");
    setEmailError(null);
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !csv.trim()) return;
    setEmailStatus("sending");
    setEmailError(null);
    track("cta_click", {
      cta_id: "paymint_snapshot_email",
      cta_label: "Email this report",
      cta_section: "paymint_snapshot",
    });
    try {
      const res = await fetch("/api/paymint-snapshot/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, email, name: name || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEmailError(json.error ?? `HTTP ${res.status}`);
        setEmailStatus("error");
        return;
      }
      setEmailStatus("sent");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Network error");
      setEmailStatus("error");
    }
  }

  return (
    <section
      id="snapshot"
      className="py-20 md:py-28 px-6 lg:px-12 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "#000" }}
      aria-labelledby="snapshot-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.30)",
          }}
        >
          <FileSpreadsheet size={12} style={{ color: "#F97316" }} />
          <span
            className="text-[10px] uppercase font-bold"
            style={{ color: "#F97316", letterSpacing: "0.18em" }}
          >
            Free tool · Web preview
          </span>
        </div>

        <h2
          id="snapshot-heading"
          className="font-light leading-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
        >
          See your branch spend, instantly.
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed max-w-3xl mb-8"
          style={{ color: "#A1A1AA" }}
        >
          Paste a Tally CSV export (or upload one), and the tool returns
          a structural snapshot in under a second: branch totals, date
          range, variance, anomaly rows, and rows that ship without a
          branch tag, the audit gap PayMint closes. We do not store the
          CSV, the rows, or your IP.
        </p>

        {/* ── Input ─────────────────────────────────────────────── */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <label
              htmlFor="snapshot-input"
              className="text-xs font-mono uppercase"
              style={{ color: "#71717A", letterSpacing: "0.16em" }}
            >
              Tally CSV
            </label>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={loadSample}
                className="text-[11px] underline-offset-4 hover:underline"
                style={{ color: "#A1A1AA" }}
              >
                Load sample CSV
              </button>
              <span style={{ color: "#3F3F46" }}>·</span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-[11px] inline-flex items-center gap-1 underline-offset-4 hover:underline"
                style={{ color: "#A1A1AA" }}
              >
                <Upload size={11} />
                Upload .csv
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={onFile}
                className="hidden"
                aria-hidden
              />
            </div>
          </div>
          <textarea
            id="snapshot-input"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={"Date,Vch No.,Particulars,Cost Centre,Debit Amount,Credit Amount\n01-04-2026,V001,Fuel,Howrah Branch,4500,0\n..."}
            spellCheck={false}
            rows={10}
            className="w-full rounded-md font-mono text-sm leading-relaxed p-4 resize-y"
            style={{
              background: "#000",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#E4E4E7",
              outline: "none",
            }}
          />
          <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
            <p className="text-xs" style={{ color: "#71717A" }}>
              Max 512 KB · 8 snapshots per hour per IP
            </p>
            <div className="flex gap-3">
              {status !== "idle" && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-sm px-4 py-2 rounded-md transition-colors"
                  style={{ color: "#A1A1AA", background: "rgba(255,255,255,0.04)" }}
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={handleScan}
                disabled={!csv.trim() || status === "scanning"}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "#F97316",
                  boxShadow: "0 0 18px rgba(249,115,22,0.28)",
                }}
              >
                {status === "scanning" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <TrendingUp size={14} />
                    Generate snapshot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────── */}
        {status === "error" && error && (
          <div
            className="rounded-lg p-4 mb-6"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.30)",
              color: "#FCA5A5",
            }}
            role="alert"
          >
            <p className="text-sm" style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
              Couldn&apos;t generate snapshot
            </p>
            <p className="text-sm" style={{ color: "#FCA5A5", opacity: 0.85 }}>
              {error}
            </p>
          </div>
        )}

        {/* ── Result ─────────────────────────────────────────────── */}
        {status === "done" && result && (
          <div>
            {/* KPI strip */}
            <div
              className="grid sm:grid-cols-3 gap-3 mb-5"
              style={{ color: "#fff" }}
            >
              <Kpi
                label="Branches"
                value={result.snapshot.branches_distinct.toLocaleString("en-IN")}
                icon={Building2}
              />
              <Kpi
                label="Rows parsed"
                value={result.snapshot.rows_parsed.toLocaleString("en-IN")}
                icon={FileSpreadsheet}
              />
              <Kpi
                label="Total spend"
                value={fmtInr(result.snapshot.total_spend)}
                icon={TrendingUp}
              />
            </div>

            {/* Groq narrative */}
            {result.narrative && (
              <div
                className="rounded-lg p-5 mb-5"
                style={{
                  background: "rgba(249,115,22,0.05)",
                  border: "1px solid rgba(249,115,22,0.20)",
                }}
              >
                <p
                  className="mono-label uppercase mb-2"
                  style={{
                    fontSize: "10px",
                    color: "#F97316",
                    letterSpacing: "0.18em",
                  }}
                >
                  Plain-English summary
                </p>
                <p
                  style={{
                    color: "#E4E4E7",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {result.narrative}
                </p>
              </div>
            )}

            {/* Top branches */}
            {result.snapshot.top_branches.length > 0 && (
              <div
                className="rounded-lg p-5 mb-5"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p
                  className="mono-label uppercase mb-3"
                  style={{ fontSize: "10px", color: "#71717A", letterSpacing: "0.18em" }}
                >
                  Top branches by spend
                </p>
                <ol className="space-y-2 list-none m-0 p-0">
                  {result.snapshot.top_branches.map((b, i) => (
                    <li
                      key={b.branch}
                      className="grid grid-cols-[24px_1fr_auto_auto] gap-3 items-center"
                    >
                      <span className="text-xs font-mono" style={{ color: "#71717A" }}>
                        {i + 1}.
                      </span>
                      <span className="text-sm" style={{ color: "#fff" }}>
                        {b.branch}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "#71717A" }}>
                        {b.row_count} rows
                      </span>
                      <span
                        className="text-sm tabular-nums text-right"
                        style={{ color: "#E4E4E7", minWidth: "8rem" }}
                      >
                        {fmtInr(b.total_amount)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Anomalies */}
            {result.snapshot.anomalies.length > 0 && (
              <div
                className="rounded-lg p-5 mb-5"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(249,115,22,0.20)",
                  borderLeft: "3px solid #F97316",
                }}
              >
                <p
                  className="mono-label uppercase mb-3"
                  style={{ fontSize: "10px", color: "#F97316", letterSpacing: "0.18em" }}
                >
                  Anomaly rows ({result.snapshot.anomalies.length})
                </p>
                <ol className="space-y-2 list-none m-0 p-0">
                  {result.snapshot.anomalies.map((a) => (
                    <li
                      key={`${a.index}-${a.amount}`}
                      className="grid grid-cols-[80px_1fr_auto_auto] gap-3 items-center"
                    >
                      <span className="text-xs font-mono" style={{ color: "#71717A" }}>
                        {a.date ?? "(no date)"}
                      </span>
                      <span className="text-sm truncate" style={{ color: "#fff" }}>
                        {a.branch ?? "(unknown branch)"} · {a.particulars}
                      </span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#F97316" }}
                      >
                        Z={a.z_score.toFixed(1)}
                      </span>
                      <span
                        className="text-sm tabular-nums text-right"
                        style={{ color: "#E4E4E7", minWidth: "8rem" }}
                      >
                        {fmtInr(a.amount)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Missing-branch callout (PayMint's wedge) */}
            {result.snapshot.rows_missing_branch > 0 && (
              <div
                className="rounded-lg p-5 mb-5"
                style={{
                  background: "rgba(234,179,8,0.05)",
                  border: "1px solid rgba(234,179,8,0.30)",
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} style={{ color: "#FACC15", marginTop: "0.15rem" }} />
                  <div>
                    <p className="font-medium" style={{ color: "#fff", fontSize: "0.95rem" }}>
                      {result.snapshot.rows_missing_branch} row(s) shipped without a branch tag.
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "#E4E4E7", lineHeight: 1.6 }}
                    >
                      These are vouchers your finance team can&apos;t trace to a specific
                      branch when auditing. PayMint&apos;s branch-coded voucher capture
                      eliminates this gap by tagging branch at the moment of expense.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warnings */}
            {result.snapshot.warnings.length > 0 && (
              <details
                className="rounded-lg p-4 mb-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <summary
                  className="cursor-pointer text-xs font-mono uppercase"
                  style={{ color: "#71717A", letterSpacing: "0.14em" }}
                >
                  Parser notes ({result.snapshot.warnings.length})
                </summary>
                <ul className="mt-3 space-y-1.5 text-sm" style={{ color: "#A1A1AA" }}>
                  {result.snapshot.warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </details>
            )}

            {/* ── Email gate (M-1 lead capture) ──────────────────── */}
            <div
              className="rounded-lg p-5 mt-8"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {emailStatus === "sent" ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: "#22C55E", marginTop: "0.15rem" }} />
                  <div>
                    <p className="font-medium" style={{ color: "#fff", fontSize: "1rem" }}>
                      Report sent to {email}.
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#A1A1AA", lineHeight: 1.6 }}>
                      Check the inbox in a few seconds. The PayMint team will reach
                      out separately within 24 business hours to walk through your
                      real numbers, no obligation.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEmail}>
                  <p
                    className="mono-label uppercase mb-3"
                    style={{ fontSize: "10px", color: "#F97316", letterSpacing: "0.18em" }}
                  >
                    Email this report to your team
                  </p>
                  <p className="mb-4 text-sm" style={{ color: "#A1A1AA", lineHeight: 1.6 }}>
                    We&apos;ll send the full snapshot (formatted for Slack / Teams /
                    forward) to your work email. The PayMint team follows up only
                    once, no drip sequence, no list-spam.
                  </p>
                  <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full rounded-md px-3 py-2 text-sm"
                      style={{
                        background: "#000",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#E4E4E7",
                        outline: "none",
                      }}
                      aria-label="Your work email"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full rounded-md px-3 py-2 text-sm"
                      style={{
                        background: "#000",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#E4E4E7",
                        outline: "none",
                      }}
                      aria-label="Your name (optional)"
                    />
                    <button
                      type="submit"
                      disabled={emailStatus === "sending" || !email.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#F97316" }}
                    >
                      {emailStatus === "sending" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Mail size={14} />
                          Email me the report
                        </>
                      )}
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-xs mt-3" style={{ color: "#FCA5A5" }}>
                      {emailError}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* CTA to demo */}
            <div className="mt-6 text-center">
              <p style={{ color: "#A1A1AA", fontSize: "0.92rem", lineHeight: 1.6 }}>
                Want the AEGIBIT team to walk through your real numbers?{" "}
                <TrackedLink
                  href="/products/paymint/demo?utm_source=snapshot_inline&utm_medium=cta&utm_campaign=snapshot_to_demo"
                  ctaId="paymint_snapshot_to_demo"
                  ctaLabel="Book a PayMint demo"
                  ctaSection="paymint_snapshot"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  Book a PayMint demo
                </TrackedLink>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Building2;
}) {
  return (
    <div
      className="rounded-lg p-4 flex items-center gap-3"
      style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-md"
        style={{
          width: "36px",
          height: "36px",
          background: "rgba(249,115,22,0.10)",
          border: "1px solid rgba(249,115,22,0.30)",
        }}
      >
        <Icon size={16} style={{ color: "#F97316" }} />
      </div>
      <div>
        <p
          className="text-[10px] uppercase"
          style={{ color: "#71717A", letterSpacing: "0.16em" }}
        >
          {label}
        </p>
        <p className="text-base font-semibold tabular-nums" style={{ color: "#fff" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
