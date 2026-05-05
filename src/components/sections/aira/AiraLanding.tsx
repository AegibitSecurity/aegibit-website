"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Mic,
  Languages,
  ShieldCheck,
  Lock,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Brain,
  Workflow,
  Crown,
  Download,
  MonitorSmartphone,
  Building2,
  Check,
} from "lucide-react";

// ── Public download metadata ─────────────────────────────────────
// AiraSetup.exe is published as a GitHub Release asset on
// AegibitSecurity/aegibit-website. The /latest/download/{name} URL
// auto-redirects to whichever release is most recent, so this URL
// stays stable across version bumps as long as the asset filename
// remains "AiraSetup.exe".
const AIRA_DOWNLOAD_URL =
  "https://github.com/AegibitSecurity/aegibit-website/releases/latest/download/AiraSetup.exe";
const AIRA_VERSION = "v1.0.0";
const AIRA_PLATFORM = "Windows 10 / 11 (64-bit)";

/**
 * Aira — AEGIBIT's voice-first AI co-founder.
 *
 * Page strategy (premium conversion funnel):
 *   • Hero shows Aira's face + the one-line promise: "Your Voice. Built Into Execution."
 *   • Each section ends with a soft CTA back to the waitlist
 *   • Form posts to /api/leads with source = "aira_waitlist"
 *   • Reuses the proven VoiceCore page rhythm so design parity is automatic;
 *     copy is rewritten end-to-end for the executive-assistant positioning
 *
 * Color system locked to existing AEGIBIT-deploy tokens — no new palette.
 */

export function AiraLanding() {
  return (
    <div style={{ background: "#000" }}>
      <Hero />
      <Capabilities />
      <LanguagesSection />
      <UseCases />
      <Pricing />
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
      {/* Premium radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        {/* LEFT — copy block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(59,130,246,0.10)",
              border: "1px solid rgba(59,130,246,0.30)",
            }}
          >
            <Sparkles size={14} style={{ color: "#60A5FA" }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: "#60A5FA", letterSpacing: "0.2em" }}
            >
              An AEGIBIT Product · Early Access
            </span>
          </div>

          {/* Logo + name lockup */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                boxShadow:
                  "0 0 0 3px rgba(59,130,246,0.10), 0 0 30px rgba(59,130,246,0.40)",
              }}
            >
              <Sparkles size={26} style={{ color: "#fff" }} />
            </div>
            <span
              style={{
                color: "#fff",
                fontWeight: 300,
                fontSize: 32,
                letterSpacing: "-0.02em",
              }}
            >
              Aira
            </span>
          </div>

          <h1
            className="font-light leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
          >
            <span style={{ color: "#EAEAEA" }}>Your voice.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built into execution.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ color: "#A1A1AA" }}
          >
            Aira is your voice-first AI co-founder. She lives on your machine,
            answers in your language, and acts on your tools — opening apps,
            sending messages, scheduling reminders, drafting on demand. No
            keyboards. No tabs. No friction. Just say her name.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={AIRA_DOWNLOAD_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                color: "#fff",
                boxShadow:
                  "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)",
              }}
            >
              <Download size={18} />
              Download for Windows · Free
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              Reserve Aira Pro
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Micro-trust strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
            <TrustChip icon={MonitorSmartphone} label={AIRA_PLATFORM} />
            <TrustChip icon={ShieldCheck} label="Voice biometric" />
            <TrustChip icon={Languages} label="7 Indian languages" />
            <TrustChip icon={Lock} label="Local-first" />
          </div>
        </motion.div>

        {/* RIGHT — Aira portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mx-auto lg:mx-0"
          style={{ maxWidth: 460 }}
        >
          <div
            className="relative rounded-[28px] overflow-hidden"
            style={{
              border: "1px solid rgba(59,130,246,0.30)",
              boxShadow:
                "0 0 0 1px rgba(59,130,246,0.15), 0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.18)",
              background:
                "linear-gradient(180deg, rgba(59,130,246,0.10) 0%, rgba(0,0,0,0) 60%)",
            }}
          >
            <Image
              src="/aira/aira_face.png"
              alt="Aira — your voice-first AI co-founder"
              width={920}
              height={920}
              priority
              className="w-full h-auto block"
              style={{ display: "block" }}
            />
            {/* Bottom gradient veil for legibility on label */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: "40%",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <div>
                <div
                  className="text-[10px] uppercase font-semibold mb-1"
                  style={{ color: "#60A5FA", letterSpacing: "0.2em" }}
                >
                  Listening
                </div>
                <div className="text-sm font-medium" style={{ color: "#fff" }}>
                  &ldquo;Hello Aira.&rdquo;
                </div>
              </div>
              <PulseDot />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon size={14} style={{ color: "#60A5FA" }} />
      <span className="text-xs" style={{ color: "#A1A1AA" }}>
        {label}
      </span>
    </div>
  );
}

function PulseDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className="ping-green absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "#60A5FA" }}
      />
      <span
        className="relative inline-flex rounded-full h-3 w-3"
        style={{ background: "#60A5FA" }}
      />
    </span>
  );
}

// ── CAPABILITIES ──────────────────────────────────────────────────

const CAPABILITIES = [
  {
    Icon: Mic,
    title: "Always-on, never intrusive",
    body:
      "Wake her with your voice. She listens for her name, answers in 1.2 seconds, then quietly returns to standby. No tabs to open. No app to switch to. She's just there.",
    color: "#60A5FA",
  },
  {
    Icon: Brain,
    title: "Speaks the way you think",
    body:
      "Hindi, Bengali, English — auto-detected mid-sentence, replied in the same warm Indian voice. Aira doesn't translate. She thinks in your language.",
    color: "#A855F7",
  },
  {
    Icon: Workflow,
    title: "30+ executor verbs, today",
    body:
      "Open apps, draft emails, control windows, copy-paste, search files, dictate code, schedule reminders, drive your browser. Aira doesn't just answer — she acts.",
    color: "#10B981",
  },
  {
    Icon: ShieldCheck,
    title: "Your voice is your password",
    body:
      "Voice biometrics enrolled at setup. Sensitive actions require Boss-tier verification. Voice prints stored as one-way embeddings — even AEGIBIT can't reconstruct your voice.",
    color: "#F59E0B",
  },
];

