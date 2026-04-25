import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security",
  description: "Zero Trust security architecture — voice biometrics, RBAC, immutable audit logging, and India data residency.",
};

const LAYERS = [
  { num:"01", title:"Voice Biometric Authentication", body:"Every command verified against the speaker's enrolled voiceprint. Replay attacks and synthetic voice rejected with >99.5% accuracy.", badge:"ACTIVE" },
  { num:"02", title:"TLS 1.3 + End-to-End Encryption", body:"All voice data encrypted in transit and at rest. No plaintext voice ever touches our infrastructure.", badge:"ENFORCED" },
  { num:"03", title:"RBAC + Per-Command ACL", body:"Authorization at the individual command level. Not just who can log in — who can say what, and when.", badge:"ENFORCED" },
  { num:"04", title:"Immutable Audit Trail", body:"Append-only, cryptographically-chained log of every action. Tamper-proof. SIEM-compatible. Regulator-approved.", badge:"ACTIVE" },
  { num:"05", title:"ML Anomaly Detection", body:"Behavioral AI flags unusual command patterns, off-hours access, and deviations from established baseline in real time.", badge:"LEARNING" },
];

const COMPLIANCE = ["RBI Cybersecurity Framework", "HIPAA", "DPDP Act 2023", "ISO 27001", "SOC 2 Type II (in progress)", "SEBI CSCRF"];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen">
        {/* Hero */}
        <section className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
          <span className="mono-label text-[#F97316] block mb-6">Security</span>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-tight tracking-tight mb-6 max-w-2xl">
            Zero Trust is not a feature.<br />It&apos;s the foundation.
          </h1>
          <p className="text-[#52525B] text-xl leading-relaxed max-w-xl">
            We don&apos;t add security on top. We build from the assumption that every request is hostile until proven otherwise.
          </p>
        </section>

        {/* Security layers */}
        <section className="px-6 pb-24 border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-4xl mx-auto divide-y divide-[rgba(255,255,255,0.06)]">
            {LAYERS.map((l) => (
              <div key={l.num} className="py-10 flex gap-10 group hover:bg-[rgba(249,115,22,0.02)] -mx-6 px-6 transition-colors">
                <span className="mono-label text-[#F97316] flex-shrink-0 mt-1">{l.num}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-white font-semibold text-lg">{l.title}</h3>
                    <span className="mono-label text-[#F97316] border border-[rgba(249,115,22,0.3)] rounded px-2 py-0.5">{l.badge}</span>
                  </div>
                  <p className="text-[#52525B] text-sm leading-relaxed">{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="px-6 pb-32 border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-4xl mx-auto pt-16">
            <span className="mono-label text-[#F97316] block mb-8">Compliance &amp; Standards</span>
            <div className="flex flex-wrap gap-3">
              {COMPLIANCE.map((c) => (
                <span key={c} className="text-sm text-[#A1A1AA] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2 hover:border-[rgba(249,115,22,0.3)] transition-colors">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-16">
              <Link href="/signup"
                className="inline-flex items-center justify-center text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ background:"#F97316", boxShadow:"0 0 28px rgba(249,115,22,0.25)" }}>
                Get Private Access
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
