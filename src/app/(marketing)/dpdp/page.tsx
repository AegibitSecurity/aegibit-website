import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /dpdp — India-specific Digital Personal Data Protection Act
 * notice. C-3 ship.
 *
 * AEGIBIT is an Indian entity processing the personal data of
 * Indian visitors and customers (lead-form emails, behavioral
 * score, UTM cohort, chat transcripts). India's Digital Personal
 * Data Protection Act 2023 ("DPDP Act") applies by default. This
 * page exists to satisfy the explicit-notice requirement under the
 * DPDP Act and to provide a single India-anchored reference for
 * data-principal rights.
 *
 * The general privacy policy lives at /privacy — this page is the
 * Indian-statute-specific overlay. Anywhere the DPDP Act and the
 * general policy differ, the DPDP-required language on this page
 * is authoritative for Indian data principals.
 */

const LAST_UPDATED = "2026-05-10";

export const metadata: Metadata = {
  title: "DPDP Act Notice",
  description:
    "AEGIBIT's notice under India's Digital Personal Data Protection Act 2023. What we collect, lawful basis, your rights as a data principal, how to file a complaint with the Data Protection Board of India.",
  alternates: { canonical: "/dpdp" },
  robots: { index: true, follow: true },
};

export default function DpdpPage() {
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
            DPDP Act 2023 Notice · India
          </span>
          <h1
            className="font-light leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#fff" }}
          >
            Your rights as a Data Principal under Indian law.
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

          <Section title="What this notice is">
            <P>
              AEGIBIT is an Indian software company. India&apos;s
              Digital Personal Data Protection Act 2023 (the
              &quot;DPDP Act&quot;) governs how we collect and process
              the personal data of individuals located in India.
            </P>
            <P>
              Under the DPDP Act, AEGIBIT is the{" "}
              <strong style={{ color: "#fff" }}>Data Fiduciary</strong>{" "}
              and you — the visitor, the lead, the customer — are
              the{" "}
              <strong style={{ color: "#fff" }}>Data Principal</strong>.
              This page describes what data we process, why, and how
              you exercise the rights the Act gives you.
            </P>
            <P>
              Our general (non-jurisdictional) privacy policy is at{" "}
              <Link href="/privacy">/privacy</Link>. Where the DPDP
              Act and the general policy differ, the language here
              is authoritative for Indian data principals.
            </P>
          </Section>

          <Section title="What we collect from you (lawful basis)">
            <P>
              We process your personal data only with your consent
              — given when you submit a form, send a chat message,
              or download a product — and only for the specific
              purpose you submitted it for. Under the DPDP Act, this
              is the &quot;consent&quot; ground (§4).
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Form submissions</strong>{" "}
                — email, name, company, phone (when you provide them)
                are processed to respond to the inquiry you submitted.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Chat with Aira</strong>{" "}
                — your message text is sent to the Groq LLM service
                so the bot can reply. If you provide your email in
                chat, it goes into the lead pipeline the same as a
                form submission.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Engagement signals</strong>{" "}
                — pages visited, time on site, scroll depth,
                anonymized IP-derived country. Used in aggregate to
                improve the site; never sold; never used to target
                you individually.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Free product downloads</strong>{" "}
                — when you download MCP Shield from GitHub or Aira
                from this site, AEGIBIT itself does not collect any
                personal data tied to that download (GitHub may; the
                Aira free Windows installer is local-first and does
                not phone home).
              </Bullet>
            </ul>
            <P>
              We do not process &quot;sensitive personal data&quot;
              as defined under emerging DPDP Rules (e.g. financial
              information, health, biometric, caste, religion) on
              public pages. PayMint as a paid product processes
              certain financial data; that is governed by the MSA
              and a separate Data Processing Agreement signed at
              customer onboarding.
            </P>
          </Section>

          <Section title="Your rights as a Data Principal">
            <P>
              The DPDP Act gives you the following rights against
              AEGIBIT as Data Fiduciary. To exercise any of them,
              email{" "}
              <Link href="mailto:contact@aegibit.com?subject=DPDP%20-%20Rights%20Request">
                contact@aegibit.com
              </Link>{" "}
              with subject &quot;DPDP - Rights Request.&quot; We
              respond within 14 days.
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Right to access information (§11)</strong>{" "}
                — request a summary of the personal data we hold
                about you and the identities of any Data Processors
                we&apos;ve shared it with.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Right to correction and erasure (§12)</strong>{" "}
                — ask us to correct anything inaccurate or to delete
                your data entirely. We will comply unless we are
                legally required to retain (e.g. tax records under
                the Income Tax Act).
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Right to nominate (§13)</strong>{" "}
                — designate another person to exercise these rights
                on your behalf in the event of your death or
                incapacity. Email us the nomination details.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Right of grievance redressal (§14)</strong>{" "}
                — if you&apos;re unsatisfied with how we&apos;ve
                handled a request, you can escalate to the Data
                Protection Board of India (see below).
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Right to withdraw consent</strong>{" "}
                — at any point. The processing that already happened
                under your previous consent remains lawful, but we
                stop further processing once you withdraw.
              </Bullet>
            </ul>
          </Section>

          <Section title="Cross-border data transfer">
            <P>
              Some of our sub-processors are located outside India
              (Vercel in the USA, Resend in the USA, Groq in the
              USA, Supabase in Singapore — see{" "}
              <Link href="/privacy">/privacy</Link> for the full
              list). The DPDP Act permits cross-border transfer to
              any country except those the Central Government
              specifically restricts. As of this notice&apos;s last
              updated date, no relevant restriction list is in force
              under §16 of the DPDP Act.
            </P>
            <P>
              We chose sub-processor regions to minimize unnecessary
              cross-border movement: Supabase Singapore is the
              closest available region; Upstash Redis runs in
              Mumbai (ap-south-1).
            </P>
          </Section>

          <Section title="Retention and deletion">
            <P>
              We retain personal data only as long as needed for the
              purpose it was collected, plus any period required by
              other Indian law (e.g. tax records, accounting
              records). The category-by-category retention schedule
              is in the privacy policy at{" "}
              <Link href="/privacy">/privacy</Link>.
            </P>
            <P>
              When you exercise the right to erasure under §12, we
              delete your personal data from our active systems
              within 30 days. Sub-processor deletion may take
              additional time depending on their published deletion
              SLAs (typically 30–90 days). Backups containing your
              data are deleted on the next scheduled backup rotation.
            </P>
          </Section>

          <Section title="Data breach notification">
            <P>
              In the event of a personal data breach affecting you,
              the DPDP Act requires AEGIBIT to notify both the Data
              Protection Board of India and the affected data
              principals. We will do so promptly after becoming aware
              of the breach, including a description of what
              happened, what data was affected, the likely
              consequences, and the steps AEGIBIT has taken to
              mitigate.
            </P>
            <P>
              Our internal target is notification within 72 hours of
              awareness, in line with comparable global frameworks
              (GDPR Article 33). The exact statutory timeline under
              the DPDP Rules will be respected once finalized.
            </P>
          </Section>

          <Section title="Grievance redressal — Data Protection Board of India">
            <P>
              If we have not resolved your concern to your
              satisfaction, you have the right to file a complaint
              with the Data Protection Board of India. The Board is
              the designated regulator under §18 of the DPDP Act.
            </P>
            <P>
              At the time of this notice, the Board&apos;s public
              contact channels are being established. Until they
              publish a direct grievance portal, the Ministry of
              Electronics and Information Technology (MeitY) is the
              relevant escalation route. We will update this
              paragraph with the Board&apos;s direct contact details
              as soon as they publish them.
            </P>
          </Section>

          <Section title="Our Data Protection contact">
            <P>
              AEGIBIT is below the &quot;Significant Data Fiduciary&quot;
              threshold under §10 of the DPDP Act and is not
              required to appoint a Data Protection Officer at this
              stage. The AEGIBIT team handles all DPDP requests
              through{" "}
              <Link href="mailto:contact@aegibit.com?subject=DPDP%20-%20Rights%20Request">
                contact@aegibit.com
              </Link>
              .
            </P>
            <P>
              If AEGIBIT crosses the threshold in the future, we
              will appoint a DPO and update this notice with their
              direct contact information.
            </P>
          </Section>

          <Section title="Children">
            <P>
              The DPDP Act (§9) prohibits processing personal data of
              children (under 18) except for limited specified
              purposes, and requires verifiable parental consent
              where it is processed. AEGIBIT&apos;s products are
              operational software for businesses; we do not
              knowingly process data of anyone under 18 through
              www.aegibit.com. If you believe a child has submitted
              data, email{" "}
              <Link href="mailto:contact@aegibit.com?subject=Child%20Data%20Concern">
                contact@aegibit.com
              </Link>{" "}
              and we will delete it immediately.
            </P>
          </Section>

          <Section title="Updates to this notice">
            <P>
              When we change this notice materially, we update the
              &quot;Last updated&quot; date at the top. The diff is
              public on
              github.com/AegibitSecurity/aegibit-website. Existing
              data principals with an active account or
              correspondence on file receive direct notice.
            </P>
          </Section>

          <Section title="Not legal advice">
            <P>
              This notice is written by the AEGIBIT team in plain
              English before formal counsel review. The DPDP Rules
              under the Act are still being notified by the Indian
              government and the operational specifics may tighten
              as those Rules come into force. AEGIBIT will engage
              external Indian counsel to review this notice before
              our first enterprise customer contract; the text may
              tighten further and the change history will be visible
              in the public git log. For specific legal questions
              about how the DPDP Act applies to your situation,
              consult your own counsel.
            </P>
          </Section>

          <Section title="Companion documents">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <Link href="/privacy">/privacy</Link> — general
                (multi-jurisdictional) privacy policy.
              </Bullet>
              <Bullet>
                <Link href="/terms">/terms</Link> — terms of service.
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

// ───────── presentation primitives (mirror /privacy + /terms) ─────────

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
      ctaId={`dpdp_link_${href.replace(/[^a-z0-9]+/gi, "_")}`}
      ctaLabel={String(children)}
      ctaSection="dpdp_body"
      className="underline-offset-4 hover:underline"
      style={{ color: "#fff" }}
    >
      {children}
    </TrackedLink>
  );
}
