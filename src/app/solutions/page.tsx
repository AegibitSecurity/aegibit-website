import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SOLUTIONS } from "@/content/solutions";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions — PayMint for Every Branch Operation",
  description:
    "Tailored PayMint solutions for car dealerships, multi-branch SMEs, fleet operators, automotive workshops, and more. Real-time expense automation, audit-grade.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Solutions — PayMint for Every Branch Operation",
    description:
      "Real-time multi-branch expense automation, tailored to your industry and operational shape.",
    type: "website",
    url: "https://www.aegibit.com/solutions",
    siteName: "AEGIBIT",
  },
  robots: { index: true, follow: true },
};

export default function SolutionsIndexPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ background: "#000" }}>
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          className="relative pt-32 pb-16 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(249,115,22,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto text-center">
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
                PayMint Solutions
              </span>
            </div>
            <h1
              className="font-light leading-[1.05] tracking-tight mb-6 mx-auto max-w-4xl"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
            >
              <span style={{ color: "#EAEAEA" }}>One platform.</span>
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #fff 0%, #f97316 50%, #fff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  paddingBottom: "0.15em",
                  display: "inline-block",
                }}
              >
                Every branch operation.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: "#A1A1AA" }}
            >
              PayMint is built for multi-branch businesses that can&apos;t afford a
              leak — dealerships, SMEs, workshops, fleet operators. Pick the
              shape closest to yours.
            </p>
          </div>
        </section>

        {/* ── GRID ─────────────────────────────────────────────────── */}
        <section className="pb-24 px-6 lg:px-12" style={{ background: "#000" }}>
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group relative rounded-2xl p-7 transition-all duration-300 flex flex-col hover:-translate-y-0.5"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minHeight: 240,
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(249,115,22,0.05), transparent)",
                  }}
                />
                <div className="relative flex flex-col h-full">
                  <div
                    className="text-[10px] uppercase font-semibold mb-3"
                    style={{ color: "#F97316", letterSpacing: "0.2em" }}
                  >
                    {s.eyebrow}
                  </div>
                  <h2
                    className="text-lg font-medium mb-3 leading-snug"
                    style={{ color: "#fff" }}
                  >
                    {s.h1}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: "#A1A1AA" }}
                  >
                    {s.subheadline.length > 140
                      ? s.subheadline.slice(0, 140) + "…"
                      : s.subheadline}
                  </p>
                  <div
                    className="flex items-center gap-2 text-sm font-semibold transition-colors group-hover:gap-3"
                    style={{ color: "#F97316" }}
                  >
                    Read more
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
        <section
          className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden"
          style={{ background: "#000" }}
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
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2
              className="font-light leading-[1.1] tracking-tight mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                color: "#fff",
              }}
            >
              Don&apos;t see your shape?
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Talk to a founder.
              </span>
            </h2>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-10"
              style={{ color: "#A1A1AA" }}
            >
              PayMint is multi-branch by design — we adapt to your specific
              operation. Book a 20-min call and we&apos;ll tailor the demo to
              your shape.
            </p>
            <Link
              href="/products/paymint/demo"
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
