"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PILLARS = [
  {
    num:"01", title:"Cybersecurity Systems",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z"/><path d="M9 12l2 2 4-4"/></svg>,
    body:"End-to-end security architecture for regulated enterprises. Identity enforcement, threat detection, and compliance infrastructure — built from first principles.",
    tags:["Zero Trust","Threat Detection","Compliance","RBAC"],
  },
  {
    num:"02", title:"AI Agents",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07"/></svg>,
    body:"Autonomous systems that monitor, decide, and act across your operations — with the security guardrails BFSI, healthcare, and government environments demand.",
    tags:["Autonomous","LLM-Powered","Biometric Auth","Audit Logs"],
  },
  {
    num:"03", title:"Automation Infrastructure",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h2M11 8h6M7 11h4M13 11h4"/></svg>,
    body:"Replace fragile manual workflows with auditable, self-healing automation. From process orchestration to intelligent routing — at the scale enterprises require.",
    tags:["Orchestration","Self-Healing","SIEM Ready","API-First"],
  },
];

export function WhatWeDo() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.08 });
  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity:0,y:20 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.6,ease:"easeOut" }} className="mb-16">
          <span className="mono-label text-[#F97316] block mb-4">What we do</span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white leading-tight tracking-tight max-w-xl">
            We build systems that think,<br/>secure, and scale.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((p,i) => (
            <motion.div key={p.num}
              initial={{ opacity:0,y:24 }} animate={inView?{opacity:1,y:0}:{}}
              transition={{ duration:0.5,delay:i*0.1,ease:"easeOut" }}
              className="card-hover rounded-2xl p-7 border border-[rgba(255,255,255,0.07)]"
              style={{ background:"linear-gradient(145deg,#0E0E0E,#0A0A0A)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)" }}>
                {p.icon}
              </div>
              <span className="mono-label text-[#F97316] block mb-3">{p.num}</span>
              <h3 className="text-white font-semibold text-lg mb-3 leading-snug">{p.title}</h3>
              <p className="text-[#52525B] text-sm leading-relaxed mb-5">{p.body}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="mono-label text-[#3F3F46] border border-[rgba(255,255,255,0.06)] rounded-md px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
