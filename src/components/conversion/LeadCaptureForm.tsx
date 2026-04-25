"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface LeadCaptureFormProps {
  source?: string;
  placeholder?: string;
  cta?: string;
  compact?: boolean;
}

export function LeadCaptureForm({
  source = "waitlist",
  placeholder = "Enter your work email",
  cta = "Join Waitlist — Free",
  compact = false,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
          </motion.div>
          <p className="text-[#F9FAFB] font-semibold">You&apos;re on the list!</p>
          <p className="text-[#6B7280] text-sm text-center">We&apos;ll reach out when your early access slot opens.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className={compact ? "flex gap-2" : "flex flex-col sm:flex-row gap-3"}
        >
          <div className="flex-1">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="bg-[rgba(4,8,16,0.8)] border-[rgba(37,99,235,0.25)] text-[#F9FAFB] placeholder:text-[#374151] focus:border-[#2563EB] h-12 rounded-xl"
              disabled={status === "loading"}
            />
            {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold h-12 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] whitespace-nowrap"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
