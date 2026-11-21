import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MultiStepForm } from "@/components/conversion/MultiStepForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-md mx-auto">
          <span className="mono-label text-[#F97316] block mb-4">Contact</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Tell us what needs to work better.</h1>
          <p className="text-[#A1A1AA] text-sm mb-10">Share the workflow, the people involved and what you want to change. We will review your enquiry to discuss product fit or a custom project.</p>
          <MultiStepForm source="contact" /><p className="text-zinc-300 text-sm mt-8">Prefer email? <a href="mailto:contact@aegibit.com" className="text-orange-400 underline underline-offset-4">contact@aegibit.com</a></p>
        </div>
      </main>
      <Footer />
    </>
  );
}
