"use client";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";
import { SlideUp } from "@/components/motion/SlideUp";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Fingerprint, Lock, Shield, BookOpen, Activity } from "lucide-react";

const LAYERS = [
  { icon: <Fingerprint className="w-4 h-4" />, title: "Voice Biometric Identity", desc: "Speaker verification on every command", badge: "ACTIVE", badgeClass: "badge-active" },
  { icon: <Lock className="w-4 h-4" />, title: "TLS 1.3 + E2E Encryption", desc: "All voice data encrypted in transit and at rest", badge: "ENFORCED", badgeClass: "badge-enforced" },
  { icon: <Shield className="w-4 h-4" />, title: "RBAC + Per-Command ACL", desc: "Granular permission checks before execution", badge: "ENFORCED", badgeClass: "badge-enforced" },
  { icon: <BookOpen className="w-4 h-4" />, title: "Immutable Audit Trail", desc: "Tamper-proof log of every action taken", badge: "ACTIVE", badgeClass: "badge-active" },
  { icon: <Activity className="w-4 h-4" />, title: "ML Anomaly Detection", desc: "Behavioral AI flags deviations in real time", badge: "LEARNING", badgeClass: "badge-learning" },
];

function ShieldVisual() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Rings */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`absolute rounded-full border border-[rgba(37,99,235,0.2)] ${
            i === 1 ? "orbit-slow" : i === 2 ? "orbit-medium" : "orbit-fast"
          }`}
          style={{
            width: `${i * 80}px`,
            height: `${i * 80}px`,
          }}
        >
          <span
            className="absolute w-2 h-2 rounded-full bg-[#2563EB] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#2563EB]"
          />
        </div>
      ))}
      {/* Center shield */}
      <div className="relative z-10 w-16 h-16 rounded-xl bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.4)] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] pulse-glow">
        <Shield className="w-8 h-8 text-[#60A5FA]" />
      </div>
    </div>
  );
}

export function SecuritySection() {
  return (
    <section id="security" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070d1a] border-y border-[rgba(37,99,235,0.1)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: visual */}
        <FadeIn direction="right">
          <div className="flex flex-col items-center gap-8">
            <ShieldVisual />
            <div className="text-center">
              <p className="mono-label text-[#60A5FA] mb-2">Zero Trust Architecture</p>
              <p className="text-[#6B7280] text-sm max-w-xs">
                Every layer independently verifies identity and intent before any command executes.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right: content */}
        <div className="space-y-8">
          <SectionHeader
            label="SECURITY ARCHITECTURE"
            title="Zero Trust is not a feature. It's the foundation."
            subtitle="We don't add security on top — we build from the assumption that every request is hostile until proven otherwise."
            centered={false}
          />

          <div className="space-y-3">
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-[rgba(37,99,235,0.12)] bg-[rgba(4,8,16,0.6)] hover:border-[rgba(37,99,235,0.3)] transition-all cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(37,99,235,0.12)] flex items-center justify-center text-[#60A5FA] flex-shrink-0 mt-0.5">
                  {layer.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#F9FAFB] text-sm">{layer.title}</span>
                    <span className={`mono-label rounded px-1.5 py-0.5 ${layer.badgeClass}`}>{layer.badge}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">{layer.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
