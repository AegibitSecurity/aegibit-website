import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { ArrowRight } from "lucide-react";

/**
 * /careers — AEGIBIT careers landing.
 *
 * Discipline call:
 *   AEGIBIT is early enough that there are no open roles to publish.
 *   The honest version of a careers page at this stage is a thesis +
 *   an introduction-channel + a contribution path — not a fake roles
 *   grid with "engineering / design / GTM" placeholders that nobody
 *   can apply to.
 *
 *   Publishing "Senior Backend Engineer · Bangalore · Apply →" with a
 *   form behind it would be the same fabrication pattern eliminated
 *   everywhere else in the $1B sprint. If you're not hiring you say so.
 *
 * What this page covers:
 *   - One-paragraph thesis (why AEGIBIT exists, what the next year
 *     looks like) — entity-first, defensible
 *   - The honest hiring status ("not actively hiring yet")
 *   - How to be in the room when we are hiring (introduction email
 *     pattern; what we read in a good intro)
 *   - Open-source contribution path (MCP Shield is MIT — contributing
 *     there is the highest-signal way to show up on our radar)
 *
 * Note on footer link:
 *   The site footer's Company column previously pointed
 *   "Careers → /about#careers" which was a dead anchor. Shipping this
 *   page closes that 404-shaped gap. The footer entry should be
 *   updated in a follow-up PR (different file, intentionally not
 *   bundled).
 */

export const metadata: Metadata = {
  title: "Careers at AEGIBIT — How to be in the room when we hire",
  description:
    "AEGIBIT is early enough that we're not actively hiring yet. Here's the thesis, how to introduce yourself, and the contribution path through MCP Shield (open-source, MIT licensed).",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers at AEGIBIT",
    description:
      "Not actively hiring yet. Here's how to be in the room when we are.",
    type: "website",
    url: "https://www.aegibit.com/careers",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary",
    title: "Careers at AEGIBIT",
    description:
      "Not actively hiring yet. Here's how to be in the room when we are.",
  },
};

