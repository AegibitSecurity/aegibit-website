const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://aegibitsecurity.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AEGIBIT Security",
  url: BASE,
  logo: `${BASE}/og-default.png`,
  contactPoint: { "@type": "ContactPoint", email: "contact@aegibit.com", contactType: "sales" },
  sameAs: [],
};

export const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AEGIBIT VoiceCore",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web, iOS, Android, Desktop",
  offers: { "@type": "Offer", priceCurrency: "INR", price: "999" },
  description: "Enterprise AI Voice Platform with Zero Trust security, RBAC, and immutable audit logging.",
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
    publisher: { "@type": "Organization", name: "AEGIBIT Security", url: BASE },
  };
}
