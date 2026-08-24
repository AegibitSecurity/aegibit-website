import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /grievance, AEGIBIT Grievance Redressal.
 *
 * Created 2026-08-24 (legal-gap patch). India requires a business
 * that handles personal data / operates a website to publish a
 * Grievance Officer contact and a redressal mechanism:
 *  - IT Act 2000 + SPDI Rules 2011, Rule 5(9): name/designation and
 *    contact of a Grievance Officer, complaints resolved within 1 month.
 *  - IT (Intermediary Guidelines) Rules 2021: grievance mechanism for
 *    content-related complaints.
 *  - DPDP Act 2023, s.13: readily-available means for a Data Principal
 *    to raise a grievance, before escalating to the Data Protection
 *    Board of India (covered on /dpdp).
 * We publish the OFFICE designation + email + registered postal
 * address only. No phone (standing rule) and no personal name (privacy
 * stance); a named officer can be added if strict Rule 5(9) naming is
 * later required by counsel.
 */

const LAST_UPDATED = "2026-08-24";

export const metadata: Metadata = {
  title: "Grievance Redressal",
  description:
    "How to raise a grievance with AEGIBIT about data handling, content, or services, and how we resolve it. Grievance Officer contact under India's IT Act/SPDI Rules and DPDP Act 2023.",
  alternates: { canonical: "/grievance" },
  robots: { index: true, follow: true },
};

export default function GrievancePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000", color: "#fff" }}>
        <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-36 pb-24 md:pt-44 md:pb-32">
          <span
            className="mono-label uppercase block mb-6"
            style={{ color: "#F97316", letterSpacing: "0.22em", fontSize: "11px" }}
          >
            Grievance Redressal
          </span>
          <h1
            className="font-light leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#fff" }}
          >
            How to raise a grievance, and how we resolve it.
          </h1>
          <p
            className="font-mono mb-12"
            style={{ color: "#52525B", fontSize: "12px", letterSpacing: "0.04em" }}
          >
            Last updated: {LAST_UPDATED} · v1.0
          </p>

          <Section title="When to use this">
            <P>
              If you have a complaint about how AEGIBIT handles your
              personal data, content on this site, or one of our
              services, you can raise it directly with our Grievance
              Officer. This mechanism is provided under India&apos;s
              Information Technology Act, 2000 and the SPDI Rules, 2011,
              the IT (Intermediary Guidelines) Rules, 2021, and the
              Digital Personal Data Protection Act, 2023.
            </P>
          </Section>

          <Section title="Grievance Officer">
            <div
              className="rounded-2xl p-6 my-2"
              style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <P>
                <strong style={{ color: "#fff" }}>The Grievance Officer</strong>
                <br />
                AEGIBIT Global Consulting
                <br />
                89 Bidhan Sarani, Shyambazar, Kolkata, West Bengal 700004, India
                <br />
                Email:{" "}
                <Link href="mailto:contact@aegibit.com?subject=Grievance">
                  contact@aegibit.com
                </Link>{" "}
                (subject: &quot;Grievance&quot;)
              </P>
              <p className="mb-0" style={{ color: "#52525B", fontSize: "13px" }}>
                Please include your name, contact details, what happened,
                and any relevant reference (account, invoice, or URL) so
                we can investigate quickly.
              </p>
            </div>
          </Section>

          <Section title="How we handle it">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Acknowledgement.</strong>{" "}
                We acknowledge your grievance within 48 hours of
                receiving it.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Resolution.</strong>{" "}
                We resolve it as quickly as we can, and in any event
                within 30 days, as required by the SPDI Rules, 2011.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Updates.</strong>{" "}
                If a matter needs longer to investigate, we tell you why
                and give you a realistic timeline.
              </Bullet>
            </ul>
          </Section>

          <Section title="Data-protection grievances (DPDP Act 2023)">
            <P>
              For grievances specifically about your personal data,
              first raise them with our Grievance Officer above. If you
              are not satisfied with our response, you may escalate to
              the Data Protection Board of India. Your rights as a Data
              Principal, and the escalation path, are set out in our{" "}
              <Link href="/dpdp">DPDP notice</Link>.
            </P>
          </Section>

          <Section title="Companion documents">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet><Link href="/privacy">/privacy</Link>, how we collect and use data.</Bullet>
              <Bullet><Link href="/dpdp">/dpdp</Link>, India DPDP Act 2023 notice and Data Principal rights.</Bullet>
              <Bullet><Link href="/terms">/terms</Link>, terms of service.</Bullet>
              <Bullet><Link href="/refund-policy">/refund-policy</Link>, refund and cancellation.</Bullet>
            </ul>
          </Section>
        </article>
      </main>
      <Footer />
    </>
  );
}

// ───────── presentation primitives (mirror /terms) ─────────

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
      ctaId={`grievance_link_${href.replace(/[^a-z0-9]+/gi, "_")}`}
      ctaLabel={String(children)}
      ctaSection="grievance_body"
      className="underline-offset-4 hover:underline"
      style={{ color: "#fff" }}
    >
      {children}
    </TrackedLink>
  );
}
