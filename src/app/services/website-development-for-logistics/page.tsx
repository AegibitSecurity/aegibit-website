import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Website Development for Logistics | AEGIBIT",
  description: "AEGIBIT delivers secure, scalable software for Logistics companies. SOC 2 ready, OWASP-tested, deployed in weeks.",
  alternates: { canonical: "/services/website-development-for-logistics" },
  openGraph: {
    title: "Secure Website Development for Logistics | AEGIBIT",
    description: "Secure software for Logistics companies. Built by a cybersecurity company.",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-orange-400">
          Industry Specialist
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
          Logistics Website Development — Built Secure by Default
        </h1>
        <p className="mt-6 text-xl text-white/70 max-w-2xl">
          AEGIBIT is a cybersecurity-first software company. We build websites, apps, and SaaS
          platforms for Logistics companies with security, compliance, and performance baked in from day one.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="/contact" className="rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
            Get a Free Security Audit
          </a>
          <a href="/pricing" className="rounded-md border border-white/20 px-6 py-3 font-semibold hover:bg-white/5">
            See Pricing
          </a>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">OWASP-Hardened</h2>
            <p className="mt-2 text-white/60">Every project is tested against the OWASP Top 10 before delivery.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">SOC 2 Ready</h2>
            <p className="mt-2 text-white/60">Audit-ready logging, RBAC, and secret management from day one.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Production in Weeks</h2>
            <p className="mt-2 text-white/60">Most Logistics projects ship in 4–8 weeks, not quarters.</p>
          </div>
        </div>

        <div className="mt-20 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">Why Logistics companies choose AEGIBIT</h2>
          <ul className="mt-6 space-y-3 text-white/70">
            <li>— Security-first development from a dedicated cybersecurity team</li>
            <li>— Compliance-ready architectures (SOC 2, GDPR, HIPAA where applicable)</li>
            <li>— Direct access to senior engineers, not account managers</li>
            <li>— Fixed-price packages starting at $499/mo or $4,999 one-time</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
