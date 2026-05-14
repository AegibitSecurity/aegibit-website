"use client";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section id="waitlist" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] rounded-3xl" />

        <FadeIn direction="up">
          <div className="relative border border-[rgba(37,99,235,0.3)] rounded-3xl bg-[#070d1a] p-12 sm:p-16 text-center overflow-hidden">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent" />

            {/* Beta badge */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="ping-green absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                <span className="mono-label text-[#34D399]">BETA ACCESS — LIMITED SPOTS</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9FAFB] leading-tight tracking-tight mb-4">
              Ready to secure your team&apos;s<br />
              <span className="gradient-text">voice workflow?</span>
            </h2>

            <p className="text-[#6B7280] text-lg max-w-xl mx-auto mb-10">
              Join 50+ security teams on the waitlist. No credit card required. Early access includes 3 months free on any paid plan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-8 py-6 text-base rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] group"
                  >
                    Join the Waitlist →
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[rgba(37,99,235,0.3)] text-[#D1D5DB] hover:border-[rgba(37,99,235,0.6)] hover:text-white px-8 py-6 text-base rounded-xl hover:bg-white/5"
                >
                  Book a Demo
                </Button>
              </Link>
            </div>

            <p className="text-[#374151] text-xs mt-6">
              Your data is never sold. GDPR & DPDP compliant. SOC 2 in progress.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
