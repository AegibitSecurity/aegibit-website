import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { industries } from "@/content/industries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) return { title: "Not Found" };
  return {
    title: `${ind.name} | AEGIBIT Security Solutions`,
    description: ind.description,
    openGraph: { title: ind.headline, description: ind.description },
  };
}

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = industries.find((i) => i.slug === slug);
  if (!ind) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `AEGIBIT VoiceCore — ${ind.name}`,
    description: ind.description,
    brand: { "@type": "Organization", name: "AEGIBIT Security" },
    audience: { "@type": "BusinessAudience", audienceType: ind.name },
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10 max-w-4xl mx-auto">
        <span className="mono-label text-[#FF6A00] block mb-4">{ind.name}</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">{ind.headline}</h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed mb-14 max-w-2xl">{ind.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          <div>
            <h2 className="mono-label text-[#52525B] mb-5">Industry Challenges</h2>
            <ul className="space-y-3">
              {ind.challenges.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                  <span className="w-1 h-1 rounded-full bg-[#52525B] mt-2 flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono-label text-[#FF6A00] mb-5">How VoiceCore Solves It</h2>
            <ul className="space-y-3">
              {ind.solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                  <span className="w-1 h-1 rounded-full bg-[#FF6A00] mt-2 flex-shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {ind.compliance.length > 0 && (
          <div className="mb-14">
            <h2 className="mono-label text-[#52525B] mb-5">Compliance &amp; Standards</h2>
            <div className="flex flex-wrap gap-2">
              {ind.compliance.map((c) => (
                <span key={c} className="mono-label text-[#A1A1AA] border border-[rgba(255,255,255,0.08)] rounded px-3 py-1.5">{c}</span>
              ))}
            </div>
          </div>
        )}

        <Link href="/signup" className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold px-7 py-3 rounded-md text-sm transition-colors">
          Get Private Access <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </>
  );
}
