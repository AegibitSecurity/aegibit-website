import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PayMintHero } from "@/components/sections/paymint/PayMintHero";
import { PayMintFeatures } from "@/components/sections/paymint/PayMintFeatures";
import { PayMintSecurity } from "@/components/sections/paymint/PayMintSecurity";
import { PayMintScreenshots } from "@/components/sections/paymint/PayMintScreenshots";
import { PayMintCustomer } from "@/components/sections/paymint/PayMintCustomer";
import { PayMintCTA } from "@/components/sections/paymint/PayMintCTA";

export const metadata: Metadata = {
  title: "PayMint — Multi-Branch Expense & Payments Platform | AEGIBIT",
  description:
    "PayMint is the secure, real-time expense management platform built by AEGIBIT for multi-branch businesses. Branch-coded vouchers, role-based approvals, audit-grade logging, Tally-ready exports.",
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
    title: "PayMint — Multi-Branch Expense & Payments Platform",
    description:
      "Secure expense management built by a cybersecurity company. Real-time sync, role-based approvals, audit-grade logs.",
    type: "website",
    url: "https://www.aegibit.com/products/paymint",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayMint — Multi-Branch Expense & Payments Platform",
    description:
      "Secure expense management built by a cybersecurity company.",
  },
};

export default function PayMintPage() {
  return (
    <>
      <Navbar />
      <main>
        <PayMintHero />
        <PayMintFeatures />
        <PayMintSecurity />
        <PayMintScreenshots />
        <PayMintCustomer />
        <PayMintCTA />
      </main>
      <Footer />
    </>
  );
}
