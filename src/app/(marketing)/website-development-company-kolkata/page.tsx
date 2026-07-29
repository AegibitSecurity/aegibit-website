import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import {
  Globe, Code2, Smartphone, Boxes, ShieldCheck, Sparkles,
  ArrowRight, MapPin, Mail, Check,
} from "lucide-react";

/**
 * /website-development-company-kolkata
 *
 * Indexable local-SEO landing page targeting the Kolkata web/software
 * development market. Pairs with the verified Google Business Profile
 * (AEGIBIT Global Consulting, service-area business, Kolkata) so the
 * site and the map listing reinforce each other.
 *
 * Honesty bar (same as the rest of the site): every claim defensible.
 * Real clients only (Nibir Motors, OJAS Fitness, both verifiable).
 * No invented metrics, no fake "500+ projects". Security-led
 * positioning is the differentiator no generic Kolkata agency can
 * credibly claim, and we back it with MCP Shield + PayMint.
 *
 * Name and service area stay consistent with the GBP: "AEGIBIT Global
 * Consulting", Kolkata. Phone is intentionally NOT shown anywhere on the
 * website (standing rule: never expose the business number on the site).
 */

const PAGE_PATH = "/website-development-company-kolkata";

export const metadata: Metadata = buildMetadata({
  title: "Website & Software Development Company in Kolkata",
  description:
    "AEGIBIT Global Consulting is a cybersecurity-first website, app, and software development company in Kolkata. Secure, high-performance websites, web apps, mobile apps, and custom software for businesses across Kolkata and West Bengal.",
  path: PAGE_PATH,
  keywords: [
    "website development company in kolkata",
    "software development company kolkata",
    "web development company kolkata",
    "app development company kolkata",
    "digital transformation company kolkata",
    "custom software development kolkata",
    "AEGIBIT Global Consulting",
  ],
});

const SERVICES = [
  { icon: Globe, title: "Website development", body: "Fast, responsive, SEO-ready websites and marketing sites that load quickly and convert, built on a modern, secure stack." },
  { icon: Code2, title: "Web application development", body: "Dashboards, customer portals, booking systems, and internal tools that run your operations in real time." },
  { icon: Smartphone, title: "Mobile app development", body: "Android and iOS apps with clean UX, offline resilience, and the same security posture as everything we ship." },
  { icon: Boxes, title: "Custom software", body: "Operational software tailored to your exact workflow, like PayMint, our multi-branch expense platform live with a real dealership group." },
  { icon: Sparkles, title: "Digital transformation", body: "Move manual, paper, or spreadsheet operations onto secure, audit-ready software your whole team can trust." },
  { icon: ShieldCheck, title: "Security and audit readiness", body: "Hardening, audit-grade logging, and compliance support from a team that treats security as the foundation, not a feature." },
] as const;

const WHY = [
  "Cybersecurity-first by default, security is the load-bearing primitive, not a bolt-on.",
  "Real delivered work you can click through to and verify, not a portfolio of stock mockups.",
  "You work with senior engineers, not account managers.",
  "Built in India, India-first pricing, global standard.",
] as const;

const AREAS = ["Kolkata", "Howrah", "Bidhannagar (Salt Lake)", "New Town", "North 24 Parganas", "South 24 Parganas"] as const;

const FAQS = [
  { q: "Do you build websites for businesses across Kolkata and West Bengal?", a: "Yes. AEGIBIT Global Consulting serves Kolkata, Howrah, Salt Lake, New Town, and the surrounding districts, and we work with clients across India remotely." },
  { q: "What kind of projects do you take on?", a: "Websites, web applications, mobile apps, and custom business software, plus digital transformation for businesses moving off manual or spreadsheet workflows." },
  { q: "What makes AEGIBIT different from other Kolkata web development companies?", a: "We are cybersecurity-first. Security is engineered into everything we build, and we back that with our own security products like MCP Shield, an open-source scanner, and PayMint, operational software live with a real customer." },
  { q: "Can I see work you have already delivered?", a: "Yes. We built the OJAS Fitness website in Barrackpore and rolled out PayMint across seven Nibir Motors dealerships in West Bengal. Both are real and verifiable." },
] as const;

