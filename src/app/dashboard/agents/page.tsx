"use client";

import { useEffect, useState } from "react";
import {
  Activity, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Bot,
} from "lucide-react";

/**
 * /dashboard/agents — Multi-Agent Orchestrator audit dashboard.
 *
 * Reads /api/admin/agent-actions (cookie auth) and renders:
 *   1. KPI strip — last 24h: total runs, successes, failures, in-progress
 *   2. Per-agent summary — name, last run, success rate
 *   3. Recent activity stream — newest first, expandable rows
 *
 * Auto-refreshes every 30s — agent runs land in real time when the
 * cron triggers them.
 */

interface AgentAction {
  id: string;
  agent: string;
  category: string | null;
  tier: string | null;
  action: string;
  summary: string | null;
  metadata: Record<string, unknown> | null;
  status: "in_progress" | "success" | "failed" | "skipped";
  outcome: Record<string, unknown> | null;
  duration_ms: number | null;
  started_at: string;
  ended_at: string | null;
}

const STATUS_META: Record<
  AgentAction["status"],
  { label: string; bg: string; fg: string; Icon: typeof CheckCircle2 }
> = {
  success:     { label: "Success",     bg: "rgba(16,185,129,0.15)",  fg: "#34D399", Icon: CheckCircle2 },
  failed:      { label: "Failed",      bg: "rgba(239,68,68,0.15)",   fg: "#FCA5A5", Icon: XCircle },
  in_progress: { label: "In progress", bg: "rgba(168,85,247,0.15)",  fg: "#C084FC", Icon: Clock },
  skipped:     { label: "Skipped",     bg: "rgba(113,113,122,0.15)", fg: "#A1A1AA", Icon: AlertCircle },
};

const CATEGORY_COLOR: Record<string, string> = {
  content:  "#F97316",
  seo:      "#3B82F6",
  infra:    "#60A5FA",
  security: "#EF4444",
  ops:      "#F59E0B",
  outreach: "#8B5CF6",
  test:     "#10B981",
};

