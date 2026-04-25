import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCases } from "@/content/use-cases";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const uc = useCases.find((u) => u.slug === slug);
  if (!uc) return { title: "Not Found" };
  return {
    title: `${uc.name} | AEGIBIT VoiceCore`,
    description: uc.description,
    openGraph: { title: uc.name, description: uc.description },
  };
}

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const uc = useCases.find((u) => u.slug === slug);
  if (!uc) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: uc.name,
    description: uc.description,
    tool: { "@type": "HowToTool", name: "AEGIBIT VoiceCore" },
    step: uc.howItHelps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10 max-w-4xl mx-auto">
        <span className="mono-label text-[#FF6A00] block mb-4">{uc.industry}</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">{uc.headline}</h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed mb-14 max-w-2xl">{uc.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="mono-label text-[#52525B] mb-5">Pain Points</h2>
            <ul className="space-y-3">
              {uc.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                  <span className="w-1 h-1 rounded-full bg-[#52525B] mt-2 flex-shrink-0" />{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mono-label text-[#FF6A00] mb-5">How VoiceCore Helps</h2>
            <ul className="space-y-3">
              {uc.howItHelps.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                  <span className="w-1 h-1 rounded-full bg-[#FF6A00] mt-2 flex-shrink-0" />{h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Voice commands */}
        <div className="mb-14">
          <h2 className="mono-label text-[#52525B] mb-5">Example Voice Commands</h2>
          <div className="rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#111111] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0A]">
              <Terminal className="w-3.5 h-3.5 text-[#52525B]" />
              <span className="mono-label text-[#2A2A2A]">voicecore terminal</span>
            </div>
            <div className="p-5 space-y-3">
              {uc.commands.map((cmd) => (
                <div key={cmd} className="flex items-start gap-3">
                  <span className="mono-label text-[#FF6A00] flex-shrink-0 mt-0.5">❯</span>
                  <span className="font-mono text-sm text-[#A1A1AA]">{cmd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link href="/signup" className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold px-7 py-3 rounded-md text-sm transition-colors">
          Get Private Access <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
      <Footer />
    </>
  );
}
