"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  "Voice Biometric Authentication",
  "RBAC Per-Command Control",
  "Immutable Audit Logging",
  "Zero Trust Architecture",
  "ML Anomaly Detection",
  "Dual Approval (Sudo Mode)",
  "India Data Residency",
  "On-Premise Deployment",
  "SOC 2 Compliance Path",
  "DPDP Act 2023 Aligned",
];

const COMPETITORS = [
  {
    name:   "VoiceCore",
    label:  "AEGIBIT",
    brand:  true,
    values: [true, true, true, true, true, true, true, true, true, true],
  },
  {
    name:   "Alexa Biz",
    label:  "Alexa for Business",
    brand:  false,
    values: [false, false, false, false, false, false, false, false, false, false],
  },
  {
    name:   "Cortana",
    label:  "MS Cortana",
    brand:  false,
    values: [false, false, false, false, false, false, false, false, false, false],
  },
  {
    name:   "Whisper",
    label:  "OpenAI Whisper",
    brand:  false,
    values: [false, false, false, false, false, false, false, false, false, false],
  },
];

export function ComparisonSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 sm:py-32 px-6 lg:px-10 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="mono-label text-[#FF6A00] block mb-4">Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            The only platform built security-first.
          </h2>
          <p className="text-[#52525B] text-sm mt-2">Others adapted consumer tools for business. We built for enterprise from day one.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="overflow-x-auto rounded-sm border border-[rgba(255,255,255,0.06)]"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left p-4 text-[#52525B] text-xs font-medium w-1/3">Feature</th>
                {COMPETITORS.map((c) => (
                  <th key={c.name} className={`p-4 text-xs font-semibold text-center ${c.brand ? "text-[#FF6A00]" : "text-[#2A2A2A]"} ${c.brand ? "bg-[rgba(255,106,0,0.04)]" : ""}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feat, fi) => (
                <tr key={feat} className={`border-b border-[rgba(255,255,255,0.04)] ${fi % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[rgba(255,255,255,0.01)]"}`}>
                  <td className="p-4 text-[#A1A1AA] text-xs">{feat}</td>
                  {COMPETITORS.map((c) => (
                    <td key={c.name} className={`p-4 text-center ${c.brand ? "bg-[rgba(255,106,0,0.04)]" : ""}`}>
                      {c.values[fi]
                        ? <Check className={`w-4 h-4 mx-auto ${c.brand ? "text-[#FF6A00]" : "text-[#52525B]"}`} />
                        : <X className="w-4 h-4 mx-auto text-[#1C1C1C]" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="text-[#2A2A2A] text-xs">Based on publicly available product documentation. Last updated Apr 2026.</p>
          <Link href="/alternatives/alexa-for-business" className="text-xs text-[#52525B] hover:text-[#A1A1AA] inline-flex items-center gap-1 transition-colors">
            See full comparisons <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
