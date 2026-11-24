"use client";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Lead { id: string; email: string; name?: string; company?: string; source: string; status: string; created_at: string; message?: string; phone?: string; team_size?: string; page?: string; }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{leadId:string;to:string;subject:string;text:string} | null>(null);
  const [sending, setSending] = useState(false);
  const [emailNotice, setEmailNotice] = useState("");
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
  async function followup(leadId: string, send = false) {
    setSending(true); setEmailNotice("");
    try {
      const response = await fetch("/api/admin/enquiry-followup", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, send }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Follow-up unavailable");
      if (send) { setDraft(null); setEmailNotice(body.message + (body.statusUpdated ? "" : " Enquiry status could not be updated.")); void load(); }
      else setDraft({ leadId, ...body });
    } catch (err) { setEmailNotice(err instanceof Error ? err.message : "Sending outcome unknown. Check provider logs before retrying."); }
    finally { setSending(false); }
  }

  useEffect(() => { void load(); }, [load]);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#F9FAFB]">Enquiries</h1>
        <button type="button" onClick={() => { setLoading(true); setError(""); void load(); }} disabled={loading} className="min-h-11 px-3 text-orange-400 disabled:opacity-50">Refresh</button>
      </div>
      <p className="text-sm text-gray-400 mb-4">Latest 100 saved enquiries. A saved enquiry does not confirm email delivery.</p>
      {error && <div role="alert" className="text-red-300 mb-4">{error} <a href="/admin/login" className="underline">Sign in</a></div>}

      {emailNotice && <p role="status" className="p-4 mb-4 rounded-xl border border-orange-400/30 text-orange-200">{emailNotice}</p>}
      {draft && <section aria-label="Email preview" className="p-6 mb-6 rounded-xl border border-orange-400/30 bg-zinc-950 text-gray-200">
        <h2 className="text-xl mb-3">Review contextual follow-up</h2><p>To: {draft.to}</p><p>Subject: {draft.subject}</p><p className="whitespace-pre-wrap my-4">{draft.text}</p>
        <p className="text-sm text-gray-400 mb-4">One email only. Replies go to contact@aegibit.com. Provider acceptance does not confirm inbox delivery.</p>
        <button disabled={sending} onClick={() => void followup(draft.leadId,true)} className="min-h-11 px-4 rounded bg-orange-400 text-black disabled:opacity-50">{sending ? "Sending…" : "Send this follow-up"}</button>
        <button disabled={sending} onClick={() => setDraft(null)} className="min-h-11 px-4 ml-3">Cancel</button>
      </section>}
      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(37,99,235,0.15)] text-[#9CA3AF]">
              {["Email", "Name", "Company", "Source", "Status", "Date", "Details"].map((h) => (
                <th scope="col" key={h} className="text-left px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-[#9CA3AF]">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-red-300">Enquiry data is unavailable. Use Refresh to retry.</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-[#9CA3AF]">No leads yet. Share your site!</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[rgba(37,99,235,0.08)] hover:bg-[rgba(37,99,235,0.04)] transition-colors">
                <td className="px-5 py-3 text-[#D1D5DB]">{lead.email}</td>
                <td className="px-5 py-3 text-[#9CA3AF]">{lead.name ?? "-"}</td>
                <td className="px-5 py-3 text-[#9CA3AF]">{lead.company ?? "-"}</td>
                <td className="px-5 py-3"><Badge variant="outline" className="border-[rgba(37,99,235,0.3)] text-[#60A5FA] mono-label">{lead.source}</Badge></td>
                <td className="px-5 py-3"><span className="badge-active rounded px-2 py-0.5 text-xs mono-label">{lead.status}</span></td>
                <td className="px-5 py-3 text-[#9CA3AF]">{new Date(lead.created_at).toLocaleString()}</td>
                <td className="px-5 py-3 min-w-64 text-gray-300"><details><summary className="cursor-pointer min-h-11 py-3 text-orange-400">View enquiry</summary>
                  <p className="whitespace-pre-wrap break-words mt-3">{lead.message || "No message supplied."}</p>
                  {lead.phone && <p className="mt-2">Phone: {lead.phone}</p>}
                  {lead.team_size && <p>Team size: {lead.team_size}</p>}
                  {["contact", "demo", "paymint_demo"].includes(lead.source) && <button disabled={sending} onClick={() => void followup(lead.id)} className="block min-h-11 mt-3 text-orange-300 underline disabled:opacity-50">Preview follow-up email</button>}
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
