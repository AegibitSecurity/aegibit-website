"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const CHAT = [
  { role:"user",   text:"Deploy api-gateway v2.4 to production" },
  { role:"system", text:"🔐 Verifying biometric identity…" },
  { role:"system", text:"✓ Rohan M. confirmed [score: 0.97]" },
  { role:"system", text:"✓ RBAC: admin → APPROVED" },
  { role:"system", text:"🚀 Deployed in 41s · tx-8f2a logged" },
];

const FEATURES = [
  "Voice biometric authentication",
  "Per-command RBAC enforcement",
  "Immutable audit trail",
  "ML anomaly detection",
  "15+ enterprise integrations",
];

export function ProductHighlight() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.1 });

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[rgba(255,255,255,0.06)]"
      style={{ background:"linear-gradient(180deg,#000 0%,#0A0A0A 50%,#000 100%)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left */}
        <motion.div initial={{ opacity:0, x:-24 }} animate={inView?{opacity:1,x:0}:{}}
          transition={{ duration:0.7, ease:"easeOut" }}>
          <span className="mono-label text-[#F97316] block mb-5">Product</span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white leading-tight tracking-tight mb-5">
            AEGIBIT —<br/>
            <span style={{ color:"#F97316" }}>Voice-First Security</span>
          </h2>
          <p className="text-[#52525B] text-base leading-relaxed mb-10 max-w-[420px]">
            Unified platform to manage operations, automate workflows, and control business logic — with biometric identity and audit logging on every spoken command.
          </p>
          <ul className="space-y-3 mb-10">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background:"rgba(249,115,22,0.12)", border:"1px solid rgba(249,115,22,0.25)" }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#A1A1AA] text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <Link href="/features" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80" style={{ color:"#F97316" }}>
            Explore the platform
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7h9M7.5 3l4 4-4 4"/>
            </svg>
          </Link>
        </motion.div>

        {/* Right — chat mockup */}
        <motion.div initial={{ opacity:0, x:24 }} animate={inView?{opacity:1,x:0}:{}}
          transition={{ duration:0.7, delay:0.12, ease:"easeOut" }}>
          <div className="rounded-2xl overflow-hidden"
            style={{ background:"#0D0D0D", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}>
            {/* Titlebar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[rgba(255,255,255,0.06)]" style={{ background:"#111" }}>
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"/>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"/>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"/>
              <span className="ml-4 mono-label text-[#3F3F46]">aegibit-flow · security pipeline</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background:"#F97316" }}/>
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background:"#F97316" }}/>
                </span>
                <span className="mono-label" style={{ color:"#F97316" }}>live</span>
              </div>
            </div>
            {/* Messages */}
            <div className="p-5 space-y-3">
              {CHAT.map((msg, i) => (
                <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
                  <div className="max-w-[85%] px-4 py-2.5 rounded-xl text-sm"
                    style={msg.role==="user" ? {
                      background:"rgba(249,115,22,0.15)", border:"1px solid rgba(249,115,22,0.25)", color:"#FBBF77",
                    } : {
                      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)",
                      color:"#A1A1AA", fontFamily:"var(--font-geist-mono,monospace)", fontSize:"0.78rem",
                    }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input bar */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(255,255,255,0.07)]" style={{ background:"rgba(255,255,255,0.03)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                </svg>
                <span className="text-[#3F3F46] text-xs flex-1">Speak a command…</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"#F97316" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6h8M6 2l4 4-4 4"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
