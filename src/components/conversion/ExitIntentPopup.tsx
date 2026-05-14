"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useVisitorStore } from "@/stores/visitor-store";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const score = useVisitorStore((s) => s.behaviorScore);

  useEffect(() => {
    if (dismissed) return;
    if (sessionStorage.getItem("aegibit_exit_shown")) return;
    // Desktop only + score > 40
    if (window.innerWidth < 768) return;
    if (score < 50) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 10) {
        setShow(true);
        sessionStorage.setItem("aegibit_exit_shown", "1");
      }
    }
    const t = setTimeout(() => document.addEventListener("mouseleave", handleMouseLeave), 10000);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", handleMouseLeave); };
  }, [dismissed, score]);

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
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-md bg-[rgba(17,17,17,0.85)] backdrop-blur-xl rounded-lg border border-[rgba(255,255,255,0.1)] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
              <button onClick={dismiss} className="absolute top-4 right-4 text-[#52525B] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              {status === "success" ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#F97316] mx-auto" />
                  <p className="text-white font-bold text-lg">Access requested.</p>
                  <p className="text-[#A1A1AA] text-sm">We&apos;ll be in touch shortly.</p>
                </div>
              ) : (
                <>
                  <p className="mono-label text-[#F97316] mb-4">Before you go</p>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight leading-snug">
                    See PayMint live in 12 minutes.
                  </h3>
                  <p className="text-[#A1A1AA] text-sm mb-6 leading-relaxed">
                    Drop your work email and the AEGIBIT team will send a 4-minute walkthrough plus two demo slot options. No spam, no credit card.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com" required
                      className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white placeholder:text-[#52525B] focus:border-[rgba(249,115,22,0.5)] rounded-md px-4 py-3 text-sm outline-none transition-colors"
                    />
                    <button
                      type="submit" disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-md text-sm transition-colors"
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
