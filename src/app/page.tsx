import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhatWeDoSection } from "@/components/sections/WhatWeDoSection";
import { CoreOfferingsSection } from "@/components/sections/CoreOfferingsSection";
import { ProductSpotlightSection } from "@/components/sections/ProductSpotlightSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ConversionSection } from "@/components/sections/ConversionSection";
import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";
import { ScrollProgressCTA } from "@/components/conversion/ScrollProgressCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhatWeDoSection />
        <CoreOfferingsSection />
        <ProductSpotlightSection />
        <TrustSection />
        <ConversionSection />
      </main>
      <Footer />
      <ExitIntentPopup />
      <ScrollProgressCTA />
    </>
  );
}
