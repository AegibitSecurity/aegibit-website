"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, BarChart3, BriefcaseBusiness, Check, Compass, Eye, LockKeyhole, Mail, RefreshCw, Sparkles, Target } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./command-center.module.css";

type Growth = { sessions: number | null; capturedInquiries: number | null; qualifiedRecords: number | null; attributionCoverage: number | null; partial: boolean; window: { since: string; until: string }; refreshedAt: string };
type Feed = { pending: number | null; recent: { id: string; source: string; status: string; created_at: string }[] | null; partial: boolean };
const number = (value: number | null | undefined) => value == null ? "Unavailable" : value.toLocaleString("en-IN");
const date = (value: string) => new Date(value).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });
const sources: Record<string, string> = { contact: "Project enquiry", demo: "Demo request", paymint_demo: "PayMint demo", chat: "Chat enquiry" };

export default function DashboardPage() {
  const reduce = useReducedMotion();
  const [growth, setGrowth] = useState<Growth | null>(null);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function read(path: string) {
      const response = await fetch(path, { credentials: "include", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error(response.status === 401 ? "Your session expired. Sign in again." : "Some information could not be loaded. Refresh to retry.");
      return response.json();
    }
    Promise.allSettled([read("/api/admin/growth"), read("/api/admin/command-center")]).then(([g, f]) => {
      if (controller.signal.aborted) return;
      setGrowth(g.status === "fulfilled" ? g.value : null);
      setFeed(f.status === "fulfilled" ? f.value : null);
      const failed = [g, f].find(r => r.status === "rejected");
      setError(failed?.status === "rejected" ? failed.reason.message : null);
      setLoading(false);
    });
    return () => controller.abort();
  }, [revision]);
  const unknown = !growth || growth.partial || !feed || feed.partial;
  const title = loading ? "Reading your business signals." : feed?.pending ? `${number(feed.pending)} enquiries are marked new.` : growth?.capturedInquiries ? "Interest is reaching your business." : growth?.capturedInquiries === 0 ? "Your next customer story starts here." : "A clear picture starts with connected data.";
  const priority = feed?.pending ? { title: "Review your enquiry queue", body: "Open each request, separate tests from buyers, and decide the next response. New status does not prove that a customer has not been contacted.", href: "/dashboard/leads", cta: "Review enquiries" } : { title: "Make the next project easy to understand", body: "Use one specific client workflow, a demonstrable result and a clear project-enquiry invitation. Check the visitor journey before expanding traffic.", href: "/dashboard/funnel", cta: "Inspect the journey" };
  const metrics = [
    { label: "Recorded sessions", value: growth?.sessions, icon: Eye, note: "Recorded visits, not unique people" },
    { label: "Captured enquiries", value: growth?.capturedInquiries, icon: Mail, note: "Contact, demo and chat records" },
    { label: "Qualified records", value: growth?.qualifiedRecords, icon: Target, note: "Marked qualified or converted" },
    { label: "Attribution coverage", value: growth?.attributionCoverage, icon: Compass, note: "Enquiries linked to a visitor", suffix: "%" },
  ];
  return (
    <div className={styles.center}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>AEGIBIT / OWNER WORKSPACE</p><h1>Business, in perspective.</h1><p className={styles.muted}>Understand the signals. Choose the next move.</p></div>
        <button className={styles.refresh} disabled={loading} onClick={() => { setLoading(true); setError(null); setRevision(r => r + 1); }}><RefreshCw size={16} className={loading && !reduce ? styles.spin : ""} />{loading ? "Refreshing" : "Refresh data"}</button>
      </header>
      <div className={styles.context}><span><LockKeyhole size={14} /> Private founder view</span><span>28 complete days · Asia/Kolkata</span><span>{growth ? `${date(growth.window.since)} – ${date(new Date(new Date(growth.window.until).getTime() - 1).toISOString())}` : "Reporting window loading"}</span></div>
      {error && <div role="alert" className={styles.notice}>{error} <Link href="/admin/login">Sign in</Link></div>}
      <motion.section className={styles.hero} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
        <div className={styles.heroCopy}><p className={styles.eyebrow}><Activity size={15} /> THE BUSINESS PULSE</p><h2>{title}</h2><p>One place to see how attention becomes an enquiry, and where your team needs to act next.</p><div className={styles.heroActions}><Link href="/dashboard/leads" className={styles.primary}>Open enquiry desk</Link><Link href="/dashboard/seo" className={styles.secondary}>Explore growth</Link></div></div>
        <div className={styles.orbit} aria-hidden="true"><div className={styles.ring} /><div className={styles.ringInner} /><span className={styles.orbitLabel}>ATTENTION</span><div className={styles.core}><Sparkles size={28} /><strong>AEGIBIT</strong><small>INSIGHT INTO ACTION</small></div><span className={styles.orbitBottom}>ENQUIRY · RELATIONSHIP · VALUE</span></div>
      </motion.section>
      <section className={styles.metrics} aria-label="Growth measurements" aria-busy={loading}>{metrics.map(({ label, value, icon: Icon, note, suffix }, i) => <motion.article key={label} className={styles.metric} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06, duration: .3 }}><div className={styles.metricLabel}>{label}<Icon size={18} /></div><strong className={value == null ? styles.unavailable : ""}>{loading ? "…" : `${number(value)}${value != null ? suffix ?? "" : ""}`}</strong><p>{note}</p></motion.article>)}</section>
      <p className={styles.disclosure}>Includes recorded test enquiries. Consent, blockers and missing attribution can limit coverage. These counts are not a sales forecast or a sequential conversion funnel.</p>
      <div className={styles.grid}>
        <section className={`${styles.panel} ${styles.priority}`}><p className={styles.eyebrow}>YOUR NEXT BEST ACTION</p><h2>{priority.title}</h2><p>{priority.body}</p><Link className={styles.primary} href={priority.href}>{priority.cta}</Link><div className={styles.rule}><Check size={16} /> Recommendation only. No messages are sent.</div></section>
        <section className={styles.panel}><div className={styles.sectionTop}><h2>How growth happens</h2><BarChart3 size={20} /></div><div className={styles.journey}>{[{ title: "Attract", text: "Help the right buyer discover your work.", href: "/dashboard/seo", label: "Search & visibility" },{ title: "Engage", text: "Find the pages and calls to action that hold attention.", href: "/dashboard/funnel", label: "Buyer journey" },{ title: "Convert", text: "Review saved enquiries and take the next human step.", href: "/dashboard/leads", label: "Enquiry desk" }].map(x => <Link key={x.title} href={x.href}><span className={styles.journeyDot} /><div><h3>{x.title}</h3><p>{x.text}</p><span>{x.label}</span></div></Link>)}</div></section>
        <section className={styles.panel}><div className={styles.sectionTop}><div><p className={styles.eyebrow}>LATEST 8 · ALL TIME</p><h2>The enquiry story</h2></div><Link href="/dashboard/leads">View details</Link></div><div aria-live="polite">{loading ? <p className={styles.muted}>Loading saved activity…</p> : feed?.recent == null ? <p className={styles.muted}>Activity unavailable. Refresh to retry.</p> : feed.recent.length === 0 ? <p className={styles.muted}>No matching enquiries have been recorded.</p> : feed.recent.map(item => <div className={styles.event} key={item.id}><div className={styles.eventIcon}><Mail size={16} /></div><div><h3>{sources[item.source] ?? "Enquiry"}</h3><p>{new Date(item.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} IST</p></div><span className={styles.badge}>{item.status}</span></div>)}</div></section>
        <section className={styles.panel}><div className={styles.sectionTop}><h2>What we can see</h2><BriefcaseBusiness size={20} /></div><p className={styles.muted}>A complete company story needs evidence from each part of the business.</p><div className={styles.coverage}>{[{ title: "Website & enquiries", status: loading ? "Loading" : unknown ? "Partial / unavailable" : "Connected", text: "Protected first-party visitor and enquiry records." },{ title: "Revenue & project delivery", status: "Not connected here", text: "No accounting, contract or delivery data is included." },{ title: "Heatmaps & bounce rate", status: "Not imported here", text: "Use Clarity for behaviour; bounce rate needs an analytics source." },{ title: "AI mentions & sales attribution", status: "Not measured here", text: "No inferred recommendations, wins or revenue." }].map(x => <div key={x.title}><div><h3>{x.title}</h3><span className={styles.badge}>{x.status}</span></div><p>{x.text}</p></div>)}</div></section>
      </div>
      <footer className={styles.footer}><span><LockKeyhole size={14} /> Customer details stay in the protected enquiry desk.</span><span>{growth ? `Last read ${new Date(growth.refreshedAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST` : "No successful growth refresh yet"}</span></footer>
    </div>
  );
}
