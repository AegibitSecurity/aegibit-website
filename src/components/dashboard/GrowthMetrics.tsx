"use client";
import { useState, useEffect, useCallback, useRef } from "react";
interface GrowthData { window: { since: string; until: string; timezone: string }; refreshedAt: string; partial: boolean; sessions: number | null; capturedInquiries: number | null; attributedInquiries: number | null; qualifiedRecords: number | null; attributionCoverage: number | null }
const date = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(value));
export function GrowthMetrics() {
 const [data, setData] = useState<GrowthData>();
 const [error, setError] = useState<Error>();
 const [isPending, setPending] = useState(true);
 const [isFetching, setFetching] = useState(true);
 const request = useRef<AbortController | null>(null);
 const refetch = useCallback(async () => {
   request.current?.abort();
   const controller = new AbortController(); request.current = controller;
   try {
     const response = await fetch("/api/admin/growth", { cache: "no-store", signal: controller.signal });
     if (!response.ok) throw new Error(response.status === 401 ? "Sign in to view growth data." : "Growth data is unavailable.");
     const next: GrowthData = await response.json();
     if (!controller.signal.aborted) { setData(next); setError(undefined); }
   } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e : new Error("Growth data is unavailable.")); }
   finally { if (!controller.signal.aborted) { setPending(false); setFetching(false); } }
 }, []);
 // State updates in refetch follow the network response; none derive state from render.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(() => { void refetch(); const timer = setInterval(() => void refetch(), 60000); return () => { clearInterval(timer); request.current?.abort(); }; }, [refetch]);
 const metrics = [ ["Measured sessions", data?.sessions, "Visitor records created in this window; consent and tracking coverage limit the count."], ["Captured inquiries", data?.capturedInquiries, "Stored contact, demo and chat lead records, deduplicated by the existing email/source constraint. Not unique companies."], ["Records marked qualified", data?.qualifiedRecords, "Inquiries in this creation cohort currently marked qualified or converted in the CRM. Not verified opportunities or won customers."], ["Attribution coverage", data?.attributionCoverage === null || data?.attributionCoverage === undefined ? null : `${data.attributionCoverage}%`, "Share of this cohort with a visitor reference. This is not a conversion rate."] ] as const;
 return <section><div className="flex items-center justify-between gap-4 mb-5"><h2 className="text-xl text-white">Inquiry measurement</h2><button onClick={() => { setFetching(true); void refetch(); }} disabled={isFetching} className="border border-white/20 rounded px-4 py-2 text-zinc-200 disabled:opacity-50">Refresh</button></div><p className="text-zinc-300 text-sm mb-6">28 complete days, Asia/Kolkata. {data ? `${date(data.window.since)} to ${date(new Date(new Date(data.window.until).getTime() - 1).toISOString())}. Refreshed ${new Date(data.refreshedAt).toLocaleString("en-IN", {timeZone:"Asia/Kolkata"})} IST.` : "Awaiting an authenticated data response."}</p>
 {error ? <p role="alert" className="text-amber-300 mb-5">{error.message} Values below may be from the last successful refresh.</p> : null}{data?.partial ? <p role="status" className="text-amber-300 mb-5">Some queries could not be verified. Unavailable metrics show Unknown.</p> : null}
 <div className="grid sm:grid-cols-2 gap-5">{metrics.map(([label,value,definition]) => <div key={label} className="border border-white/15 rounded-xl bg-zinc-950 p-6"><h3 className="text-zinc-300 text-sm">{label}</h3><p className="text-white text-3xl my-3">{isPending ? "Loading…" : value ?? "Unknown"}</p><p className="text-zinc-400 text-sm">{definition}</p></div>)}</div><p className="text-zinc-400 text-sm mt-5">Source: existing visitors and leads tables. Internal and bot exclusion is not independently verified. No revenue or opportunity conversion is inferred from behaviour scores.</p></section>;
}
