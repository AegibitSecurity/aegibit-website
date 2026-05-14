import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { Download, Mail } from "lucide-react";

/**
 * /press — AEGIBIT press & brand resources.
 *
 * Discipline call:
 *   A press page is a list of artifacts a journalist or analyst can use
 *   without contacting us. At AEGIBIT's stage we don't yet have a
 *   coverage gallery to point to ("As seen in: TechCrunch / The Verge"
 *   would be fabrication). What we DO have is real and shippable:
 *     - A logo file at /icon.svg, served as the favicon and a fully
 *       usable asset
 *     - A documented brand color palette
 *     - Three calibrated company descriptions (one-line, short, long)
 *     - A press inbox
 *     - Two concrete data points (Nibir Motors live across 7 branches,
 *       MCP Shield MIT v0.2.1)
 *
 *   That's a legitimate press kit even at this stage. Pretending we
 *   have a 200-logo Trust Bar of analyst coverage would be the same
 *   credibility miss the rest of the site eliminated.
 *
 * What this page does NOT include:
 *   - Fabricated "as seen in" logo wall
 *   - Headshots or founder bio (entity-first per brand voice; if/when
 *     a /about/team page exists, link from here)
 *   - Awards / certifications we don't hold
 */

export const metadata: Metadata = {
  title: "Press & Brand — AEGIBIT",
  description:
    "Press inbox, brand assets, and ready-to-use company descriptions for AEGIBIT — cybersecurity-first operational software, built in India, live with Nibir Motors across 7 branches.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Press & Brand Resources — AEGIBIT",
    description:
      "Press inbox, brand assets, ready-to-use descriptions. Cybersecurity-first operational software, built in India.",
    type: "website",
    url: "https://www.aegibit.com/press",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary",
    title: "Press & Brand — AEGIBIT",
    description: "Press inbox, brand assets, ready-to-use descriptions.",
  },
};

const DESCRIPTIONS = [
  {
    length: "One-line",
    body: "AEGIBIT builds cybersecurity-first operational software for businesses that can't afford a leak.",
  },
  {
    length: "Short (≈40 words)",
    body: "AEGIBIT is a cybersecurity-first software company building operational platforms for multi-branch businesses where a single leak ends the company. PayMint, the flagship multi-branch expense platform, is live with Nibir Motors across 7 branches in West Bengal. Built in India.",
  },
  {
    length: "Long (≈80 words)",
    body: "AEGIBIT builds operational software for multi-branch businesses, dealerships, and mission-critical SMEs — categories where a single data leak ends the company. The thesis is to invert the conventional ordering of product over security: at AEGIBIT, the security architecture is the load-bearing primitive and the product surface is the expression of it. PayMint, the flagship multi-branch expense platform, is live with Nibir Motors. MCP Shield, the open-source security scanner for the Model Context Protocol, ships under MIT license at v0.2.1.",
  },
] as const;

const COLORS = [
  { token: "AEGIBIT Orange", hex: "#F97316", note: "Primary brand color · Tailwind orange-500" },
  { token: "AEGIBIT Orange Hover", hex: "#EA580C", note: "Hover / pressed state · Tailwind orange-600" },
  { token: "Surface Black", hex: "#000000", note: "Canvas background" },
  { token: "Surface Black Soft", hex: "#0A0A0A", note: "Alternating section background" },
  { token: "Body Text", hex: "#A1A1AA", note: "Body copy on dark surfaces · WCAG AA on #000" },
  { token: "Subtext", hex: "#71717A", note: "Tertiary captions · WCAG AA on #000" },
] as const;

const FACTS = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "Kolkata, India" },
  { label: "Flagship product", value: "PayMint — multi-branch expense platform" },
  { label: "Open-source product", value: "MCP Shield — MIT v0.2.1" },
  { label: "Live customers", value: "Nibir Motors — 7 branches, West Bengal" },
  { label: "Press contact", value: "contact@aegibit.com" },
] as const;

