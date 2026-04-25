import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About", description: "AEGIBIT — Built in India for enterprises that cannot afford failure." };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen">
        <section className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
          <span className="mono-label text-[#F97316] block mb-6">Company</span>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-bold text-white leading-tight tracking-tight mb-10 max-w-2xl">
            Built in India.<br />Built for security.
          </h1>

          <div className="space-y-8 max-w-2xl">
            <p className="text-[#A1A1AA] text-lg leading-relaxed">
              We started AEGIBIT after seeing enterprise teams adopt consumer voice assistants for work — tools with no audit trails, no identity verification, and no concept of least-privilege access. The result was shadow IT at the voice layer.
            </p>
            <p className="text-[#A1A1AA] text-lg leading-relaxed">
              VoiceCore is our answer: an AI voice platform designed from the ground up for environments where security isn&apos;t optional — BFSI, healthcare, government, and enterprise technology teams.
            </p>
            <p className="text-[#A1A1AA] text-lg leading-relaxed">
              We&apos;re a team of security engineers, ML researchers, and product builders. We care deeply about data sovereignty, and we&apos;re building the platform we wish existed.
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-[rgba(255,255,255,0.06)]">
            <p className="mono-label text-[#52525B] mb-3">🇮🇳 Built in India</p>
            <p className="mono-label text-[#52525B]">contact@aegibit.com</p>
          </div>

          <div className="mt-12">
            <Link href="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90"
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
