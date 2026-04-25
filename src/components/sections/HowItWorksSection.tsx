"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Mic, Fingerprint, Zap, BookOpen } from "lucide-react";

const STEPS = [
  { num: "01", icon: <Mic className="w-5 h-5" />, title: "Speak", desc: "User issues a natural language voice command through the VoiceCore interface." },
  { num: "02", icon: <Fingerprint className="w-5 h-5" />, title: "Verify", desc: "Voiceprint is matched, RBAC is checked, and anomaly score is evaluated in <50ms." },
  { num: "03", icon: <Zap className="w-5 h-5" />, title: "Execute", desc: "Approved commands are dispatched to connected systems. Denied commands are blocked and flagged." },
  { num: "04", icon: <BookOpen className="w-5 h-5" />, title: "Log", desc: "Every action is written to an immutable audit trail with full context and timestamps." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        label="HOW IT WORKS"
        title="Speak. Verify. Execute. Log."
        subtitle="Four steps, zero trust, full auditability — every time."
      />

      <div className="mt-16 relative">
        {/* Connector line (desktop) */}
        <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB] opacity-30" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-[0_0_24px_rgba(37,99,235,0.4)]">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 mono-label text-[#2563EB] bg-[#040810] border border-[rgba(37,99,235,0.3)] rounded px-1">
                  {step.num}
                </span>
              </div>
              <h3 className="font-bold text-[#F9FAFB] text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
