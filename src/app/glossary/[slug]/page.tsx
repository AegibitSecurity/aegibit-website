import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const TERMS: Record<string, { term: string; definition: string; related: string[] }> = {
  "zero-trust": {
    term: "Zero Trust",
    definition: "A security model that requires strict identity verification for every person and device trying to access resources, regardless of whether they are inside or outside the network perimeter. Zero Trust operates on the principle of 'never trust, always verify.'",
    related: ["Voice Biometrics", "RBAC", "Audit Logs"],
  },
  "voice-biometrics": {
    term: "Voice Biometrics",
    definition: "The use of an individual's unique vocal characteristics — including pitch, tone, cadence, and pronunciation patterns — to verify their identity. Voice biometrics provides continuous authentication across an entire spoken interaction, unlike one-time PIN entry.",
    related: ["Zero Trust", "Multi-Factor Authentication", "Speaker Verification"],
  },
  "rbac": {
    term: "Role-Based Access Control (RBAC)",
    definition: "A method of regulating access to systems based on the roles of individual users within an organization. In RBAC, permissions are assigned to roles rather than individuals, and users are assigned to roles based on their responsibilities.",
    related: ["Zero Trust", "Least Privilege", "Access Control List"],
  },
  "audit-log": {
    term: "Audit Log",
    definition: "A chronological record of system activities that provides documentary evidence of the sequence of activities that have affected a specific operation or event. Immutable audit logs cannot be altered or deleted, making them critical for compliance and forensic investigation.",
    related: ["Compliance", "SIEM", "Forensics"],
  },
  "anomaly-detection": {
    term: "Anomaly Detection",
    definition: "The identification of patterns in data that do not conform to expected behavior. In security contexts, anomaly detection uses machine learning to identify unusual access patterns, command sequences, or behavioral changes that may indicate a threat.",
    related: ["SIEM", "Behavioral AI", "Insider Threat"],
  },
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = TERMS[slug];
  if (!t) return { title: "Not Found" };
  return {
    title: `${t.term} | AEGIBIT Security Glossary`,
    description: t.definition.slice(0, 160),
  };
}

export function generateStaticParams() {
  return Object.keys(TERMS).map((slug) => ({ slug }));
}

export default async function GlossaryTerm({ params }: Props) {
  const { slug } = await params;
  const t = TERMS[slug];
  if (!t) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "AEGIBIT Security Glossary" },
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10 max-w-3xl mx-auto">
        <span className="mono-label text-[#FF6A00] block mb-4">Glossary</span>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-6">{t.term}</h1>
        <p className="text-[#A1A1AA] text-lg leading-relaxed mb-10">{t.definition}</p>
        {t.related.length > 0 && (
          <div>
            <p className="mono-label text-[#52525B] mb-3">Related Terms</p>
            <div className="flex flex-wrap gap-2">
              {t.related.map((r) => (
                <span key={r} className="text-sm text-[#A1A1AA] border border-[rgba(255,255,255,0.08)] rounded px-3 py-1">{r}</span>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
