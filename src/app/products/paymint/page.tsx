import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PayMintHero } from "@/components/sections/paymint/PayMintHero";
import { PayMintFeatures } from "@/components/sections/paymint/PayMintFeatures";
import { PayMintSecurity } from "@/components/sections/paymint/PayMintSecurity";
import { PayMintScreenshots } from "@/components/sections/paymint/PayMintScreenshots";
import { PayMintCustomer } from "@/components/sections/paymint/PayMintCustomer";
import { PayMintSnapshotSection } from "@/components/sections/paymint/PayMintSnapshotSection";
import { PayMintCTA } from "@/components/sections/paymint/PayMintCTA";

export const metadata: Metadata = {
  title: "PayMint, Multi-Branch Expense & Payments Platform",
  description:
    "PayMint supports multi-branch expense requests, role-based approvals, voucher references, payment records and accounting exports. Discuss your workflow with AEGIBIT.",
  keywords: [
    "PayMint",
    "expense management",
    "multi-branch expense app",
    "voucher tracking",
    "Tally export",
    "fintech app India",
    "AEGIBIT",
  ],
  alternates: { canonical: "/products/paymint" },
  openGraph: {
    title: "PayMint, Multi-Branch Expense & Payments Platform",
    description:
      "Multi-branch expense workflows with approval roles, voucher references and payment records.",
    type: "website",
    url: "https://www.aegibit.com/products/paymint",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayMint, Multi-Branch Expense & Payments Platform",
    description:
      "Expense workflows built around branch requests, approvals and payment records.",
  },
};

export default function PayMintPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PayMint", applicationCategory: "BusinessApplication", operatingSystem: "Web, Android", url: "https://www.aegibit.com/products/paymint", description: "Multi-branch expense vouchers, role-based approvals, payment records and accounting exports.", publisher: { "@type": "Organization", name: "AEGIBIT Global Consulting", url: "https://www.aegibit.com" } }) }} />
      <Navbar />
      <main id="main-content">
        <PayMintHero />
        <PayMintFeatures />
        <PayMintSnapshotSection />
        <PayMintSecurity />
        <PayMintScreenshots />
        <PayMintCustomer />
        <PayMintCTA />
      </main>
      <Footer />
    </>
  );
}
