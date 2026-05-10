import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPARISONS, findComparison } from "@/content/comparisons";
import { ComparisonPage } from "@/components/sections/compare/ComparisonPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = findComparison(slug);
  if (!c) return { title: "Comparison Not Found" };

  const url = `https://www.aegibit.com/compare/${c.slug}`;
  return {
    title: c.title,
    description: c.description,
    keywords: [
      `PayMint vs ${c.competitorName}`,
      `${c.competitorName} alternative`,
      "multi-branch expense management",
      "PayMint",
      "AEGIBIT",
    ],
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      url,
      siteName: "AEGIBIT",
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const c = findComparison(slug);
  if (!c) notFound();

  // FAQ schema for Google rich results
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // BreadcrumbList for SERP enhancement
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AEGIBIT", item: "https://www.aegibit.com" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://www.aegibit.com/compare" },
      {
        "@type": "ListItem",
        position: 3,
        name: c.title,
        item: `https://www.aegibit.com/compare/${c.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />
      <ComparisonPage comparison={c} />
      <Footer />
    </>
  );
}
