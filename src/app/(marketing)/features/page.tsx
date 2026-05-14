import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ArrowRight, Boxes, Shield, Mic, Layers } from "lucide-react";

/**
 * /features — AEGIBIT platform thesis.
 *
 * Rewritten 2026-05-10 (C-2 third ship). Previous page was the
 * canonical "vague filler" surface the audit called out:
 *   - Single H1 just said "AEGIBIT" with subhead "The operating
 *     system for intelligent, secure automation" — meaningless
 *   - 6 feature cards: "Voice-Driven Control", "Zero Trust
 *     Architecture", "SOC 2 Ready", "Enterprise Integrations
 *     — Connect to 15+ enterprise tools (Slack, Jira, ServiceNow,
 *     Splunk, PagerDuty, GitHub)", "Immutable Audit Logs",
 *     "RBAC Per Command"
 *   - "Join 50+ enterprise teams on the waitlist" (fabricated)
 *   - "Get Private Access" → /signup (dead VoiceCore-era CTA)
 *
 * What was wrong (per the audit + tonight's claim-discipline rule):
 *   - "SOC 2 Ready" contradicts /security saying "in progress"
 *   - "Connect to 15+ enterprise tools" was a hard overclaim — none
 *     of those integrations exist today
 *   - "50+ enterprise teams on the waitlist" was fabricated
 *   - Voice-Driven Control sold deprecated VoiceCore
 *   - "Zero Trust Architecture" is a category label, not a feature
 *
 * REWRITE THESIS:
 * /features should answer: "what is AEGIBIT-the-platform vs
 * AEGIBIT-the-product?" The page positions the company as a
 * multi-product platform with a single security-first DNA, lists
 * the products that exist today + early access, and explains the
 * shared substrate every product inherits (the security primitives
 * that justify cybersecurity-first positioning).
 *
 * Every claim on this page is defensible:
 *   - Three products listed map to actual source code in src/app/products/*
 *   - Shared substrate items map to actual files (next.config.ts,
 *     src/lib/rate-limiter.ts, src/lib/auth.ts, agent_actions table)
 *   - No SOC 2 / HIPAA / ISO certified badges (none earned)
 *   - No "Get Private Access" CTA (deprecated)
 *   - No fabricated waitlist counts
 */

export const metadata: Metadata = {
  title: "Platform — AEGIBIT, written as architecture",
  description:
    "AEGIBIT is a multi-product platform with a single security-first DNA. PayMint for multi-branch expense capture. MCP Shield for AI-infrastructure security. Aira for voice control. Every product inherits the same hardened security substrate.",
  keywords: [
    "AEGIBIT platform",
    "AEGIBIT architecture",
    "AEGIBIT products",
    "PayMint",
    "MCP Shield",
    "Aira",
    "cybersecurity platform India",
    "operational software",
  ],
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Platform — AEGIBIT, written as architecture",
    description:
      "Three products, one security-first DNA. PayMint live. MCP Shield open-source. Aira on Windows. Shared hardened substrate across every product.",
    type: "website",
    url: "https://www.aegibit.com/features",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform — AEGIBIT, written as architecture",
    description:
      "Three products, one security-first DNA. PayMint, MCP Shield, Aira — all sharing the same hardened substrate.",
  },
};

const PRODUCTS = [
  {
    name: "PayMint",
    state: "Live",
    icon: Boxes,
    tagline: "Multi-branch expense capture.",
    detail:
      "30-second voucher capture (photo + geo-tag + timestamp at the branch). Same-day visibility across every branch HQ used to wait 5–9 days for. Tally-ready exports. DPDP-ready.",
    href: "/products/paymint",
    ctaId: "features_product_paymint",
  },
  {
    name: "MCP Shield",
    state: "Live · v0.2.1 · MIT",
    icon: Shield,
    tagline: "Security for the Model Context Protocol.",
    detail:
      "Open-source scanner + runtime for MCP servers. Catches tool poisoning, prompt injection, hidden-Unicode steganography, secret exposure, unsafe stdio launches.",
    href: "/products/mcp-shield",
    ctaId: "features_product_mcp_shield",
  },
  {
    name: "Aira",
    state: "Free · Windows",
    icon: Mic,
    tagline: "Voice control for your desktop.",
    detail:
      "Wake by voice — opens apps, drafts messages, schedules reminders, acts on your tools. Hindi, Bengali, English, four more Indian languages. Voice biometric. Local-first.",
    href: "/products/aira",
    ctaId: "features_product_aira",
  },
];

const SUBSTRATE = [
  {
    title: "Hardened response headers",
    detail:
      "Explicit Content Security Policy, HSTS + includeSubDomains, Permissions-Policy denying camera/mic/geo/payment/sensors, COOP same-origin-allow-popups — applied to every request from every AEGIBIT product.",
    proof: "next.config.ts",
  },
  {
    title: "Per-IP rate limiting",
    detail:
      "Upstash Redis-backed limiter with in-memory fallback. Counters survive serverless cold-start scatter. Fail-open posture so a vendor outage never locks out legitimate visitors.",
    proof: "src/lib/rate-limiter.ts",
  },
  {
    title: "Cookie-only admin auth",
    detail:
      "Iron-session encrypted httpOnly cookies. scrypt-hashed admin credentials with explicit memory bounds. No bearer tokens leak into client bundles — ever.",
    proof: "src/lib/auth.ts",
  },
  {
    title: "Append-only audit trail",
    detail:
      "Every automation action lands in an insert-only Postgres table with full payload and identity. No UPDATE or DELETE path in application code. Designed for the auditor before the auditor was hired.",
    proof: "supabase/schema.sql agent_actions",
  },
  {
    title: "Visitor data minimization (DPDP-aware)",
    detail:
      "Lead-capture forms store only what's necessary. Behavior score and UTM cohort are segment-level, never per-user fingerprinted. EU visitors get data export / deletion via contact@aegibit.com.",
    proof: "src/lib/validators.ts · src/lib/cohorts.ts",
  },
];

