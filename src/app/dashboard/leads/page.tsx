"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Lead { id: string; email: string; name?: string; company?: string; source: string; status: string; created_at: string; }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setLeads(d.leads ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#F9FAFB] mb-6">Leads</h1>
      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(37,99,235,0.15)] text-[#6B7280]">
              {["Email", "Name", "Company", "Source", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-[#374151]">Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-[#374151]">No leads yet. Share your site!</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[rgba(37,99,235,0.08)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                <td className="px-5 py-3 text-[#D1D5DB]">{lead.email}</td>
                <td className="px-5 py-3 text-[#6B7280]">{lead.name ?? "—"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{lead.company ?? "—"}</td>
                <td className="px-5 py-3"><Badge variant="outline" className="border-[rgba(37,99,235,0.3)] text-[#60A5FA] mono-label">{lead.source}</Badge></td>
                <td className="px-5 py-3"><span className="badge-active rounded px-2 py-0.5 text-xs mono-label">{lead.status}</span></td>
                <td className="px-5 py-3 text-[#6B7280]">{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
