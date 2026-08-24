import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";

/**
 * /refund-policy, AEGIBIT Refund & Cancellation Policy.
 *
 * Created 2026-08-24 (legal-gap patch). The Consumer Protection
 * (E-Commerce) Rules 2020 require an entity selling online to display
 * a clear cancellation/refund policy; our paid subscriptions (PayMint,
 * Vestiq) and service engagements need one. Content is honest and maps
 * to what we actually do (cancel-anytime monthly, CSV export, 30-day
 * read-only grace, service refunds governed by the signed SOW/MSA).
 * No phone number (standing rule); email + registered office only.
 */

const LAST_UPDATED = "2026-08-24";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How cancellations and refunds work for AEGIBIT's paid subscriptions (PayMint, Vestiq) and service engagements. Cancel anytime, no lock-in, data always exportable. India-anchored.",
  alternates: { canonical: "/refund-policy" },
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000", color: "#fff" }}>
        <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-36 pb-24 md:pt-44 md:pb-32">
          <span
            className="mono-label uppercase block mb-6"
            style={{ color: "#F97316", letterSpacing: "0.22em", fontSize: "11px" }}
          >
            Refund &amp; Cancellation
          </span>
          <h1
            className="font-light leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#fff" }}
          >
            How cancellations and refunds work.
          </h1>
          <p
            className="font-mono mb-12"
            style={{ color: "#52525B", fontSize: "12px", letterSpacing: "0.04em" }}
          >
            Last updated: {LAST_UPDATED} · v1.0
          </p>

          <Section title="Plain-English summary">
            <P>
              You can cancel a paid AEGIBIT subscription at any time.
              There is no minimum lock-in on our monthly plans, and your
              data is always exportable. Free products (the Aira desktop
              app, MCP Shield) cost nothing, so there is nothing to
              refund. Custom software and service engagements are
              governed by the signed proposal or Master Services
              Agreement (MSA), which sets out milestones and remedies.
            </P>
            <P>
              This policy is published in line with the Consumer
              Protection (E-Commerce) Rules, 2020. It is governed by the
              laws of India.
            </P>
          </Section>

          <Section title="Product subscriptions (PayMint, Vestiq)">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                <strong style={{ color: "#fff" }}>Cancel anytime.</strong>{" "}
                Email us and we cancel your subscription. Monthly plans
                have no minimum lock-in.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Billing cycle.</strong>{" "}
                Cancellation stops future renewals. The current paid
                month runs to the end of its cycle; we do not charge you
                again after you cancel.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Partial months.</strong>{" "}
                Monthly fees already paid for the running cycle are
                generally non-refundable, since the service was
                available to you for that period, except where a refund
                is required by applicable law.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Your data.</strong>{" "}
                Exportable as CSV at any time. After cancellation we keep
                your account in read-only mode for 30 days in case you
                return, then it is scheduled for deletion per our{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </Bullet>
              <Bullet>
                <strong style={{ color: "#fff" }}>Billing errors.</strong>{" "}
                If you were charged in error (duplicate charge, a charge
                after a confirmed cancellation), tell us and we refund
                the incorrect amount in full.
              </Bullet>
            </ul>
          </Section>

          <Section title="Service engagements (custom software, websites, builds)">
            <P>
              Service engagements are quoted and scoped in a written
              proposal or MSA before work starts. That signed document,
              not this page, governs payment milestones, deliverables,
              and any refund or remedy. General principles:
            </P>
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet>
                Advance and milestone payments are applied against work
                performed and delivered up to that point.
              </Bullet>
              <Bullet>
                One-time setup, onboarding, or third-party pass-through
                costs (for example paid infrastructure bought on your
                behalf) are non-refundable once the work or purchase has
                begun.
              </Bullet>
              <Bullet>
                If AEGIBIT fails to deliver an agreed milestone, your
                remedy is the one set out in the signed SOW/MSA. We
                would rather fix the work than leave you unhappy.
              </Bullet>
              <Bullet>
                You own everything we deliver and are paid for. There
                are no lock-in games on your code or data.
              </Bullet>
            </ul>
          </Section>

          <Section title="Free products">
            <P>
              The Aira desktop assistant and MCP Shield are free. No
              payment is taken, so no refund arises. They are provided
              under the licenses bundled with each, as described in our{" "}
              <Link href="/terms">Terms of Service</Link>.
            </P>
          </Section>

          <Section title="How to request a cancellation or refund">
            <P>
              Email{" "}
              <Link href="mailto:contact@aegibit.com?subject=Refund%20%2F%20Cancellation">
                contact@aegibit.com
              </Link>{" "}
              with the subject &quot;Refund / Cancellation&quot; and your
              account or invoice details. We acknowledge within 2
              business days and resolve eligible requests within 7
              business days. Approved refunds are returned to the
              original payment method.
            </P>
            <P>
              Please raise any billing concern with us first so we can
              fix it directly. Initiating a bank chargeback before
              contacting us can suspend your account while the dispute
              is investigated.
            </P>
          </Section>

          <Section title="Governing law">
            <P>
              This policy is governed by the laws of India. Any dispute
              is subject to the courts of Kolkata, West Bengal, India.
              For customers under an active MSA, the MSA&apos;s dispute
              mechanism applies instead.
            </P>
          </Section>

          <Section title="Companion documents">
            <ul className="space-y-3 my-6" style={{ color: "#A1A1AA", lineHeight: 1.7 }}>
              <Bullet><Link href="/terms">/terms</Link>, terms of service.</Bullet>
              <Bullet><Link href="/privacy">/privacy</Link>, how we handle your data.</Bullet>
              <Bullet><Link href="/grievance">/grievance</Link>, grievance redressal and officer contact.</Bullet>
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
      ctaId={`refund_link_${href.replace(/[^a-z0-9]+/gi, "_")}`}
      ctaLabel={String(children)}
      ctaSection="refund_body"
      className="underline-offset-4 hover:underline"
      style={{ color: "#fff" }}
    >
      {children}
    </TrackedLink>
  );
}
