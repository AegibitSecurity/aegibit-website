import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE_URL, buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/content/glossary";

/**
 * /glossary, the index of AEGIBIT's reference library. Part of the
 * Sprint 1 GEO experiment: a genuine topic cluster on security, AI,
 * and business software, each entry a full 8-section primer.
 */

export const metadata: Metadata = buildMetadata({
  title: "Glossary: Security, AI, and Business Software Explained",
  description:
    "Plain-language, in-depth explanations of the concepts behind secure business software: Zero Trust, RBAC, audit logs, prompt injection, MCP, RAG, DPDP, multi-tenancy, CPQ, and more. By AEGIBIT.",
  path: "/glossary",
  keywords: [
    "security glossary",
    "zero trust explained",
    "prompt injection",
    "row level security",
    "DPDP act explained",
    "CPQ meaning",
    "AEGIBIT",
  ],
});

export default function GlossaryIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/glossary#set`,
    name: "AEGIBIT Glossary of Security, AI, and Business Software",
    url: `${SITE_URL}/glossary`,
    hasDefinedTerm: GLOSSARY.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      url: `${SITE_URL}/glossary/${t.slug}`,
    })),
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content" className="pt-32 pb-20 px-6 lg:px-10 max-w-4xl mx-auto">
        <span className="mono-label text-[#F97316] block mb-4">Reference Library</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
          The AEGIBIT Glossary
        </h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed max-w-2xl mb-12">
          The concepts behind secure business software, explained properly: what each one is,
          why it matters, how it works, where teams go wrong, and how to get it right. Written
          by the team that builds this way every day.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {GLOSSARY.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="group rounded-xl p-6 border border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] hover:border-[rgba(249,115,22,0.45)] transition-colors"
            >
              <h2 className="text-white font-semibold mb-2 group-hover:text-[#F97316] transition-colors">
                {t.term}
              </h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed line-clamp-3">{t.short}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
