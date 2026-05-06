"use client";
import { useEffect, useState } from "react";

interface Visitor { id: string; ip_address?: string; device?: string; country?: string; behavior_score: number; created_at: string; }

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setVisitors(d.visitors ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function scoreColor(score: number) {
    if (score >= 76) return "text-[#EF4444]";
    if (score >= 51) return "text-[#F59E0B]";
    if (score >= 21) return "text-[#06B6D4]";
    return "text-[#6B7280]";
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#F9FAFB] mb-6">Visitors</h1>
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
                <td className="px-5 py-3 text-[#D1D5DB] font-mono text-xs">{v.ip_address ?? "—"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{v.device ?? "—"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{v.country ?? "—"}</td>
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