function Capabilities() {
  return (
    <section
      id="capabilities"
      className="py-20 md:py-28 px-6 lg:px-12"
      style={{ background: "#000" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
          >
            What Aira does
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            An executive assistant that{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              actually executes.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-5"
            style={{ color: "#A1A1AA" }}
          >
            Other voice AIs answer questions. Aira opens the app, drafts the
            reply, and books the meeting — without you touching the keyboard.
          </p>
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
              <h3
                className="text-lg font-medium mb-3 leading-snug"
                style={{ color: "#fff" }}
              >
                {c.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#A1A1AA" }}
              >
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
  { name: "हिन्दी", en: "Hindi" },
  { name: "বাংলা", en: "Bengali" },
  { name: "தமிழ்", en: "Tamil" },
  { name: "తెలుగు", en: "Telugu" },
  { name: "मराठी", en: "Marathi" },
  { name: "ગુજરાતી", en: "Gujarati" },
  { name: "English", en: "English" },
];

function LanguagesSection() {
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
            7 languages. Native fluency.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
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
            Aira understands and replies in the warm Indian voice you actually
            recognise — Neerja, Swara, Tanishaa.
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
              <div
                className="text-xl font-medium mb-1"
                style={{ color: "#fff" }}
              >
                {l.name}
              </div>
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: "#60A5FA" }}
              >
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
    role: "Founder",
    quote:
      "\"Aira, draft a cold email to the Krishnagar dealership about the test drive\" — done in seconds, in your tone.",
  },
  {
    role: "Executive",
    quote:
      "\"Remind me in 20 minutes that I have a board call\" — Aira speaks the reminder back, in your language, when it's time.",
  },
  {
    role: "Operator",
    quote:
      "\"Open Excel, the latest expense file, and read me the top 5 anomalies\" — keyboard never touched.",
  },
  {
    role: "Creator",
    quote:
      "\"Translate this paragraph to Bengali and copy to clipboard\" — done before you finish the sentence.",
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
            What it sounds like in real life
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Real commands. Real outcomes.
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
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: "#E4E4E7" }}
                >
                  {u.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(59,130,246,0.40)",
            }}
          >
            Want this on your machine?
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── PRICING / TIERS ───────────────────────────────────────────────

interface Tier {
  name: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaIcon: React.ComponentType<{ size?: number }>;
  status?: { label: string; color: string };
  highlighted?: boolean;
  iconColor: string;
  ctaExternal?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Aira",
    price: "Free",
    priceSuffix: "forever",
    tagline: "The full desktop co-founder. Yours to keep.",
    features: [
      "Wake-word voice activation",
      "Voice biometric authentication",
      "7 Indian languages, native voice",
      "30+ executor verbs (apps, files, windows, browser)",
      "Local LLM (Ollama, included)",
      "Local memory + reminders",
      "100% local — no cloud, no account",
    ],
    ctaLabel: "Download for Windows",
    ctaHref: AIRA_DOWNLOAD_URL,
    ctaIcon: Download,
    ctaExternal: true,
    status: { label: `Available now · ${AIRA_VERSION}`, color: "#10B981" },
    iconColor: "#60A5FA",
  },
  {
    name: "Aira Pro",
    price: "Coming",
    priceSuffix: "Q3 2026",
    tagline: "Cloud brain, memory sync, integrations.",
    features: [
      "Everything in Aira (Free)",
      "Cloud brain — Claude / GPT routed for hard reasoning",
      "Aira Cloud Memory — sync across devices",
      "Native integrations (Gmail, Calendar, Slack, Notion)",
      "Companion mobile app for reminders on the go",
      "Priority support, founder channel access",
      "Permanent founder pricing on GA",
    ],
    ctaLabel: "Reserve my Aira Pro",
    ctaHref: "#waitlist",
    ctaIcon: Sparkles,
    status: { label: "Founder waitlist open", color: "#60A5FA" },
    highlighted: true,
    iconColor: "#60A5FA",
  },
  {
    name: "Aira Sovereign",
    price: "Custom",
    tagline: "For enterprises, BFSI & call centers.",
    features: [
      "Everything in Aira Pro",
      "India data residency (AWS Mumbai / Hyderabad)",
      "Multi-tenant deployment, dedicated infra",
      "SSO, audit logs, compliance reports",
      "Custom voice biometric models",
      "Bulk voice automation for call centers",
      "White-glove onboarding & SLAs",
    ],
    ctaLabel: "Talk to sales",
    ctaHref: "/contact?product=aira-sovereign",
    ctaIcon: Building2,
    status: { label: "Talk to founders", color: "#A855F7" },
    iconColor: "#A855F7",
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(59,130,246,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#60A5FA", letterSpacing: "0.3em" }}
          >
            Aira tiers
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            Free today.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Yours forever.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-5"
            style={{ color: "#A1A1AA" }}
          >
            Aira (Free) is the complete desktop co-founder — no signup, no
            account, no asterisk. Pro adds the cloud brain. Sovereign is for
            regulated industries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </div>

        {/* Reassurance line */}
        <p
          className="text-center text-xs mt-10 max-w-xl mx-auto"
          style={{ color: "#52525B" }}
        >
          The desktop version of Aira will remain free forever. Paid tiers add
          cloud, sync, integrations, and enterprise features — never paywall
          what already works on your machine.
        </p>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const Icon = tier.ctaIcon;
  const isExternal = tier.ctaExternal;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55 }}
      className="rounded-2xl p-7 md:p-8 flex flex-col"
      style={{
        background: tier.highlighted
          ? "linear-gradient(180deg, rgba(59,130,246,0.10) 0%, #0a0a0a 60%)"
          : "#0D0D0D",
        border: tier.highlighted
          ? "1px solid rgba(59,130,246,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: tier.highlighted
          ? "0 0 0 1px rgba(59,130,246,0.15), 0 30px 60px rgba(0,0,0,0.4), 0 0 60px rgba(59,130,246,0.10)"
          : "none",
        minHeight: 480,
      }}
    >
      {/* Status pill */}
      {tier.status && (
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full self-start mb-5"
          style={{
            background: `${tier.status.color}15`,
            border: `1px solid ${tier.status.color}30`,
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="ping-green absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: tier.status.color }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: tier.status.color }}
            />
          </span>
          <span
            className="text-[10px] uppercase font-bold"
            style={{ color: tier.status.color, letterSpacing: "0.12em" }}
          >
            {tier.status.label}
          </span>
        </div>
      )}

      {/* Name + price */}
      <h3
        className="text-2xl font-light mb-1"
        style={{ color: "#fff", letterSpacing: "-0.01em" }}
      >
        {tier.name}
      </h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className="text-3xl font-light"
          style={{
            background: tier.highlighted
              ? "linear-gradient(135deg, #fff 0%, #60A5FA 100%)"
              : "none",
            WebkitBackgroundClip: tier.highlighted ? "text" : "unset",
            WebkitTextFillColor: tier.highlighted ? "transparent" : "#fff",
            backgroundClip: tier.highlighted ? "text" : "unset",
            color: tier.highlighted ? undefined : "#fff",
          }}
        >
          {tier.price}
        </span>
        {tier.priceSuffix && (
          <span className="text-sm" style={{ color: "#71717A" }}>
            {tier.priceSuffix}
          </span>
        )}
      </div>
      <p className="text-sm mb-6" style={{ color: "#A1A1AA" }}>
        {tier.tagline}
      </p>

      {/* Features */}
      <ul className="space-y-2.5 flex-1 mb-7">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check
              size={16}
              style={{
                color: tier.iconColor,
                flexShrink: 0,
                marginTop: 2,
              }}
              strokeWidth={2.4}
            />
            <span className="text-sm leading-relaxed" style={{ color: "#E4E4E7" }}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isExternal ? (
        <a
          href={tier.ctaHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{
            background: tier.highlighted
              ? "linear-gradient(135deg, #3B82F6, #1D4ED8)"
              : "rgba(59,130,246,0.10)",
            color: "#fff",
            border: tier.highlighted
              ? "none"
              : "1px solid rgba(59,130,246,0.30)",
            boxShadow: tier.highlighted
              ? "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)"
              : "none",
          }}
        >
          <Icon size={16} />
          {tier.ctaLabel}
        </a>
      ) : (
        <Link
          href={tier.ctaHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{
            background: tier.highlighted
              ? "linear-gradient(135deg, #3B82F6, #1D4ED8)"
              : "rgba(59,130,246,0.10)",
            color: "#fff",
            border: tier.highlighted
              ? "none"
              : "1px solid rgba(59,130,246,0.30)",
            boxShadow: tier.highlighted
              ? "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)"
              : "none",
          }}
        >
          <Icon size={16} />
          {tier.ctaLabel}
        </Link>
      )}
    </motion.div>
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
          source: "aira_waitlist",
          page: "/products/aira",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
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
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(59,130,246,0.10)",
              border: "1px solid rgba(59,130,246,0.30)",
            }}
          >
            <Crown size={12} style={{ color: "#60A5FA" }} />
            <span
              className="text-[10px] uppercase font-medium"
              style={{ color: "#60A5FA", letterSpacing: "0.2em" }}
            >
              Founder-tier pilot — limited seats
            </span>
          </div>
          <h2
            className="font-light leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Reserve your seat with Aira.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
            We&apos;re onboarding the first 100 founders, executives, and
            operators. You get a 6-month free pilot of Aira Pro, founder
            access, and a permanent discount on GA pricing.
          </p>
        </div>

        <div
          className="rounded-2xl p-7 md:p-9"
          style={{
            background: "linear-gradient(180deg, #0D0D0D 0%, #060606 100%)",
            border: "1px solid rgba(59,130,246,0.20)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.08)",
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
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: 1,
                    height: 1,
                    opacity: 0,
                  }}
                />

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Full name" required>
                    <Input
                      value={name}
                      onChange={setName}
                      placeholder="Aarav Sharma"
                    />
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
                  <Input
                    value={company}
                    onChange={setCompany}
                    placeholder="Your company"
                  />
                </Field>

                <div className="mt-4">
                  <Field label="What would you put Aira to work on first?">
                    <textarea
                      value={usecase}
                      onChange={(e) => setUsecase(e.target.value)}
                      placeholder="e.g. Voice-drafting emails in Hindi, hands-free reminders during commute, controlling my workstation while presenting…"
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
                    boxShadow:
                      "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)",
                  }}
                >
                  {submitting ? "Securing your seat…" : "Reserve my Aira"}
                  {!submitting && <ArrowRight size={18} />}
                </button>
                <p
                  className="text-[11px] mt-4 text-center"
                  style={{ color: "#52525B" }}
                >
                  We&apos;ll email when your invite is ready. No spam, ever.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), rgba(59,130,246,0.05))",
                    border: "2px solid rgba(59,130,246,0.4)",
                  }}
                >
                  <CheckCircle2
                    size={40}
                    style={{ color: "#60A5FA" }}
                    strokeWidth={2.5}
                  />
                </motion.div>
                <h2
                  className="text-2xl font-light mb-3"
                  style={{ color: "#fff" }}
                >
                  Aira is on the way.
                </h2>
                <p
                  className="text-base leading-relaxed max-w-sm mx-auto"
                  style={{ color: "#A1A1AA" }}
                >
                  We&apos;ll reach out the moment your invite is ready. A
                  confirmation email is already in your inbox.
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
    q: "How do I get Aira on my machine?",
    a: "Download the free Windows installer from this page — Aira (Free) is the full desktop co-founder, ready to use today on Windows 10 or 11 (64-bit). No signup, no account, no asterisk. Aira Pro (cloud brain + sync + integrations) opens in Q3 2026; founder-tier waitlist is open below for early access plus a permanent discount on Pro pricing.",
  },
  {
    q: "What does Aira run on? Is it cloud or local?",
    a: "Aira is local-first. Voice recognition, biometric auth, the wake word, and the executor all run on your machine. No audio is sent to the cloud during normal use. Aira Pro adds an optional cloud brain for harder reasoning, gated behind your account — your call.",
  },
  {
    q: "Does Aira work in Hindi and Bengali, or just English?",
    a: "Aira understands and replies in Hindi, Bengali, English, Tamil, Telugu, Marathi, and Gujarati — auto-detected mid-conversation. The voice itself is the warm Indian female voice (Neerja / Swara / Tanishaa) most users actually recognise. No robotic American voice.",
  },
  {
    q: "How is voice biometric authentication secured?",
    a: "At enrollment, your voice is converted to a one-way mathematical embedding. The audio is discarded; only the embedding is stored, locally. Even AEGIBIT cannot reconstruct your voice. Sensitive actions (payments, deletions, system commands) require your voice match — no one else's voice can act on your behalf.",
  },
  {
    q: "How does Aira fit into AEGIBIT's other products?",
    a: "Aira is the voice layer of the AEGIBIT operating system. Today she runs on your desktop. Soon she'll voice-approve PayMint vouchers, drive Industry OS workflows, and surface insights from every AEGIBIT product you use. One voice. Every tool.",
  },
];

function FAQ() {
  return (
    <section
      className="py-20 md:py-28 px-6 lg:px-12"
      style={{ background: "#000" }}
    >
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
          Everything founders ask before saying yes.
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
                <span className="text-base font-medium leading-snug">
                  {f.q}
                </span>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 transition-transform group-open:rotate-90"
                  style={{ color: "#60A5FA" }}
                />
              </summary>
              <div className="px-5 pb-5">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#A1A1AA" }}
                >
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Final CTA */}
        <div
          className="mt-14 rounded-2xl p-8 md:p-10 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(59,130,246,0.10) 0%, #0a0a0a 100%)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Clock
            size={20}
            style={{ color: "#60A5FA", margin: "0 auto 12px" }}
          />
          <h3
            className="font-light mb-3"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              color: "#fff",
            }}
          >
            Founder seats fill quietly.
          </h3>
          <p
            className="text-sm leading-relaxed mb-6 max-w-md mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            Reserve yours before the next batch closes. 60 seconds.
          </p>
          <Link
            href="#waitlist"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              color: "#fff",
              boxShadow:
                "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.25)",
            }}
          >
            Reserve my Aira
            <ArrowRight size={16} />
          </Link>
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
