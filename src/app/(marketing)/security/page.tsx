import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ArrowRight, Shield, ShieldCheck, ShieldAlert } from "lucide-react";

/**
 * /security — AEGIBIT security posture.
 *
 * Rewritten 2026-05-10 as part of the C-2 VoiceCore → PayMint rewrite.
 *
 * Previous page (delete reference):
 *   - Sold deprecated VoiceCore ("Voice Biometric Authentication",
 *     "Voice data encrypted", "ML Anomaly Detection")
 *   - Fabricated specifics (">99.5% accuracy" with no source)
 *   - Undefendable compliance claims (HIPAA — we're not US healthcare,
 *     ISO 27001 — not certified, RBI Cybersecurity Framework — not
 *     registered, SEBI CSCRF — not applicable to us)
 *   - Dead CTA "Get Private Access" → /signup
 *
 * This rewrite: every claim is defensible against a CISO asking
 * "where does this number come from?" or "show me the audit." If
 * we can't point to source code, configuration file, or a public
 * artifact, the claim is not on this page.
 *
 * What this page DOES NOT claim:
 *   - SOC 2 Type II Certified (we're in progress — that's the only
 *     honest framing)
 *   - HIPAA / ISO 27001 / RBI / SEBI alignment (no audit underwrites
 *     any of those today)
 *   - Specific accuracy/SLA percentages
 *   - "Zero Trust Architecture" as a feature (it's category labeling,
 *     not specifics)
 *
 * What this page DOES claim — each anchored to a real source:
 *   - CSP + HSTS + Permissions-Policy + COOP — visible in next.config.ts
 *   - Per-IP rate limiting via Upstash hybrid — src/lib/rate-limiter.ts
 *   - httpOnly cookie sessions + scrypt password hashing — src/lib/auth.ts
 *   - Append-only audit trail on agent actions — supabase/schema.sql
 *     `agent_actions` table
 *   - PayMint voucher trail with photo + geo + timestamp — product fact
 *   - MCP Shield as proof point — we open-sourced security tooling
 *     for the MCP ecosystem after Anthropic's April 2026 RCE disclosure
 */

export const metadata: Metadata = {
  title: "Security — AEGIBIT's posture, written plainly",
  description:
    "AEGIBIT's security posture. CSP-hardened headers, per-IP rate limiting, httpOnly cookie auth, append-only audit trail, geo-tagged voucher capture, open-source MCP security tooling. Every claim defensible. DPDP-aware. SOC 2 Type II in progress.",
  keywords: [
    "AEGIBIT security",
    "AEGIBIT trust center",
    "AEGIBIT compliance",
    "PayMint security",
    "MCP Shield",
    "DPDP Act compliance India",
    "SOC 2 in progress",
    "responsible disclosure",
  ],
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security — AEGIBIT's posture, written plainly",
    description:
      "Every security claim defensible against a CISO's first question. CSP-hardened headers, per-IP rate limiting, httpOnly cookie auth, append-only agent audit trail, MCP Shield open-source tooling.",
    type: "website",
    url: "https://www.aegibit.com/security",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security — AEGIBIT's posture, written plainly",
    description:
      "Every security claim defensible. DPDP-aware. SOC 2 Type II in progress. Read the configuration, not the marketing.",
  },
};

/**
 * Each posture item must be anchored to a real artifact we can show
 * a buyer if asked. `proof` is the human-readable pointer to that
 * artifact. We deliberately reference internal file paths to signal
 * "we can show you the configuration" rather than "we hope you trust
 * the marketing copy."
 */
