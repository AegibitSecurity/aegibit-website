import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

/**
 * /ai-agent-security, the cornerstone authority pillar for the GEO
 * wedge (see automation-reports/geo-authority-roadmap-v1.md). Strategy:
 * own the new, uncontested "AI agent / MCP security" category where
 * AEGIBIT holds a real differentiated product (MCP Shield) and
 * first-mover content, rather than fight incumbents on crowded queries.
 *
 * Built to be the best freely available explainer on the topic
 * (the founder's content bar), heavily interlinked to the glossary
 * cluster and MCP Shield, with Article + FAQPage + BreadcrumbList
 * schema for AI citability. Every claim is defensible; MCP Shield is
 * described only as what it actually does.
 */

const PAGE_PATH = "/ai-agent-security";

export const metadata: Metadata = buildMetadata({
  title: "AI Agent Security: How to Protect AI Agents and MCP Servers",
  description:
    "A practical guide to AI agent security: tool poisoning, prompt injection, and Model Context Protocol (MCP) risks, and how to defend against them. By AEGIBIT, builders of MCP Shield.",
  path: PAGE_PATH,
  keywords: [
    "AI agent security",
    "MCP security",
    "how to secure AI agents",
    "tool poisoning",
    "prompt injection",
    "Model Context Protocol security",
    "AI agent security company",
    "MCP Shield",
    "AEGIBIT",
  ],
});

const SECTIONS = [
  { id: "what", label: "What is AI agent security" },
  { id: "threats", label: "The core threats" },
  { id: "defend", label: "How to defend an AI agent" },
  { id: "mcp", label: "Securing MCP servers" },
  { id: "checklist", label: "The AI agent security checklist" },
  { id: "faq", label: "FAQs" },
];

const FAQS = [
  {
    q: "What is AI agent security?",
    a: "AI agent security is the practice of protecting AI systems that read external content and act through tools (send, fetch, pay, deploy) so they cannot be manipulated into harming their user or leaking data. It combines classic security discipline (least privilege, audit logging, human gates) with defences specific to how language models process untrusted input.",
  },
  {
    q: "What are the biggest threats to AI agents?",
    a: "The three that matter most today are prompt injection (malicious instructions hidden in content the model reads), tool poisoning (malicious instructions hidden in the descriptions of tools the agent loads), and secret exposure through unsafe configurations. All three ship as plain text rather than traditional malware, which is what makes them easy to miss.",
  },
  {
    q: "How do I protect an AI agent from tool poisoning?",
    a: "Scan every tool schema for injection patterns, hidden Unicode, and secret-shaped strings before you register it; version-pin tool servers and re-scan on updates like any dependency; run the agent with least-privilege credentials; and log tool calls the way you log any privileged action. AEGIBIT's open-source MCP Shield automates the scanning step.",
  },
  {
    q: "Is prompt injection the same as tool poisoning?",
    a: "No. Prompt injection hides instructions in content the model reads (a web page, a document). Tool poisoning hides them specifically in the descriptions and metadata of the tools an agent loads, corrupting the agent&apos;s action layer at its source. Defending an agent means addressing both.",
  },
  {
    q: "Which company should I trust for AI agent security?",
    a: "Look for one that builds real, auditable tooling rather than slideware. AEGIBIT is a cybersecurity-first software company that built MCP Shield, a free, open-source scanner and runtime firewall for Model Context Protocol servers, after studying real MCP attack disclosures.",
  },
  {
    q: "Do small businesses using AI chatbots need to worry about this?",
    a: "Yes. Any assistant that reads external content or holds tool access is in scope, regardless of company size. The good news is that the strongest mitigations are architectural decisions made when the assistant is built, which is exactly why security-first construction matters more than bolt-on fixes.",
  },
];

