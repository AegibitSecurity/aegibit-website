"use client";
import { motion } from "framer-motion";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Fingerprint, Bot, Shield, BookOpen, Key, Activity, Puzzle, Globe, Monitor } from "lucide-react";

const FEATURES = [
  {
    icon: <Fingerprint className="w-5 h-5" />,
    color: "#2563EB",
    title: "Voice Biometric Auth",
    description: "Every command is verified against the speaker's voiceprint. Replay attacks and synthetic voice are rejected with >99.5% accuracy.",
    tags: ["Speaker Verification", "Anti-Spoofing", "Zero Trust"],
    accent: true,
  },
  {
    icon: <Bot className="w-5 h-5" />,
    color: "#06B6D4",
    title: "AI Voice Assistant",
    description: "LLM-powered natural language understanding translates spoken commands into structured, permission-checked actions.",
    tags: ["LLM", "NLU", "Contextual"],
    accent: false,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: "#8B5CF6",
    title: "RBAC Per-Command",
    description: "Role-based access control at the individual command level. Define exactly who can speak what, and when.",
    tags: ["RBAC", "ACL", "Granular"],
    accent: false,
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    color: "#10B981",
    title: "SOC-Grade Audit Logs",
    description: "Immutable, tamper-proof logs of every voice command, decision, and action. SIEM-ready export.",
    tags: ["Immutable", "SIEM", "Compliance"],
    accent: false,
  },
  {
    icon: <Key className="w-5 h-5" />,
    color: "#F59E0B",
    title: "Sudo Mode — Dual Approval",
    description: "High-risk commands require a second voice approval from a designated authority. No single point of compromise.",
    tags: ["Dual Auth", "4-Eyes", "High Risk"],
    accent: false,
  },
  {
    icon: <Activity className="w-5 h-5" />,
    color: "#EF4444",
    title: "Anomaly Detection",
    description: "ML models flag unusual command patterns, off-hours access, and behavior deviations in real time.",
    tags: ["ML", "Behavioral AI", "Alerts"],
    accent: false,
  },
  {
    icon: <Puzzle className="w-5 h-5" />,
    color: "#06B6D4",
    title: "15+ Enterprise Integrations",
    description: "Connects with Slack, Jira, Google Workspace, SIEM platforms, ServiceNow, PagerDuty, and more.",
    tags: ["REST API", "Webhooks", "Connectors"],
    accent: false,
  },
  {
    icon: <Globe className="w-5 h-5" />,
    color: "#10B981",
    title: "India Data Residency",
    description: "Enterprise plans guarantee data sovereignty — all voice data and logs stay within Indian data centers.",
    tags: ["DPDP", "Sovereignty", "On-Premise"],
    accent: false,
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    color: "#8B5CF6",
    title: "Desktop + Mobile + Web",
    description: "Native apps and web SDK so your teams can use VoiceCore from any device, in any environment.",
    tags: ["Cross-Platform", "SDK", "Native"],
    accent: false,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        label="PLATFORM FEATURES"
        title="Everything enterprise teams need. Nothing they don't."
        subtitle="Built security-first, not security-bolted-on. Every feature ships with audit trails and zero-trust enforcement."
      />

      <StaggerContainer staggerDelay={0.08} className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group relative p-6 rounded-xl border bg-[#070d1a] transition-all duration-300 cursor-default ${
              f.accent
                ? "border-[rgba(37,99,235,0.4)] shadow-[0_0_30px_rgba(37,99,235,0.12)]"
                : "border-[rgba(37,99,235,0.12)] hover:border-[rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.08)]"
            }`}
          >
            {f.accent && (
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent rounded-t-xl" />
            )}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ background: `${f.color}20`, color: f.color }}
            >
              {f.icon}
            </div>
            <h3 className="font-semibold text-[#F9FAFB] mb-2">{f.title}</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{f.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {f.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono-label text-[#374151] border border-[rgba(37,99,235,0.15)] rounded px-2 py-0.5 group-hover:border-[rgba(37,99,235,0.25)] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </StaggerContainer>
    </section>
  );
}
