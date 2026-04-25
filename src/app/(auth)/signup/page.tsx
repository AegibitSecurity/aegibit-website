"use client";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name:"", email:"", company:"" });
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/leads", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, source:"waitlist", page:"/signup" }),
      });
      setStatus("success");
    } catch { setStatus("idle"); }
  }

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] p-8"
      style={{ boxShadow:"0 0 0 1px rgba(249,115,22,0.1), 0 32px 64px rgba(0,0,0,0.5)" }}>
      {/* Orange top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px"
        style={{ background:"linear-gradient(90deg,transparent,#F97316,transparent)" }}/>

      {status==="success" ? (
        <div className="text-center py-8 space-y-4">
          <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color:"#F97316" }}/>
          <p className="text-white font-bold text-xl tracking-tight">Access requested.</p>
          <p className="text-[#52525B] text-sm">We&apos;ll reach out to {form.email} within 24 hours.</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Get Private Access</h2>
          <p className="text-[#52525B] text-sm mb-7">AEGIBIT operates on an invite basis.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id:"name",    label:"Full Name",   type:"text",  ph:"Your name",       req:true },
              { id:"email",   label:"Work Email",  type:"email", ph:"you@company.com", req:true },
              { id:"company", label:"Company",     type:"text",  ph:"Company name",    req:false },
            ].map(({ id, label, type, ph, req }) => (
              <div key={id} className="space-y-1.5">
                <label htmlFor={id} className="mono-label text-[#52525B] block">{label}</label>
                <input id={id} type={type} placeholder={ph} required={req}
                  value={(form as Record<string,string>)[id]}
                  onChange={(e) => setForm(f => ({ ...f, [id]:e.target.value }))}
                  className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
                  onFocus={e => (e.target.style.borderColor="rgba(249,115,22,0.5)")}
                  onBlur={e => (e.target.style.borderColor="rgba(255,255,255,0.08)")}
                />
              </div>
            ))}
            <button type="submit" disabled={status==="loading"}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white py-3.5 rounded-xl mt-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background:"#F97316", boxShadow:"0 0 20px rgba(249,115,22,0.3)" }}>
              {status==="loading" ? <Loader2 className="w-4 h-4 animate-spin"/> : <>Request Access <ArrowRight className="w-4 h-4"/></>}
            </button>
          </form>
          <p className="text-center text-[#3F3F46] text-xs mt-5">
            Already have access?{" "}
            <Link href="/login" className="text-[#A1A1AA] hover:text-white transition-colors">Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}
