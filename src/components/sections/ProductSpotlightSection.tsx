"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProductSpotlightSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="products" className="py-32 px-6 lg:px-10 bg-[#111111] border-y border-[rgba(255,255,255,0.06)]">
      <div ref={ref} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left: content */}
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mono-label text-[#FF6A00] block mb-6"
          >
            Product
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-white tracking-tight leading-tight mb-6"
          >
            AEGIBIT Flow
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22,1,0.36,1] }}
            className="text-[#A1A1AA] text-lg leading-relaxed mb-10"
          >
            A unified platform to manage operations, automate workflows, and control business logic.
            Built for teams that need reliability, auditability, and speed — without compromise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white border border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.25)] px-6 py-3 rounded-md transition-all"
            >
              Explore Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Right: abstract product visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22,1,0.36,1] }}
          className="relative"
        >
          {/* Dashboard wireframe */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="ml-4 mono-label text-[#2A2A2A]">aegibit-flow — dashboard</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Workflows", val: "1,284" },
                  { label: "Automations", val: "96%" },
                  { label: "Threats Blocked", val: "3,410" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#111111] rounded-md p-3 border border-[rgba(255,255,255,0.05)]">
                    <p className="text-[#52525B] text-[10px] mono-label mb-1">{s.label}</p>
                    <p className="text-white font-bold text-lg">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Activity feed */}
              <div className="space-y-2">
                {[
                  { msg: "Automated threat response triggered", time: "2s ago", dot: "#FF6A00" },
                  { msg: "Workflow 'Invoice Processing' completed", time: "1m ago", dot: "#22C55E" },
                  { msg: "AI agent deployed to production", time: "4m ago", dot: "#A1A1AA" },
                  { msg: "Compliance audit log generated", time: "8m ago", dot: "#A1A1AA" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.04)]">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                    <span className="text-[#A1A1AA] text-xs flex-1">{item.msg}</span>
                    <span className="mono-label text-[#2A2A2A] flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute -inset-4 bg-[rgba(255,106,0,0.04)] rounded-2xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