export default function PressPage() {
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
              Press & brand
            </p>
            <h1
              className="font-light leading-[1.05] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)", color: "#fff" }}
            >
              Everything you need to{" "}
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
                write about AEGIBIT.
              </span>
            </h1>
            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "#A1A1AA" }}
            >
              Three calibrated company descriptions, the brand color palette,
              the logo file, and the company facts you&apos;d otherwise have
              to email us for. The press inbox is{" "}
              <TrackedLink
                href="mailto:contact@aegibit.com"
                ctaId="press_hero_inbox"
                ctaLabel="Press inbox"
                ctaSection="press_hero"
                className="underline-offset-4 hover:underline"
                style={{ color: "#fff" }}
              >
                contact@aegibit.com
              </TrackedLink>{" "}
              — we reply same business day in IST.
            </p>
          </div>
        </section>

        {/* ───────── Company facts ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
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
              Company facts
            </p>
            <h2
              className="font-light leading-tight mb-10"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              The six things journalists ask first
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt
                    className="mono-label uppercase mb-1.5"
                    style={{
                      fontSize: "10px",
                      color: "#71717A",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {f.label}
                  </dt>
                  <dd
                    style={{
                      color: "#fff",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────── Calibrated descriptions ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "#000",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <p
              className="mono-label uppercase mb-3"
              style={{
                fontSize: "11px",
                color: "#F97316",
                letterSpacing: "0.22em",
              }}
            >
              Ready-to-paste
            </p>
            <h2
              className="font-light leading-tight mb-10"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              Three calibrated descriptions
            </h2>
            <div className="space-y-6">
              {DESCRIPTIONS.map((d) => (
                <div
                  key={d.length}
                  className="p-6 rounded-xl"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    className="mono-label uppercase mb-3"
                    style={{
                      fontSize: "10px",
                      color: "#F97316",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {d.length}
                  </p>
                  <p
                    style={{
                      color: "#E4E4E7",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Brand assets ───────── */}
        <section
          className="py-16 md:py-20 px-6 lg:px-12 border-t"
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
              Brand assets
            </p>
            <h2
              className="font-light leading-tight mb-10"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                color: "#fff",
              }}
            >
              Logo and palette
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div
                className="p-8 rounded-xl flex flex-col items-center justify-center"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.06)",
                  minHeight: "220px",
                }}
              >
                <Image
                  src="/icon.svg"
                  alt="AEGIBIT logo mark"
                  width={96}
                  height={96}
                  unoptimized
                  style={{ marginBottom: "1.5rem" }}
                />
                <TrackedLink
                  href="/icon.svg"
                  ctaId="press_logo_download"
                  ctaLabel="Logo SVG"
                  ctaSection="press_brand_assets"
                  className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
                  style={{ color: "#A1A1AA" }}
                >
                  <Download size={14} />
                  Download SVG
                </TrackedLink>
              </div>

              <div
                className="p-8 rounded-xl"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.06)",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/icon.svg"
                  alt="AEGIBIT logo mark on light background"
                  width={96}
                  height={96}
                  unoptimized
                  style={{ marginBottom: "1.5rem" }}
                />
                <p
                  className="text-xs font-mono"
                  style={{ color: "#71717A" }}
                >
                  Light background variant
                </p>
              </div>
            </div>

            <p
              className="mono-label uppercase mb-4"
              style={{
                fontSize: "11px",
                color: "#71717A",
                letterSpacing: "0.22em",
              }}
            >
              Color palette
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 list-none m-0 p-0">
              {COLORS.map((c) => (
                <li
                  key={c.token}
                  className="flex items-center gap-4 p-4 rounded-lg"
                  style={{
                    background: "#0D0D0D",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    className="flex-shrink-0 rounded"
                    aria-hidden
                    style={{
                      width: "40px",
                      height: "40px",
                      background: c.hex,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {c.token}{" "}
                      <span
                        className="font-mono"
                        style={{ color: "#71717A", fontWeight: 400 }}
                      >
                        {c.hex}
                      </span>
                    </p>
                    <p
                      style={{
                        color: "#A1A1AA",
                        fontSize: "0.78rem",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {c.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Press inbox ───────── */}
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
              Press, analyst, or interview request?
            </h2>
            <p
              className="text-base md:text-lg mb-8 max-w-2xl mx-auto"
              style={{ color: "#A1A1AA", lineHeight: 1.7 }}
            >
              contact@aegibit.com — same business day in IST. Mention the
              publication and the angle in the subject line and you&apos;ll
              hit a faster lane.
            </p>
            <TrackedLink
              href="mailto:contact@aegibit.com?subject=Press%20inquiry"
              ctaId="press_inbox_cta"
              ctaLabel="Email press inbox"
              ctaSection="press_final_cta"
              className="inline-flex items-center gap-2 px-7 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: "#F97316",
                padding: "0 1.75rem",
                height: "3.25rem",
                boxShadow: "0 0 28px rgba(249,115,22,0.30)",
              }}
            >
              <Mail size={18} />
              Email contact@aegibit.com
            </TrackedLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
