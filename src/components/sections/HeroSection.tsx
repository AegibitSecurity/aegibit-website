"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* Subtle grid background — pure CSS, no Three.js */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(255,106,0,0.05)] blur-[100px]" />
      {/* Orange accent lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-[#FF6A00] to-transparent opacity-30" />
    </div>
  );
}

/* Shield mark — abstract, inspired by logo */
function ShieldMark() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="float-slow absolute right-[8%] top-1/2 -translate-y-1/2 hidden xl:block"
    >
      <svg width="240" height="280" viewBox="0 0 120 140" fill="none" opacity="0.18">
        <path
          d="M60 4L8 26V68C8 96 30 120 60 128C90 120 112 96 112 68V26L60 4Z"
          stroke="#FF6A00"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M60 20L22 36V68C22 88 38 106 60 112C82 106 98 88 98 68V36L60 20Z"
          fill="rgba(255,106,0,0.06)"
          stroke="#FF6A00"
          strokeWidth="0.8"
        />
        <path
          d="M60 44V84M44 64H76"
          stroke="#FF6A00"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  );
}

const ease = "easeOut" as const;

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      <GridBackground />
      <ShieldMark />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 text-center">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <span className="mono-label text-[#FF6A00] tracking-widest">
            AI · Cybersecurity · Automation
          </span>
        </motion.div>

        {/* Wordmark headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="text-[clamp(5rem,15vw,11rem)] font-bold tracking-[-0.04em] leading-[0.9] text-white mb-6"
          style={{ fontFamily: "var(--font-sora, sans-serif)" }}
        >
          AEGIBIT
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="text-[clamp(1.1rem,2.5vw,1.6rem)] text-[#A1A1AA] font-light tracking-wide mb-4"
        >
          Securing Tomorrow. Today.
        </motion.p>

        {/* Supporting */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease }}
          className="text-[#52525B] text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Built for companies that cannot afford failure.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold px-7 py-3.5 rounded-md text-sm transition-colors"
          >
            Get Private Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] px-7 py-3.5 rounded-md text-sm transition-all"
          >
            Book a Demo
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.15)] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
