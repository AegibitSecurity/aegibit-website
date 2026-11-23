"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useVisitorStore } from "@/stores/visitor-store";
import { isValidEmail } from "@/lib/validators";
import { hasAnalyticsConsent } from "@/lib/consent";
import { track } from "@/lib/track";

interface FormData {
  email: string;
  name: string;
  company: string;
  teamSize: string;
  message: string;
}

const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

interface Props {
  source?: string;
  onSuccess?: () => void;
}

export function MultiStepForm({ source = "contact", onSuccess }: Props) {
  const [step, setStep]     = useState(1);
  const [dir, setDir]       = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [submitError, setSubmitError] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const submitting = useRef(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [data, setData]     = useState<FormData>({
    email: "", name: "", company: "", teamSize: "", message: "",
  });

  const setStartedForm  = useVisitorStore((s) => s.setStartedForm);
  const setSubmittedForm = useVisitorStore((s) => s.setSubmittedForm);
  const recalculate     = useVisitorStore((s) => s.recalculateScore);
  const visitorId       = useVisitorStore((s) => s.visitorId);
  const focusFired      = useRef(false);

  useEffect(() => { track("contact_step_view", { source, step }); }, [source, step]);

  function set(field: keyof FormData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setStartedForm();
    recalculate();
    // Fire form_focus exactly once per form-instance, first user
    // touch is the funnel "engagement" signal. Subsequent fields
    // are noise for funnel math.
    if (!focusFired.current) {
      focusFired.current = true;
      track("form_focus", { source, field });
    }
  }

  function validateStep(): boolean {
    const errs: Partial<FormData> = {};
    if (step === 1 && !isValidEmail(data.email.trim())) errs.email = "Enter a valid email";
    if (step === 2 && !data.name.trim()) errs.name = "Name is required";
    if (Object.keys(errs).length) { setErrors(errs); track("contact_validation_error", { source, step, fields: Object.keys(errs) }); return false; }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setDir(1);
    setStep((s) => s + 1);
  }

  function back() {
    setDir(-1);
    setStep((s) => s - 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current || !validateStep()) return;
    submitting.current = true;
    setSubmitError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: data.email.trim(),
          source,
          page: window.location.pathname,
          visitorId: hasAnalyticsConsent() ? visitorId ?? undefined : undefined,
        }),
      });
      if (!res.ok) throw new Error(res.status === 429 ? "Please wait a moment before trying again." : "Your request could not be saved. Please retry or email contact@aegibit.com.");
      const result = await res.json();
      if (result.ok !== true) throw new Error("Your request could not be confirmed. Please retry or email contact@aegibit.com.");
      setDuplicate(result.duplicate === true);
      setStatus("success");
      setSubmittedForm();
      recalculate();
      if (!result.duplicate) track("form_submit", {
        source,
        team_size: data.teamSize || undefined,
        had_company: Boolean(data.company.trim()),
        had_message: Boolean(data.message.trim()),
      });
      onSuccess?.();
    } catch (error) {
      setStatus("idle");
      setSubmitError(error instanceof Error ? error.message : "Please retry or email contact@aegibit.com.");
      track("contact_submit_error", { source, category: "request_failed" });
    } finally { submitting.current = false; }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status" aria-live="polite"
        className="text-center py-10 space-y-4"
      >
        <CheckCircle2 className="w-12 h-12 text-[#F97316] mx-auto" />
        <p className="text-white font-bold text-xl tracking-tight">{duplicate ? "Your earlier request is already recorded." : "Your request has been received."}</p>
        <p className="text-[#A1A1AA] text-sm">{duplicate ? "To update it, email contact@aegibit.com." : "Thank you. The AEGIBIT team will review your enquiry."}</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-[#F97316]" : "bg-[rgba(255,255,255,0.08)]"}`} />
            <span className={`mono-label flex-shrink-0 transition-colors ${s === step ? "text-[#F97316]" : s < step ? "text-[#EA580C]" : "text-[#A1A1AA]"}`}>
              {s}/{3}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={step === 3 ? submit : (e) => { e.preventDefault(); next(); }}>
        <AnimatePresence mode="wait" custom={dir}>
          {step === 1 && (
            <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}>
              <p className="mono-label text-[#A1A1AA] mb-2">Step 1 of 3</p>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">What&apos;s your work email?</h2>
              <div className="space-y-1.5">
                <input
                  aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} aria-label="Work email" autoComplete="email" maxLength={200} type="email" value={data.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="you@company.com" autoFocus
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#A1A1AA] focus:border-[rgba(249,115,22,0.5)] rounded-md px-4 py-3 text-base outline-none transition-colors"
                />
                {errors.email && <p id="contact-email-error" role="alert" className="text-[#FCA5A5] text-xs">{errors.email}</p>}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}>
              <p className="mono-label text-[#A1A1AA] mb-2">Step 2 of 3</p>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Tell us about yourself.</h2>
              <div className="space-y-3">
                <div>
                  <input
                    aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} aria-label="Your name" autoComplete="name" maxLength={100} type="text" value={data.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name" autoFocus
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#A1A1AA] focus:border-[rgba(249,115,22,0.5)] rounded-md px-4 py-3 text-base outline-none transition-colors"
                  />
                  {errors.name && <p id="contact-name-error" role="alert" className="text-[#FCA5A5] text-xs mt-1">{errors.name}</p>}
                </div>
                <input
                  aria-label="Company name" autoComplete="organization" maxLength={100} type="text" value={data.company} onChange={(e) => set("company", e.target.value)}
                  placeholder="Company name"
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#A1A1AA] focus:border-[rgba(249,115,22,0.5)] rounded-md px-4 py-3 text-base outline-none transition-colors"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}>
              <p className="mono-label text-[#A1A1AA] mb-2">Step 3 of 3</p>
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Last step, almost there.</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[#A1A1AA] text-xs mb-2">Team size</p>
                  <div className="flex flex-wrap gap-2">
                    {TEAM_SIZES.map((size) => (
                      <button key={size} type="button" aria-pressed={data.teamSize === size} onClick={() => set("teamSize", size)}
                        className={`min-h-11 px-4 py-2 rounded-md text-sm border transition-colors ${data.teamSize === size ? "bg-[#F97316] border-[#F97316] text-black" : "border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:border-[rgba(255,255,255,0.2)]"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea aria-label="What are you trying to solve?" maxLength={2000}
                  value={data.message} onChange={(e) => set("message", e.target.value)}
                  placeholder="What are you trying to solve? (optional)" rows={3}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#A1A1AA] focus:border-[rgba(249,115,22,0.5)] rounded-md px-4 py-3 text-base outline-none transition-colors resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitError ? <p role="alert" className="text-red-300 text-sm mt-4">{submitError}</p> : null}
        {/* Nav buttons */}
        <div className={`flex gap-3 mt-6 ${step > 1 ? "justify-between" : "justify-end"}`}>
          {step > 1 && (
            <button type="button" disabled={status === "loading"} onClick={back}
              className="text-sm text-[#A1A1AA] hover:text-[#A1A1AA] transition-colors px-4 py-2">
              ← Back
            </button>
          )}
          <button
            type="submit" disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#FB923C] text-black font-semibold px-6 py-2.5 rounded-md text-sm transition-colors disabled:opacity-60"
          >
            {status === "loading" ? (
              <><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /><span>Sending…</span></>
            ) : step < 3 ? (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Submit <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
