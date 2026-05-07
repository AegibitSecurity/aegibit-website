import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { integrations } from "@/content/integrations";
import { SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const int = integrations.find((i) => i.slug === slug);
  if (!int) return { title: "Not Found" };
  const title = `AEGIBIT VoiceCore + ${int.name} Integration`;
  const description = int.description;
  return {
    title,
    description,
    alternates: { canonical: `/integrations/${int.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/integrations/${int.slug}`,
      siteName: "AEGIBIT",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function generateStaticParams() {
  return integrations.map((i) => ({ slug: i.slug }));
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const int = integrations.find((i) => i.slug === slug);
  if (!int) notFound();

  const pageUrl = `${SITE_URL}/integrations/${int.slug}`;
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
        description: int.description,
        brand: { "@type": "Organization", name: "AEGIBIT Security", url: SITE_URL },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: "999",
          availability: "https://schema.org/InStock",
        },
        featureList: int.commands,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AEGIBIT", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE_URL}/integrations` },
          { "@type": "ListItem", position: 3, name: int.name, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10 max-w-4xl mx-auto">
        <span className="mono-label text-[#FF6A00] block mb-4">{int.category} Integration</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
          AEGIBIT VoiceCore + {int.name}
        </h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed mb-14 max-w-2xl">{int.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          {/* Commands */}
          <div>
            <h2 className="mono-label text-[#FF6A00] mb-5">Voice Commands</h2>
            <div className="rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#111111] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0A]">
                <Terminal className="w-3.5 h-3.5 text-[#52525B]" />
                <span className="mono-label text-[#2A2A2A]">examples</span>
              </div>
              <div className="p-4 space-y-3">
                {int.commands.map((cmd) => (
                  <div key={cmd} className="flex items-start gap-2">
                    <span className="mono-label text-[#FF6A00] flex-shrink-0">❯</span>
                    <span className="font-mono text-xs text-[#A1A1AA] leading-relaxed">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Setup */}
          <div>
            <h2 className="mono-label text-[#52525B] mb-5">Setup Steps</h2>
            <ol className="space-y-4">
              {int.setupSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                  <span className="mono-label text-[#FF6A00] flex-shrink-0 w-5">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Link href="/signup" className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold px-7 py-3 rounded-md text-sm transition-colors">
          Connect {int.name} to VoiceCore <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </>
  );
}
