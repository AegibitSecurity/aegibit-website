import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /terms — AEGIBIT Terms of Service.
 *
 * Created 2026-05-10 (C-3 ship). Footer linked here before this
 * page existed (404). This document covers public use of
 * www.aegibit.com and the publicly-available AEGIBIT products
 * (PayMint demo, MCP Shield open-source, Aira free desktop).
 * Paid contracts are governed by a separate MSA agreed at signing.
 *
 * Drafting principle: plain English, what users can/can't do,
 * what AEGIBIT promises, what AEGIBIT doesn't. Honest about scope —
 * the disclaimer block explicitly says this will be reviewed by
 * counsel before AEGIBIT scales to enterprise contracts.
 */

const LAST_UPDATED = "2026-05-10";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for using www.aegibit.com and AEGIBIT's publicly-available products (PayMint demo, MCP Shield, Aira). Plain-English, honest scope, India-anchored.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000", color: "#fff" }}>
        <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-36 pb-24 md:pt-44 md:pb-32">
          <span
            className="mono-label uppercase block mb-6"
            style={{
              color: "#F97316",
              letterSpacing: "0.22em",
              fontSize: "11px",
            }}
          >
            Terms of Service
          </span>
          <h1
            className="font-light leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#fff" }}
          >
            What you agree to by using www.aegibit.com.
          </h1>
          <p
            className="font-mono mb-12"
            style={{
              color: "#52525B",
              fontSize: "12px",
              letterSpacing: "0.04em",
            }}
          >
            Last updated: {LAST_UPDATED} · v1.0
          </p>

          <Section title="Plain-English summary">
            <P>
              These terms cover public use of www.aegibit.com and
              AEGIBIT&apos;s publicly-available products: the PayMint
              demo, MCP Shield open-source code, and the free Aira
              Windows desktop assistant. Paid contracts are separately
              governed by an MSA agreed at signing.
            </P>
            <P>
              By visiting the site or downloading anything from it,
              you agree to: not abuse it, not pretend to be us, not
              reverse-engineer the security controls, and to follow
              the licenses on each product (MIT for MCP Shield, the
              Aira EULA in the installer for Aira, the PayMint
              subscription terms when you become a customer).
            </P>
          </Section>

          <Section title="Who AEGIBIT is">
            <P>
              AEGIBIT is an Indian software company operating
              www.aegibit.com and the AEGIBIT product line (PayMint,
              MCP Shield, Aira). Operational contact:{" "}
              <Link href="mailto:contact@aegibit.com">
                contact@aegibit.com
              </Link>
              .
            </P>
          </Section>

          <Section title="What you can do">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                Browse the site, read the content, share links.
              </Bullet>
              <Bullet>
                Submit forms (demo requests, contact inquiries) and
                expect a reply from the AEGIBIT team within 24
                business hours.
              </Bullet>
              <Bullet>
                Download free products (Aira Windows installer, MCP
                Shield from GitHub) under the license bundled with
                each.
              </Bullet>
              <Bullet>
                Quote or reference us in good faith — research, blog
                posts, comparison pages, podcasts. We&apos;d love
                a link back to{" "}
                <Link href="https://www.aegibit.com">www.aegibit.com</Link>
                .
              </Bullet>
              <Bullet>
                Use the Aira chatbot to ask product questions and
                request a founder follow-up.
              </Bullet>
            </ul>
          </Section>

          <Section title="What you can't do">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                Try to break into the site or admin surfaces, run
                automated scans against production traffic, or
                bypass rate limits. (Good-faith security research is
                welcome — see the responsible disclosure path on{" "}
                <Link href="/security">/security</Link>.)
              </Bullet>
              <Bullet>
                Impersonate AEGIBIT, the AEGIBIT team, or any
                AEGIBIT product. The AEGIBIT name, logo, and
                wordmark are trademarks we&apos;ll defend.
              </Bullet>
              <Bullet>
                Reverse-engineer security controls (CSP, rate
                limiting, audit trail) for the purpose of evading
                them. Reverse-engineering for compatibility or
                interoperability — fine.
              </Bullet>
              <Bullet>
                Scrape the site at a rate that interferes with other
                visitors&apos; experience. Reasonable crawling
                (search engines, archive bots) is allowed and our
                robots.txt is the authoritative guide.
              </Bullet>
              <Bullet>
                Use the chatbot for high-volume API-like access. The
                chatbot is built for human conversation; programmatic
                clients should contact us for API access discussions.
              </Bullet>
              <Bullet>
                Republish or rebrand AEGIBIT content (blog posts,
                case studies, product pages) without permission.
                Quoting with attribution is fine.
              </Bullet>
            </ul>
          </Section>

          <Section title="Products and their licenses">
            <P>
              AEGIBIT products are governed by their individual
              licenses, which override these general terms where
              they conflict.
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>MCP Shield</strong> —
                MIT licensed. Full text in the GitHub repository at{" "}
                <Link href="https://github.com/AegibitSecurity/mcp-shield">
                  github.com/AegibitSecurity/mcp-shield
                </Link>
                . You can use, modify, redistribute under the MIT
                terms.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Aira (Free)</strong> —
                free for personal and commercial use. EULA shipped
                inside the Windows installer. No telemetry leaves
                your machine without your explicit action (e.g.
                submitting an Aira Pro waitlist email).
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>PayMint</strong> —
                pricing and subscription terms are published at{" "}
                <Link href="/pricing">/pricing</Link>. Active
                customers are governed by the MSA signed at the start
                of the engagement; that document overrides these
                general terms.
              </Bullet>
            </ul>
          </Section>

          <Section title="Availability and changes">
            <P>
              The site is provided on a best-effort basis. We don&apos;t
              promise specific uptime numbers on www.aegibit.com
              (those numbers belong on the product-specific status
              page, not the marketing site). Pages, features, and
              copy may change without notice.
            </P>
            <P>
              When we change these terms materially, we update the
              &quot;Last updated&quot; date at the top and the diff
              is publicly visible in the git history at
              github.com/AegibitSecurity/aegibit-website. For
              customers under an active MSA, we also send written
              notice to the contact on file.
            </P>
          </Section>

          <Section title="Disclaimer of warranties">
            <P>
              The site and the free products are provided
              &quot;as is.&quot; We don&apos;t warrant that the site
              will be uninterrupted, error-free, or that the free
              products will work for your specific use case.
            </P>
            <P>
              For PayMint customers under an active MSA, the
              warranties in the signed agreement apply instead of
              this section.
            </P>
          </Section>

          <Section title="Limitation of liability">
            <P>
              To the extent permitted by law, AEGIBIT&apos;s liability
              arising from public use of www.aegibit.com or the free
              products is limited to direct damages and capped at
              ₹0 (we make no money from your free use of these). For
              paid PayMint customers, liability terms in the signed
              MSA apply instead and supersede this paragraph.
            </P>
            <P>
              Nothing in these terms limits liability for
              death, personal injury, fraud, or anything else that
              cannot be limited under applicable law.
            </P>
          </Section>

          <Section title="Governing law and forum">
            <P>
              These terms are governed by the laws of India. Disputes
              arising from these terms will be brought before the
              courts of Kolkata, West Bengal, India.
            </P>
            <P>
              For paid customers, the MSA may specify a different
              governing law or arbitration mechanism agreed during
              contract negotiation; that document supersedes this
              section.
            </P>
          </Section>

          <Section title="Contact">
            <P>
              For legal notices, demands, or contract questions,
              email{" "}
              <Link href="mailto:contact@aegibit.com?subject=Legal%20-%20Terms">
                contact@aegibit.com
              </Link>{" "}
              with subject &quot;Legal - Terms.&quot; The AEGIBIT
              team monitors this address and routes appropriately.
            </P>
          </Section>

          <Section title="Not legal advice">
            <P>
              These terms are written by the AEGIBIT team in plain
              English before formal counsel review. AEGIBIT will
              engage external counsel to review this document before
              our first enterprise customer contract; the text may
              tighten as a result, and that history will be visible
              in the public git log. For specific legal questions
              about your situation, consult your own counsel.
            </P>
          </Section>

          <Section title="Companion documents">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <Link href="/privacy">/privacy</Link> — how we
                collect, store, and use data.
              </Bullet>
              <Bullet>
                <Link href="/dpdp">/dpdp</Link> — India-specific
                DPDP Act 2023 notice.
              </Bullet>
              <Bullet>
                <Link href="/security">/security</Link> — technical
                security posture.
              </Bullet>
            </ul>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

// ───────── presentation primitives (mirror /privacy) ─────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2
        className="font-medium mb-5"
        style={{
          fontSize: "1.35rem",
          color: "#fff",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "#A1A1AA", lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden style={{ color: "#F97316", marginTop: "0.45rem", lineHeight: 0 }}>·</span>
      <span>{children}</span>
    </li>
  );
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = !href.startsWith("/") && !href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:underline"
        style={{ color: "#fff" }}
      >
        {children}
      </a>
    );
  }
  return (
    <TrackedLink
      href={href}
      ctaId={`terms_link_${href.replace(/[^a-z0-9]+/gi, "_")}`}
      ctaLabel={String(children)}
      ctaSection="terms_body"
      className="underline-offset-4 hover:underline"
      style={{ color: "#fff" }}
    >
      {children}
    </TrackedLink>
  );
}
