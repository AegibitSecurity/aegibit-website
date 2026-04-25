"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/motion/StaggerContainer";
import { FadeIn } from "@/components/motion/FadeIn";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader
        label="PRICING"
        title="Start free. Scale as you grow."
        subtitle="No hidden fees. No vendor lock-in. Cancel anytime."
      />

      {/* Toggle */}
      <FadeIn delay={0.3} className="flex items-center justify-center gap-4 mt-8">
        <span className={`text-sm ${!annual ? "text-[#F9FAFB]" : "text-[#6B7280]"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[#2563EB]" : "bg-[#1a2a4a]"}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${annual ? "left-7" : "left-1"}`} />
        </button>
        <span className={`text-sm flex items-center gap-2 ${annual ? "text-[#F9FAFB]" : "text-[#6B7280]"}`}>
          Annual
          <span className="mono-label text-[#10B981] border border-[rgba(16,185,129,0.3)] rounded px-1.5 py-0.5">SAVE 20%</span>
        </span>
      </FadeIn>

      <StaggerContainer staggerDelay={0.12} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {PRICING_PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            variants={staggerItem}
            className={cn(
              "relative p-7 rounded-2xl border flex flex-col transition-all",
              plan.highlighted
                ? "border-[rgba(37,99,235,0.5)] bg-[#070d1a] shadow-[0_0_50px_rgba(37,99,235,0.2)] scale-[1.02]"
                : "border-[rgba(37,99,235,0.15)] bg-[#070d1a]"
            )}
          >
            {plan.highlighted && (
              <>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent rounded-t-2xl" />
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white border-0 text-xs mono-label">
                  {plan.badge}
                </Badge>
              </>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-[#F9FAFB] text-lg mb-1">{plan.name}</h3>
              <p className="text-[#6B7280] text-sm">{plan.description}</p>
            </div>

            <div className="mb-8">
              {plan.price.monthly ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-[#6B7280] text-sm">{plan.currency}</span>
                  <span className="text-4xl font-bold text-[#F9FAFB]">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-[#6B7280] text-sm">/{plan.unit}</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-[#F9FAFB]">Custom</span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#D1D5DB]">
                  <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Link href={plan.id === "enterprise" ? "/contact" : "/#waitlist"}>
              <Button
                variant={plan.ctaVariant}
                className={cn(
                  "w-full rounded-xl py-5",
                  plan.highlighted
                    ? "bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : "border-[rgba(37,99,235,0.3)] text-[#D1D5DB] hover:border-[rgba(37,99,235,0.6)] hover:text-white"
                )}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </StaggerContainer>
    </section>
  );
}
