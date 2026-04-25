"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/motion/FadeIn";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, page: "/contact" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch { setStatus("error"); }
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
        <SectionHeader label="CONTACT" title="Get in touch" subtitle="We read every message. Expect a reply within one business day." />
        <FadeIn delay={0.2} className="mt-12">
          {status === "success" ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
              <p className="text-[#F9FAFB] font-bold text-xl">Message received!</p>
              <p className="text-[#6B7280]">We&apos;ll reply to {form.email} within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { id: "name", label: "Name", type: "text", placeholder: "Your name", required: true },
                { id: "email", label: "Work Email", type: "email", placeholder: "you@company.com", required: true },
                { id: "company", label: "Company", type: "text", placeholder: "Company name", required: false },
              ].map(({ id, label, type, placeholder, required }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-[#D1D5DB] text-sm">{label}</Label>
                  <Input
                    id={id} type={type} placeholder={placeholder} required={required}
                    value={(form as Record<string, string>)[id]}
                    onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                    className="bg-[rgba(4,8,16,0.8)] border-[rgba(37,99,235,0.25)] text-[#F9FAFB] placeholder:text-[#374151] focus:border-[#2563EB] h-11 rounded-xl"
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-[#D1D5DB] text-sm">Message</Label>
                <textarea
                  id="message" required rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your use case..."
                  className="w-full bg-[rgba(4,8,16,0.8)] border border-[rgba(37,99,235,0.25)] text-[#F9FAFB] placeholder:text-[#374151] focus:border-[#2563EB] rounded-xl p-3 outline-none resize-none text-sm transition-colors"
                />
              </div>
              {status === "error" && <p className="text-[#EF4444] text-sm">Something went wrong. Please try again.</p>}
              <Button type="submit" disabled={status === "loading"} className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white h-12 rounded-xl">
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
              </Button>
            </form>
          )}
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
