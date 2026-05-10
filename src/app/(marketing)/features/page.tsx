import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform",
  description: "AEGIBIT — voice-first security platform with Zero Trust, RBAC, and immutable audit logging.",
};

const FEATURES = [
  {
    title: "Voice-Driven Control",
    body: "Control your entire security infrastructure with natural voice commands. AEGIBIT understands context, intent, and executes complex workflows with simple spoken instructions.",
    tag: "Voice Control",
  },
  {
    title: "Zero Trust Architecture",
    body: "Every connection, every request, every action is independently verified. AEGIBIT implements Zero Trust principles at every layer — no implicit trust, ever.",
    tag: "Security",
  },
  {
    title: "SOC 2 Ready",
    body: "Compliance built-in, not bolted-on. AEGIBIT is designed from the ground up to meet SOC 2 Type II requirements with comprehensive audit trails and granular access controls.",
    tag: "Compliance",
  },
  {
    title: "Enterprise Integrations",
    body: "Connect to 15+ enterprise tools out of the box — Slack, Jira, ServiceNow, Splunk, PagerDuty, GitHub and more. Custom integrations via REST API on Business and Enterprise plans.",
    tag: "Integrations",
  },
  {
    title: "Immutable Audit Logs",
    body: "Every command, every decision, every outcome is written to a tamper-proof, append-only audit log. SIEM-compatible. Forensic-ready. Regulator-approved.",
    tag: "Audit",
  },
  {
    title: "RBAC Per Command",
    body: "Role-based access control at the individual command level. Not just who can log in — but who can say what, and when. Granular policies that map to your org hierarchy.",
    tag: "Access Control",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen">

        {/* Hero */}
        <section className="pt-40 pb-24 px-6 text-center max-w-4xl mx-auto">
          <span className="mono-label text-[#F97316] block mb-6">Platform</span>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-tight tracking-tight mb-6">
            AEGIBIT
          </h1>
          <p className="text-[#52525B] text-xl leading-relaxed max-w-xl mx-auto mb-10">
            The operating system for intelligent, secure automation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup"
              className="text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90"
              style={{ background:"#F97316", boxShadow:"0 0 28px rgba(249,115,22,0.3)" }}>
              Get Private Access
            </Link>
            <Link href="/contact"
              className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              Book a demo →
            </Link>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 pb-32 border-t border-[rgba(255,255,255,0.06)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)] mt-0">
              {FEATURES.map((f) => (
                <div key={f.title}
                  className="bg-[#000] hover:bg-[#0A0A0A] transition-colors p-10 group">
                  <span className="mono-label text-[#F97316] block mb-5">{f.tag}</span>
                  <h3 className="text-white font-semibold text-xl mb-4 leading-snug group-hover:text-[#F97316] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-[#52525B] text-sm leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-32">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
              Ready to deploy AEGIBIT?
            </h2>
            <p className="text-[#52525B] mb-8">Join 50+ enterprise teams on the waitlist.</p>
            <Link href="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white px-8 py-4 rounded-xl transition-all hover:opacity-90"
              style={{ background:"#F97316", boxShadow:"0 0 28px rgba(249,115,22,0.25)" }}>
              Get Private Access
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
