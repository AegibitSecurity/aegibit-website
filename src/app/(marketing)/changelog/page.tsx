import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /changelog — AEGIBIT ship log.
 *
 * Discipline call:
 *   Every entry must trace to an actual merged PR or shipped artifact.
 *   A fabricated changelog is the same credibility miss the rest of
 *   the $1B sprint was built to eliminate. Each entry includes the
 *   PR number so a CISO can click through to the diff.
 *
 *   Scope here is the public site + open-source products (MCP Shield).
 *   Internal PayMint deploys and Aira desktop-app releases live in
 *   their own product changelogs (see /products/aira/changelog) and
 *   are summarized here only when there's a customer-visible change.
 *
 *   When the volume justifies it (every week-ish), this should pivot
 *   to an MDX-sourced collection with a per-entry permalink and an
 *   RSS feed. For now hand-curated is honest and lightweight.
 *
 * Voice rule:
 *   Past tense, AEGIBIT-as-entity, one-line description. No
 *   exclamation marks, no marketing puff. The reader is a buyer
 *   doing diligence, not a hype-thread.
 */

export const metadata: Metadata = {
  title: "AEGIBIT Changelog — What shipped, when",
  description:
    "Public ship log for AEGIBIT — every meaningful change to the website, the platform, and the open-source products. Each entry links to the merged pull request so the work is verifiable.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "AEGIBIT Changelog",
    description:
      "Public ship log. Every entry traces to a merged pull request.",
    type: "website",
    url: "https://www.aegibit.com/changelog",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary",
    title: "AEGIBIT Changelog",
    description:
      "Public ship log. Every entry traces to a merged pull request.",
  },
};

type Entry = {
  date: string;
  tag: "Site" | "Platform" | "MCP Shield" | "Aira" | "PayMint";
  title: string;
  detail: string;
  prNumber?: number;
};

// Reverse-chronological. Newest at top.
const ENTRIES: Entry[] = [
  {
    date: "2026-05-14",
    tag: "Site",
    title: "Brand-chrome pages — /status, /changelog, /careers, /press",
    detail:
      "Four entity-level pages added. Honest scope on each — no fake uptime histograms, no listed roles when we're not hiring yet, no fabricated press coverage.",
    prNumber: 102,
  },
  {
    date: "2026-05-14",
    tag: "Site",
    title: "Defensible <sup> citations on /products/mcp-shield",
    detail:
      "Two hero figures (150M SDK downloads, 200K+ vulnerable servers) now carry inline [1][2] superscripts linking to a same-page Sources section with methodology + canonical GitHub README pointer.",
    prNumber: 101,
  },
  {
    date: "2026-05-14",
    tag: "Site",
    title: "Dropped deprecated VoiceCore offer from homepage JSON-LD",
    detail:
      "VoiceCore was retired from every marketing surface but lingered in Schema.org structured data. Replaced with MCP Shield. Aira gained a url field so Google has an edge to /products/aira.",
    prNumber: 100,
  },
  {
    date: "2026-05-14",
    tag: "Site",
    title: "Cookie / data-collection notice banner",
    detail:
      "First-visit notice for DPDP Act §4 explicit-disclosure compliance. Not an opt-in gate (AEGIBIT doesn't set tracking cookies) — clear-disclosure model that matches what the site actually does.",
    prNumber: 99,
  },
  {
    date: "2026-05-13",
    tag: "Site",
    title: "Accessibility pass — focus-visible, skip-to-content, aria-labels",
    detail:
      "WCAG 2.1 AA pass. Global :focus-visible outline, skip-to-content anchor, dynamic aria-label on the mobile menu, prefers-reduced-motion suppression. Footer body-text contrast bumped from 2.4:1 to 6.1:1.",
    prNumber: 98,
  },
  {
    date: "2026-05-13",
    tag: "Site",
    title: "Brand color unification — single #F97316 orange",
    detail:
      "24-file sed sweep collapsed three different orange values (#FF5A1F, #FF6A00, #F97316) and their RGBA variants into the canonical Tailwind orange-500. Hover variant #EA580C matches orange-600.",
    prNumber: 97,
  },
  {
    date: "2026-05-13",
    tag: "Site",
    title: "Legal pages — /privacy, /terms, /dpdp",
    detail:
      "Three companion documents. /dpdp is the India-specific DPDP Act 2023 overlay with statute references and the five Data Principal rights. /privacy lists every sub-processor and per-category retention. /terms keeps liability-cap honest at ₹0 on free-tier.",
    prNumber: 96,
  },
  {
    date: "2026-05-13",
    tag: "Site",
    title: "/features rewritten — platform thesis, three products",
    detail:
      "Replaced AI-buzzword positioning with the actual platform thesis: three products (PayMint, MCP Shield, Aira) and five shared substrate primitives, each with a ↳ proof pointer to source. Includes an explicit 'what we are not yet' non-claim block.",
    prNumber: 95,
  },
  {
    date: "2026-05-12",
    tag: "Site",
    title: "/security rewritten — defensible posture, honest compliance status",
    detail:
      "Six posture items each with a ↳ proof pointer to a real file. Honest compliance status (Aligning / In progress / Aware) and an explicit 'what we do NOT claim' block listing ISO 27001 / HIPAA / RBI / SEBI / FedRAMP / IRAP / C5 with reasons. Responsible-disclosure path with 48h ack, 7d remediation, no-legal-action commitment.",
    prNumber: 94,
  },
  {
    date: "2026-04-22",
    tag: "MCP Shield",
    title: "MCP Shield v0.2.1 — five checks, MIT licensed, public",
    detail:
      "Open-source security scanner and runtime for Model Context Protocol servers. Five checks shipped: AEG-MCP-001 tool poisoning, -002 schema hardness, -003 secret exposure, -004 stdio launch hardening, -005 transport security. Built after the April 2026 MCP-RCE disclosure.",
  },
];

