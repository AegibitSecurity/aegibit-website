import type { Metadata } from "next";
import { PayMintDemoForm } from "@/components/sections/paymint/PayMintDemoForm";

export const metadata: Metadata = {
  title: "Book a PayMint Demo — Multi-Branch Expense Automation | AEGIBIT",
  description:
    "See PayMint in action. 20-minute live demo for dealership owners, CFOs, and operations leaders. Learn how to automate multi-branch expense tracking, voucher generation, and Tally exports.",
  alternates: { canonical: "/products/paymint/demo" },
  openGraph: {
    title: "Book a PayMint Demo — AEGIBIT",
    description:
      "20-minute live demo. Multi-branch expense automation for dealerships and SMEs.",
    type: "website",
    url: "https://www.aegibit.com/products/paymint/demo",
    siteName: "AEGIBIT",
  },
  robots: { index: true, follow: true },
};

export default function PayMintDemoPage() {
  return <PayMintDemoForm />;
}
