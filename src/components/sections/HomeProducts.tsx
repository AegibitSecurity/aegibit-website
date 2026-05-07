"use client";

import { TrackedLink } from "@/components/shared/TrackedLink";
import {
  Wallet,
  Mic,
  Sparkles,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";

/**
 * HomeProducts — AEGIBIT product showcase.
 *
 * The homepage section directly under the hero. Communicates that AEGIBIT
 * is a multi-product company building an industry OS, not a single tool.
 *
 * Product status badges:
 *   • LIVE        — In production, paying customers
 *   • EARLY ACCESS — Buildable, design-partner-only
 *   • EMBEDDED    — Layered across all products (Aira AI)
 *   • COMING 2026 — On the roadmap, not yet code
 *
 * Each card has its own CTA so visitors with different intent (PayMint
 * buyer vs VoiceCore early-adopter vs general AEGIBIT prospect) all
 * find a meaningful next step from this single section.
 */

type ProductStatus =
  | "LIVE"
  | "EARLY ACCESS"
  | "EMBEDDED"
  | "COMING 2026"
  | "FREE · WINDOWS";

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: ProductStatus;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconColor: string;
  href: string;
  ctaLabel: string;
  highlighted?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "paymint",
    name: "PayMint",
    tagline: "Multi-branch expense automation.",
    description:
      "Real-time vouchers, role-based approvals, audit-grade logs, Tally-ready exports. Live with Nibir Motors across 7 branches in West Bengal.",
    status: "LIVE",
    icon: Wallet,
    iconColor: "#F97316",
    href: "/products/paymint",
    ctaLabel: "Explore PayMint",
    highlighted: true,
  },
  {
    id: "aira",
    name: "Aira",
    tagline: "Your voice. Built into execution.",
    description:
      "Voice-first AI co-founder by AEGIBIT. Free desktop download for Windows — wake her with your voice and she opens apps, drafts messages, schedules reminders, and acts on your tools. Hindi, Bengali, English. Voice biometric. Local-first.",
    status: "FREE · WINDOWS",
    icon: Mic,
    iconColor: "#60A5FA",
    href: "/products/aira",
    ctaLabel: "Download Aira free",
  },
  {
    id: "aira-inside",
    name: "Aira Inside",
    tagline: "AI co-founder, in every AEGIBIT product.",
    description:
      "Anomaly detection, cash-flow forecasting, natural-language queries — Aira lives inside PayMint, the upcoming Industry OS suite, and every future AEGIBIT product. Smarter with every customer.",
    status: "EMBEDDED",
    icon: Sparkles,
    iconColor: "#A855F7",
    href: "/products/paymint",
    ctaLabel: "See Aira inside PayMint",
  },
  {
    id: "industry-os",
    name: "Industry OS",
    tagline: "The full operational suite.",
    description:
      "DealerCRM. ServiceOps. InventoryIQ. AegiPay. The complete AEGIBIT platform for dealerships and multi-branch SMEs — shipping over 2026-27.",
    status: "COMING 2026",
    icon: Layers,
    iconColor: "#10B981",
    href: "/contact?topic=roadmap",
    ctaLabel: "View Roadmap",
  },
];

export function HomeProducts() {
  return (
    <section
      id="products"
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "#000" }}
    >
      {/* Subtle warm radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(249,115,22,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section heading ──────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(249,115,22,0.10)",
              border: "1px solid rgba(249,115,22,0.30)",
            }}
          >
            <Layers size={14} style={{ color: "#F97316" }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: "#F97316", letterSpacing: "0.2em" }}
            >
              The AEGIBIT Platform
            </span>
          </div>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            One platform.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Compounding trust.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            AEGIBIT builds an interlocking suite of products. Each one earns its
            keep on its own. Together, they become the operating system for your
            entire business.
          </p>
        </div>

        {/* ── Products grid ────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { name, tagline, description, status, icon: Icon, iconColor, href, ctaLabel, highlighted } = product;

  const statusConfig: Record<ProductStatus, { bg: string; fg: string; pulse: boolean }> = {
    "LIVE":            { bg: "rgba(16,185,129,0.10)", fg: "#10B981", pulse: true },
    "EARLY ACCESS":    { bg: "rgba(59,130,246,0.10)", fg: "#60A5FA", pulse: false },
    "EMBEDDED":        { bg: "rgba(168,85,247,0.10)", fg: "#A855F7", pulse: false },
    "COMING 2026":     { bg: "rgba(255,255,255,0.05)", fg: "#71717A", pulse: false },
    "FREE · WINDOWS":  { bg: "rgba(59,130,246,0.10)", fg: "#60A5FA", pulse: true  },
  };
  const s = statusConfig[status];

  return (
    <TrackedLink
      href={href}
      ctaId={`home_products_${product.id}`}
      ctaLabel={ctaLabel}
      ctaSection="home_products"
      className="group relative rounded-2xl p-7 md:p-8 transition-all duration-300 flex flex-col hover:-translate-y-0.5"
      style={{
        background: highlighted ? "linear-gradient(180deg, #1a1004 0%, #0a0a0a 100%)" : "#0D0D0D",
        border: highlighted
          ? "1px solid rgba(249,115,22,0.30)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: highlighted
          ? "0 0 0 1px rgba(249,115,22,0.10), 0 30px 60px rgba(0,0,0,0.4), 0 0 60px rgba(249,115,22,0.08)"
          : "none",
        minHeight: 280,
      }}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(249,115,22,0.04), transparent)",
        }}
      />

      <div className="relative flex flex-col h-full">
        {/* ── Status pill + flagship badge ──────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: s.bg,
              border: `1px solid ${s.fg}30`,
            }}
          >
            {s.pulse && (
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="ping-green absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: s.fg }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: s.fg }}
                />
              </span>
            )}
            <span
              className="text-[10px] uppercase font-bold"
              style={{ color: s.fg, letterSpacing: "0.12em" }}
            >
              {status}
            </span>
          </div>
          {highlighted && (
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(249,115,22,0.10)",
                border: "1px solid rgba(249,115,22,0.20)",
              }}
            >
              <Zap size={10} style={{ color: "#F97316" }} />
              <span
                className="text-[10px] uppercase font-bold"
                style={{ color: "#F97316", letterSpacing: "0.12em" }}
              >
                Flagship
              </span>
            </div>
          )}
        </div>

        {/* ── Icon + name ───────────────────────────────────────── */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}30`,
            }}
          >
            <Icon size={22} style={{ color: iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium leading-tight mb-1"
              style={{
                fontSize: "1.4rem",
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </h3>
            <p className="text-sm" style={{ color: iconColor }}>
              {tagline}
            </p>
          </div>
        </div>

        {/* ── Description ───────────────────────────────────────── */}
        <p
          className="text-sm leading-relaxed mb-7 flex-1"
          style={{ color: "#A1A1AA" }}
        >
          {description}
        </p>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3"
          style={{ color: iconColor }}
        >
          {ctaLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </TrackedLink>
  );
}
