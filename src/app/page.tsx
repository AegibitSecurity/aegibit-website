import { Navbar }           from "@/components/layout/Navbar";
import { Footer }           from "@/components/layout/Footer";
import { HeroSection }      from "@/components/sections/HeroSection";
import { HomeProducts }     from "@/components/sections/HomeProducts";
import { WhatWeDo }         from "@/components/sections/WhatWeDo";
import { ProofSection }     from "@/components/sections/ProofSection";
import { SelectedWork }     from "@/components/sections/SelectedWork";
import { GovRegistrations } from "@/components/sections/GovRegistrations";
import { HomeCTA }          from "@/components/sections/HomeCTA";

import { COMPANY_DESCRIPTION, PRODUCT_CATALOG } from "@/content/product-catalog";
const HOME_JSON_LD = {
 "@context": "https://schema.org", "@type": "Organization",
 "@id": "https://www.aegibit.com/#org", name: "AEGIBIT Global Consulting", alternateName: "AEGIBIT",
 url: "https://www.aegibit.com", logo: "https://www.aegibit.com/icon.svg", description: COMPANY_DESCRIPTION,
 contactPoint: { "@type": "ContactPoint", email: "contact@aegibit.com", contactType: "sales" },
 hasOfferCatalog: { "@type": "OfferCatalog", name: "AEGIBIT products", itemListElement: PRODUCT_CATALOG.map(p => ({ "@type": "Offer", itemOffered: { "@type": "SoftwareApplication", name: p.name, description: p.description, url: `https://www.aegibit.com${p.href}` } })) }
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
        {/* Buyer fit before the catalogue */ }<WhatWeDo />
        <HomeProducts />
        {/* 4 */ }<ProofSection />
        {/* 5 */ }<GovRegistrations />
        {/* 6 */ }<SelectedWork />
        {/* 7 */ }<HomeCTA />
      </main>

      <Footer />
    </>
  );
}
