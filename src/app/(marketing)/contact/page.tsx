"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MultiStepForm } from "@/components/conversion/MultiStepForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-md mx-auto">
          <span className="mono-label text-[#F97316] block mb-4">Contact</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Get in touch.</h1>
          <p className="text-[#52525B] text-sm mb-10">We read every message. Expect a reply within one business day.</p>
          <MultiStepForm source="contact" />
        </div>
      </main>
      <Footer />
    </>
  );
}
