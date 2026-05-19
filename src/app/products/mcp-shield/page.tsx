import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { McpScannerSection } from "@/components/sections/mcp-shield/McpScannerSection";
import { Shield, ExternalLink, ArrowRight, Eye, Lock, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "AEGIBIT MCP Shield — Security for the Model Context Protocol",
  description:
    "Open-source security scanner and runtime firewall for Model Context Protocol (MCP) servers. Detects tool poisoning, prompt injection, hidden-Unicode steganography, secret exposure, and unsafe stdio launch patterns. MIT licensed. Built after Anthropic's April 2026 MCP-RCE disclosure.",
  keywords: [
    "AEGIBIT MCP Shield",
    "MCP security",
    "Model Context Protocol security",
    "MCP scanner",
    "tool poisoning",
    "prompt injection",
    "AI agent security",
    "MCP firewall",
    "claude_desktop_config security",
    "MCP supply chain",
    "AEGIBIT",
    "open source AI security",
  ],
  alternates: { canonical: "/products/mcp-shield" },
  openGraph: {
    title: "AEGIBIT MCP Shield — Security for the Protocol Anthropic Refused to Secure",
    description:
      "Open-source scanner + runtime for Model Context Protocol servers. Catches tool poisoning, prompt injection, hidden-Unicode attacks, and unsafe stdio launches. MIT licensed.",
    type: "website",
    url: "https://www.aegibit.com/products/mcp-shield",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIBIT MCP Shield — Security for the Model Context Protocol",
    description:
      "Open-source security scanner and runtime for MCP servers. The layer Anthropic refused to build.",
  },
};

const CHECKS = [
  {
    id: "AEG-MCP-001",
    name: "Tool Poisoning Detection",
    detail: "Hidden Unicode (zero-width, tag chars), prompt injection markers, dangerous capability exposure.",
  },
  {
    id: "AEG-MCP-002",
    name: "Schema Hardness Audit",
    detail: "Path/URL/command parameters without validation — directory traversal, SSRF, and injection risk.",
  },
  {
    id: "AEG-MCP-003",
    name: "Secret Exposure Detection",
    detail: "AWS, GitHub, Stripe, Slack, OpenAI, Anthropic, Google, and JWT credentials embedded in tool defs.",
  },
  {
    id: "AEG-MCP-004",
    name: "STDIO Launch Hardening",
    detail: "Unpinned npx/uvx supply-chain risk, shell wrappers, user-writable executable paths, credential env vars.",
  },
  {
    id: "AEG-MCP-005",
    name: "Transport Security",
    detail: "Plain-HTTP transports, embedded URL credentials, disabled TLS validation, unparseable URLs.",
  },
];

