import { Navbar }           from "@/components/layout/Navbar";
import { Footer }           from "@/components/layout/Footer";
import { HeroSection }      from "@/components/sections/HeroSection";
import { TrustStrip }       from "@/components/sections/TrustStrip";
import { WhatWeDo }         from "@/components/sections/WhatWeDo";
import { ProductHighlight } from "@/components/sections/ProductHighlight";
import { ProofSection }     from "@/components/sections/ProofSection";
import { HomeCTA }          from "@/components/sections/HomeCTA";
import { ClientFloatingElements } from "@/components/shared/ClientFloatingElements";

// Structured data for Google Knowledge Graph + Rich Results.
// PayMint is positioned as the flagship SoftwareApplication (currently in
// market, with a real customer); VoiceCore is referenced as a sibling
// product but kept out of pricing claims until it ships.
const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.aegibit.com/#org",
      name: "AEGIBIT Security",
      url: "https://www.aegibit.com",
      logo: "https://www.aegibit.com/icon.svg",
      description:
        "AEGIBIT builds operational software for dealerships and multi-branch SMEs. Cybersecurity-first by design.",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@aegibit.com",
        contactType: "sales",
        areaServed: "IN",
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
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "0",
        availability: "https://schema.org/InStock",
        description: "Demo available on request",
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

      <main>
        {/* 1 */ }<HeroSection />
        {/* 2 */ }<TrustStrip />
        {/* 3 */ }<WhatWeDo />
        {/* 4 */ }<ProductHighlight />
        {/* 5 */ }<ProofSection />
        {/* 6 */ }<HomeCTA />
      </main>

      <Footer />
      <ClientFloatingElements />
    </>
  );
}
