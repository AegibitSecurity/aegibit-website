import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

/**
 * Metadata layout for the pricing page. The page itself is a client
 * component and cannot export metadata, so this server layout supplies
 * a unique title and description (the page previously inherited the
 * homepage's, which the SEO audit flagged as a duplicate title).
 */
export const metadata: Metadata = buildMetadata({
  title: "Pricing: AEGIBIT Software and Security Plans",
  description:
    "Explore PayMint plans for multi-branch expense management. Contact AEGIBIT for the scope and pricing of a custom software project.",
  path: "/pricing",
  keywords: [
    "AEGIBIT pricing",
    "PayMint price",
    "Vestiq price",
    "software development pricing India",
    "cybersecurity pricing",
  ],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
