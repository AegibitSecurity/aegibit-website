"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    id: "starter", name: "Starter", monthly: 999, annual: 799, unit: "user/month",
    desc: "For small security teams getting started.",
    features: ["Core voice + LLM assistant","30-day audit logs","5 integrations","Basic RBAC","Email support"],
    cta: "Get Started", highlight: false,
  },
  {
    id: "business", name: "Business", monthly: 2499, annual: 1999, unit: "user/month",
    desc: "For enterprise teams that need biometric auth and full compliance.",
    features: ["Everything in Starter","Voice biometric auth","RBAC + custom roles","1-year audit logs","15 integrations + API","ML anomaly detection","Priority support"],
    cta: "Start Free Trial", highlight: true, badge: "MOST POPULAR",
  },
  {
    id: "enterprise", name: "Enterprise", monthly: null, annual: null, unit: "",
    desc: "Custom deployment for regulated industries.",
    features: ["Everything in Business","Sudo Mode — Dual Approval","SIEM integration","On-premise option","India data residency SLA","Dedicated CSM","SOC 2 Type II reports"],
    cta: "Talk to Us", highlight: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen">
        {/* Hero */}
        <section className="pt-40 pb-20 px-6 text-center">
          <span className="mono-label text-[#F97316] block mb-6">Pricing</span>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold text-white tracking-tight mb-4">
            Start free. Scale as you grow.
          </h1>
          <p className="text-[#52525B] text-lg mb-10">No hidden fees. No vendor lock-in. Cancel anytime.</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual?"text-white":"text-[#52525B]"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ background: annual ? "#F97316" : "rgba(255,255,255,0.1)" }}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${annual?"left-6":"left-1"}`}/>
            </button>
            <span className={`text-sm flex items-center gap-2 ${annual?"text-white":"text-[#52525B]"}`}>
              Annual
              <span className="mono-label text-[#F97316] border border-[rgba(249,115,22,0.3)] rounded px-1.5 py-0.5">SAVE 20%</span>
            </span>
          </div>
        </section>

        {/* Plans */}
        <section className="px-6 pb-32">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className="rounded-2xl p-8 border flex flex-col transition-all"
                style={{
                  background: plan.highlight ? "linear-gradient(145deg,#0F0F0F,#0D0D0D)" : "#0A0A0A",
                  borderColor: plan.highlight ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)",
                  boxShadow: plan.highlight ? "0 0 48px rgba(249,115,22,0.1)" : "none",
                }}>
                {plan.badge && (
                  <span className="mono-label text-[#F97316] border border-[rgba(249,115,22,0.3)] rounded-md px-2 py-1 self-start mb-4">{plan.badge}</span>
                )}
                <h3 className="text-white font-semibold text-lg mb-1">{plan.name}</h3>
                <p className="text-[#52525B] text-sm mb-6">{plan.desc}</p>

                <div className="mb-8">
                  {plan.monthly ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#52525B] text-sm">Rs.</span>
                      <span className="text-4xl font-bold text-white">{annual ? plan.annual : plan.monthly}</span>
                      <span className="text-[#52525B] text-sm">/{plan.unit}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-white">Custom</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                      <Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5"/>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.id === "enterprise" ? "/contact" : "/signup"}
                  className="w-full text-center text-sm font-semibold py-3.5 rounded-xl transition-all"
                  style={plan.highlight ? {
                    background:"#F97316", color:"#fff", boxShadow:"0 0 20px rgba(249,115,22,0.25)",
                  } : {
                    border:"1px solid rgba(255,255,255,0.1)", color:"#A1A1AA",
                  }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
