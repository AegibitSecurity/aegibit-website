"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { useCohort } from "@/hooks/useCohort";

/**
 * Cohort-personalized homepage CTA.
 *
 * Six variants matched in priority order via useCohort():
 *   high_intent  → "Skip the demo. Start a 14-day pilot." (urgency)
 *   from_paid    → "You searched. We deliver." (intent-validation; UTM=cpc/google_ads)
 *   from_social  → "We meet on LinkedIn often. Let's meet for real." (relationship; UTM=linkedin etc.)
 *   from_email   → "Picked the right link." (already-warm; UTM=email)
 *   returning    → "Pick up where you left off." (generic returning)
 *   default      → "Ready to secure and scale your business?" (canonical)
 *
 * Each cohort gets a distinct cta_id so the funnel dashboard groups
 * conversions per-cohort automatically. No new dashboard code.
 *
 * The personalization is segment-based, not per-user fingerprinted —
 * respects the charter privacy posture. UTM cohorts are per-visit
 * (sessionStorage); they identify WHY the visitor is here today, not
 * WHO they are.
 */

const COPY = {
  high_intent: {
    eyebrow: "Decision time",
    headline: "Skip the demo.\nStart a 14-day pilot.",
    body: "You've seen the pricing. You've checked the alternatives. We've prepped your sandbox. Reserve a slot today.",
    ctaLabel: "Start my pilot",
    ctaHref: "/products/paymint/demo",
    ctaId: "home_cta_high_intent",
  },
  from_paid: {
    eyebrow: "Direct match",
    headline: "You searched.\nWe deliver.",
    body: "Multi-branch operational software with cybersecurity baked in. Real-time visibility, audit-grade trail, 30-second voucher capture. See PayMint in action.",
    ctaLabel: "Book a 12-min demo",
    ctaHref: "/products/paymint/demo",
    ctaId: "home_cta_from_paid",
  },
  from_social: {
    eyebrow: "Glad you came over",
    headline: "We meet on social\noften. Let's meet for real.",
    body: "20 minutes, no pitch deck — just a frank conversation about what you're trying to fix. If AEGIBIT isn't the right shape, we'll point you to who is.",
    ctaLabel: "Talk to a founder",
    ctaHref: "/contact",
    ctaId: "home_cta_from_social",
  },
  from_email: {
    eyebrow: "Right link, right time",
    headline: "Ready to take\nthe next step?",
    body: "You've been following AEGIBIT. The next move is the easy one — pick a slot, get the live walkthrough, decide on the spot.",
    ctaLabel: "Pick a demo slot",
    ctaHref: "/products/paymint/demo",
    ctaId: "home_cta_from_email",
  },
  returning: {
    eyebrow: "Welcome back",
    headline: "Pick up where you\nleft off.",
    body: "You've been here before. Whatever brought you back — let's close the loop. 20 minutes of your time, real answers.",
    ctaLabel: "Talk to a founder",
    ctaHref: "/contact",
    ctaId: "home_cta_returning",
  },
  default: {
    eyebrow: "Get started",
    headline: "Ready to secure\nand scale your business?",
    body: "Join enterprises building on AEGIBIT. No credit card required.",
    ctaLabel: "Get Enterprise Access",
    ctaHref: "/signup",
    ctaId: "home_cta_default",
  },
} as const;

export function HomeCTA() {
  const [ref, inView] = useInView({ triggerOnce:true, threshold:0.2 });
  const cohort = useCohort();
  const c = COPY[cohort.id];

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto">
        {/* Card with radial glow */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.7, ease:"easeOut" }}
          className="relative rounded-2xl overflow-hidden text-center px-8 py-20"
          style={{
            background:"linear-gradient(135deg, #0D0D0D 0%, #111 50%, #0D0D0D 100%)",
            border:"1px solid rgba(255,255,255,0.08)",
          }}>
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 65%)" }}/>
          {/* Top orange line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px"
            style={{ background:"linear-gradient(90deg, transparent, #F97316, transparent)" }}/>

          <motion.span
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.2 }}
            className="mono-label text-[#F97316] block mb-6">
            {c.eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity:0,y:16 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, delay:0.15, ease:"easeOut" }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white leading-tight tracking-tight mb-5"
            style={{ whiteSpace: "pre-line" }}>
            {c.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity:0,y:12 }} animate={inView?{opacity:1,y:0}:{}}
            transition={{ duration:0.6, delay:0.25, ease:"easeOut" }}
            className="text-[#52525B] text-base mb-12 max-w-md mx-auto">
            {c.body}
          </motion.p>

          <motion.div
            initial={{ opacity:0 }} animate={inView?{opacity:1}:{}}
            transition={{ duration:0.5, delay:0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TrackedLink
              href={c.ctaHref}
              ctaId={c.ctaId}
              ctaLabel={c.ctaLabel}
              ctaSection="home_cta"
              className="text-sm font-semibold text-white px-8 py-4 rounded-xl transition-all hover:opacity-90"
              style={{ background:"#F97316", boxShadow:"0 0 40px rgba(249,115,22,0.3)", minWidth:210 }}>
              {c.ctaLabel}
            </TrackedLink>
            <a href="mailto:contact@aegibit.com"
              className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              contact@aegibit.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
