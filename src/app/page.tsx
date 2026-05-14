import { Navbar }           from "@/components/layout/Navbar";
import { Footer }           from "@/components/layout/Footer";
import { HeroSection }      from "@/components/sections/HeroSection";
import { HomeProducts }     from "@/components/sections/HomeProducts";
import { WhatWeDo }         from "@/components/sections/WhatWeDo";
import { ProofSection }     from "@/components/sections/ProofSection";
import { HomeCTA }          from "@/components/sections/HomeCTA";

// Structured data — AEGIBIT-the-company is the primary entity. PayMint
// is one of three products in the OfferCatalog (PayMint paid SaaS,
// MCP Shield open-source MIT, Aira free Windows). The Organization
// carries brand identity; the top-level SoftwareApplication node
// carries PayMint specifics because PayMint is the lead commercial
// product Google should treat as the primary rich-result candidate.
//
// VoiceCore was dropped from this graph in 2026-05 — the product was
// deprecated, leaving it in Schema.org meant Google indexed an item
// that didn't exist on the site, which (a) eroded the rich-result
// trust signal and (b) violated the "every claim must be defensible"
// bar set during the credibility cleanup pass. Don't add a product
// here until its /products/<slug> page is live and on-message.
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.aegibit.com/#org",
      name: "AEGIBIT Security",
      alternateName: "AEGIBIT",
      url: "https://www.aegibit.com",
      logo: "https://www.aegibit.com/icon.svg",
      slogan: "Securing Tomorrow, Today",
      description:
        "AEGIBIT builds operational software for businesses that can't afford a leak. Cybersecurity-first. Real-time across every branch. Engineered to outlast — for dealerships, multi-branch SMEs, and mission-critical operations.",
      foundingDate: "2024",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@aegibit.com",
        contactType: "sales",
        areaServed: "IN",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AEGIBIT Products",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "SoftwareApplication",
              name: "PayMint",
              url: "https://www.aegibit.com/products/paymint",
              description:
                "Multi-branch expense automation with branch-coded vouchers, role-based approvals, and Tally-ready exports.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "SoftwareApplication",
              name: "MCP Shield",
              url: "https://www.aegibit.com/products/mcp-shield",
              description:
                "Open-source MIT-licensed security shim for Model Context Protocol servers. Origin allow-listing, prompt-injection guardrails, structured audit logging. v0.2.1 on GitHub.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "SoftwareApplication",
              name: "Aira",
              url: "https://www.aegibit.com/products/aira",
              description:
                "Voice-controlled desktop assistant by AEGIBIT. Free for Windows. Hindi, Bengali, English. Local-first. Voice biometric.",
            },
          },
        ],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.aegibit.com/products/paymint#app",
      name: "PayMint",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Expense Management",
      operatingSystem: "Web, Android, iOS",
      url: "https://www.aegibit.com/products/paymint",
      description:
        "Multi-branch expense management with real-time sync, branch-coded vouchers, role-based approvals, audit-grade logging, and Tally-ready exports. Built by a cybersecurity company.",
      author: { "@id": "https://www.aegibit.com/#org" },
      brand: { "@id": "https://www.aegibit.com/#org" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "999",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "999",
          priceCurrency: "INR",
          unitText: "branch/month",
        },
        availability: "https://schema.org/InStock",
        description: "₹999 per branch per month. Free 14-day pilot available.",
      },
      featureList: [
        "Multi-branch expense tracking",
        "Branch-coded voucher generation",
        "Role-based approval workflow",
        "Real-time sync across devices",
        "Audit-grade logging",
        "Tally-ready CSV exports",
        "Offline-capable with auto-sync",
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />

      <main id="main-content">
        {/* 1 */ }<HeroSection />
        {/* 2 */ }<HomeProducts />
        {/* 3 */ }<WhatWeDo />
        {/* 4 */ }<ProofSection />
        {/* 5 */ }<HomeCTA />
      </main>

      <Footer />
    </>
  );
}
