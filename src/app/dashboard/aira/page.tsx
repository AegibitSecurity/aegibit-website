"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Mail,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

/**
 * /dashboard/aira — Aira Ops Dashboard
 *
 * Real-time operator view for the AEGIBIT founders. Single screen showing:
 *   • Total leads + today / this week / month
 *   • Demo pipeline by status (new → contacted → qualified → converted)
 *   • Lead source breakdown (paymint_demo / contact / waitlist / etc.)
 *   • Recent 10 leads with quick actions
 *   • Pipeline health badge (Resend OK, Supabase OK, env-vars OK)
 *
 * Auth via NEXT_PUBLIC_DASHBOARD_TOKEN bearer (existing convention).
 * Auto-refreshes every 60 seconds for live ops feel.
 */

interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  team_size?: string;
  message?: string;
  source: string;
  page?: string;
  status: string;
  created_at: string;
}

interface HealthReport {
  timestamp: string;
  environment?: string;
  region?: string;
  env: Record<string, boolean>;
  supabase: { ok: boolean; total_leads?: number; recent_5?: unknown[]; error?: string };
  resend: unknown;
}

const SOURCE_LABELS: Record<string, string> = {
  paymint_demo: "PayMint Demo",
  demo:         "Generic Demo",
  contact:      "Contact Form",
  waitlist:     "Waitlist",
  exit_intent:  "Exit Popup",
};

const SOURCE_COLORS: Record<string, string> = {
  paymint_demo: "#F97316",
  demo:         "#3B82F6",
  contact:      "#8B5CF6",
  waitlist:     "#10B981",
  exit_intent:  "#F59E0B",
};

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  new:        { bg: "rgba(59,130,246,0.15)",  fg: "#60A5FA" },
  contacted:  { bg: "rgba(245,158,11,0.15)",  fg: "#FBBF24" },
  qualified:  { bg: "rgba(168,85,247,0.15)",  fg: "#C084FC" },
  converted:  { bg: "rgba(16,185,129,0.15)",  fg: "#34D399" },
};

