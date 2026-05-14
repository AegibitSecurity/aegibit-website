import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Minus,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { Comparison, ComparisonRow } from "@/content/comparisons";

/**
 * ComparisonPage — premium head-to-head template.
 *
 * Layout:
 *   1. Hero with PayMint vs {competitor} headline + CTAs
 *   2. Honest concession: "What {competitor} does well"
 *   3. PayMint wins (where we objectively lead)
 *   4. Detailed feature table grouped by section, with cell tooltips
 *   5. Decision helper: "Pick PayMint if..." vs "Pick {competitor} if..."
 *   6. Buyer FAQs (also feeds rich results)
 *   7. Closing CTA with UTM-tagged link tied to competitor name
 */

export function ComparisonPage({ comparison: c }: { comparison: Comparison }) {
  const utm = `?utm_source=compare&utm_campaign=${encodeURIComponent(c.slug)}`;

  return (
    <main style={{ background: "#000" }}>
      {/* ── HERO ──────────────────────────────────────────────────── */}
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
              Honest Comparison
            </span>
          </div>

          <h1
            className="font-light leading-[1.05] tracking-tight mb-6 mx-auto max-w-4xl"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
          >
            {c.headline.split(" vs ").length === 2 ? (
              <>
                <span style={{ color: "#EAEAEA" }}>{c.headline.split(" vs ")[0]} vs </span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {c.headline.split(" vs ")[1]}
                </span>
              </>
            ) : (
              c.headline
            )}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
            style={{ color: "#A1A1AA" }}
          >
            {c.subhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/products/paymint/demo${utm}`}
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
              href="/products/paymint"
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
        </div>
      </section>

      {/* ── HONEST RESPECT BLOCK + WINS ─────────────────────────── */}
      <section className="py-16 px-6 lg:px-12" style={{ background: "#000" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {/* What competitor does well */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              className="text-[11px] uppercase mb-3 font-medium"
              style={{ color: "#94A3B8", letterSpacing: "0.2em" }}
            >
              Where {c.competitorName} earns its place
            </p>
            <h2 className="text-xl font-medium mb-5" style={{ color: "#fff" }}>
              {c.competitorTagline}
            </h2>
            <ul className="space-y-3">
              {c.competitorStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="flex-shrink-0 mt-1"
                    style={{ color: "#94A3B8" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* PayMint wins */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: "linear-gradient(180deg, #1a1004 0%, #0a0a0a 100%)",
              border: "1px solid rgba(249,115,22,0.30)",
              boxShadow: "0 0 0 1px rgba(249,115,22,0.10), 0 0 60px rgba(249,115,22,0.08)",
            }}
          >
            <p
              className="text-[11px] uppercase mb-3 font-medium"
              style={{ color: "#F97316", letterSpacing: "0.2em" }}
            >
              Where PayMint clearly wins
            </p>
            <h2 className="text-xl font-medium mb-5" style={{ color: "#fff" }}>
              Multi-branch operations, end-to-end.
            </h2>
            <ul className="space-y-3">
              {c.paymintWins.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="flex-shrink-0 mt-1"
                    style={{ color: "#F97316" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                    {w}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURE TABLE ─────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12" style={{ background: "#000" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#F97316", letterSpacing: "0.3em" }}
          >
            Side-by-side
          </p>
          <h2
            className="font-light leading-tight mb-12"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            The full feature comparison.
          </h2>

          <div className="space-y-10">
            {c.table.map((section) => (
              <div key={section.title}>
                <h3
                  className="text-[12px] uppercase font-bold mb-4 pb-3"
                  style={{
                    color: "#F97316",
                    letterSpacing: "0.15em",
                    borderBottom: "1px solid rgba(249,115,22,0.20)",
                  }}
                >
                  {section.title}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th className="text-left py-3 px-4 text-[11px] uppercase font-medium tracking-wider" style={{ color: "#71717A" }}>
                          Feature
                        </th>
                        <th className="text-left py-3 px-4 text-[11px] uppercase font-medium tracking-wider" style={{ color: "#F97316" }}>
                          PayMint
                        </th>
                        <th className="text-left py-3 px-4 text-[11px] uppercase font-medium tracking-wider" style={{ color: "#94A3B8" }}>
                          {c.competitorName}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row, i) => (
                        <FeatureRow key={i} row={row} competitorName={c.competitorName} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECISION HELPER ──────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12" style={{ background: "#000" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="text-[11px] uppercase mb-4 font-medium text-center"
            style={{ color: "#F97316", letterSpacing: "0.3em" }}
          >
            Decision helper
          </p>
          <h2
            className="font-light leading-tight mb-12 text-center"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Which is right for your operation?
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div
              className="rounded-2xl p-7"
              style={{
                background: "linear-gradient(180deg, #1a1004 0%, #0a0a0a 100%)",
                border: "1px solid rgba(249,115,22,0.30)",
              }}
            >
              <h3 className="text-lg font-medium mb-5" style={{ color: "#F97316" }}>
                Pick PayMint if…
              </h3>
              <ul className="space-y-3">
                {c.pickPaymintIf.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight
                      size={14}
                      className="flex-shrink-0 mt-1"
                      style={{ color: "#F97316" }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl p-7"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <h3 className="text-lg font-medium mb-5" style={{ color: "#94A3B8" }}>
                Pick {c.competitorName} if…
              </h3>
              <ul className="space-y-3">
                {c.pickCompetitorIf.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight
                      size={14}
                      className="flex-shrink-0 mt-1"
                      style={{ color: "#94A3B8" }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 lg:px-12" style={{ background: "#000" }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: "#F97316", letterSpacing: "0.3em" }}
          >
            Buyer FAQs
          </p>
          <h2
            className="font-light leading-tight mb-12"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "#fff" }}
          >
            Questions evaluators ask.
          </h2>

          <div className="space-y-3">
            {c.faqs.map((f, i) => (
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
                    style={{ color: "#F97316" }}
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

      {/* ── CLOSING CTA ─────────────────────────────────────────── */}
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
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", color: "#fff" }}
          >
            See PayMint run{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #F97316 100%)",
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
            20-minute live demo. Same-day sandbox link. ₹999/branch/month.
            Free 14-day pilot, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/products/paymint/demo${utm}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                color: "#fff",
                boxShadow: "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
              }}
            >
              <CalendarCheck size={18} />
              Book a Demo
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureRow({ row }: { row: ComparisonRow; competitorName: string }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <td className="py-4 px-4 align-top" style={{ color: "#E4E4E7" }}>
        <div className="text-sm font-medium leading-snug">{row.feature}</div>
        {row.note && (
          <div className="text-xs mt-1 leading-relaxed" style={{ color: "#71717A" }}>
            {row.note}
          </div>
        )}
      </td>
      <td className="py-4 px-4 align-top">
        <CellValue value={row.paymint} positive />
      </td>
      <td className="py-4 px-4 align-top">
        <CellValue value={row.competitor} positive={false} />
      </td>
    </tr>
  );
}

function CellValue({ value, positive }: { value: string; positive: boolean }) {
  if (value === "—") {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: "#52525B" }}>
        <Minus size={14} />
        <span>Not available</span>
      </div>
    );
  }
  if (value === "✓") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: positive ? "#F97316" : "#94A3B8" }}>
        <Check size={15} />
        <span>Yes</span>
      </div>
    );
  }
  if (value.startsWith("✓ ")) {
    return (
      <div className="flex items-start gap-2 text-sm">
        <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color: positive ? "#F97316" : "#94A3B8" }} />
        <span style={{ color: "#E4E4E7" }}>{value.slice(2)}</span>
      </div>
    );
  }
  return (
    <div className="text-sm" style={{ color: "#A1A1AA" }}>
      {value}
    </div>
  );
}
