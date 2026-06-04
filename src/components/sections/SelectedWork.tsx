import { TrackedLink } from "@/components/shared/TrackedLink";
import { Building2, Dumbbell, ArrowRight, ArrowUpRight, Briefcase } from "lucide-react";

/**
 * SelectedWork, real delivered client work.
 *
 * Same honesty bar as ProofSection: every entry here is a real client
 * with shippable, verifiable output. No fabricated logos, no invented
 * metrics. Two clients today (Nibir Motors, software; OJAS Fitness,
 * website). As we ship more, add cards here, but each one must be a
 * project a prospect can click through to and verify.
 */

interface Work {
  id: string;
  category: string;
  name: string;
  role: string;
  description: string;
  chips: string[];
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accent: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
}

const WORK: Work[] = [
  {
    id: "nibir-motors",
    category: "Operational software",
    name: "Nibir Motors",
    role: "Multi-branch expense automation, 7 dealerships, West Bengal",
    description:
      "We rolled out PayMint across all seven Nibir Motors dealerships, branch-coded vouchers, role-based approvals, and Tally-ready exports that took them to fully audit-ready in 30 days.",
    chips: ["PayMint rollout", "7 branches", "Audit-ready in 30 days"],
    icon: Building2,
    accent: "#F97316",
    href: "/case-studies/nibir-motors",
    ctaLabel: "Read the case study",
  },
  {
    id: "ojas-fitness",
    category: "Website development",
    name: "OJAS Fitness O.9",
    role: "Premium gym website, Barrackpore, West Bengal",
    description:
      "We designed and built the OJAS Fitness website end to end, programs, trainers, membership tiers, a transformation gallery, and online class booking, all on a fast, secure, mobile-first stack.",
    chips: ["Responsive build", "Online booking", "Security-first"],
    icon: Dumbbell,
    accent: "#10B981",
    href: "https://ojasfitness09.com",
    ctaLabel: "Visit the live site",
    external: true,
  },
];

export function SelectedWork() {
  return (
    <section
      id="work"
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: "#000" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 25%, rgba(249,115,22,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(249,115,22,0.10)",
              border: "1px solid rgba(249,115,22,0.30)",
            }}
          >
            <Briefcase size={14} style={{ color: "#F97316" }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: "#F97316", letterSpacing: "0.2em" }}
            >
              Selected work
            </span>
          </div>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}
          >
            Real clients.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Shipped work.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#A1A1AA" }}
          >
            A small, growing track record. Every project here is real, live, and
            built to our cybersecurity-first standard.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {WORK.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work }: { work: Work }) {
  const { category, name, role, description, chips, icon: Icon, accent, href, ctaLabel, external } = work;

  return (
    <TrackedLink
      href={href}
      ctaId={`home_work_${work.id}`}
      ctaLabel={ctaLabel}
      ctaSection="home_work"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative rounded-2xl p-7 md:p-8 transition-all duration-300 flex flex-col hover:-translate-y-0.5"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: 300,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent}0A, transparent)` }}
      />

      <div className="relative flex flex-col h-full">
        {/* Category */}
        <div className="mb-6">
          <span
            className="text-[10px] uppercase font-bold"
            style={{ color: accent, letterSpacing: "0.16em" }}
          >
            {category}
          </span>
        </div>

        {/* Icon + name */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
          >
            <Icon size={22} style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium leading-tight mb-1"
              style={{ fontSize: "1.4rem", color: "#fff", letterSpacing: "-0.01em" }}
            >
              {name}
            </h3>
            <p className="text-sm" style={{ color: "#A1A1AA" }}>
              {role}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#A1A1AA" }}>
          {description}
        </p>

        {/* Scope chips */}
        <div className="flex flex-wrap gap-2 mb-7">
          {chips.map((c) => (
            <span
              key={c}
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#D4D4D8",
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
          style={{ color: accent }}
        >
          {ctaLabel}
          {external ? (
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          )}
        </div>
      </div>
    </TrackedLink>
  );
}
