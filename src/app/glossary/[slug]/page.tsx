import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GLOSSARY, getTerm } from "@/content/glossary";

/**
 * /glossary/[slug], reference-grade term pages (Sprint 1,
 * exp-glossary-geo). Rebuilt from one-paragraph stubs into the
 * 8-section format the founder set as the bar: definition, why it
 * matters, how it works, real example, common mistakes, best
 * practices, related concepts (as real links, fixing the audit
 * finding), and FAQs with FAQPage schema. DefinedTerm + FAQPage +
 * BreadcrumbList JSON-LD make each page AI-citable (GEO).
 */

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) return { title: "Not Found" };
  const description = t.short.slice(0, 158);
  return {
    title: `What is ${t.term}?`,
    description,
    alternates: { canonical: `/glossary/${slug}` },
    openGraph: {
      title: `${t.term} | AEGIBIT Glossary`,
      description,
      type: "article",
      url: `${SITE_URL}/glossary/${slug}`,
      siteName: "AEGIBIT",
    },
    twitter: { card: "summary_large_image", title: t.term, description },
  };
}

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-3">{label}</h2>
      {children}
    </section>
  );
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) notFound();

  const pageUrl = `${SITE_URL}/glossary/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${pageUrl}#term`,
        name: t.term,
        description: t.short,
        url: pageUrl,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "AEGIBIT Glossary of Security, AI, and Business Software",
          url: `${SITE_URL}/glossary`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AEGIBIT", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE_URL}/glossary` },
          { "@type": "ListItem", position: 3, name: t.term, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content" className="pt-32 pb-20 px-6 lg:px-10 max-w-3xl mx-auto">
        <Link href="/glossary" className="mono-label text-[#F97316] block mb-4 hover:underline">
          ← AEGIBIT Glossary
        </Link>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-5">{t.term}</h1>
        <p className="text-[#D4D4D8] text-lg leading-relaxed mb-10">{t.short}</p>

        <Section label="Why it matters">
          <p className="text-[#A1A1AA] leading-relaxed">{t.why}</p>
        </Section>

        <Section label="How it works">
          <p className="text-[#A1A1AA] leading-relaxed">{t.how}</p>
        </Section>

        <Section label="A real-world example">
          <p className="text-[#A1A1AA] leading-relaxed">{t.example}</p>
        </Section>

        <Section label="Common mistakes">
          <ul className="space-y-2">
            {t.mistakes.map((m) => (
              <li key={m} className="text-[#A1A1AA] leading-relaxed flex gap-2">
                <span className="text-[#F87171] shrink-0">✗</span> {m}
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Best practices">
          <ul className="space-y-2">
            {t.bestPractices.map((b) => (
              <li key={b} className="text-[#A1A1AA] leading-relaxed flex gap-2">
                <span className="text-[#10B981] shrink-0">✓</span> {b}
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Frequently asked questions">
          <div className="space-y-5">
            {t.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-white font-medium mb-1">{f.q}</h3>
                <p className="text-[#A1A1AA] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {t.aegibit && (
          <div
            className="rounded-xl p-6 mb-10"
            style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.10), transparent)",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <p className="text-[#D4D4D8] leading-relaxed mb-3">{t.aegibit.text}</p>
            <Link href={t.aegibit.href} className="text-sm font-semibold text-[#F97316] hover:underline">
              {t.aegibit.label} →
            </Link>
          </div>
        )}

        <div>
          <p className="mono-label text-[#52525B] mb-3">Related concepts</p>
          <div className="flex flex-wrap gap-2">
            {t.related.map((slugRef) => {
              const rel = getTerm(slugRef);
              if (!rel) return null;
              return (
                <Link
                  key={slugRef}
                  href={`/glossary/${slugRef}`}
                  className="text-sm text-[#A1A1AA] border border-[rgba(255,255,255,0.08)] rounded px-3 py-1 hover:border-[rgba(249,115,22,0.5)] hover:text-white transition-colors"
                >
                  {rel.term}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