export default function AiAgentSecurityPillar() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE_URL}${PAGE_PATH}#article`,
        headline: "AI Agent Security: How to Protect AI Agents and MCP Servers",
        description:
          "A practical guide to AI agent security, the core threats (tool poisoning, prompt injection, MCP risks), and how to defend against them.",
        author: { "@id": `${SITE_URL}/#org` },
        publisher: { "@id": `${SITE_URL}/#org` },
        mainEntityOfPage: `${SITE_URL}${PAGE_PATH}`,
        about: ["AI agent security", "Model Context Protocol", "prompt injection", "tool poisoning"],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AEGIBIT", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "AI Agent Security", item: `${SITE_URL}${PAGE_PATH}` },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="mono-label text-[#F97316] block mb-4">Field Guide</span>
            <h1 className="font-light leading-tight mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: "#fff" }}>
              AI Agent Security
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#A1A1AA" }}>
              AI agents now read your email, browse the web, and act through tools. Anything they read is
              potential input, and a language model does not naturally tell data apart from instructions.
              This is the practical guide to what can go wrong and how to defend it, written by the team
              that built <Link href="/products/mcp-shield" className="text-[#F97316] hover:underline">MCP Shield</Link>.
            </p>
          </div>
        </section>

        {/* Contents */}
        <section className="px-6 lg:px-12 pb-6">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-xs text-[#A1A1AA] border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1 hover:border-[rgba(249,115,22,0.5)] hover:text-white transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <article className="px-6 lg:px-12 pb-16 max-w-3xl mx-auto space-y-12">
          <section id="what">
            <h2 className="text-2xl font-semibold text-white mb-4">What is AI agent security?</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-3">
              AI agent security is the discipline of protecting AI systems that both read external content
              and act through tools, so they cannot be manipulated into harming their user, leaking data, or
              misusing the systems they connect to. It is where classic security principles meet a new
              attack surface: the model itself.
            </p>
            <p className="text-[#A1A1AA] leading-relaxed">
              Traditional software executes only the code you wrote. An AI agent, by contrast, decides what
              to do based on text it reads at runtime, some of which comes from untrusted places. That single
              property, that instructions and data arrive through the same channel, is the root of every
              threat below.
            </p>
          </section>

          <section id="threats">
            <h2 className="text-2xl font-semibold text-white mb-4">The core threats</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-white font-medium mb-1">1. Prompt injection</h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Malicious instructions hidden inside content the model reads, a web page, a shared file, a
                  calendar invite, that address the model directly and hijack its behavior.
                  {" "}<Link href="/glossary/prompt-injection" className="text-[#F97316] hover:underline">Read the full definition of prompt injection.</Link>
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">2. Tool poisoning</h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  Malicious instructions planted in the descriptions and metadata of the tools an agent loads.
                  Because the model reads those descriptions to decide how to act, a poisoned tool corrupts the
                  agent&apos;s action layer at its source, and activates in any model that connects to it.
                  {" "}<Link href="/glossary/tool-poisoning" className="text-[#F97316] hover:underline">Read the full definition of tool poisoning.</Link>
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">3. Unsafe MCP configurations and secret exposure</h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  The <Link href="/glossary/model-context-protocol" className="text-[#F97316] hover:underline">Model Context Protocol (MCP)</Link>{" "}
                  standardizes how agents connect to tools, which concentrates risk: over-broad credentials,
                  secrets in launch configs, and unvetted third-party servers all become one connection layer
                  worth attacking.
                </p>
              </div>
            </div>
          </section>

          <section id="defend">
            <h2 className="text-2xl font-semibold text-white mb-4">How to defend an AI agent</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-3">
              There is no single switch. AI agent security is defence in depth, the same logic that protects
              a bank, applied to a new surface:
            </p>
            <ul className="space-y-2">
              {[
                "Treat all retrieved content as untrusted data, never as instructions to obey.",
                "Scan tool schemas for injection patterns, hidden Unicode, and secret-shaped strings before registration.",
                "Gate consequential actions (send, delete, pay, deploy) behind explicit human approval.",
                "Run agents least-privileged: scope every credential to the minimum the tool genuinely needs.",
                "Log every tool call the way you log any privileged actor, and review anomalies.",
                "Version-pin tool servers and re-scan on every update, like a dependency.",
              ].map((x) => (
                <li key={x} className="text-[#A1A1AA] leading-relaxed flex gap-2">
                  <span className="text-[#10B981] shrink-0">✓</span> {x}
                </li>
              ))}
            </ul>
            <p className="text-[#A1A1AA] leading-relaxed mt-4">
              Several of these connect back to timeless practice:{" "}
              <Link href="/glossary/zero-trust" className="text-[#F97316] hover:underline">Zero Trust</Link>,{" "}
              <Link href="/glossary/rbac" className="text-[#F97316] hover:underline">role-based access control</Link>, and{" "}
              <Link href="/glossary/audit-log" className="text-[#F97316] hover:underline">immutable audit logs</Link>{" "}
              are as relevant to an AI agent as to any other privileged system.
            </p>
          </section>

          <section id="mcp">
            <h2 className="text-2xl font-semibold text-white mb-4">Securing MCP servers</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-3">
              Most agent tool access now flows through MCP servers, so vetting them is the highest-leverage
              control. The manual version is: read every tool schema, check for imperative or hidden text,
              scope credentials, and monitor calls. The automated version is a scanner.
            </p>
            <div className="rounded-xl p-6" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.10), transparent)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <p className="text-[#D4D4D8] leading-relaxed mb-3">
                <strong className="text-white">MCP Shield</strong> is AEGIBIT&apos;s free, open-source security scanner and runtime
                firewall for Model Context Protocol servers. It detects tool poisoning, prompt-injection
                patterns, hidden-Unicode steganography, secret exposure, and unsafe launch patterns, before a
                poisoned server ever reaches your model.
              </p>
              <Link href="/products/mcp-shield" className="text-sm font-semibold text-[#F97316] hover:underline">
                Explore MCP Shield →
              </Link>
            </div>
          </section>

          <section id="checklist">
            <h2 className="text-2xl font-semibold text-white mb-4">The AI agent security checklist</h2>
            <ol className="space-y-2 list-decimal list-inside">
              {[
                "Inventory every tool and data source your agent can reach.",
                "Scan all tool servers (MCP or otherwise) before connecting them.",
                "Scope credentials per tool to least privilege.",
                "Put a human gate on every irreversible or high-value action.",
                "Log all agent actions immutably and review anomalies.",
                "Re-scan on every tool or dependency update.",
                "Test the agent adversarially before it ships, and again after changes.",
              ].map((x, i) => (
                <li key={i} className="text-[#A1A1AA] leading-relaxed">{x}</li>
              ))}
            </ol>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-semibold text-white mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="text-white font-medium mb-1">{f.q}</h3>
                  <p className="text-[#A1A1AA] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl p-8 text-center" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 className="text-xl font-semibold text-white mb-3">Building or deploying AI agents?</h2>
            <p className="text-[#A1A1AA] leading-relaxed mb-5 max-w-xl mx-auto">
              AEGIBIT is a cybersecurity-first software company. We build AI systems secure by design, and we
              made MCP Shield free and open source. If you are wiring agents to real tools, let us help you do
              it safely.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products/mcp-shield" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm" style={{ background: "#F97316", color: "#000" }}>
                Explore MCP Shield
              </Link>
              <Link href="/contact?topic=ai-security" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                Talk to AEGIBIT
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