function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#kolkata`,
    name: "AEGIBIT Global Consulting",
    image: `${SITE_URL}/brand/AEGIBIT%20LOGO.png`,
    logo: `${SITE_URL}/icon.svg`,
    url: `${SITE_URL}${PAGE_PATH}`,
    email: "contact@aegibit.com",
    priceRange: "$$",
    description:
      "Cybersecurity-first website, application, and software development company serving Kolkata and West Bengal.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 22.5726, longitude: 88.3639 },
    areaServed: AREAS.map((a) => ({ "@type": "City", name: a })),
    knowsAbout: [
      "Website development", "Web application development", "Mobile app development",
      "Custom software development", "Digital transformation", "Cybersecurity",
    ],
    sameAs: [
      "https://www.instagram.com/aegibitglobal",
      "https://x.com/aegibitsec",
      "https://github.com/AegibitSecurity",
    ],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function KolkataPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Website Development Company in Kolkata", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative px-6 lg:px-12 pt-32 pb-24 md:pt-40 md:pb-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.30)" }}
            >
              <MapPin size={14} style={{ color: "#F97316" }} />
              <span className="text-[11px] uppercase font-medium" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
                Kolkata · Cybersecurity-first
              </span>
            </div>
            <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
              Website & Software Development{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #F97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Company in Kolkata
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              AEGIBIT Global Consulting builds secure, high-performance websites, web apps, mobile apps, and custom
              software for businesses across Kolkata and West Bengal. Security is built in from the first line of code,
              not bolted on later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <TrackedLink
                href="/contact?topic=kolkata"
                ctaId="kolkata_hero_contact"
                ctaLabel="Talk to a founder"
                ctaSection="kolkata_hero"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#F97316", color: "#000" }}
              >
                Talk to a founder <ArrowRight size={16} />
              </TrackedLink>
              <a
                href="mailto:contact@aegibit.com?subject=Website%20or%20software%20project"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Mail size={15} /> Email us
              </a>
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
                What we build
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                One Kolkata team, full-stack delivery
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}>
                      <Icon size={20} style={{ color: "#F97316" }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.15rem", color: "#fff" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Why AEGIBIT ──────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
                Why AEGIBIT
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                The security-led difference
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {WHY.map((w) => (
                <div key={w} className="flex items-start gap-3 rounded-xl p-5" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Check size={18} style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }} />
                  <p className="text-sm leading-relaxed" style={{ color: "#D4D4D8" }}>{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof (real clients, reused) ─────────────────────── */}
        <SelectedWork />

        {/* ── Areas served ─────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-5" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
              Serving Kolkata and West Bengal
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {AREAS.map((a) => (
                <span key={a} className="text-sm px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#D4D4D8" }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Honest guides (cornerstone content, internal links) */}
        <section className="px-6 lg:px-12 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-[11px] uppercase font-medium mb-5 text-center" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
              Honest guides for Kolkata buyers
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { t: "How much does a website cost in Kolkata in 2026?", h: "/blog/website-cost-kolkata-2026" },
                { t: "How to choose a web development company in Kolkata", h: "/blog/choose-web-development-company-kolkata" },
                { t: "How much does app development cost in Kolkata?", h: "/blog/app-development-cost-kolkata-2026" },
                { t: "Digital transformation for Kolkata SMEs: a 90-day roadmap", h: "/blog/digital-transformation-kolkata-smes" },
              ].map((g) => (
                <TrackedLink
                  key={g.h}
                  href={g.h}
                  ctaId={"kolkata_guide_" + (g.h.split("/").pop() ?? "guide")}
                  ctaLabel={g.t}
                  ctaSection="kolkata_guides"
                  className="group flex items-start justify-between gap-3 rounded-xl p-5 transition-colors hover:bg-white/5"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="text-sm leading-relaxed" style={{ color: "#D4D4D8" }}>{g.t}</span>
                  <ArrowRight size={15} className="flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" style={{ color: "#F97316" }} />
                </TrackedLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-light text-center mb-12" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="font-medium mb-2" style={{ fontSize: "1.05rem", color: "#fff" }}>{f.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="px-6 lg:px-12 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff" }}>
              Start your Kolkata project
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              Tell us what you want to build. You will get a clear, honest plan from a dedicated engineering team, no
              jargon, no lock-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <TrackedLink
                href="/contact?topic=kolkata"
                ctaId="kolkata_cta_contact"
                ctaLabel="Talk to a founder"
                ctaSection="kolkata_cta"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#F97316", color: "#000" }}
              >
                Talk to a founder <ArrowRight size={16} />
              </TrackedLink>
              <a
                href="mailto:contact@aegibit.com?subject=Website%20or%20software%20project"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Mail size={15} /> Email us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
