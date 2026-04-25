import { Navbar }           from "@/components/layout/Navbar";
import { Footer }           from "@/components/layout/Footer";
import { HeroSection }      from "@/components/sections/HeroSection";
import { TrustStrip }       from "@/components/sections/TrustStrip";
import { WhatWeDo }         from "@/components/sections/WhatWeDo";
import { ProductHighlight } from "@/components/sections/ProductHighlight";
import { ProofSection }     from "@/components/sections/ProofSection";
import { HomeCTA }          from "@/components/sections/HomeCTA";
import { ClientFloatingElements } from "@/components/shared/ClientFloatingElements";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "AEGIBIT Security",
      url: "https://aegibitsecurity.com",
      contactPoint: { "@type": "ContactPoint", email: "contact@aegibit.com", contactType: "sales" },
    },
    {
      "@type": "SoftwareApplication",
      name: "AEGIBIT VoiceCore",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web, iOS, Android, Desktop",
      offers: { "@type": "Offer", priceCurrency: "INR", price: "999" },
      description: "Enterprise AI and Cybersecurity platform — built for companies that cannot afford failure.",
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
