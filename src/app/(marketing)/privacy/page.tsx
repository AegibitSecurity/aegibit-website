import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /privacy — AEGIBIT Privacy Policy.
 *
 * Created 2026-05-10 (C-3 ship). Footer linked here before this
 * page existed, returning 404. That's a real legal exposure for an
 * Indian entity processing PII via lead forms, behavioral score,
 * UTM cohorts, and chatbot conversation transcripts.
 *
 * Drafting principle: plain English, honest specifics, no legalese
 * boilerplate. Every data category + third-party processor listed
 * here maps to actual code or actual integration. Where the policy
 * has not yet been reviewed by counsel, the page explicitly says so
 * — the audit's "every claim defensible" rule applies to legal copy
 * just as much as marketing copy.
 *
 * The companion India-specific DPDP notice lives at /dpdp. The
 * terms of service lives at /terms.
 */

const LAST_UPDATED = "2026-05-10";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AEGIBIT collects, stores, and uses your data. Plain-English summary, every data category and third-party processor listed. India-based, DPDP-aware, EU/GDPR-aware.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
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
            Privacy Policy
          </span>
          <h1
            className="font-light leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#fff" }}
          >
            What we collect, why, and how to make us forget.
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
              AEGIBIT is an Indian software company. When you visit
              www.aegibit.com or submit a form, we collect a small set
              of operational data (your email if you give it, your
              session fingerprint, which pages you visited, where you
              arrived from). We never sell your data. You can ask us
              to export it or delete it at any time by emailing{" "}
              <Link href="mailto:contact@aegibit.com?subject=Privacy%20Request">
                contact@aegibit.com
              </Link>
              .
            </P>
            <P>
              The rest of this page lists every data category we
              collect, where each one ends up, and what your rights
              are. If your buying process requires a Data Processing
              Agreement (DPA), we can provide one — contact us with
              the request and the AEGIBIT team will respond within
              5 business days.
            </P>
          </Section>

          <Section title="Who we are">
            <P>
              <strong style={{ color: "#fff" }}>AEGIBIT</strong> (the
              brand) is operated from India by the founding team
              behind the AEGIBIT product line — PayMint, MCP Shield,
              and Aira. Operational contact:{" "}
              <Link href="mailto:contact@aegibit.com">
                contact@aegibit.com
              </Link>
              . Postal address is shared on request to verified
              counterparties.
            </P>
            <P>
              Under India&apos;s Digital Personal Data Protection Act
              2023 (DPDP Act), AEGIBIT acts as the &quot;Data
              Fiduciary&quot; for personal data of visitors and
              customers. Under the EU GDPR, AEGIBIT acts as the
              &quot;Data Controller&quot; for EU residents who
              voluntarily submit data to us.
            </P>
          </Section>

          <Section title="What we collect">
            <P>
              We collect these categories — and only these — for the
              purposes listed.
            </P>
            <Table
              rows={[
                {
                  category: "Identity data",
                  examples: "email, name, company, phone (all optional except email when you submit a form)",
                  purpose: "Responding to your inquiry, scheduling demos, sending product updates only if you opt in",
                },
                {
                  category: "Engagement data",
                  examples: "page views, time on page, scroll depth, click events, behavior score",
                  purpose: "Understanding which pages help visitors, deciding what to improve next, classifying inbound leads as hot vs warm",
                },
                {
                  category: "Attribution data",
                  examples: "UTM source, UTM medium, UTM campaign, HTTP referrer, landing page",
                  purpose: "Knowing which channels bring real interest so we don't waste outreach on the wrong audiences",
                },
                {
                  category: "Technical data",
                  examples: "anonymized IP (used for rate limiting), user-agent string, device class, browser, OS",
                  purpose: "Operational security (rate-limit abuse, bot detection), basic compatibility",
                },
                {
                  category: "Chat transcripts",
                  examples: "messages you send to the Aira chat widget, plus the bot's replies",
                  purpose: "Answering you in real time; if you provide your email through the chat, also routing the conversation to the AEGIBIT team for follow-up",
                },
                {
                  category: "Admin session data (admins only)",
                  examples: "iron-session httpOnly cookie containing an opaque session ID",
                  purpose: "Authenticating admins to /admin and /dashboard surfaces — never set for public visitors",
                },
              ]}
            />
          </Section>

          <Section title="Cookies and similar storage">
            <P>
              We use a small set of browser-storage entries. None of
              them are advertising cookies. None are shared with a
              third party for re-targeting.
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>vc_return</strong> —
                a 30-day cookie that lets us recognize a returning
                visitor and show appropriate copy (e.g.
                &quot;welcome back&quot; instead of the first-time
                hero). No personal information attached.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>aegibit_session</strong>{" "}
                — a httpOnly, Secure, SameSite=Lax encrypted cookie
                set only when an admin logs in to /admin. Never set
                for public visitors.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>sessionStorage</strong>{" "}
                — short-lived browser-storage entries holding UTM
                attribution and chat-widget state. Cleared when you
                close the tab.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>localStorage</strong>{" "}
                — first-visit marker (so we don&apos;t replay
                one-time animations) and visitor ID. No personal
                information.
              </Bullet>
            </ul>
            <P>
              A formal cookie-consent banner is on the polish roadmap.
              Until it ships, your operating-system &quot;Do Not
              Track&quot; signal and your browser&apos;s third-party
              cookie controls remain authoritative on this site.
            </P>
          </Section>

          <Section title="Who we share data with (sub-processors)">
            <P>
              We use third-party services to run the website and
              respond to inquiries. Each sub-processor receives only
              the minimum data they need.
            </P>
            <Table
              rows={[
                {
                  category: "Vercel (USA)",
                  examples: "hosting, edge functions, anonymized traffic analytics",
                  purpose: "Serves every page on www.aegibit.com",
                },
                {
                  category: "Supabase (Singapore region)",
                  examples: "Postgres database storing leads, visitor events, agent action audit log",
                  purpose: "Primary database; India-adjacent region chosen to reduce cross-border transfer",
                },
                {
                  category: "Upstash Redis (Mumbai region)",
                  examples: "rate-limit counters keyed by anonymized IP",
                  purpose: "Per-IP rate limiting to prevent form/chat abuse",
                },
                {
                  category: "Resend (USA)",
                  examples: "email address + message body when you submit a lead form",
                  purpose: "Delivers the lead notification email + your auto-acknowledgement",
                },
                {
                  category: "Groq (USA)",
                  examples: "the text content of your chat messages and the bot's replies",
                  purpose: "Runs the Llama 3.3 70B model that powers the chatbot",
                },
                {
                  category: "Slack (USA — internal channel)",
                  examples: "hot-lead notifications (email + a short summary of the lead context)",
                  purpose: "Notifying the AEGIBIT team in real time so high-intent leads get a same-hour reply",
                },
              ]}
            />
            <P>
              We do not sell data to advertisers or data brokers.
              Sub-processors handle only what is described above and
              are bound by their own published Data Processing
              Agreements. If you need names of legal contacts at any
              sub-processor, contact us.
            </P>
          </Section>

          <Section title="How long we keep data">
            <P>
              Retention is by category, not blanket:
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Leads (forms + chat email captures):</strong>{" "}
                kept indefinitely until you ask us to delete them, because
                ongoing business relationships often span years.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Engagement + attribution events:</strong>{" "}
                kept for 365 days in the visitor_events table for funnel
                analytics, then aggregated and deleted at row level.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Chat transcripts:</strong>{" "}
                kept for 90 days; auto-purged unless the conversation
                produced a captured lead (in which case it follows the
                lead retention rule above).
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Rate-limit state:</strong>{" "}
                ephemeral — Redis TTL of 60 seconds. Never persisted.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Server logs:</strong>{" "}
                ephemeral — Vercel runtime rotation; no long-term storage
                of request logs.
              </Bullet>
            </ul>
          </Section>

          <Section title="Your rights">
            <P>
              Regardless of jurisdiction, you can:
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Access</strong> — request
                a copy of every piece of personal data we hold about
                you.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Correct</strong> — fix
                anything that&apos;s wrong.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Delete</strong> — ask
                us to remove your data entirely (we will, except where
                we have a regulatory obligation to retain, e.g. tax
                records).
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Opt out</strong> — stop
                future processing, including any product-update emails.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Complain</strong> — lodge
                a complaint with your local data protection regulator
                (India: Data Protection Board of India once
                operational; EU: your member-state DPA).
              </Bullet>
            </ul>
            <P>
              To exercise any of these, email{" "}
              <Link href="mailto:contact@aegibit.com?subject=Privacy%20Rights%20Request">
                contact@aegibit.com
              </Link>{" "}
              with subject &quot;Privacy Rights Request.&quot; We
              respond within 14 days under DPDP, or sooner under GDPR
              if you cite that framework specifically.
            </P>
          </Section>

          <Section title="Security">
            <P>
              The full security posture is documented at{" "}
              <Link href="/security">/security</Link> — including
              CSP-hardened headers, per-IP rate limiting, httpOnly
              cookie sessions, scrypt-hashed admin credentials, and
              an append-only audit trail on every automation action.
            </P>
            <P>
              In the event of a personal-data breach affecting you,
              we will notify you and the relevant regulator within
              72 hours of becoming aware, in line with GDPR Article
              33 and the comparable DPDP timeline. Notification will
              include what happened, what data was affected, and
              what we&apos;ve done.
            </P>
          </Section>

          <Section title="Children">
            <P>
              AEGIBIT&apos;s products are operational software for
              businesses. We do not knowingly collect data from
              children under 18 (or under 16 where local law sets the
              digital-consent age there). If you believe a child has
              submitted data to us, email{" "}
              <Link href="mailto:contact@aegibit.com?subject=Child%20Data%20Concern">
                contact@aegibit.com
              </Link>{" "}
              and we will delete it immediately.
            </P>
          </Section>

          <Section title="International transfers">
            <P>
              Where a sub-processor is located outside India (USA,
              Singapore), data transfers happen under either the
              sub-processor&apos;s standard contractual clauses or
              their published cross-border framework
              (e.g. Vercel + Resend rely on EU-US DPF for EU data
              transfers; AEGIBIT relies on their adequacy). If
              additional clauses are required for a specific
              buyer&apos;s compliance obligations, contact us.
            </P>
          </Section>

          <Section title="Changes to this policy">
            <P>
              When we change this policy materially, we update the
              &quot;Last updated&quot; date at the top and ship the
              change as a normal git commit (the diff is public on
              github.com/AegibitSecurity/aegibit-website). For
              customers under an active DPA, we also send written
              notice to the contact on file.
            </P>
          </Section>

          <Section title="Not legal advice">
            <P>
              This page describes how AEGIBIT actually operates today.
              It is written by the founding team in plain English
              before formal counsel review. AEGIBIT will engage
              external counsel to review this policy before our first
              enterprise customer contract; the policy text may
              tighten as a result, and that history will be visible
              in the public git log. For specific legal questions
              about your situation, consult your own counsel.
            </P>
          </Section>

          <Section title="Companion documents">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <Link href="/terms">/terms</Link> — terms of service
                for using www.aegibit.com and AEGIBIT&apos;s
                publicly-available products.
              </Bullet>
              <Bullet>
                <Link href="/dpdp">/dpdp</Link> — India-specific DPDP
                Act 2023 notice with the data-fiduciary disclosures
                required by Indian law.
              </Bullet>
              <Bullet>
                <Link href="/security">/security</Link> — technical
                security posture with file-level proof pointers.
              </Bullet>
            </ul>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

