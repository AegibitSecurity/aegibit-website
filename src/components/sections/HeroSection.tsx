import Link from "next/link";

const TRUST = [
  { label: "SOC 2 Type II Certified" },
  { label: "99.99% Uptime SLA" },
  { label: "Zero Trust Architecture" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-28 overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Subtle warm radial — matches reference ambient warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 28%, rgba(249,115,22,0.055) 0%, transparent 70%)",
        }}
      />

      {/* Shield icon with back-glow pulse */}
      <div className="relative mb-7 flex items-center justify-center fade-up">

        {/* Back-glow layer 1 — large slow pulse */}
        <div className="absolute" style={{
          width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
          animation: "shield-glow-pulse 3s ease-in-out infinite",
        }}/>

        {/* Back-glow layer 2 — tighter, delayed */}
        <div className="absolute" style={{
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.28) 0%, transparent 70%)",
          animation: "shield-glow-pulse 3s ease-in-out infinite 1s",
        }}/>

        {/* Icon box */}
        <div
          style={{
            position: "relative", zIndex: 2,
            width: 68, height: 68, borderRadius: 16,
            background: "linear-gradient(145deg, rgba(249,115,22,0.20), rgba(249,115,22,0.07))",
            border: "1px solid rgba(249,115,22,0.45)",
            boxShadow:
              "0 0 0 3px rgba(249,115,22,0.08)," +
              "0 0 16px rgba(249,115,22,0.40)," +
              "0 0 40px rgba(249,115,22,0.15)," +
              "inset 0 1px 0 rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            <path d="M14 2L2 6.5V15C2 23 7.5 29.5 14 31.5C20.5 29.5 26 23 26 15V6.5L14 2Z" fill="#F97316" opacity="0.95"/>
            <path d="M9 15.5L12.5 19L19 12" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Brand wordmark + tagline */}
      <div className="fade-up delay-1 mb-8">
        <div style={{
          letterSpacing: "0.30em",
          fontSize: "0.72rem",
          fontWeight: 600,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          marginBottom: "0.5rem",
        }}>
          <span style={{ color: "#FFFFFF" }}>AEGI</span>
          <span style={{ color: "#F97316" }}>BIT</span>
          <sup style={{ color: "rgba(255,255,255,0.22)", letterSpacing: 0, fontSize: "0.48em", marginLeft: "0.15em" }}>™</sup>
        </div>
        <div style={{
          letterSpacing: "0.2em",
          fontSize: "0.58rem",
          fontWeight: 500,
          fontFamily: "var(--font-geist-mono), monospace",
          textTransform: "uppercase",
          color: "#3F3F46",
        }}>
          Securing Tomorrow, Today
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HEADLINE — exact spec match
          Font: system-ui (Inter fallback)
          Weight: 500
          Letter-spacing: -0.03em
          Line-height: 1.05
          Size: clamp(48px, 6vw, 88px)
          Line 1: warm white #EAEAEA
          Line 2: gradient 90deg white→orange→white
      ═══════════════════════════════════════ */}
      <h1
        className="fade-up delay-2 mb-6"
        style={{
          fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          fontSize: "clamp(48px, 6vw, 88px)",
          textAlign: "center",
          margin: "0 auto 1.5rem",
          maxWidth: "820px",
        }}
      >
        {/* Line 1 — warm white */}
        <span
          style={{
            display: "block",
            color: "#EAEAEA",
          }}
        >
          Multi-branch operations,
        </span>

        {/* Line 2 — gradient: white → orange → white, padded to show descenders */}
        <span
          style={{
            display: "block",
            /* Extra padding prevents "g" descender from being clipped by background-clip */
            paddingBottom: "0.15em",
            lineHeight: 1.15,
            background: "linear-gradient(90deg, #fff 0%, #f97316 35%, #ff8a3d 65%, #fff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          built like a vault.
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="fade-up delay-3 mb-10"
        style={{
          color: "#A1A1AA",
          fontSize: "1.05rem",
          lineHeight: 1.65,
          maxWidth: "560px",
          margin: "0 auto 2.5rem",
        }}
      >
        AEGIBIT builds the operational backbone for dealerships and multi-branch
        SMEs. Our flagship — <span style={{ color: "#fff", fontWeight: 600 }}>PayMint</span> —
        handles real-time expense tracking, branch-coded vouchers, and audit-grade
        logs. Built by a cybersecurity company. Deployed in days.
      </p>

      {/* CTAs — primary funnel: Book PayMint Demo */}
      <div className="fade-up delay-4 flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link
          href="/products/paymint/demo"
          className="text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #F97316, #EA6C0A)",
            padding: "13px 30px",
            borderRadius: "10px",
            minWidth: "220px",
            textAlign: "center",
            boxShadow: "0 0 18px rgba(249,115,22,0.32), 0 2px 6px rgba(0,0,0,0.4)",
          }}
        >
          Book a 20-min PayMint Demo
        </Link>
        <Link
          href="/products/paymint"
          className="text-sm font-semibold transition-colors hover:text-white"
          style={{
            padding: "13px 30px",
            borderRadius: "10px",
            minWidth: "160px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#A1A1AA",
          }}
        >
          Explore PayMint
        </Link>
      </div>

      {/* Trust badges — more visible */}
      <div className="fade-up delay-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {TRUST.map((t) => (
          <div key={t.label} className="flex items-center gap-2.5">
            {/* Orange checkmark */}
            <div style={{
              width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
              background: "rgba(249,115,22,0.15)",
              border: "1px solid rgba(249,115,22,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ color: "#9CA3AF", fontSize: "0.78rem", fontWeight: 400 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-up delay-6">
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center p-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <div className="w-1 h-1.5 rounded-full scroll-bounce" style={{ background: "#F97316" }} />
        </div>
      </div>
    </section>
  );
}