export default function FeaturesPage() {
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
              Platform
            </span>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-3xl mb-8"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.25rem)", color: "#fff" }}
            >
              Three products.{" "}
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
                One security-first DNA.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              AEGIBIT is a platform, not a feature list. Each product
              solves a specific operational problem — multi-branch
              expense capture, AI-infrastructure security, desktop
              voice control — but they all inherit the same hardened
              substrate. The configuration files are listed below.
            </p>
          </div>
        </section>

        {/* ───────── Products ───────── */}
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
              The products
            </p>
            <h2
              className="font-light leading-tight mb-12 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Two shipped. One free download. All today.
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                return (
                  <TrackedLink
                    key={p.name}
                    href={p.href}
                    ctaId={p.ctaId}
                    ctaLabel={p.name}
                    ctaSection="features_products"
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
                          letterSpacing: "0.12em",
                        }}
                      >
                        {p.state}
                      </span>
                    </div>
                    <h3
                      className="font-medium mb-2"
                      style={{ fontSize: "1.25rem", color: "#fff" }}
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
                      style={{ color: "#71717A", fontSize: "0.88rem", lineHeight: 1.55 }}
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

        {/* ───────── Shared substrate ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12"
          style={{ background: "#000" }}
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
              Shared substrate
            </p>
            <h2
              className="font-light leading-tight mb-4 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Five primitives every AEGIBIT product inherits.
            </h2>
            <p
              className="mb-12 max-w-3xl"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Cybersecurity-first means each product launches with the
              same hardened defaults instead of bolting them on
              quarterly. The proof for each item is a file you can read.
            </p>

            <div
              className="divide-y"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {SUBSTRATE.map((s, i) => (
                <div
                  key={s.title}
                  className="py-8 md:py-10 grid md:grid-cols-[60px_1fr] gap-4 md:gap-10"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div>
                    <span
                      className="mono-label"
                      style={{
                        color: "#F97316",
                        letterSpacing: "0.22em",
                        fontSize: "11px",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-medium mb-3"
                      style={{ fontSize: "1.15rem", color: "#fff" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mb-4"
                      style={{ color: "#A1A1AA", lineHeight: 1.7 }}
                    >
                      {s.detail}
                    </p>
                    <p
                      className="font-mono"
                      style={{
                        color: "#52525B",
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ↳ proof: {s.proof}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p
              className="mt-12 text-sm"
              style={{ color: "#52525B", lineHeight: 1.7 }}
            >
              The complete security posture — including responsible
              disclosure and compliance status — lives on{" "}
              <TrackedLink
                href="/security"
                ctaId="features_link_security"
                ctaLabel="/security"
                ctaSection="features_substrate"
                className="underline-offset-4 hover:underline"
                style={{ color: "#A1A1AA" }}
              >
                /security
              </TrackedLink>
              .
            </p>
          </div>
        </section>

        {/* ───────── What's not here yet ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
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
              What we are not yet
            </p>
            <h2
              className="font-light leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              No certification badges we have not earned.
            </h2>
            <div
              className="space-y-5 text-base md:text-lg"
              style={{ color: "#A1A1AA", lineHeight: 1.75 }}
            >
              <p>
                AEGIBIT does not currently hold SOC 2 Type II
                certification (in progress), ISO 27001, HIPAA, RBI
                Cybersecurity Framework, or SEBI CSCRF. We will not
                display a badge before the auditor issues the report.
              </p>
              <p>
                We do not have pre-built integrations with Slack,
                Jira, ServiceNow, Splunk, PagerDuty, or GitHub. When
                a specific integration becomes important to a buyer,
                it ships as a focused engineering slice, not a marketing
                claim.
              </p>
              <p>
                For a roadmap discussion — what AEGIBIT is building
                next and which buyers shape the priority queue — the
                AEGIBIT team responds at{" "}
                <a
                  href="mailto:contact@aegibit.com"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  contact@aegibit.com
                </a>
                .
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
            <Layers
              size={36}
              style={{ color: "#F97316", margin: "0 auto 1.25rem" }}
            />
            <h2
              className="font-light leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              See the platform live.
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Book a 12-minute PayMint demo. We walk the architecture
              and the product together — configuration files open, no
              slideware.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TrackedLink
                href="/products/paymint/demo"
                ctaId="features_cta_demo"
                ctaLabel="Book a PayMint demo"
                ctaSection="features_final_cta"
                className="inline-flex items-center gap-2 px-7 rounded-xl font-semibold text-white transition-all hover:opacity-90"
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
                ctaId="features_cta_contact"
                ctaLabel="Talk to AEGIBIT"
                ctaSection="features_final_cta"
                className="inline-flex items-center gap-2 px-6 rounded-xl font-medium text-white transition-all"
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
