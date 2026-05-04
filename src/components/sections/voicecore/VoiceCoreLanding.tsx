"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Sparkles,
  ShieldCheck,
  Languages,
  Volume2,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/**
 * VoiceCore — second AEGIBIT product, currently in early access.
 *
 * Page strategy:
 *   • Position VoiceCore as "voice-first business operations" — a
 *     distinct product from PayMint with its own use case
 *   • Capture early-access waitlist signups via inline form using
 *     existing /api/leads infrastructure (source = voicecore_waitlist)
 *   • Reinforce AEGIBIT-platform narrative — VoiceCore + PayMint +
 *     Aira AI all in one operating-system vision
 */

export function VoiceCoreLanding() {
  return (
    <div style={{ background: "#000" }}>
      <Hero />
      <Capabilities />
      <Languages_ />
      <UseCases />
      <Waitlist />
      <FAQ />
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative pt-32 pb-16 px-6 lg:px-12 overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: "rgba(59,130,246,0.10)",
            border: "1px solid rgba(59,130,246,0.30)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="ping-green absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#60A5FA" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "#60A5FA" }}
            />
          </span>
          <span
            className="text-[11px] uppercase font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.2em" }}
          >
            Early Access · Design Partners Onboarding
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              boxShadow: "0 0 0 3px rgba(59,130,246,0.10), 0 0 30px rgba(59,130,246,0.40)",
            }}
          >
            <Mic size={26} style={{ color: "#fff" }} />
          </div>
          <div className="flex items-baseline">
            <span style={{ color: "#fff", fontWeight: 300, fontSize: 32, letterSpacing: "-0.02em" }}>
              Voice
            </span>
            <span style={{ color: "#60A5FA", fontWeight: 300, fontSize: 32, letterSpacing: "-0.02em" }}>
              Core
            </span>
          </div>
        </div>

        <h1
          className="font-light leading-[1.05] tracking-tight mb-6 mx-auto max-w-4xl"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
        >
          <span style={{ color: "#EAEAEA" }}>Run your business</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            by speaking to it.
          </span>
        </h1>

        <p
          className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
          style={{ color: "#A1A1AA" }}
        >
          VoiceCore is AEGIBIT&apos;s voice-first operations platform. Approve
          vouchers, query reports, dispatch tasks, audit access — all by
          speaking, in Hindi, Bengali, English, or any major Indian language.
          Biometric voice authentication. Built by a cybersecurity company.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              color: "#fff",
              boxShadow:
                "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)",
            }}
          >
            <Sparkles size={18} />
            Get Early Access
          </a>
          <Link
            href="/products/paymint"
            className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300"
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            See PayMint (live now)
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── CAPABILITIES ──────────────────────────────────────────────────

const CAPABILITIES = [
  {
    Icon: Mic,
    title: "Natural-language commands",
    body:
      "Speak the way you think. \"Show me last week's fuel spend by branch.\" \"Approve the Krishnagar workshop voucher for ₹14,250.\" VoiceCore parses intent, not syntax.",
    color: "#60A5FA",
  },
  {
    Icon: Lock,
    title: "Biometric voice authentication",
    body:
      "Your voice is your password. Voice prints are stored as one-way embeddings — even AEGIBIT can't reconstruct your voice. Action approval requires the right voice, every time.",
    color: "#A855F7",
  },
  {
    Icon: Languages,
    title: "Multi-language by design",
    body:
      "Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, English. Branch managers in Krishnagar speak Bengali; head office in Mumbai speaks Hindi; VoiceCore handles both fluently.",
    color: "#10B981",
  },
  {
    Icon: ShieldCheck,
    title: "Audit-grade voice logs",
    body:
      "Every voice command is recorded, timestamped, and tied to an authenticated voice biometric. Forensics-ready audit trail for the actions you take by voice.",
    color: "#F59E0B",
  },
];

