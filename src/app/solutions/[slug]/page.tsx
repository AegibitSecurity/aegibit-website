import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SOLUTIONS, findSolution } from "@/content/solutions";
import { SolutionPage } from "@/components/sections/solutions/SolutionPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = findSolution(slug);
  if (!solution) return { title: "Solution Not Found | AEGIBIT" };

  const url = `https://www.aegibit.com/solutions/${solution.slug}`;
  return {
    title: solution.title,
    description: solution.description,
    keywords: [
      solution.keyword,
      "PayMint",
      "AEGIBIT",
      "expense management India",
      "multi-branch SME",
      "Tally export",
    ],
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: {
      title: solution.title,
      description: solution.description,
      type: "website",
      url,
      siteName: "AEGIBIT",
    },
    twitter: {
      card: "summary_large_image",
      title: solution.title,
      description: solution.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SolutionDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = findSolution(slug);
  if (!solution) notFound();

  // FAQ schema for Google rich results — appears on the page as a single
  // <script type="application/ld+json"> tag, picked up by Googlebot.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: solution.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AEGIBIT",
        item: "https://www.aegibit.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Solutions",
        item: "https://www.aegibit.com/solutions",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: solution.title,
        item: `https://www.aegibit.com/solutions/${solution.slug}`,
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
      <SolutionPage solution={solution} />
      <Footer />
    </>
  );
}
