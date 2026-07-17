import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

/**
 * Metadata layout for the contact page. The page is a client component
 * and cannot export metadata, so this server layout supplies a unique
 * title and description (it previously inherited the homepage's, which
 * the SEO audit flagged as a duplicate title).
 */
export const metadata: Metadata = buildMetadata({
  title: "Contact AEGIBIT: Talk to a Founder",
  description:
    "Get in touch with AEGIBIT, a cybersecurity-first web, app, and software company in Kolkata. Email contact@aegibit.com or start a project. Straight answers, honest scope.",
  path: "/contact",
  keywords: [
    "contact AEGIBIT",
    "hire software company Kolkata",
    "web development enquiry Kolkata",
    "AEGIBIT email",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