const TAG_COLORS: Record<Entry["tag"], { bg: string; border: string; text: string }> = {
  Site: {
    bg: "rgba(249,115,22,0.10)",
    border: "rgba(249,115,22,0.25)",
    text: "#F97316",
  },
  Platform: {
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.25)",
    text: "#818CF8",
  },
  "MCP Shield": {
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    text: "#22C55E",
  },
  Aira: {
    bg: "rgba(168,85,247,0.10)",
    border: "rgba(168,85,247,0.25)",
    text: "#C084FC",
  },
  PayMint: {
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    text: "#FBBF24",
  },
};

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        style={{ background: "#000", color: "#fff" }}
      >
        {/* ───────── Hero ───────── */}
        <section
          className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-5xl mx-auto">
            <p
              className="mono-label uppercase mb-4"
              style={{
                fontSize: "11px",
                color: "#F97316",
                letterSpacing: "0.22em",
              }}
            >
              Public ship log
            </p>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "#fff" }}
            >
              What AEGIBIT{" "}
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
                shipped, and when.
              </span>
            </h1>
            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              Every entry traces to a merged pull request or a published
              release. No fabricated history. Hand-curated for now;
              MDX-sourced with an RSS feed when the volume justifies it.
            </p>
          </div>
        </section>

        {/* ───────── Entries ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <ol className="space-y-8 list-none m-0 p-0">
              {ENTRIES.map((e, i) => {
                const tag = TAG_COLORS[e.tag];
                return (
                  <li
                    key={`${e.date}-${i}`}
                    className="grid md:grid-cols-[140px_1fr] gap-3 md:gap-8 pb-8"
                    style={{
                      borderBottom:
                        i === ENTRIES.length - 1
                          ? "none"
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div>
                      <p
                        className="font-mono"
                        style={{
                          color: "#71717A",
                          fontSize: "0.82rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {e.date}
                      </p>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: tag.bg,
                          border: `1px solid ${tag.border}`,
                          color: tag.text,
                        }}
                      >
                        {e.tag}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-medium mb-2"
                        style={{ fontSize: "1.05rem", color: "#fff", lineHeight: 1.4 }}
                      >
                        {e.title}
                      </h3>
                      <p
                        style={{
                          color: "#A1A1AA",
                          fontSize: "0.95rem",
                          lineHeight: 1.65,
                          marginBottom: e.prNumber ? "0.6rem" : "0",
                        }}
                      >
                        {e.detail}
                      </p>
                      {e.prNumber && (
                        <TrackedLink
                          href={`https://github.com/AegibitSecurity/aegibit-website/pull/${e.prNumber}`}
                          ctaId={`changelog_pr_${e.prNumber}`}
                          ctaLabel={`PR #${e.prNumber}`}
                          ctaSection="changelog_entries"
                          className="inline-flex items-center text-xs font-mono underline-offset-4 hover:underline"
                          style={{ color: "#71717A" }}
                        >
                          PR #{e.prNumber}
                        </TrackedLink>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ───────── Footer note ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#000",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              Looking for product-specific release notes? Aira desktop-app
              releases live at{" "}
              <TrackedLink
                href="/products/aira/changelog"
                ctaId="changelog_aira_releases"
                ctaLabel="Aira release notes"
                ctaSection="changelog_footer"
                className="underline-offset-4 hover:underline"
                style={{ color: "#fff" }}
              >
                /products/aira/changelog
              </TrackedLink>
              . MCP Shield versions ship at{" "}
              <TrackedLink
                href="https://github.com/AegibitSecurity/mcp-shield/releases"
                ctaId="changelog_mcp_shield_releases"
                ctaLabel="MCP Shield releases"
                ctaSection="changelog_footer"
                className="underline-offset-4 hover:underline"
                style={{ color: "#fff" }}
              >
                github.com/AegibitSecurity/mcp-shield/releases
              </TrackedLink>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