// ───────── presentation primitives (same pattern across legal pages) ─────────

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
      ctaId={`privacy_link_${href.replace(/[^a-z0-9]+/gi, "_")}`}
      ctaLabel={String(children)}
      ctaSection="privacy_body"
      className="underline-offset-4 hover:underline"
      style={{ color: "#fff" }}
    >
      {children}
    </TrackedLink>
  );
}

function Table({
  rows,
}: {
  rows: { category: string; examples: string; purpose: string }[];
}) {
  return (
    <div
      className="rounded-xl overflow-hidden my-6"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {rows.map((r, i) => (
        <div
          key={r.category}
          className="grid md:grid-cols-[200px_1fr_1fr] gap-4 md:gap-6 p-5"
          style={{
            background: i % 2 === 0 ? "#0D0D0D" : "#0A0A0A",
            borderTop:
              i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <p
              className="font-medium"
              style={{ color: "#fff", fontSize: "0.95rem" }}
            >
              {r.category}
            </p>
          </div>
          <div>
            <p
              className="font-mono"
              style={{
                color: "#71717A",
                fontSize: "0.82rem",
                lineHeight: 1.55,
              }}
            >
              {r.examples}
            </p>
          </div>
          <div>
            <p style={{ color: "#A1A1AA", fontSize: "0.92rem", lineHeight: 1.55 }}>
              {r.purpose}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
