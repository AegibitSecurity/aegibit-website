"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const METRICS = [
  { value: "99.9%",  label: "Uptime SLA" },
  { value: "<50ms",  label: "Threat Response" },
  { value: "100%",   label: "Audit Coverage" },
  { value: "3×",     label: "Faster Operations" },
];

const INDUSTRIES = [
  {
    name: "BFSI",
    description: "Banking, financial services, and insurance. Zero-tolerance security with full regulatory auditability.",
  },
  {
    name: "Healthcare",
    description: "HIPAA-aligned AI infrastructure for clinical operations and patient data security.",
  },
  {
    name: "Enterprise SaaS",
    description: "Scalable automation and security primitives for fast-moving product teams.",
  },
];

export function TrustSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-32 px-6 lg:px-10 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div ref={ref} className="max-w-7xl mx-auto">

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(255,255,255,0.06)] rounded-sm mb-24">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-[#0A0A0A] px-8 py-10"
            >
              <p className="text-[clamp(2rem,4vw,3rem)] font-bold text-white tracking-tight mb-2">
                {m.value}
              </p>
              <p className="mono-label text-[#52525B]">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <span className="mono-label text-[#FF6A00]">Industries Served</span>
          <div className="h-px flex-1 mx-8 bg-[rgba(255,255,255,0.06)] hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22,1,0.36,1] }}
              className="group p-7 rounded-sm border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,106,0,0.2)] bg-[#111111] hover:bg-[#161616] transition-all"
            >
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-[#FF6A00] transition-colors">
                {ind.name}
              </h3>
              <p className="text-[#52525B] text-sm leading-relaxed group-hover:text-[#A1A1AA] transition-colors">
                {ind.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
