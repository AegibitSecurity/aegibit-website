import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CTASection } from "@/components/sections/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <SectionHeader
          label="ABOUT US"
          title="Built in India. Built for security."
          subtitle="AEGIBIT Security is on a mission to make enterprise voice AI trustworthy enough for regulated industries."
        />
        <div className="mt-12 prose prose-invert max-w-none">
          <p className="text-[#D1D5DB] leading-relaxed">
            We started AEGIBIT after seeing enterprise teams adopt consumer voice assistants for work — tools
            with no audit trails, no identity verification, and no concept of least-privilege access.
            The result? Shadow IT at the voice layer. Commands executed without accountability. Data leaked through
            integrations with no RBAC.
          </p>
          <p className="text-[#D1D5DB] leading-relaxed mt-4">
            VoiceCore is our answer. An AI voice platform designed from the ground up for environments where security
            isn&apos;t optional — BFSI, healthcare, government, and enterprise technology teams.
          </p>
          <p className="text-[#D1D5DB] leading-relaxed mt-4">
            We&apos;re a small team of security engineers, ML researchers, and product builders. We&apos;re based in India,
            we care deeply about data sovereignty, and we&apos;re building the platform we wish existed.
          </p>
        </div>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
