import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { Search, ShieldCheck, Rocket, LifeBuoy, ArrowRight } from "lucide-react";

/**
 * /work, portfolio page.
 *
 * Dedicated indexable surface for "web / software development company"
 * intent, worldwide. Reuses the SelectedWork section (single source of
 * truth for our real clients) so proof never drifts between homepage and
 * here. Honesty bar unchanged: real, verifiable clients only.
 */

const PAGE_PATH = "/work";

export const metadata: Metadata = buildMetadata({
  title: "Our Work: Websites, Apps and Software We Have Shipped",
  description:
    "Real client work from AEGIBIT, a cybersecurity-first software, web, and app development company. See what we have built and shipped, from operational software to premium websites.",
  path: PAGE_PATH,
  keywords: [
    "AEGIBIT work",
    "AEGIBIT portfolio",
    "web development portfolio",
    "software development company work",
    "case studies",
    "OJAS Fitness website",
    "Nibir Motors PayMint",
  ],
});

const STEPS = [
  { icon: Search, title: "Discovery", body: "We learn your business, your users, and where a leak would hurt most. Clear scope, honest timeline." },
  { icon: ShieldCheck, title: "Secure build", body: "Senior engineers build it security-first, with audit-grade logging and clean, reviewable code." },
  { icon: Rocket, title: "Launch", body: "We ship fast, on a modern stack, tested and verified. Your project goes live, not into a backlog." },
  { icon: LifeBuoy, title: "Support", body: "We stay with you after launch. No lock-in, no disappearing act. When you win, we win." },
] as const;

function itemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AEGIBIT Work",
    url: `${SITE_URL}${PAGE_PATH}`,
    about: "Client work delivered by AEGIBIT Global Consulting",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "CreativeWork",
            name: "Nibir Motors: PayMint rollout",
            about: "Multi-branch expense automation across 7 dealerships in West Bengal",
            url: `${SITE_URL}/case-studies/nibir-motors`,
            creator: { "@type": "Organization", name: "AEGIBIT Global Consulting" },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "CreativeWork",
            name: "OJAS Fitness O.9 website",
            about: "Premium gym website with programs, trainers, memberships, and online booking",
            url: "https://ojasfitness09.com",
            creator: { "@type": "Organization", name: "AEGIBIT Global Consulting" },
          },
        },
      ],
    },
  };
}

export default function WorkPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Work", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-5" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
              Our work
            </p>
            <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
              Proof,{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #F97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                not promises.
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "#A1A1AA" }}>
              We would rather show you what we have shipped than tell you how good we are. Every project here is
              real, live, and built to our cybersecurity-first standard.
            </p>
          </div>
        </section>

        {/* Real clients (single source of truth) */}
        <SelectedWork />

        {/* How we work */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
                How we work
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Clear, secure, and built to outlast
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}>
                        <Icon size={18} style={{ color: "#F97316" }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#52525B" }}>0{i + 1}</span>
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.1rem", color: "#fff" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff" }}>
              Your project could be next.
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              Websites, apps, custom software, or a security review. Tell us what you want to build and get a clear,
              honest plan from a dedicated team.
            </p>
            <TrackedLink
              href="/contact?topic=work"
              ctaId="work_cta_contact"
              ctaLabel="Start a project"
              ctaSection="work_cta"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "#F97316", color: "#000" }}
            >
              Start a project <ArrowRight size={16} />
            </TrackedLink>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
