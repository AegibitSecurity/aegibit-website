import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { CTASection } from "@/components/sections/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security Architecture" };

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
