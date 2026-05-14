import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ArrowRight, Shield, Boxes } from "lucide-react";

/**
 * /about — AEGIBIT company page.
 *
 * Brand voice rule (carried over from PR #76 — the company-first
 * voice sweep): the entity AEGIBIT is the protagonist of every
 * sentence, not the founder personally. Premium enterprise buyers
 * — CISOs, finance directors, compliance heads — want a *company*
 * on the other side of the conversation. Person-led copy ("started
 * by X after seeing Y") signals fragility, not durability.
 *
 * Every claim on this page is defensible:
 *   - "Built in India" — true (Kolkata-anchored, India-first by design)
 *   - "Cybersecurity-first" — defensible from next.config.ts header
 *     posture + MCP Shield product
 *   - "Live with Nibir Motors across 7 branches" — true (real customer
 *     with a /case-studies/nibir-motors deep dive)
 *   - "Two products shipped, one in early access" — accurate count
 *     (PayMint live, MCP Shield live, Aira early access)
 *
 * Things deliberately NOT on this page:
 *   - SOC 2 certified claim — we're in progress (see /security).
 *   - Founder personal bio / photo — entity-first per the brand
 *     positioning. If later we want a /about/team or /about/founders
 *     page, that's the place for personal presence.
 *   - Headcount / funding — irrelevant to buyer trust at this stage.
 *   - Regulatory overclaims (RBI / HIPAA / FERPA) — gone everywhere
 *     after PR #77.
 */

export const metadata: Metadata = {
  title: "About AEGIBIT — Cybersecurity-first software for businesses that can't afford a leak",
  description:
    "AEGIBIT builds operational software for multi-branch businesses where a single leak ends the company. Cybersecurity-first by default. Built in India, global mandate. Live with Nibir Motors across 7 branches in West Bengal.",
  keywords: [
    "AEGIBIT",
    "AEGIBIT company",
    "about AEGIBIT",
    "cybersecurity software India",
    "multi-branch operational software",
    "PayMint",
    "MCP Shield",
    "Nibir Motors",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About AEGIBIT — Built for businesses that can't afford a leak",
    description:
      "Cybersecurity-first software for multi-branch operations. PayMint live with Nibir Motors. MCP Shield open-source. India-first, global mandate.",
    type: "website",
    url: "https://www.aegibit.com/about",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "About AEGIBIT — Built for businesses that can't afford a leak",
    description:
      "Cybersecurity-first software for multi-branch operations. Live with Nibir Motors. MCP Shield open-source. Built in India.",
  },
};

