"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const OFFERINGS = [
  {
    num: "01",
    title: "Cybersecurity Systems",
    body: "End-to-end security architecture for enterprises. Threat detection, identity enforcement, and compliance infrastructure built to withstand sophisticated attacks.",
    href: "/security",
  },
  {
    num: "02",
    title: "AI Agents",
    body: "Autonomous AI systems that monitor, decide, and act across your operations. Designed with security guardrails that regulated industries demand.",
    href: "/features",
  },
  {
    num: "03",
    title: "Automation Infrastructure",
    body: "Replace fragile manual workflows with auditable, self-healing automation. From process orchestration to intelligent routing — at enterprise scale.",
    href: "/features",
  },
  {
    num: "04",
    title: "SaaS Platforms",
    body: "Mission-critical software for teams that operate in high-stakes environments. Built with compliance, observability, and resilience from day one.",
    href: "/#products",
  },
];

export function CoreOfferingsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-32 px-6 lg:px-10 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <span className="mono-label text-[#FF6A00] block mb-4">Core Offerings</span>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white tracking-tight">
              What we deliver.
            </h2>
          </div>
          <Link href="/features" className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors inline-flex items-center gap-1">
            View all capabilities <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden">
          {OFFERINGS.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#0A0A0A] hover:bg-[#111111] p-10 transition-colors relative"
            >
              {/* Number */}
              <span className="mono-label text-[#2A2A2A] block mb-6">{item.num}</span>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">{item.title}</h3>

              {/* Body */}
              <p className="text-[#52525B] text-sm leading-relaxed group-hover:text-[#A1A1AA] transition-colors">
                {item.body}
              </p>

              {/* Link */}
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 text-xs text-[#FF6A00] mt-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more <ArrowUpRight className="w-3 h-3" />
              </Link>

              {/* Orange corner accent on hover */}
              <div className="absolute top-0 left-0 w-0 h-px bg-[#FF6A00] group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
