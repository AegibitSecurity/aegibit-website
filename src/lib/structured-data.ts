import { SITE_URL } from "@/lib/seo";

const BASE = SITE_URL;

/**
 * The AEGIBIT entity graph, GEO (Generative Engine Optimization)
 * surface. Deepened deliberately: knowsAbout builds topical authority
 * for AI models and Google's knowledge graph; areaServed reflects the
 * real India + Gulf mandate; every fact here is registered and
 * verifiable. Site-wide rules hold: no phone number, no GSTIN.
 *
 * (The stale VoiceCore softwareAppSchema that used to live here was
 * dead code for a retired product and has been removed.)
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AEGIBIT Global Consulting",
  alternateName: "AEGIBIT",
  slogan: "Securing Tomorrow, Today.",
  description:
    "Cybersecurity-first software company building custom software, SaaS products, AI automation, and premium websites for businesses across India and the Gulf. Government-registered (MSME Udyam), engineered to production grade, secured by design.",
  foundingDate: "2026-06-04",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "Udyam Registration Number (MSME, Government of India)",
    value: "UDYAM-WB-10-0209203",
  },
  url: BASE,
  logo: `${BASE}/icon.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  knowsAbout: [
    "Cybersecurity",
    "Custom software development",
    "SaaS development",
    "AI automation",
    "CRM software",
    "HRMS and payroll software",
    "Expense management software",
    "Dealership management software",
    "Boutique billing software",
    "Web development",
    "Android app development",
    "Model Context Protocol security",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@aegibit.com",
    contactType: "sales",
    areaServed: ["IN", "AE"],
  },
  sameAs: [
    "https://www.instagram.com/aegibitglobal",
    "https://x.com/aegibitsec",
    "https://github.com/AegibitSecurity",
  ],
};

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(opts: { title: string; description: string; date: string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.date,
    author: { "@type": "Organization", name: opts.author },
    publisher: { "@type": "Organization", name: "AEGIBIT Global Consulting", url: BASE },
  };
}