const POSTURE = [
  {
    n: "01",
    title: "Hardened response headers on every request",
    body: "Explicit Content Security Policy with no unsafe-eval. HSTS with includeSubDomains. Permissions-Policy denies camera, microphone, geolocation, payment, sensors. COOP same-origin-allow-popups. X-Content-Type-Options nosniff. Pinned in next.config.ts and verified on every deploy.",
    proof: "next.config.ts headers() function",
  },
  {
    n: "02",
    title: "Per-IP rate limiting that survives serverless cold starts",
    body: "Upstash Redis-backed limiter (visitor 10/min, event 30/min, lead 5/min, chat 20/min). In-memory fallback when Upstash unreachable. Fail-open posture so a vendor outage doesn't lock out legitimate visitors. Lambda spawn doesn't reset the counter.",
    proof: "src/lib/rate-limiter.ts",
  },
  {
    n: "03",
    title: "httpOnly cookie sessions, scrypt-hashed admin credentials",
    body: "Iron-session encrypted cookies (SameSite=Lax, Secure in production, 8-hour TTL). Admin password stored as scrypt:salt:derived format with N=2^14 and 64 MB maxmem — explicitly bounded so a misconfigured runtime can't OOM. No bearer tokens in client bundles, ever.",
    proof: "src/lib/auth.ts + src/lib/session.ts",
  },
  {
    n: "04",
    title: "Append-only audit trail on every automation action",
    body: "Every agent run, every deploy notify, every lead-pipeline action writes a row to a Postgres table with start time, finish time, status, full payload, and the agent identity. Rows are insert-only; no UPDATE or DELETE path in the application code.",
    proof: "supabase/schema.sql `agent_actions` table",
  },
  {
    n: "05",
    title: "PayMint voucher capture — auditor-grade from the field",
    body: "Every voucher captured at the branch is anchored to a photograph, a GPS coordinate, and a server-issued timestamp at the moment of submission. The visibility window for headquarters is same-day instead of the 5-9 days typical of paper-based reconciliation.",
    proof: "PayMint product feature — see /products/paymint",
  },
  {
    n: "06",
    title: "MCP Shield — we open-sourced our own security tooling",
    body: "After Anthropic's April 2026 MCP-RCE disclosure, we shipped MCP Shield: a free, MIT-licensed scanner + runtime for Model Context Protocol servers. Detects tool poisoning, hidden-Unicode steganography, prompt injection markers, secret exposure, unsafe stdio launches. Public code, public issues, public reports.",
    proof: "github.com/AegibitSecurity/mcp-shield + /products/mcp-shield",
  },
];

const COMPLIANCE_TODAY = [
  {
    name: "DPDP Act 2023 (India)",
    status: "Aligning",
    note: "AEGIBIT is an Indian company processing Indian PII. The Digital Personal Data Protection Act 2023 applies by default. We process lead-form data with consent, store only what's necessary, and treat the user's email as the primary identity reference.",
  },
  {
    name: "SOC 2 Type II",
    status: "In progress",
    note: "Internal controls + audit-trail discipline mapped to the Trust Services Criteria. Formal Type II audit window has not yet opened. We will not display a SOC 2 badge until the auditor issues the report.",
  },
  {
    name: "GDPR — EU visitor data",
    status: "Aware",
    note: "EU-resident visitors who submit forms can request data export or deletion via contact@aegibit.com. We do not currently market into the EU; if AEGIBIT begins selling there, we will publish a formal DPA.",
  },
];