function Capabilities() {
  return (
    <section className="py-20 md:py-28 px-6 lg:px-12" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
          >
            What VoiceCore does
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            Operations at the speed of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              speech.
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {CAPABILITIES.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-7"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `${c.color}15`,
                  border: `1px solid ${c.color}30`,
                }}
              >
                <c.Icon size={20} style={{ color: c.color }} strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-medium mb-3 leading-snug" style={{ color: "#fff" }}>
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LANGUAGES ─────────────────────────────────────────────────────

const LANGS = [
  { name: "हिन्दी",   en: "Hindi",    samples: 60_000_000 },
  { name: "বাংলা",     en: "Bengali",  samples: 30_000_000 },
  { name: "தமிழ்",     en: "Tamil",    samples: 25_000_000 },
  { name: "తెలుగు",   en: "Telugu",   samples: 22_000_000 },
  { name: "मराठी",    en: "Marathi",  samples: 22_000_000 },
  { name: "ગુજરાતી",  en: "Gujarati", samples: 18_000_000 },
  { name: "English",  en: "English",  samples: 50_000_000 },
];

function Languages_() {
  return (
    <section
      className="py-20 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: "rgba(59,130,246,0.05)",
          filter: "blur(150px)",
          borderRadius: "50%",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
          >
            India-first, by design
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            7 languages. Real fluency.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              No translation tax.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-4"
            style={{ color: "#A1A1AA" }}
          >
            Most voice AI is English-first with Indian languages bolted on.
            VoiceCore is trained natively on Indian-language operational
            commands. Branch staff speak the way they actually speak.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {LANGS.map((l) => (
            <div
              key={l.en}
              className="rounded-xl p-4 text-center"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-xl font-medium mb-1" style={{ color: "#fff" }}>
                {l.name}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "#60A5FA" }}>
                {l.en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── USE CASES ─────────────────────────────────────────────────────

const USECASES = [
  {
    role: "CFO",
    quote:
      "\"Show me total fuel spend across all branches this week.\" Real-time answer in 2 seconds.",
  },
  {
    role: "Branch Manager",
    quote:
      "\"Approve workshop voucher 0042.\" Voice biometric checks identity, action logged, done.",
  },
  {
    role: "Service GM",
    quote:
      "\"List pending vouchers above ₹10,000 for Krishnagar branch.\" Triaged in seconds.",
  },
  {
    role: "Founder",
    quote:
      "\"Compare petty cash discipline across branches over the last 6 months.\" Visualised live.",
  },
];

function UseCases() {
  return (
    <section className="py-20 px-6 lg:px-12" style={{ background: "#000" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
          >
            What it sounds like in production
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Real commands. Real ops.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {USECASES.map((u, i) => (
            <div
              key={i}
              className="rounded-xl p-5 flex items-start gap-4"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(59,130,246,0.10)",
                  border: "1px solid rgba(59,130,246,0.20)",
                }}
              >
                <Volume2 size={16} style={{ color: "#60A5FA" }} />
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-wider mb-1.5 font-semibold"
                  style={{ color: "#60A5FA" }}
                >
                  {u.role}
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: "#E4E4E7" }}>
                  {u.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WAITLIST FORM ─────────────────────────────────────────────────

function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [usecase, setUsecase] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (website) {
      setSubmitted(true);
      return;
    }
    if (!name || !email) {
      setError("Please enter your name and work email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim() || undefined,
          message: usecase ? `Use case: ${usecase}` : undefined,
          source: "voicecore_waitlist",
          page: "/products/voicecore",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="waitlist"
      className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 600,
          background: "rgba(59,130,246,0.08)",
          filter: "blur(160px)",
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="font-light leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Join the early access list.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
            We&apos;re onboarding design partners now. Early access includes a
            6-month free pilot and direct line to the founders.
          </p>
        </div>

        <div
          className="rounded-2xl p-7 md:p-9"
          style={{
            background: "linear-gradient(180deg, #0D0D0D 0%, #060606 100%)",
            border: "1px solid rgba(59,130,246,0.20)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.08)",
          }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                noValidate
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Full name" required>
                    <Input value={name} onChange={setName} placeholder="Aarav Sharma" />
                  </Field>
                  <Field label="Work email" required>
                    <Input
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="aarav@yourcompany.com"
                    />
                  </Field>
                </div>

                <Field label="Company">
                  <Input value={company} onChange={setCompany} placeholder="Your company" />
                </Field>

                <div className="mt-4">
                  <Field label="What would you use VoiceCore for?">
                    <textarea
                      value={usecase}
                      onChange={(e) => setUsecase(e.target.value)}
                      placeholder="e.g. Approve vouchers on the go in Hindi, query reports during meetings, voice-auth biometric for sensitive ops..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        fontSize: 14,
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </Field>
                </div>

                {error && (
                  <div
                    className="mt-4 rounded-lg p-3 text-sm"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#FCA5A5",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                    color: "#fff",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)",
                  }}
                >
                  {submitting ? "Securing your spot…" : "Reserve early access"}
                  {!submitting && <ArrowRight size={18} />}
                </button>
                <p className="text-[11px] mt-4 text-center" style={{ color: "#52525B" }}>
                  We&apos;ll email when your invite is ready. No spam, ever.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), rgba(59,130,246,0.05))",
                    border: "2px solid rgba(59,130,246,0.4)",
                  }}
                >
                  <CheckCircle2 size={40} style={{ color: "#60A5FA" }} strokeWidth={2.5} />
                </motion.div>
                <h2 className="text-2xl font-light mb-3" style={{ color: "#fff" }}>
                  You&apos;re on the list.
                </h2>
                <p className="text-base leading-relaxed max-w-sm mx-auto" style={{ color: "#A1A1AA" }}>
                  We&apos;ll reach out the moment your invite is ready. Confirmation
                  email already sent.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "When will VoiceCore be generally available?",
    a: "Early-access design partners are onboarding now (Q2 2026). General availability targeted for late 2026. Early-access partners get a 6-month free pilot, direct founder access, and a permanent discount on GA pricing.",
  },
  {
    q: "How does voice biometric authentication work?",
    a: "Your voice is converted to a one-way embedding (mathematical fingerprint) at enrollment. The original audio is discarded; we store only the embedding. Subsequent commands are matched against the embedding with sub-2-second latency. Even AEGIBIT cannot reconstruct your voice from the stored data — it's mathematically irreversible.",
  },
  {
    q: "Will VoiceCore work in noisy branch environments (workshops, showrooms)?",
    a: "Yes. We've trained the speech recognition model specifically on Indian operational environments — workshop background noise, showroom customer chatter, vehicle ambient sound. Wake-word activation prevents accidental triggers; biometric auth prevents unauthorized voices from acting on your behalf.",
  },
  {
    q: "Is my voice data sent to a third-party API like ChatGPT?",
    a: "No. VoiceCore runs on AEGIBIT's own infrastructure with India data residency. We don't send raw audio to external APIs. The voice biometric layer is fully on-device for the matching step. We're cybersecurity-first by design.",
  },
  {
    q: "Does VoiceCore integrate with PayMint?",
    a: "Yes — that's the design intent. Voice approve PayMint vouchers, voice-query expense reports, voice-trigger Tally exports. PayMint customers get integrated VoiceCore at GA. Standalone VoiceCore (without PayMint) is also planned.",
  },
];

function FAQ() {
  return (
    <section className="py-20 md:py-28 px-6 lg:px-12" style={{ background: "#000" }}>
      <div className="max-w-3xl mx-auto">
        <p
          className="text-[11px] uppercase mb-4 font-medium"
          style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
        >
          FAQ
        </p>
        <h2
          className="font-light leading-tight mb-12"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
        >
          What evaluators ask.
        </h2>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <summary
                className="cursor-pointer list-none p-5 flex items-center justify-between gap-4"
                style={{ color: "#fff" }}
              >
                <span className="text-base font-medium leading-snug">{f.q}</span>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 transition-transform group-open:rotate-90"
                  style={{ color: "#60A5FA" }}
                />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Form atoms ────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="flex items-center gap-1.5 text-[12px] font-medium mb-1.5"
        style={{ color: "#A1A1AA" }}
      >
        {label}
        {required && <span style={{ color: "#60A5FA" }}>*</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "11px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
    />
  );
}