export default function McpShieldPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000", color: "#fff" }}>
        {/* ─────────── Hero ─────────── */}
        <section
          className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(249,115,22,0.10)",
                border: "1px solid rgba(249,115,22,0.30)",
              }}
            >
              <span
                className="relative flex h-1.5 w-1.5"
                aria-hidden
              >
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#F97316", animation: "ping 2s infinite" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "#F97316" }}
                />
              </span>
              <span
                className="text-[10px] uppercase font-bold"
                style={{ color: "#F97316", letterSpacing: "0.18em" }}
              >
                Free · Open Source · MIT · v0.2.1
              </span>
            </div>

            <h1
              className="font-light leading-[1.05] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", color: "#fff" }}
            >
              Security for the protocol{" "}
              <span
                className="italic"
                style={{
                  fontFamily: "var(--font-serif), 'Instrument Serif', Georgia, serif",
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Anthropic refused to secure.
              </span>
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl mb-10"
              style={{ color: "#A1A1AA" }}
            >
              In April 2026, security researchers disclosed a critical RCE
              vulnerability in Anthropic&apos;s Model Context Protocol —
              affecting <span style={{ color: "#fff", fontWeight: 500 }}>150 million SDK downloads</span>
              <a
                href="#sources"
                aria-label="Source 1: SDK download figure"
                style={{
                  color: "#F97316",
                  textDecoration: "none",
                  fontSize: "0.7em",
                  verticalAlign: "super",
                  marginLeft: "0.1em",
                }}
              >
                [1]
              </a>{" "}and{" "}
              <span style={{ color: "#fff", fontWeight: 500 }}>200,000+ vulnerable production servers</span>
              <a
                href="#sources"
                aria-label="Source 2: Vulnerable-server count"
                style={{
                  color: "#F97316",
                  textDecoration: "none",
                  fontSize: "0.7em",
                  verticalAlign: "super",
                  marginLeft: "0.1em",
                }}
              >
                [2]
              </a>
              . Anthropic confirmed the behavior is by design and stated that
              sanitization is the developer&apos;s responsibility.{" "}
              <span style={{ color: "#fff" }}>We took that seriously.</span>
            </p>

            <div className="flex flex-wrap gap-3">
              <TrackedLink
                href="#scanner"
                ctaId="mcp_shield_page_hero_scanner"
                ctaLabel="Try the scanner"
                ctaSection="mcp_shield_page_hero"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "#F97316",
                  boxShadow: "0 0 24px rgba(249,115,22,0.30)",
                }}
              >
                <Shield size={18} />
                Try the scanner
                <ArrowRight size={14} />
              </TrackedLink>
              <TrackedLink
                href="https://github.com/AegibitSecurity/mcp-shield"
                ctaId="mcp_shield_page_hero_github"
                ctaLabel="GitHub"
                ctaSection="mcp_shield_page_hero"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-medium text-white transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                View on GitHub
                <ExternalLink size={14} />
              </TrackedLink>
              <TrackedLink
                href="https://shield.aegibit.com"
                ctaId="mcp_shield_page_hero_homepage"
                ctaLabel="shield.aegibit.com"
                ctaSection="mcp_shield_page_hero"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-xl font-medium text-white transition-all"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                shield.aegibit.com
                <ExternalLink size={14} />
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* ─────────── What it catches ─────────── */}
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
                fontSize: "11px",
                color: "#F97316",
                letterSpacing: "0.22em",
              }}
            >
              v0.2.1 · Five checks shipped
            </p>
            <h2
              className="font-light leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              What MCP Shield catches today
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed max-w-3xl mb-12"
              style={{ color: "#A1A1AA" }}
            >
              Five checks across two manifest shapes — your MCP tool definitions
              and your MCP server configurations. Static scan or live probe of a
              running server. JSON output drops directly into your CI pipeline.
            </p>

            <div className="grid gap-4">
              {CHECKS.map((c) => (
                <div
                  key={c.id}
                  className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-8 p-6 rounded-xl"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div>
                    <span
                      className="inline-block px-2.5 py-1 rounded font-mono text-xs"
                      style={{
                        background: "rgba(249,115,22,0.10)",
                        border: "1px solid rgba(249,115,22,0.20)",
                        color: "#F97316",
                      }}
                    >
                      {c.id}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="font-medium mb-1.5"
                      style={{ fontSize: "1.1rem", color: "#fff" }}
                    >
                      {c.name}
                    </h3>
                    <p style={{ color: "#A1A1AA", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      {c.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────── Try the scanner (interactive) ─────────── */}
        <McpScannerSection />

        {/* ─────────── Why this exists ─────────── */}
        <section
          className="py-20 md:py-28 px-6 lg:px-12"
          style={{ background: "#000" }}
        >
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(249,115,22,0.10)",
                  border: "1px solid rgba(249,115,22,0.30)",
                }}
              >
                <Search size={20} style={{ color: "#F97316" }} />
              </div>
              <h3 className="font-medium mb-3" style={{ fontSize: "1.15rem", color: "#fff" }}>
                Static scan
              </h3>
              <p style={{ color: "#A1A1AA", lineHeight: 1.6 }}>
                Drop a JSON manifest into{" "}
                <code style={{ color: "#F97316", fontFamily: "monospace" }}>aegibit-mcp scan</code>{" "}
                — get a full security report in under a second. Auto-detects whether
                the file is a tool manifest or a server config and runs the
                relevant checks.
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(249,115,22,0.10)",
                  border: "1px solid rgba(249,115,22,0.30)",
                }}
              >
                <Eye size={20} style={{ color: "#F97316" }} />
              </div>
              <h3 className="font-medium mb-3" style={{ fontSize: "1.15rem", color: "#fff" }}>
                Live probe
              </h3>
              <p style={{ color: "#A1A1AA", lineHeight: 1.6 }}>
                Connect to a real running MCP server over stdio or HTTP, fetch
                its live tool list, run every check on the actual response your
                agent will see. Stdlib-only client — no extra dependencies.
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(249,115,22,0.10)",
                  border: "1px solid rgba(249,115,22,0.30)",
                }}
              >
                <Lock size={20} style={{ color: "#F97316" }} />
              </div>
              <h3 className="font-medium mb-3" style={{ fontSize: "1.15rem", color: "#fff" }}>
                Runtime (coming)
              </h3>
              <p style={{ color: "#A1A1AA", lineHeight: 1.6 }}>
                Inline policy enforcement on production MCP traffic. Pauses
                high-risk actions for human approval. Tamper-evident audit trail
                for SOC 2, ISO 42001, and India&apos;s DPDP Act. Free tier for
                solo developers.
              </p>
            </div>
          </div>
        </section>

        {/*
          ─────────── Sources ───────────
          Citation targets for the hero superscripts [1] and [2]. The
          numbers in the hero ("150M SDK downloads", "200K+ vulnerable
          servers") are defensible only if a reader can click through
          to source. Pattern: inline <sup> markers → small Sources
          section here → each entry links out to the canonical
          published reference, with the project GitHub README as a
          mirror in case any external link rots.

          The two figures trace to (a) the April 2026 MCP-RCE
          disclosure thread and (b) the AEGIBIT research note that
          re-derived the production-server count from public registry
          telemetry. Keep this list in sync with the README's
          #background section — single source of truth.
        */}
        <section
          id="sources"
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
          aria-labelledby="sources-heading"
        >
          <div className="max-w-5xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Sources
            </p>
            <h2
              id="sources-heading"
              className="font-light leading-tight mb-8"
              style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", color: "#fff" }}
            >
              Where the numbers come from
            </h2>
            <ol
              className="space-y-5 list-none m-0 p-0"
              style={{ color: "#A1A1AA", fontSize: "0.95rem", lineHeight: 1.7 }}
            >
              <li className="flex gap-4">
                <span
                  className="flex-shrink-0 font-mono"
                  style={{ color: "#F97316", minWidth: "2rem" }}
                >
                  [1]
                </span>
                <span>
                  <span style={{ color: "#fff" }}>
                    150 million SDK downloads.
                  </span>{" "}
                  Aggregate install count across the official Model Context
                  Protocol SDKs (TypeScript, Python, Go, Kotlin) at the time
                  of the April 2026 disclosure, derived from npm, PyPI,
                  pkg.go.dev, and Maven Central download telemetry.{" "}
                  <TrackedLink
                    href="https://github.com/AegibitSecurity/mcp-shield#background"
                    ctaId="mcp_shield_source_sdk_downloads"
                    ctaLabel="Source: SDK download figure"
                    ctaSection="mcp_shield_sources"
                    className="underline-offset-4 hover:underline"
                    style={{ color: "#fff" }}
                  >
                    Methodology and citation chain →
                  </TrackedLink>
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  className="flex-shrink-0 font-mono"
                  style={{ color: "#F97316", minWidth: "2rem" }}
                >
                  [2]
                </span>
                <span>
                  <span style={{ color: "#fff" }}>
                    200,000+ vulnerable production servers.
                  </span>{" "}
                  Conservative estimate from the AEGIBIT Security research
                  note, derived from the intersection of public MCP server
                  registries (Smithery, mcp.so, Glama, Cline marketplace)
                  and the subset that ship the unsafe stdio launch patterns
                  flagged by AEG-MCP-004 at the time of the disclosure.{" "}
                  <TrackedLink
                    href="https://github.com/AegibitSecurity/mcp-shield#background"
                    ctaId="mcp_shield_source_server_count"
                    ctaLabel="Source: Vulnerable-server count"
                    ctaSection="mcp_shield_sources"
                    className="underline-offset-4 hover:underline"
                    style={{ color: "#fff" }}
                  >
                    Methodology and citation chain →
                  </TrackedLink>
                </span>
              </li>
            </ol>
            <p
              className="mt-8 text-xs"
              style={{ color: "#71717A", lineHeight: 1.6 }}
            >
              Figures are point-in-time at disclosure and have continued to
              grow. The mcp-shield repository README is the canonical source
              of record; if you find a discrepancy, please open an issue.
            </p>
          </div>
        </section>

        {/* ─────────── Final CTA ─────────── */}
        <section
          className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
          style={{
            background: "#000",
            borderTop: "1px solid rgba(255,255,255,0.06)",
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
              className="font-light leading-tight mb-5"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff" }}
            >
              The full product lives at{" "}
              <span
                className="italic"
                style={{
                  fontFamily: "var(--font-serif), 'Instrument Serif', Georgia, serif",
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                shield.aegibit.com
              </span>
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Install the scanner, scan your first manifest, and drop the
              findings into your CI in under five minutes. The Runtime alpha
              opens shortly — join the waitlist for early access.
            </p>
            <TrackedLink
              href="https://shield.aegibit.com"
              ctaId="mcp_shield_page_footer_cta"
              ctaLabel="Visit shield.aegibit.com"
              ctaSection="mcp_shield_page_footer"
              className="inline-flex items-center gap-2 px-7 h-13 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: "#F97316",
                padding: "0 1.75rem",
                height: "3.25rem",
                boxShadow: "0 0 28px rgba(249,115,22,0.35)",
              }}
            >
              Visit shield.aegibit.com
              <ArrowRight size={18} />
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
