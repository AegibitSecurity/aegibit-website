"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { motion } from "framer-motion";

/**
 * PayMint pricing — public, transparent, conversion-focused.
 *
 * Strategy:
 *   • Per-branch pricing scales with customer value (clear mental model)
 *   • Below ₹1,000 anchor (psychological friction) for the headline tier
 *   • Free 14-day pilot, no card required → reduces commitment friction
 *   • Custom enterprise tier for 25+ branches → land-and-expand for groups
 *
 * Every CTA funnels to /products/paymint/demo — single conversion path.
 */

const PLANS = [
  {
    id: "pilot",
    name: "Pilot",
    price: "₹0",
    suffix: "for 14 days",
    desc: "Run PayMint live across one branch. No card required.",
    features: [
      "1 branch, up to 100 vouchers",
      "Real-time multi-device sync",
      "Branch-coded voucher numbers",
      "Tally-ready CSV export",
      "Audit log (full retention)",
      "Email support",
    ],
    cta: "Start Free Pilot",
    href: "/products/paymint/demo",
    highlight: false,
  },
  {
    id: "branch",
    name: "Branch",
    price: "₹999",
    suffix: "/ branch / month",
    desc: "For multi-branch dealerships and SMEs running 2-24 branches.",
    features: [
      "Unlimited branches (₹999 each)",
      "Unlimited users + roles",
      "Real-time sync across all branches",
      "Branch-coded vouchers + atomic counters",
      "Role-based approval workflow (5 roles)",
      "Tally + Power BI exports",
      "Audit-grade logging (forever)",
      "Mobile + Android APK + Web app",
      "Priority email + WhatsApp support",
      "OTA updates — features ship live",
    ],
    cta: "Book a Demo",
    href: "/products/paymint/demo",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    suffix: "for 25+ branches",
    desc: "For multi-state dealer groups, channel partners, large SMEs.",
    features: [
      "Everything in Branch tier",
      "Volume pricing (lower per-branch)",
      "Dedicated Customer Success Manager",
      "Custom integrations (DMS, ERP, CRM)",
      "On-premise deployment option",
      "India data residency SLA",
      "SOC 2 Type II audit support",
      "White-glove onboarding (every branch)",
      "99.99% uptime SLA contract",
      "Custom Tally / Power BI templates",
    ],
    cta: "Talk to Sales",
    href: "/products/paymint/demo",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "How does per-branch pricing work?",
    a: "Simple: count your active branches, multiply by ₹999. A 5-branch dealership pays ₹4,995/month. A 12-branch group pays ₹11,988/month. Add or remove branches anytime; billing pro-rates automatically.",
  },
  {
    q: "Is there really no credit card for the 14-day pilot?",
    a: "Correct. Sign up via the demo flow, we provision a sandbox branch within 24 hours, you run real vouchers for 14 days. If you continue, we send an invoice on day 15. If not, no obligation, your data stays exportable.",
  },
  {
    q: "Do you charge per user?",
    a: "No. Per branch only. You can add unlimited users (makers, approvers, accountants, admins) at no extra cost. Most customers run 5-25 users per branch — all included.",
  },
  {
    q: "What happens if I add a branch mid-month?",
    a: "Pro-rated billing. Add a branch on day 10 — you pay only for the remaining 20 days at the per-branch rate.",
  },
  {
    q: "Is GST extra?",
    a: "Yes. All prices are exclusive of 18% GST. Indian customers receive a tax invoice with full GSTIN details for input credit.",
  },
  {
    q: "Can I get a discount for annual prepayment?",
    a: "Yes. Annual commitment = 2 months free (effective ₹833/branch/month). Talk to us for the contract.",
  },
  {
    q: "How is Enterprise pricing structured?",
    a: "Volume tiers below ₹999/branch for 25+ branches, scaling further at 50+ and 100+. Includes dedicated CSM, custom integrations, on-premise option, contractual SLAs. Book a call for a tailored quote.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime via email — no minimum lock-in on the Branch tier. Your data is exportable as CSV at any point. We'll keep your account in read-only mode for 30 days post-cancellation in case you change your mind.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000" }}>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          className="relative pt-32 pb-16 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(249,115,22,0.10) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(249,115,22,0.10)",
                border: "1px solid rgba(249,115,22,0.30)",
              }}
            >
              <Sparkles size={14} style={{ color: "#F97316" }} />
              <span
                className="text-[11px] uppercase font-medium"
                style={{ color: "#F97316", letterSpacing: "0.2em" }}
              >
                Transparent Pricing
              </span>
            </div>
            <h1
              className="font-light leading-[1.05] tracking-tight mb-6 mx-auto max-w-3xl"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
            >
              <span style={{ color: "#EAEAEA" }}>One price. Per branch.</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #fff 0%, #f97316 50%, #fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "0.15em",
                  display: "inline-block",
                }}
              >
                No hidden tiers.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4"
              style={{ color: "#A1A1AA" }}
            >
              ₹999 per branch per month. Unlimited users. Every feature. Free 14-day pilot,
              no credit card required.
            </p>
            <p className="text-sm" style={{ color: "#52525B" }}>
              Below 18% GST · Annual commitment = 2 months free
            </p>
          </div>
        </section>

        {/* ── PLANS ────────────────────────────────────────────────────── */}
        <section className="pb-20 px-6 lg:px-12" style={{ background: "#000" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 md:gap-6">
            {PLANS.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative rounded-2xl p-7 md:p-8 flex flex-col"
                style={{
                  background: p.highlight ? "linear-gradient(180deg, #1a1004 0%, #0a0a0a 100%)" : "#0D0D0D",
                  border: p.highlight
                    ? "1px solid rgba(249,115,22,0.40)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: p.highlight
                    ? "0 0 0 1px rgba(249,115,22,0.15), 0 30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(249,115,22,0.10)"
                    : "none",
                }}
              >
                {p.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{
                      background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                      color: "#fff",
                      letterSpacing: "0.15em",
                      boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="text-xl font-medium mb-2"
                    style={{ color: "#fff" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                    {p.desc}
                  </p>
                </div>

                <div className="mb-7 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="font-light"
                      style={{
                        fontSize: 44,
                        color: "#fff",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                      }}
                    >
                      {p.price}
                    </span>
                    <span className="text-sm" style={{ color: "#71717A" }}>
                      {p.suffix}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: "#F97316" }}
                      />
                      <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <TrackedLink
                  href={p.href}
                  ctaId={`pricing_tier_${p.id}`}
                  ctaLabel={p.cta}
                  ctaSection="pricing_tiers"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  style={
                    p.highlight
                      ? {
                          background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                          color: "#fff",
                          boxShadow:
                            "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
                        }
                      : {
                          background: "transparent",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.20)",
                        }
                  }
                >
                  <Calendar size={16} />
                  {p.cta}
                </TrackedLink>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── ROI HIGHLIGHT ──────────────────────────────────────────────── */}
        <section className="py-16 px-6 lg:px-12" style={{ background: "#000" }}>
          <div
            className="max-w-4xl mx-auto rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2
              className="font-light leading-tight mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#fff" }}
            >
              Compare to the cost of <em style={{ color: "#F97316", fontStyle: "normal" }}>not</em> automating.
            </h2>
            <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: "#A1A1AA" }}>
              One finance hire = ₹50,000+/month. PayMint at ₹999/branch handles what that hire
              would do, across every branch, in real time, with full audit trail.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-light mb-1" style={{ color: "#F97316" }}>~50×</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "#52525B" }}>
                  Cheaper per branch vs hiring
                </div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1" style={{ color: "#F97316" }}>~95%</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "#52525B" }}>
                  Less time on month-end Tally entry
                </div>
              </div>
              <div>
                <div className="text-3xl font-light mb-1" style={{ color: "#F97316" }}>24h</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "#52525B" }}>
                  From signup to first branch live
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 lg:px-12" style={{ background: "#000" }}>
          <div className="max-w-3xl mx-auto">
            <p
              className="text-[11px] uppercase mb-4 font-medium"
              style={{ color: "#F97316", letterSpacing: "0.3em" }}
            >
              Pricing FAQs
            </p>
            <h2
              className="font-light leading-tight mb-12"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
            >
              Buyer questions, answered.
            </h2>

            <div className="space-y-3">
              {FAQ.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <summary
                    className="cursor-pointer list-none p-5 flex items-center justify-between gap-4"
                    style={{ color: "#fff" }}
                  >
                    <span className="text-base font-medium leading-snug">{f.q}</span>
                    <ArrowRight
                      size={18}
                      className="flex-shrink-0 transition-transform group-open:rotate-90"
                      style={{ color: "#F97316" }}
                    />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                      {f.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ─────────────────────────────────────────────── */}
        <section
          className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: 800,
              height: 600,
              background: "rgba(249,115,22,0.08)",
              filter: "blur(160px)",
              borderRadius: "50%",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-light leading-[1.1] tracking-tight mb-6"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "#fff" }}
            >
              Start your free 14-day pilot today.
            </h2>
            <p className="text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ color: "#A1A1AA" }}>
              No credit card. We provision a sandbox branch within 24 hours. You run
              real vouchers across real branches. Decide on day 14.
            </p>
            <TrackedLink
              href="/products/paymint/demo"
              ctaId="pricing_bottom_book_demo"
              ctaLabel="Book Your Demo"
              ctaSection="pricing_bottom_cta"
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                color: "#fff",
                boxShadow: "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
              }}
            >
              <Calendar size={18} />
              Book Your Demo
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
