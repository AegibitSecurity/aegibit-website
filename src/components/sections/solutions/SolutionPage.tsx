import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Quote,
} from "lucide-react";
import type { Solution } from "@/content/solutions";

const PAYMINT_DEMO_URL = "/products/paymint/demo";
const PAYMINT_PRODUCT_URL = "/products/paymint";

export function SolutionPage({ solution }: { solution: Solution }) {
  return (
    <main style={{ background: "#000000" }}>
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden"
        style={{ background: "#000000" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(249,115,22,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(249,115,22,0.10)",
              border: "1px solid rgba(249,115,22,0.30)",
            }}
          >
            <Sparkles size={14} style={{ color: "#F97316" }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: "#F97316", letterSpacing: "0.2em" }}
            >
              {solution.eyebrow}
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-light leading-[1.05] tracking-tight mb-6 mx-auto max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", color: "#fff" }}
          >
            {solution.h1}
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            {solution.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href={PAYMINT_DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                color: "#fff",
                boxShadow:
                  "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
              }}
            >
              <CalendarCheck size={18} />
              Book a 20-min Demo
            </Link>
            <Link
              href={PAYMINT_PRODUCT_URL}
              className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              Explore PayMint
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Audience strip */}
          <p
            className="text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#52525B" }}
          >
            <strong style={{ color: "#71717A" }}>Built for:</strong>{" "}
            {solution.audience}
          </p>
        </div>
      </section>

      {/* ── PAIN POINTS ────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12" style={{ background: "#000000" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#EF4444", letterSpacing: "0.3em" }}
          >
            The status quo is broken
          </p>
          <h2
            className="font-light leading-tight mb-12 max-w-3xl"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            What you&apos;re probably dealing with today.
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {solution.painPoints.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(239,68,68,0.10)",
                }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(239,68,68,0.10)",
                    border: "1px solid rgba(239,68,68,0.20)",
                  }}
                >
                  <AlertTriangle size={16} style={{ color: "#EF4444" }} />
                </div>
                <p
                  className="text-sm leading-relaxed pt-1"
                  style={{ color: "#CBD5E1" }}
                >
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION (FEATURES) ────────────────────────────────────── */}
      <section
        className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: "#000000" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 700,
            height: 700,
            background: "rgba(249,115,22,0.05)",
            filter: "blur(150px)",
            borderRadius: "50%",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p
              className="text-[11px] uppercase mb-4 font-medium"
              style={{ color: "#F97316", letterSpacing: "0.3em" }}
            >
              How PayMint solves it
            </p>
            <h2
              className="font-light leading-tight max-w-3xl mx-auto"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#fff",
              }}
            >
              The features that{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                directly fix this.
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {solution.features.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 transition-all duration-300"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(249,115,22,0.10)",
                    border: "1px solid rgba(249,115,22,0.20)",
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: "#F97316" }} />
                </div>
                <h3
                  className="text-lg font-medium mb-3 leading-snug"
                  style={{ color: "#fff" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12" style={{ background: "#000000" }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Quote
              size={56}
              strokeWidth={1}
              style={{
                color: "rgba(249,115,22,0.10)",
                position: "absolute",
                top: 24,
                right: 32,
              }}
            />
            <div className="relative">
              <p
                className="text-xl md:text-2xl leading-relaxed font-light italic mb-8"
                style={{ color: "#fff", letterSpacing: "-0.005em" }}
              >
                &ldquo;{solution.testimonialAngle}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                    color: "#fff",
                  }}
                >
                  NM
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#fff" }}>
                    Nibir Motors Pvt. Ltd.
                  </div>
                  <div className="text-xs" style={{ color: "#52525B" }}>
                    7 branches across West Bengal · Live on PayMint
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 lg:px-12" style={{ background: "#000000" }}>
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#F97316", letterSpacing: "0.3em" }}
          >
            Frequently asked
          </p>
          <h2
            className="font-light leading-tight mb-12"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Questions buyers actually ask.
          </h2>

          <div className="space-y-3">
            {solution.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <summary
                  className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                  style={{ color: "#fff" }}
                >
                  <span className="text-base font-medium leading-snug">{f.q}</span>
                  <ArrowRight
                    size={18}
                    className="flex-shrink-0 transition-transform group-open:rotate-90"
                    style={{ color: "#F97316" }}
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
        </div>
      </section>

      {/* ── CLOSING CTA ─────────────────────────────────────────────── */}
      <section
        className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
        style={{ background: "#000000" }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 800,
            height: 600,
            background: "rgba(249,115,22,0.08)",
            filter: "blur(160px)",
            borderRadius: "50%",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="font-light leading-[1.1] tracking-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              color: "#fff",
            }}
          >
            See PayMint run{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              your operation.
            </span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: "#A1A1AA" }}
          >
            20-minute live walkthrough. No prep needed. Get a sandbox link the
            same day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={PAYMINT_DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                color: "#fff",
                boxShadow:
                  "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
              }}
            >
              <CalendarCheck size={18} />
              Book a Demo
            </Link>
            <Link
              href={PAYMINT_PRODUCT_URL}
              className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              Explore the full PayMint
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
