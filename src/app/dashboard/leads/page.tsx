"use client";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Lead { id: string; email: string; name?: string; company?: string; source: string; status: string; created_at: string; message?: string; phone?: string; team_size?: string; page?: string; }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const load = useCallback(() => {
    return fetch("/api/leads", { credentials: "include", cache: "no-store", signal: AbortSignal.timeout(15000) })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? "Your session expired. Sign in again to view enquiries." : "Enquiries could not be loaded. Please retry.");
        const body = await response.json();
        if (!Array.isArray(body.leads)) throw new Error("The server did not return an enquiry list. Please retry.");
        setLeads(body.leads);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error && err.name !== "TimeoutError" ? err.message : "Loading timed out. Please retry.");
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { void load(); }, [load]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#F9FAFB]">Enquiries</h1>
        <button type="button" onClick={() => { setLoading(true); setError(""); void load(); }} disabled={loading} className="text-orange-400 disabled:opacity-50">Refresh</button>
      </div>
      <p className="text-sm text-gray-400 mb-4">Latest 100 saved enquiries. A saved enquiry does not confirm email delivery.</p>
      {error && <div role="alert" className="text-red-300 mb-4">{error} <a href="/admin/login" className="underline">Sign in</a></div>}
      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(37,99,235,0.15)] text-[#6B7280]">
              {["Email", "Name", "Company", "Source", "Status", "Date", "Details"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-[#374151]">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-red-300">Enquiry data is unavailable. Use Refresh to retry.</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-[#374151]">No leads yet. Share your site!</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[rgba(37,99,235,0.08)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                <td className="px-5 py-3 text-[#D1D5DB]">{lead.email}</td>
                <td className="px-5 py-3 text-[#6B7280]">{lead.name ?? "-"}</td>
                <td className="px-5 py-3 text-[#6B7280]">{lead.company ?? "-"}</td>
                <td className="px-5 py-3"><Badge variant="outline" className="border-[rgba(37,99,235,0.3)] text-[#60A5FA] mono-label">{lead.source}</Badge></td>
                <td className="px-5 py-3"><span className="badge-active rounded px-2 py-0.5 text-xs mono-label">{lead.status}</span></td>
                <td className="px-5 py-3 text-[#6B7280]">{new Date(lead.created_at).toLocaleString()}</td>
                <td className="px-5 py-3 min-w-64 text-gray-300"><details><summary className="cursor-pointer text-orange-400">View enquiry</summary>
                  <p className="whitespace-pre-wrap break-words mt-3">{lead.message || "No message supplied."}</p>
                  {lead.phone && <p className="mt-2">Phone: {lead.phone}</p>}
                  {lead.team_size && <p>Team size: {lead.team_size}</p>}
                  {lead.page && <p className="break-all">Page: {lead.page}</p>}
                </details></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