export default function AiraOpsDashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [health, setHealth] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setRefreshing(true);
    const token = process.env.NEXT_PUBLIC_DASHBOARD_TOKEN ?? "";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [leadsRes, healthRes] = await Promise.all([
        fetch("/api/leads", { headers, cache: "no-store" }).then((r) => r.json()),
        fetch("/api/admin/health", { headers, cache: "no-store" }).then((r) => r.json()),
      ]);
      setLeads(leadsRes.leads ?? []);
      setHealth(healthRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Aggregations ──────────────────────────────────────────────────
  const total = leads?.length ?? 0;
  const today = leads?.filter((l) => isToday(l.created_at)).length ?? 0;
  const thisWeek = leads?.filter((l) => isThisWeek(l.created_at)).length ?? 0;
  const thisMonth = leads?.filter((l) => isThisMonth(l.created_at)).length ?? 0;
  const paymintDemos = leads?.filter((l) => l.source === "paymint_demo").length ?? 0;

  const sourceBreakdown = aggregate(leads ?? [], (l) => l.source);
  const statusBreakdown = aggregate(leads ?? [], (l) => l.status);

  // ── Render ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8">
        <div className="text-[#6B7280] text-sm">Loading Aira Ops…</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} style={{ color: "#F97316" }} />
            <h1 className="text-2xl font-bold text-[#F9FAFB]">Aira Ops</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Real-time view of every lead, every demo, every signal — auto-refreshing every 60s.
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.30)",
            color: "#F97316",
          }}
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh now"}
        </button>
      </div>

      {/* ── Health bar ─────────────────────────────────────────────── */}
      <HealthBar health={health} error={error} />

      {/* ── KPI cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total leads"      value={total}        icon={Mail} accent="#60A5FA" />
        <Stat label="Today"            value={today}        icon={Calendar} accent="#34D399" />
        <Stat label="This week"        value={thisWeek}     icon={TrendingUp} accent="#FBBF24" />
        <Stat label="PayMint demos"    value={paymintDemos} icon={Sparkles} accent="#F97316" />
      </div>

      {/* ── Two-column layout: pipeline + sources ────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <Panel title="Pipeline by status" subtitle={`${total} leads · this month: ${thisMonth}`}>
          {Object.keys(STATUS_COLORS).map((status) => {
            const count = statusBreakdown[status] ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            const c = STATUS_COLORS[status];
            return (
              <div key={status} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: c.bg, color: c.fg }}
                  >
                    {status}
                  </span>
                  <span className="text-sm font-medium text-[#D1D5DB]">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                  <div
                    style={{
                      width: `${pct}%`,
                      background: c.fg,
                      height: "100%",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Lead sources" subtitle="Where they came from">
          {Object.entries(sourceBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([src, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              const color = SOURCE_COLORS[src] ?? "#6B7280";
              return (
                <div key={src} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: color }}
                      />
                      <span className="text-xs text-[#D1D5DB]">
                        {SOURCE_LABELS[src] ?? src}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#D1D5DB]">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, background: color, height: "100%" }}
                    />
                  </div>
                </div>
              );
            })}
          {total === 0 && (
            <div className="text-xs text-[#6B7280] py-4 text-center">
              No leads yet. They&apos;ll appear here in real time.
            </div>
          )}
        </Panel>
      </div>

      {/* ── Recent leads table ────────────────────────────────────── */}
      <Panel title="Recent leads" subtitle="Last 10 — newest first">
        {leads && leads.length > 0 ? (
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.05)] text-[10px] uppercase tracking-wider text-[#6B7280]">
                  <th className="text-left px-5 py-3 font-medium">When</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Company</th>
                  <th className="text-left px-5 py-3 font-medium">Source</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((l) => {
                  const s = STATUS_COLORS[l.status] ?? STATUS_COLORS.new;
                  const srcColor = SOURCE_COLORS[l.source] ?? "#6B7280";
                  return (
                    <tr key={l.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3 text-xs text-[#9CA3AF]">{relativeTime(l.created_at)}</td>
                      <td className="px-5 py-3">
                        <a
                          href={`mailto:${l.email}`}
                          className="text-[#60A5FA] hover:underline text-xs"
                        >
                          {l.email}
                        </a>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#D1D5DB]">{l.name || "—"}</td>
                      <td className="px-5 py-3 text-xs text-[#D1D5DB]">{l.company || "—"}</td>
                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            background: `${srcColor}20`,
                            color: srcColor,
                            border: `1px solid ${srcColor}40`,
                          }}
                        >
                          {SOURCE_LABELS[l.source] ?? l.source}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: s.bg, color: s.fg }}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-[#6B7280] py-8 text-center">
            No leads yet. Submit a test from /products/paymint/demo and refresh.
          </div>
        )}
      </Panel>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function HealthBar({ health, error }: { health: HealthReport | null; error: string | null }) {
  const allGreen =
    !error &&
    health?.supabase?.ok &&
    health?.env?.RESEND_API_KEY &&
    health?.env?.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div
      className="rounded-xl p-4 mb-6 flex items-center gap-3"
      style={{
        background: allGreen ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
        border: `1px solid ${allGreen ? "rgba(16,185,129,0.20)" : "rgba(239,68,68,0.20)"}`,
      }}
    >
      {allGreen ? (
        <CheckCircle2 size={18} style={{ color: "#10B981" }} />
      ) : (
        <AlertCircle size={18} style={{ color: "#EF4444" }} />
      )}
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: allGreen ? "#34D399" : "#FCA5A5" }}>
          {allGreen ? "All systems operational" : "Pipeline issue detected"}
        </div>
        <div className="text-xs text-[#6B7280] mt-0.5">
          {allGreen
            ? `Supabase ${health?.supabase.total_leads ?? 0} leads · Resend configured · Region ${health?.region ?? "?"}`
            : (error ?? "Check /api/admin/health for details")}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "#070d1a",
        border: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-[#6B7280]">{label}</span>
        <Icon size={14} style={{ color: accent }} />
      </div>
      <div className="text-2xl font-light text-[#F9FAFB]">{value.toLocaleString()}</div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "#070d1a",
        border: "1px solid rgba(37,99,235,0.15)",
      }}
    >
      <div className="mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
        <h2 className="text-sm font-semibold text-[#F9FAFB]">{title}</h2>
        {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function aggregate<T>(arr: T[], key: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of arr) {
    const k = key(x);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  return d.toDateString() === n.toDateString();
}
function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  const ms = n.getTime() - d.getTime();
  return ms < 7 * 24 * 60 * 60 * 1000;
}
function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`;
  if (ms < 7 * 86_400_000) return `${Math.floor(ms / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString();
}