export default function CareersPage() {
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
              Careers
            </p>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "#fff" }}
            >
              We&apos;re not hiring yet.{" "}
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
                Here&apos;s the thesis anyway.
              </span>
            </h1>
            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              AEGIBIT is early enough that publishing a roles grid would be
              fabrication. When we are hiring, the people we want already
              know about it — through the open-source work, through warm
              intros, through the work itself. Here&apos;s how to be in the
              room when that happens.
            </p>
          </div>
        </section>

        {/* ───────── Thesis ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Why this company exists
            </p>
            <h2
              className="font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              The thesis in one paragraph
            </h2>
            <p
              className="mb-5"
              style={{ color: "#A1A1AA", fontSize: "1.05rem", lineHeight: 1.75 }}
            >
              Most operational software is built like a product first and a
              security artifact second. For multi-branch businesses — where
              a single leak ends the company — that ordering is exactly
              backwards. AEGIBIT builds the inverse: cybersecurity-first
              operational software, with the security architecture as the
              load-bearing primitive and the product surface as the
              expression of it. PayMint is the first commercial expression
              of that thesis. MCP Shield is the open-source expression. The
              next twelve months expand both axes.
            </p>
            <p
              style={{ color: "#A1A1AA", fontSize: "1.05rem", lineHeight: 1.75 }}
            >
              For the longer version, see{" "}
              <TrackedLink
                href="/about"
                ctaId="careers_about_link"
                ctaLabel="About AEGIBIT"
                ctaSection="careers_thesis"
                className="underline-offset-4 hover:underline"
                style={{ color: "#fff" }}
              >
                /about
              </TrackedLink>
              .
            </p>
          </div>
        </section>

        {/* ───────── How to be in the room ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#000",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Introductions
            </p>
            <h2
              className="font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              How to be in the room when we hire
            </h2>

            <ol
              className="space-y-6 list-none m-0 p-0"
              style={{ color: "#A1A1AA", fontSize: "1rem", lineHeight: 1.7 }}
            >
              <li className="flex gap-4">
                <span
                  className="flex-shrink-0 font-mono"
                  style={{ color: "#F97316", minWidth: "1.5rem" }}
                >
                  1.
                </span>
                <span>
                  <span style={{ color: "#fff" }}>
                    Contribute to MCP Shield.
                  </span>{" "}
                  The repository is at{" "}
                  <TrackedLink
                    href="https://github.com/AegibitSecurity/mcp-shield"
                    ctaId="careers_mcp_shield_github"
                    ctaLabel="MCP Shield GitHub"
                    ctaSection="careers_introductions"
                    className="underline-offset-4 hover:underline"
                    style={{ color: "#fff" }}
                  >
                    github.com/AegibitSecurity/mcp-shield
                  </TrackedLink>
                  . MIT licensed, stdlib-only Python, every check is documented.
                  A landed PR (or even a sharp issue report) is a stronger
                  signal than a cold résumé.
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  className="flex-shrink-0 font-mono"
                  style={{ color: "#F97316", minWidth: "1.5rem" }}
                >
                  2.
                </span>
                <span>
                  <span style={{ color: "#fff" }}>
                    Send a short, specific email.
                  </span>{" "}
                  contact@aegibit.com. We read the ones that name a real
                  problem from the AEGIBIT thesis you&apos;ve thought about
                  for more than five minutes. Two paragraphs is enough. A
                  link to one thing you&apos;ve built is worth more than a
                  CV attachment.
                </span>
              </li>
              <li className="flex gap-4">
                <span
                  className="flex-shrink-0 font-mono"
                  style={{ color: "#F97316", minWidth: "1.5rem" }}
                >
                  3.
                </span>
                <span>
                  <span style={{ color: "#fff" }}>
                    Use a real customer&apos;s lens.
                  </span>{" "}
                  AEGIBIT is in market with Nibir Motors across 7 branches —
                  see{" "}
                  <TrackedLink
                    href="/case-studies/nibir-motors"
                    ctaId="careers_case_study_nibir"
                    ctaLabel="Nibir Motors case study"
                    ctaSection="careers_introductions"
                    className="underline-offset-4 hover:underline"
                    style={{ color: "#fff" }}
                  >
                    /case-studies/nibir-motors
                  </TrackedLink>
                  . If you can articulate why PayMint works for a 7-branch
                  dealership group and what we&apos;d need for a 70-branch
                  group, you understand the company.
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* ───────── What we are not ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#0A0A0A",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Honest scope
            </p>
            <h2
              className="font-light leading-tight mb-6"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              What this is not, yet
            </h2>
            <ul
              className="space-y-3 list-none m-0 p-0"
              style={{ color: "#A1A1AA", fontSize: "1rem", lineHeight: 1.7 }}
            >
              <li>
                — Not a venture-backed organization with funded headcount
                plans. AEGIBIT is bootstrapped and committed to staying
                that way until paid scale justifies otherwise.
              </li>
              <li>
                — Not an &ldquo;interview-loop&rdquo; pipeline. When the first role
                opens, we&apos;ll publish it here and the conversation
                will be small, human, and grounded in real work.
              </li>
              <li>
                — Not a vehicle for résumé credentialing. Our bar is
                contribution and judgment, not pedigree.
              </li>
            </ul>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section
          className="relative py-20 md:py-24 px-6 lg:px-12 overflow-hidden"
          style={{
            background: "#000",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-light leading-tight mb-5"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              When we open the first role, this page changes.
            </h2>
            <p
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              Until then — contact@aegibit.com is the front door.
            </p>
            <TrackedLink
              href="mailto:contact@aegibit.com?subject=AEGIBIT%20introduction"
              ctaId="careers_introduction_cta"
              ctaLabel="Introduce yourself"
              ctaSection="careers_final_cta"
              className="inline-flex items-center gap-2 px-7 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: "#F97316",
                padding: "0 1.75rem",
                height: "3.25rem",
                boxShadow: "0 0 28px rgba(249,115,22,0.30)",
              }}
            >
              Introduce yourself
              <ArrowRight size={18} />
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