const PRODUCTS = [
  {
    name: "PayMint",
    icon: Boxes,
    tagline: "Multi-branch expense capture for retail, services, and dealerships.",
    detail:
      "Same-day visibility across every branch. 30-second voucher capture (photo + geo + timestamp). Audit-grade trail. Tally-ready exports. DPDP-ready.",
    href: "/products/paymint",
    cta: "PayMint",
    ctaId: "about_product_paymint",
    state: "Live",
  },
  {
    name: "MCP Shield",
    icon: Shield,
    tagline: "Open-source security for the Model Context Protocol.",
    detail:
      "Static scanner + live probe for MCP servers. Catches tool poisoning, prompt injection, hidden-Unicode attacks, secret exposure, unsafe stdio launches. MIT licensed.",
    href: "/products/mcp-shield",
    cta: "MCP Shield",
    ctaId: "about_product_mcp_shield",
    state: "Live · v0.2.1",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000", color: "#fff" }}>
        {/* ───────── Hero ───────── */}
        <section
          className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto">
            <span
              className="mono-label uppercase block mb-6"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              About AEGIBIT
            </span>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-3xl mb-8"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.25rem)", color: "#fff" }}
            >
              Built for businesses that{" "}
              <span
                className="italic"
                style={{
                  fontFamily:
                    "var(--font-serif), 'Instrument Serif', Georgia, serif",
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                can&apos;t afford a leak.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              AEGIBIT builds operational software for multi-branch businesses
              where a single security or audit failure ends the company.
              Cybersecurity-first by default — not bolted on. Real-time
              across every branch. Engineered to outlast the trends.
            </p>
          </div>
        </section>

        {/* ───────── What we build ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              What we build
            </p>
            <h2
              className="font-light leading-tight mb-12 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Two products shipped. One mission.
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                return (
                  <TrackedLink
                    key={p.name}
                    href={p.href}
                    ctaId={p.ctaId}
                    ctaLabel={p.cta}
                    ctaSection="about_products"
                    className="block p-7 rounded-xl transition-all hover:bg-[rgba(255,255,255,0.02)]"
                    style={{
                      background: "#0D0D0D",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: "rgba(249,115,22,0.10)",
                          border: "1px solid rgba(249,115,22,0.30)",
                        }}
                      >
                        <Icon size={20} style={{ color: "#F97316" }} />
                      </div>
                      <span
                        className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: "rgba(249,115,22,0.10)",
                          border: "1px solid rgba(249,115,22,0.30)",
                          color: "#F97316",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {p.state}
                      </span>
                    </div>
                    <h3
                      className="font-medium mb-2"
                      style={{ fontSize: "1.35rem", color: "#fff" }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="mb-3"
                      style={{ color: "#A1A1AA", fontSize: "0.95rem", lineHeight: 1.55 }}
                    >
                      {p.tagline}
                    </p>
                    <p
                      style={{ color: "#71717A", fontSize: "0.9rem", lineHeight: 1.55 }}
                    >
                      {p.detail}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium"
                      style={{ color: "#F97316" }}
                    >
                      Visit {p.name}
                      <ArrowRight size={14} />
                    </span>
                  </TrackedLink>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────── Why this matters ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12"
          style={{ background: "#000" }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              Why this matters
            </p>
            <h2
              className="font-light leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Most operational software is built for offices that lose
              productivity when they fail. We build for operations that
              lose the company.
            </h2>
            <div className="space-y-6 text-base md:text-lg" style={{ color: "#A1A1AA", lineHeight: 1.75 }}>
              <p>
                A multi-branch dealer running on Excel and WhatsApp loses
                cash per branch every month it isn&apos;t reconciled
                same-day. A clinic group running petty-cash on
                paper loses audit-grade trail every month it isn&apos;t
                photographed and time-stamped. A SaaS team plugging
                Anthropic&apos;s MCP protocol into production without
                input sanitisation loses the keys to its own infrastructure
                the moment a poisoned tool definition lands.
              </p>
              <p>
                These aren&apos;t productivity problems. They&apos;re
                continuity problems. AEGIBIT builds for the operators
                who already understand the difference.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Proof: Nibir Motors anchor ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              Proof
            </p>
            <h2
              className="font-light leading-tight mb-12 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Live with Nibir Motors across 7 dealerships in West
              Bengal.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
              {[
                { value: "7", label: "Branches live" },
                { value: "30s", label: "Voucher capture" },
                { value: "12 hrs/wk", label: "Reclaimed" },
                { value: "30 days", label: "To audit-ready" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-bold leading-none mb-3 tracking-tight"
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                      color: "#fff",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="mono-label" style={{ color: "#52525B" }}>
                    {s.label}
                  </p>
                  <div
                    className="w-7 h-0.5 mt-3"
                    style={{ background: "rgba(249,115,22,0.4)" }}
                  />
                </div>
              ))}
            </div>

            <TrackedLink
              href="/case-studies/nibir-motors"
              ctaId="about_proof_nibir"
              ctaLabel="Read the Nibir Motors case study"
              ctaSection="about_proof"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#F97316" }}
            >
              Read the Nibir Motors case study
              <ArrowRight size={14} />
            </TrackedLink>
          </div>
        </section>

        {/* ───────── Where we are ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12"
          style={{ background: "#000" }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              Where we are
            </p>
            <h2
              className="font-light leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Built in India. Built for the global mandate.
            </h2>
            <div
              className="space-y-5 text-base md:text-lg"
              style={{ color: "#A1A1AA", lineHeight: 1.75 }}
            >
              <p>
                AEGIBIT is anchored in India because the operators who
                feel the multi-branch pain most acutely — multi-state
                retail, services, dealerships, clinic chains, distribution —
                are concentrated here. India also forces a discipline that
                the global market then benefits from: DPDP Act compliance,
                low-bandwidth resilience, multi-language ops, branch-led
                edge cases.
              </p>
              <p>
                We are bootstrapped, focused, and shipping. The AEGIBIT
                team responds at{" "}
                <a
                  href="mailto:contact@aegibit.com"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  contact@aegibit.com
                </a>{" "}
                within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section
          className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden border-t"
          style={{
            background: "#000",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.10) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-light leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              See PayMint live in 12 minutes.
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Book a walkthrough on real branch data, or talk to the
              AEGIBIT team about anything else AEGIBIT-shaped.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TrackedLink
                href="/products/paymint/demo"
                ctaId="about_cta_demo"
                ctaLabel="Book a PayMint demo"
                ctaSection="about_final_cta"
                className="inline-flex items-center gap-2 px-7 h-13 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "#F97316",
                  padding: "0 1.75rem",
                  height: "3.25rem",
                  boxShadow: "0 0 28px rgba(249,115,22,0.30)",
                }}
              >
                Book a PayMint demo
                <ArrowRight size={18} />
              </TrackedLink>
              <TrackedLink
                href="/contact"
                ctaId="about_cta_contact"
                ctaLabel="Talk to AEGIBIT"
                ctaSection="about_final_cta"
                className="inline-flex items-center gap-2 px-6 h-13 rounded-xl font-medium text-white transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "0 1.5rem",
                  height: "3.25rem",
                }}
              >
                Talk to AEGIBIT
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
