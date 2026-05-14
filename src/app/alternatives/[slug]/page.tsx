import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { alternatives } from "@/content/alternatives";
import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const alt = alternatives.find((a) => a.slug === slug);
  if (!alt) return { title: "Not Found" };
  return {
    title: alt.title,
    description: alt.metaDescription,
    keywords: alt.targetKeywords,
    alternates: { canonical: `/alternatives/${alt.slug}` },
    openGraph: {
      title: alt.title,
      description: alt.metaDescription,
      type: "article",
      url: `${SITE_URL}/alternatives/${alt.slug}`,
      siteName: "AEGIBIT",
    },
    twitter: {
      card: "summary_large_image",
      title: alt.title,
      description: alt.metaDescription,
    },
  };
}

export function generateStaticParams() {
  return alternatives.map((a) => ({ slug: a.slug }));
}

export default async function AlternativePage({ params }: Props) {
  const { slug } = await params;
  const alt = alternatives.find((a) => a.slug === slug);
  if (!alt) notFound();

  const pageUrl = `${SITE_URL}/alternatives/${alt.slug}`;

  // schema.org rejects mixed @type arrays — split into a @graph of
  // independent entities. Google parses each one and emits the right
  // rich result (Product card + FAQ accordion).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#app`,
        name: "AEGIBIT VoiceCore",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: pageUrl,
        description: alt.metaDescription,
        brand: { "@type": "Organization", name: "AEGIBIT Security", url: SITE_URL },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: "999",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: alt.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AEGIBIT", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Alternatives", item: `${SITE_URL}/alternatives` },
          { "@type": "ListItem", position: 3, name: `vs ${alt.name}`, item: pageUrl },
        ],
      },
    ],
  };

  const relatedAlts = alternatives.filter((a) => a.slug !== slug).slice(0, 4);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <span className="mono-label text-[#F97316] block mb-4">Alternative to {alt.name}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">{alt.title}</h1>
          <p className="text-[#A1A1AA] text-lg leading-relaxed max-w-2xl">{alt.metaDescription}</p>
        </div>

        {/* Comparison table */}
        <div className="mb-16 rounded-sm border border-[rgba(255,255,255,0.06)] overflow-hidden">
          <div className="grid grid-cols-3 bg-[#111111] border-b border-[rgba(255,255,255,0.06)]">
            <div className="p-4 text-[#52525B] text-sm font-medium">Feature</div>
            <div className="p-4 text-[#F97316] text-sm font-semibold border-l border-[rgba(255,255,255,0.06)]">AEGIBIT VoiceCore</div>
            <div className="p-4 text-[#52525B] text-sm font-medium border-l border-[rgba(255,255,255,0.06)]">{alt.name}</div>
          </div>
          {alt.features.map((f, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[rgba(255,255,255,0.01)]"}`}>
              <div className="p-4 text-[#A1A1AA] text-sm">{f.feature}</div>
              <div className="p-4 border-l border-[rgba(255,255,255,0.04)] flex items-center">
                {f.us ? <Check className="w-4 h-4 text-[#F97316]" /> : <X className="w-4 h-4 text-[#2A2A2A]" />}
              </div>
              <div className="p-4 border-l border-[rgba(255,255,255,0.04)] flex items-center">
                {f.them ? <Check className="w-4 h-4 text-[#52525B]" /> : <X className="w-4 h-4 text-[#2A2A2A]" />}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {alt.faqs.map((faq, i) => (
              <div key={i} className="border-b border-[rgba(255,255,255,0.06)] pb-6">
                <h3 className="text-white font-semibold mb-2 text-sm">{faq.q}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-sm border border-[rgba(249,115,22,0.2)] bg-[#111111] mb-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Ready to switch to VoiceCore?</h2>
          <p className="text-[#A1A1AA] mb-6 text-sm">Join 50+ enterprise teams. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#CC5500] text-white font-semibold px-7 py-3 rounded-md text-sm transition-colors">
            Get Private Access <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related alternatives */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-5">More Comparisons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedAlts.map((a) => (
              <Link key={a.slug} href={`/alternatives/${a.slug}`} className="p-3 rounded-sm border border-[rgba(255,255,255,0.06)] text-[#52525B] hover:text-[#A1A1AA] hover:border-[rgba(255,255,255,0.1)] text-xs transition-all">
                vs {a.name}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
