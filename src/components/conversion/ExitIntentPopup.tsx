"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    if (dismissed) return;
    if (sessionStorage.getItem("exit_intent_shown")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 10) {
        setShow(true);
        sessionStorage.setItem("exit_intent_shown", "1");
      }
    }
    const t = setTimeout(() => document.addEventListener("mouseleave", handleMouseLeave), 10000);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", handleMouseLeave); };
  }, [dismissed]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent", page: window.location.pathname }),
      });
      setStatus("success");
    } catch { setStatus("idle"); }
  }

  function dismiss() { setShow(false); setDismissed(true); }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md bg-[#111111] rounded-lg border border-[rgba(255,255,255,0.1)] p-8">
              <button onClick={dismiss} className="absolute top-4 right-4 text-[#52525B] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              {status === "success" ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#FF6A00] mx-auto" />
                  <p className="text-white font-bold text-lg">Access requested.</p>
                  <p className="text-[#A1A1AA] text-sm">We&apos;ll be in touch shortly.</p>
                </div>
              ) : (
                <>
                  <p className="mono-label text-[#FF6A00] mb-4">Before you go</p>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    Request private access.
                  </h3>
                  <p className="text-[#A1A1AA] text-sm mb-6 leading-relaxed">
                    AEGIBIT operates on a private access model. Leave your email and we&apos;ll reach out within 24 hours.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com" required
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#52525B] focus:border-[rgba(255,106,0,0.5)] rounded-md px-4 py-3 text-sm outline-none transition-colors"
                    />
                    <button
                      type="submit" disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold py-3 rounded-md text-sm transition-colors"
                    >
                      {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Request Access <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
