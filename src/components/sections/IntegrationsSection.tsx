"use client";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import Link from "next/link";

const INTEGRATIONS = [
  { name: "Google Calendar", color: "#4285F4" },
  { name: "Gmail",           color: "#EA4335" },
  { name: "Outlook",         color: "#0078D4" },
  { name: "Slack",           color: "#4A154B" },
  { name: "Jira",            color: "#0052CC" },
  { name: "Linear",          color: "#5E6AD2" },
  { name: "ServiceNow",      color: "#81B5A1" },
  { name: "Notion",          color: "#FFFFFF" },
  { name: "Splunk",          color: "#F58220" },
  { name: "PagerDuty",       color: "#06AC38" },
  { name: "GitHub",          color: "#FFFFFF" },
  { name: "SIEM",            color: "#2563EB" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070d1a] border-y border-[rgba(37,99,235,0.1)]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="INTEGRATIONS"
          title="Works with your existing tools"
          subtitle="Plug VoiceCore into your stack in minutes — no rip-and-replace required."
        />

        <StaggerContainer staggerDelay={0.05} className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {INTEGRATIONS.map((int) => (
            <motion.div
              key={int.name}
              variants={staggerItem}
              whileHover={{ scale: 1.05, borderColor: `${int.color}50` }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[rgba(37,99,235,0.12)] bg-[rgba(4,8,16,0.6)] cursor-default transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: `${int.color}20`, color: int.color }}
              >
                {int.name.slice(0, 2)}
              </div>
              <span className="text-[#6B7280] text-xs text-center leading-tight">{int.name}</span>
            </motion.div>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center">
          <Link href="/features#integrations" className="text-[#60A5FA] text-sm hover:text-[#93C5FD] transition-colors inline-flex items-center gap-1">
            See all integrations →
          </Link>
        </div>
      </div>
    </section>
  );
}