const NOT_CLAIMED = [
  "ISO 27001 — not certified",
  "HIPAA — not applicable (we are not a US healthcare entity or covered associate)",
  "RBI Cybersecurity Framework — we are not a regulated bank or NBFC",
  "SEBI CSCRF — not applicable",
  "FedRAMP, IRAP, C5 — not pursued",
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#000", color: "#fff" }}>
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
              Security
            </span>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-3xl mb-8"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.25rem)", color: "#fff" }}
            >
              Security is the architecture.{" "}
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
                Not the marketing.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              Every claim on this page is defensible against a CISO&apos;s
              first question: <em>&quot;where does that number come
              from?&quot;</em> If we can&apos;t point at source code, a
              configuration file, or a public artifact, the claim
              isn&apos;t on this page.
            </p>
          </div>
        </section>

        {/* ───────── The posture ───────── */}
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
              The posture
            </p>
            <h2
              className="font-light leading-tight mb-12 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Six things AEGIBIT actually does — each anchored to a
              file you can read or a public artifact you can audit.
            </h2>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {POSTURE.map((p) => (
                <div
                  key={p.n}
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
                      {p.n}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-medium mb-3"
                      style={{ fontSize: "1.15rem", color: "#fff" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="mb-4"
                      style={{ color: "#A1A1AA", lineHeight: 1.7 }}
                    >
                      {p.body}
                    </p>
                    <p
                      className="font-mono"
                      style={{
                        color: "#52525B",
                        fontSize: "12px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      ↳ proof: {p.proof}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Compliance — honest framing ───────── */}
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
              Compliance status — today
            </p>
            <h2
              className="font-light leading-tight mb-12 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              We will not display a certification badge we have not
              earned.
            </h2>

            <div className="space-y-4 mb-16">
              {COMPLIANCE_TODAY.map((c) => (
                <div
                  key={c.name}
                  className="p-6 md:p-7 rounded-xl"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                    <h3
                      className="font-medium"
                      style={{ fontSize: "1.1rem", color: "#fff" }}
                    >
                      {c.name}
                    </h3>
                    <span
                      className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(249,115,22,0.10)",
                        border: "1px solid rgba(249,115,22,0.30)",
                        color: "#F97316",
                        letterSpacing: "0.14em",
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p style={{ color: "#A1A1AA", lineHeight: 1.65 }}>
                    {c.note}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="p-7 rounded-xl"
              style={{
                background: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <ShieldAlert
                  size={20}
                  style={{ color: "#F97316", marginTop: "2px", flexShrink: 0 }}
                />
                <h3
                  className="font-medium"
                  style={{ fontSize: "1rem", color: "#fff" }}
                >
                  What we do NOT claim
                </h3>
              </div>
              <ul
                className="space-y-2 ml-7"
                style={{ color: "#71717A", fontSize: "0.92rem", lineHeight: 1.7 }}
              >
                {NOT_CLAIMED.map((n) => (
                  <li key={n}>· {n}</li>
                ))}
              </ul>
              <p
                className="ml-7 mt-4"
                style={{ color: "#52525B", fontSize: "0.85rem", lineHeight: 1.6 }}
              >
                If your buying process requires a specific certification
                that&apos;s not on the &quot;today&quot; list above, the
                AEGIBIT team can share our Trust Center roadmap — reach
                out at{" "}
                <a
                  href="mailto:contact@aegibit.com"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#A1A1AA" }}
                >
                  contact@aegibit.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ───────── Responsible disclosure ───────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                color: "#F97316",
                letterSpacing: "0.22em",
                fontSize: "11px",
              }}
            >
              Responsible disclosure
            </p>
            <h2
              className="font-light leading-tight mb-8 max-w-3xl"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Found a vulnerability? Tell us — we&apos;ll fix it and
              credit you.
            </h2>
            <div
              className="space-y-5 text-base md:text-lg"
              style={{ color: "#A1A1AA", lineHeight: 1.75 }}
            >
              <p>
                Email{" "}
                <a
                  href="mailto:contact@aegibit.com?subject=Security%20Disclosure"
                  className="underline-offset-4 hover:underline"
                  style={{ color: "#fff" }}
                >
                  contact@aegibit.com
                </a>{" "}
                with subject &quot;Security Disclosure.&quot; Include a
                clear reproduction path, the affected URL or component,
                and any payload required to trigger the issue. Encrypted
                channels available on request.
              </p>
              <p>
                We commit to acknowledging the report within 48 hours,
                providing a remediation timeline within 7 days, and
                coordinating a public disclosure window with you once a
                fix has shipped. We will not pursue legal action against
                anyone reporting in good faith.
              </p>
              <p>
                Out of scope: denial-of-service testing against
                production traffic, social engineering of AEGIBIT
                personnel, and any test that compromises the data or
                experience of other AEGIBIT visitors or customers.
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
            <ShieldCheck
              size={36}
              style={{ color: "#F97316", margin: "0 auto 1.25rem" }}
            />
            <h2
              className="font-light leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              Want the security walkthrough live?
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Book a 12-minute PayMint demo and we&apos;ll cover the
              security architecture alongside the product workflow.
              Configuration files open, no slideware.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TrackedLink
                href="/products/paymint/demo"
                ctaId="security_cta_demo"
                ctaLabel="Book a PayMint demo"
                ctaSection="security_final_cta"
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
                href="/products/mcp-shield"
                ctaId="security_cta_mcp_shield"
                ctaLabel="See MCP Shield"
                ctaSection="security_final_cta"
                className="inline-flex items-center gap-2 px-6 rounded-xl font-medium text-white transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "0 1.5rem",
                  height: "3.25rem",
                }}
              >
                <Shield size={16} />
                See MCP Shield
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
