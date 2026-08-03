"use client";
import { useEffect, useState } from "react";

interface Visitor { id: string; ip_address?: string; device?: string; country?: string; behavior_score: number; created_at: string; }
interface Daily { today: number; yesterday: number; last7: number; last30: number; days: { date: string; count: number }[]; }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [daily, setDaily] = useState<Daily | null>(null);
  const [liveNow, setLiveNow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time "on the site right now" tile: poll every 8s while this
  // dashboard tab is visible. Backed by the presence heartbeat every
  // visitor's browser sends (see useVisitorTracking effect 0).
  useEffect(() => {
    let stop = false;
    const poll = () => {
      if (stop || document.visibilityState !== "visible") return;
      fetch("/api/admin/visitors-now", { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (!stop && d) setLiveNow(typeof d.now === "number" ? d.now : null); })
        .catch(() => {});
    };
    poll();
    const t = setInterval(poll, 8000);
    document.addEventListener("visibilitychange", poll);
    return () => { stop = true; clearInterval(t); document.removeEventListener("visibilitychange", poll); };
  }, []);

  useEffect(() => {
    fetch("/api/analytics", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setVisitors(d.visitors ?? []); setLoading(false); })
      .catch(() => setLoading(false));
    fetch("/api/admin/visitors-daily", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d && !d.error) setDaily(d); })
      .catch(() => {});
  }, []);

  const maxDay = daily ? Math.max(1, ...daily.days.map((d) => d.count)) : 1;
  const fmtDay = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

  function scoreColor(score: number) {
    if (score >= 76) return "text-[#EF4444]";
    if (score >= 51) return "text-[#F59E0B]";
    if (score >= 21) return "text-[#06B6D4]";
    return "text-[#6B7280]";
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#F9FAFB] mb-6">Visitors</h1>

      {/* Live right now (real-time presence) */}
      <div className="rounded-xl border border-[rgba(16,185,129,0.35)] bg-[#06120d] p-5 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#10B981] mb-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
            </span>
            Live · on the site right now
          </p>
          <p className="text-4xl font-bold text-[#F9FAFB] tabular-nums">
            {liveNow === null ? "…" : liveNow.toLocaleString("en-IN")}
          </p>
        </div>
        <p className="text-[11px] text-[#374151] max-w-[220px] text-right">
          Distinct visitors whose browser pinged in the last 75 seconds. Updates every 8s.
        </p>
      </div>

      {/* Daily summary (IST) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today", value: daily?.today },
          { label: "Yesterday", value: daily?.yesterday },
          { label: "Last 7 days", value: daily?.last7 },
          { label: "Last 30 days", value: daily?.last30 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] p-5">
            <p className="text-[11px] uppercase tracking-wider text-[#6B7280] mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-[#F9FAFB] tabular-nums">
              {s.value === undefined ? "…" : s.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Visitors per day, last 30 days (IST) */}
      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] p-5 mb-6">
        <p className="text-[11px] uppercase tracking-wider text-[#6B7280] mb-4">Visitors per day (last 30 days, IST)</p>
        {!daily ? (
          <p className="text-[#374151] text-sm">Loading…</p>
        ) : (
          <div className="space-y-1.5">
            {daily.days.slice().reverse().map((d) => (
              <div key={d.date} className="flex items-center gap-3 text-sm">
                <span className="w-16 flex-shrink-0 text-[#6B7280] tabular-nums">{fmtDay(d.date)}</span>
                <div className="flex-1 h-4 rounded bg-[rgba(37,99,235,0.06)] overflow-hidden">
                  <div className="h-full rounded" style={{ width: `${(d.count / maxDay) * 100}%`, background: "#F97316", minWidth: d.count > 0 ? "3px" : "0" }} />
                </div>
                <span className="w-10 flex-shrink-0 text-right font-semibold text-[#D1D5DB] tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] uppercase tracking-wider text-[#6B7280] mb-3">Recent visitor sessions</p>
      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(37,99,235,0.15)] text-[#6B7280]">
              {["IP", "Device", "Country", "Score", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#374151]">Loading...</td></tr>
            ) : visitors.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#374151]">No visitors tracked yet.</td></tr>
            ) : visitors.map((v) => (
              <tr key={v.id} className="border-b border-[rgba(37,99,235,0.08)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                <td className="px-5 py-3 text-[#D1D5DB] font-mono text-xs">{v.ip_address ?? "-"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{v.device ?? "-"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{v.country ?? "-"}</td>
                <td className={`px-5 py-3 font-bold ${scoreColor(v.behavior_score)}`}>{v.behavior_score}</td>
                <td className="px-5 py-3 text-[#6B7280]">{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
