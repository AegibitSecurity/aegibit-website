"use client";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "waitlist", page: "/signup" }),
      });
      setStatus("success");
    } catch { setStatus("idle"); }
  }

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111111] p-8">
      {status === "success" ? (
        <div className="text-center py-8 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#FF6A00] mx-auto" />
          <p className="text-white font-bold text-xl tracking-tight">Access requested.</p>
          <p className="text-[#A1A1AA] text-sm">We&apos;ll reach out to {form.email} within 24 hours.</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Get Private Access</h2>
          <p className="text-[#52525B] text-sm mb-7">AEGIBIT operates on an invite basis. Request your access below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: "name",    label: "Full Name",   type: "text",  ph: "Your name",     req: true },
              { id: "email",   label: "Work Email",  type: "email", ph: "you@company.com",req: true },
              { id: "company", label: "Company",     type: "text",  ph: "Company name",   req: false },
            ].map(({ id, label, type, ph, req }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="text-[#A1A1AA] text-xs mono-label block">{label}</label>
                <input
                  id={id} type={type} placeholder={ph} required={req}
                  value={(form as Record<string,string>)[id]}
                  onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#2A2A2A] focus:border-[rgba(255,106,0,0.4)] rounded-md px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            ))}
            <button
              type="submit" disabled={status === "loading"}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold py-3 rounded-md text-sm transition-colors mt-2"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request Access <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
          <p className="text-center text-[#2A2A2A] text-xs mt-5">
            Already have access?{" "}
            <Link href="/login" className="text-[#A1A1AA] hover:text-white">Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}