export default function AgentsDashboard() {
  const [rows, setRows] = useState<AgentAction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/agent-actions?limit=100", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
      } else {
        setRows(json.rows ?? []);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const last24h = (rows ?? []).filter(
    (r) => Date.now() - new Date(r.started_at).getTime() < 86_400_000,
  );
  const kpi = {
    total:      last24h.length,
    success:    last24h.filter((r) => r.status === "success").length,
    failed:     last24h.filter((r) => r.status === "failed").length,
    inProgress: last24h.filter((r) => r.status === "in_progress").length,
  };

  // Per-agent: aggregate runs in window
  const agentSummary = new Map<
    string,
    { total: number; success: number; failed: number; lastRun: string }
  >();
  for (const r of rows ?? []) {
    let s = agentSummary.get(r.agent);
    if (!s) {
      s = { total: 0, success: 0, failed: 0, lastRun: r.started_at };
      agentSummary.set(r.agent, s);
    }
    s.total += 1;
    if (r.status === "success") s.success += 1;
    if (r.status === "failed") s.failed += 1;
    if (new Date(r.started_at).getTime() > new Date(s.lastRun).getTime()) {
      s.lastRun = r.started_at;
    }
  }
  const agentList = [...agentSummary.entries()].sort(
    (a, z) => new Date(z[1].lastRun).getTime() - new Date(a[1].lastRun).getTime(),
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot size={20} style={{ color: "#F97316" }} />
            <h1 className="text-2xl font-bold text-[#F9FAFB]">Agents</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Multi-Agent Orchestrator audit log. Every autonomous action lands here.
            Auto-refreshes every 30s.
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); void load(); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.30)",
            color: "#F97316",
          }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Runs · 24h"     value={kpi.total}      color="#60A5FA" Icon={Activity} />
        <Stat label="Successes · 24h" value={kpi.success}    color="#34D399" Icon={CheckCircle2} />
        <Stat label="Failures · 24h"  value={kpi.failed}     color="#FCA5A5" Icon={XCircle} />
        <Stat label="In progress"     value={kpi.inProgress} color="#C084FC" Icon={Clock} />
      </div>

      {/* Per-agent summary */}
      <div className="rounded-xl p-5 mb-6"
        style={{ background: "#070d1a", border: "1px solid rgba(37,99,235,0.15)" }}>
        <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="text-sm font-semibold text-[#F9FAFB]">Active agents ({agentList.length})</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Aggregated over the {rows?.length ?? 0}-row window. Success rate excludes
            in-progress runs.
          </p>
        </div>
        {agentList.length === 0 ? (
          <div className="text-xs text-[#6B7280] py-6 text-center">
            No agent runs recorded yet. The cron schedules in
            .github/workflows/*.yml fire daily 03:00 UTC and will start
            populating this view automatically. To trigger manually, run
            <code className="mx-1 px-1.5 py-0.5 rounded bg-black/40 text-[#F97316] text-[11px]">
              gh workflow run daily-automation.yml
            </code>
            (requires DASHBOARD_SECRET wired into the workflow env).
          </div>
        ) : (
          <div className="space-y-2">
            {agentList.map(([name, s]) => {
              const completed = s.success + s.failed;
              const rate = completed > 0 ? Math.round((s.success / completed) * 100) : null;
              return (
                <div key={name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="font-mono text-xs text-[#D1D5DB]">{name}</div>
                  <div className="flex items-center gap-4 text-xs text-[#A1A1AA]">
                    <span><span className="text-[#34D399]">{s.success}</span>✓ <span className="text-[#FCA5A5]">{s.failed}</span>✗</span>
                    {rate !== null && (
                      <span className="text-[#A1A1AA]">{rate}% rate</span>
                    )}
                    <span className="text-[#52525B]">{relativeTime(s.lastRun)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="rounded-xl p-5"
        style={{ background: "#070d1a", border: "1px solid rgba(37,99,235,0.15)" }}>
        <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="text-sm font-semibold text-[#F9FAFB]">Recent activity</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Newest first. Click a row to expand metadata + outcome.
          </p>
        </div>
        {!rows || rows.length === 0 ? (
          <div className="text-xs text-[#6B7280] py-6 text-center">No runs yet.</div>
        ) : (
          <div className="space-y-1">
            {rows.slice(0, 50).map((r) => {
              const s = STATUS_META[r.status];
              const open = expandedId === r.id;
              const cat = r.category ?? "ops";
              return (
                <div key={r.id}>
                  <button
                    onClick={() => setExpandedId(open ? null : r.id)}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <s.Icon size={14} style={{ color: s.fg, flexShrink: 0 }} />
                    <span className="font-mono text-xs text-[#D1D5DB] flex-shrink-0 w-44 truncate">
                      {r.agent}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
                      style={{
                        background: `${CATEGORY_COLOR[cat] ?? "#A1A1AA"}20`,
                        color: CATEGORY_COLOR[cat] ?? "#A1A1AA",
                        border: `1px solid ${CATEGORY_COLOR[cat] ?? "#A1A1AA"}40`,
                      }}>
                      {cat}
                    </span>
                    {r.tier && (
                      <span className="text-[10px] text-[#52525B] font-mono flex-shrink-0">{r.tier}</span>
                    )}
                    <span className="text-xs text-[#A1A1AA] truncate flex-1">
                      {r.summary ?? r.action}
                    </span>
                    <span className="text-[10px] text-[#52525B] flex-shrink-0">
                      {r.duration_ms ? `${r.duration_ms}ms` : "—"}
                    </span>
                    <span className="text-[10px] text-[#52525B] flex-shrink-0 w-24 text-right">
                      {relativeTime(r.started_at)}
                    </span>
                  </button>
                  {open && (
                    <div className="px-3 pb-3 pl-12 text-[11px] text-[#9CA3AF] font-mono">
                      <div className="mt-1">started: {new Date(r.started_at).toISOString()}</div>
                      {r.ended_at && <div>ended: {new Date(r.ended_at).toISOString()}</div>}
                      {r.metadata && Object.keys(r.metadata).length > 0 && (
                        <pre className="mt-2 p-2 rounded bg-black/40 text-[#A1A1AA] whitespace-pre-wrap break-all">
                          metadata: {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      )}
                      {r.outcome && Object.keys(r.outcome).length > 0 && (
                        <pre className="mt-2 p-2 rounded bg-black/40 text-[#A1A1AA] whitespace-pre-wrap break-all">
                          outcome: {JSON.stringify(r.outcome, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color, Icon }: { label: string; value: number; color: string; Icon: typeof Activity }) {
  return (
    <div className="rounded-xl p-4"
      style={{ background: "#070d1a", border: "1px solid rgba(37,99,235,0.15)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">{label}</span>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-2xl font-light text-[#F9FAFB]">{value.toLocaleString()}</div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000)         return "just now";
  if (ms < 3_600_000)      return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000)     return `${Math.floor(ms / 3_600_000)}h ago`;
  if (ms < 7 * 86_400_000) return `${Math.floor(ms / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}
