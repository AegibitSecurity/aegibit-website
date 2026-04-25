import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { IntegrationsSection } from "@/components/sections/IntegrationsSection";
import { CTASection } from "@/components/sections/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Features" };

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <FeaturesSection />
        <IntegrationsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
