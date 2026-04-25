"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";

const TESTIMONIALS = [
  {
    quote: "We evaluated six voice AI platforms. VoiceCore was the only one that didn't ask us to choose between productivity and security. The biometric layer and immutable audit logs were exactly what our CISO demanded.",
    name: "Arjun Mehta",
    title: "Head of Information Security",
    company: "Fintech Corp",
    initials: "AM",
    color: "#2563EB",
  },
  {
    quote: "Onboarding took two hours. Our SOC team was running voice-authenticated incident commands by end of day. The anomaly detection has already flagged two suspicious access patterns we'd have missed.",
    name: "Priya Sharma",
    title: "CISO",
    company: "Regional Bank",
    initials: "PS",
    color: "#06B6D4",
  },
  {
    quote: "As a CTO at a health-tech company, data residency isn't optional — it's regulatory. AEGIBIT gave us India-only data guarantees and SOC 2 documentation on day one. No other vendor could do that.",
    name: "Rahul Nair",
    title: "CTO",
    company: "HealthTech Startup",
    initials: "RN",
    color: "#8B5CF6",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        label="TESTIMONIALS"
        title="Trusted by security leaders"
        subtitle="From BFSI CISOs to healthcare CTOs — here's what early access teams are saying."
      />

      <StaggerContainer staggerDelay={0.12} className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            className="p-6 rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] hover:border-[rgba(37,99,235,0.3)] hover:shadow-[0_0_24px_rgba(37,99,235,0.08)] transition-all"
          >
            <p className="text-[#D1D5DB] text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: `${t.color}30`, border: `1px solid ${t.color}50`, color: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-[#F9FAFB] font-semibold text-sm">{t.name}</p>
                <p className="text-[#6B7280] text-xs">{t.title}, {t.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>
    </section>
  );
}
