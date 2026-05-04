import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Quote,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Database,
  ArrowRight,
} from "lucide-react";

/**
 * Pillar case study — Nibir Motors.
 *
 * Long-form (~2,000 words) authority asset. Goals:
 *   1. Rank for branded queries ("Nibir Motors PayMint", "PayMint case study")
 *   2. Become the #1 social-proof artefact linked from outbound emails
 *   3. Deepen technical credibility for buyers in due-diligence mode
 *   4. Drive demo conversions via the embedded CTAs
 *
 * Schema.org Article markup for Google rich results.
 */

export const metadata: Metadata = {
  title: "How Nibir Motors Automated 7 Branches with PayMint | AEGIBIT",
  description:
    "Inside the Nibir Motors PayMint deployment — 7 branches across West Bengal, real-time voucher sync, audit-grade logging, ₹4.8L+ monthly transaction volume reconciled in real time.",
  alternates: { canonical: "/case-studies/nibir-motors" },
  openGraph: {
    title: "How Nibir Motors Automated 7 Branches with PayMint",
    description:
      "Real-time multi-branch expense automation in production. 7 branches, audit-grade logs, Tally-ready exports.",
    type: "article",
    url: "https://www.aegibit.com/case-studies/nibir-motors",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Nibir Motors Automated 7 Branches with PayMint",
    description:
      "Inside an in-production PayMint deployment across 7 dealership branches.",
  },
  robots: { index: true, follow: true },
};

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Nibir Motors Automated 7 Branches with PayMint",
  description:
    "Inside the Nibir Motors PayMint deployment — 7 branches across West Bengal, real-time voucher sync, audit-grade logging.",
  image: "https://www.aegibit.com/opengraph-image",
  datePublished: "2026-05-04",
  dateModified: "2026-05-04",
  author: {
    "@type": "Organization",
    name: "AEGIBIT Security",
    url: "https://www.aegibit.com",
  },
  publisher: {
    "@type": "Organization",
    name: "AEGIBIT Security",
    logo: {
      "@type": "ImageObject",
      url: "https://www.aegibit.com/icon.svg",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.aegibit.com/case-studies/nibir-motors",
  },
};

export default function NibirMotorsCaseStudyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />
      <Navbar />
      <main style={{ background: "#000" }}>
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
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/case-studies"
                className="text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                style={{ color: "#F97316" }}
              >
                Case Study
              </Link>
              <span style={{ color: "#52525B" }}>·</span>
              <span className="text-xs flex items-center gap-1" style={{ color: "#71717A" }}>
                <Calendar size={12} /> May 2026
              </span>
              <span style={{ color: "#52525B" }}>·</span>
              <span className="text-xs" style={{ color: "#71717A" }}>
                12-min read
              </span>
            </div>
            <h1
              className="font-light leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", color: "#fff" }}
            >
              How Nibir Motors{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                automated 7 branches
              </span>{" "}
              with PayMint.
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: "#A1A1AA" }}
            >
              Real-time voucher sync. Branch-coded numbering. Audit-grade logging.
              Tally exports in 20 minutes. Inside a production PayMint deployment
              across one of West Bengal&apos;s largest multi-branch automotive groups.
            </p>
          </div>
        </section>

        {/* ── METRICS STRIP ─────────────────────────────────────────── */}
        <section className="py-12 px-6 lg:px-12" style={{ background: "#000" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "7",   label: "Active branches" },
              { value: "24/7", label: "Real-time sync" },
              { value: "100%", label: "Voucher uniqueness" },
              { value: "0",   label: "Reconciliation disputes" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-6 text-center"
                style={{
                  background: "#0D0D0D",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="text-3xl md:text-4xl font-light mb-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #F97316 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "#52525B" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ARTICLE BODY ──────────────────────────────────────────── */}
        <article className="px-6 lg:px-12 pb-16" style={{ background: "#000" }}>
          <div className="max-w-3xl mx-auto" style={{ color: "#CBD5E1" }}>
            {/* Section: Customer profile */}
            <SectionTitle eyebrow="The Customer" title="Nibir Motors Pvt. Ltd." />
            <Para>
              Nibir Motors operates across <strong style={{ color: "#fff" }}>seven branches</strong>{" "}
              spread through West Bengal — Berhampore (head office), Kalyani, Krishnagar,
              Chakdah, Plassey, Raghunathganj, and Kandi. Their operations span automotive
              sales, service workshops, and parts distribution — three distinct expense
              streams, multiplied across seven physical locations, totaling{" "}
              <strong style={{ color: "#fff" }}>over 200 vouchers per month</strong> at
              monthly transaction volumes north of ₹4.8 lakh.
            </Para>
            <Para>
              Before PayMint, expense management at Nibir followed the pattern most
              multi-branch Indian SMEs would recognise: branch managers submitted petty-cash
              vouchers via WhatsApp and email, head-office finance keyed them into Tally
              manually, and reconciliation lived in a 60-tab Excel workbook one accountant
              maintained. <strong style={{ color: "#fff" }}>Month-end took three days</strong>.
              Audit trail was a stack of paper.
            </Para>

            {/* Section: The pain */}
            <SectionTitle eyebrow="The Problem" title="Six leaks they couldn't ignore." />
            <BulletList
              items={[
                "Voucher numbering conflicts: two branches occasionally issued the same number for different transactions, creating reconciliation disputes that took days to resolve.",
                "Real-time visibility was nonexistent. The CFO learned about an over-spending branch only after the books closed — too late to intervene.",
                "WhatsApp-based receipts got lost. Photos went missing in scrolling chats. Some vouchers were paid against verbal approvals that left no audit trail.",
                "Tally entry was a bottleneck. One accountant spent two-to-three full days a month just keying vouchers, with periodic errors that surfaced only at year-end audits.",
                "Branch managers couldn't act fast. A workshop needed parts urgently, but procurement waited 36 hours for head-office approval over phone tag.",
                "When auditors asked who approved a specific voucher in March, the answer was: 'Probably the branch manager. Let me check the WhatsApp.' Not good enough.",
              ]}
            />

            {/* Section: The solution */}
            <SectionTitle eyebrow="The Solution" title="A multi-branch operating system, not a tool." />
            <Para>
              We built PayMint specifically for this shape of operation: multi-branch SMEs in
              India that have outgrown spreadsheets but can&apos;t justify SAP. The deployment at
              Nibir went live across all seven branches within{" "}
              <strong style={{ color: "#fff" }}>14 days</strong> — three days of
              configuration and onboarding for the first branch, then 90-minute
              spin-ups for each subsequent branch. Branch managers were submitting real
              vouchers on day three.
            </Para>

            <FeatureBlock
              icon={Database}
              title="Branch-coded voucher numbering"
              body={`Every payment now gets a tamper-proof voucher number stamped with three pieces of identity: branch code (KLY for Kalyani, BHP for Berhampore, etc.), per-branch sequence number, and Indian fiscal year. So Kalyani's 42nd voucher of FY 2026-27 reads 'KLY/0042/2627'. Auditors can read it once and instantly know which branch issued it, in what order, and in which fiscal cycle.

The numbering is issued by atomic Firestore transactions on per-branch counters — concurrent submissions across branches cannot collide on the same number. Within a branch, the sequence is gap-free. Once assigned, voucher numbers are immutable by Firestore Security Rules; not even a super admin can edit them after the fact.`}
            />

            <FeatureBlock
              icon={RefreshCw}
              title="Real-time multi-device sync"
              body={`When a maker in Kalyani submits a fuel voucher at 11:47 AM, the head-office finance team in Berhampore sees it in their pending queue at 11:47 AM and 0.3 seconds. PayMint runs on Firebase real-time streams — sub-300ms p95 latency from voucher creation to it appearing on every authorised device.

The real win isn't the speed; it's what becomes possible because of the speed. Nibir's CFO can spot an over-spending branch the same day, not at month-end. Branch managers see approvals reflected immediately, so payments don't sit in limbo. Field staff at remote branches submit vouchers offline (the app caches to IndexedDB and queues writes); the moment connectivity returns, every queued voucher syncs with proper numbering preserved.`}
            />

            <FeatureBlock
              icon={ShieldCheck}
              title="Five-role approval workflow"
              body={`Maker → Authoriser → Accountant → Admin → Super Admin. Each role has scoped permissions enforced server-side in Firestore Security Rules — a compromised browser cannot bypass them.

Branch managers at Kalyani see only Kalyani vouchers. The service-GM sees only workshop vouchers. The CFO sees everything. The audit log records every action with actor UID and server timestamp, append-only, even from super admins. When an external auditor recently asked Nibir's team to produce the approval chain for a specific March voucher, the answer was a click — not a search through WhatsApp.`}
            />

            <FeatureBlock
              icon={TrendingUp}
              title="Tally-ready exports — 20 minutes vs 3 days"
              body={`The 11-column Tally CSV exports map straight into Tally Prime: voucher type, voucher number, date, ledger name, cost center, amount, GST split, narration, and three more. Cost centers like 'BERHAMPORE Branch' and 'KALYANI Service' auto-tag based on branch and expense type configured during onboarding.

Nibir's monthly Tally entry — historically a 2-3 day exercise for one accountant — now takes 20 minutes. The accountant opens PayMint, clicks Export, drops the CSV into Tally Prime. Done.

Voucher numbers in the export are immutable and idempotent — re-running the export doesn't create duplicates because Tally recognises the numbers it already imported. This means Nibir's team can re-export any historical month at any time without consequence, useful for cross-checks and audit prep.`}
            />

            {/* Section: Results */}
            <SectionTitle eyebrow="The Results" title="What changed in the first 90 days." />
            <ResultsGrid
              items={[
                {
                  metric: "Month-end Tally entry time",
                  before: "2-3 days",
                  after: "20 minutes",
                  delta: "~95% reduction",
                },
                {
                  metric: "Voucher numbering disputes",
                  before: "Periodic",
                  after: "Zero",
                  delta: "100% eliminated",
                },
                {
                  metric: "Approval cycle time",
                  before: "12-36 hours (WhatsApp)",
                  after: "Under 1 hour",
                  delta: "~95% faster",
                },
                {
                  metric: "Audit prep time",
                  before: "Days of digging",
                  after: "One click",
                  delta: "Forensics-ready",
                },
                {
                  metric: "Real-time branch visibility",
                  before: "End of month",
                  after: "Real-time",
                  delta: "Live ops",
                },
                {
                  metric: "CFO time on reconciliation",
                  before: "~15 hours/month",
                  after: "~2 hours/month",
                  delta: "~85% reduction",
                },
              ]}
            />

            {/* Quote */}
            <Pullquote>
              Every fuel bill, workshop invoice, and petty-cash voucher across 7 branches
              now flows through one audited pipeline. We see everything, real-time. The
              CFO sleeps better. The auditor finishes faster. The accountant reclaimed
              two-and-a-half days a month.
            </Pullquote>

            {/* Section: What's next */}
            <SectionTitle eyebrow="What's Next" title="The roadmap, in their words." />
            <Para>
              Nibir is now live on PayMint as their canonical expense system. The next
              expansion conversations are about three threads: deeper integration with
              their existing DMS (Dealer Management System) for cross-system
              reconciliation, addition of vehicle-level fuel tracking (cost-per-km
              monitoring across the company fleet), and onboarding a regional sister
              business that operates four additional branches.
            </Para>
            <Para>
              The pattern that emerged from the deployment is one we&apos;re seeing repeatedly
              at AEGIBIT: <strong style={{ color: "#fff" }}>multi-branch Indian SMEs don&apos;t
              need lighter spreadsheets — they need an operating system.</strong> One that
              respects branch autonomy, gives head office real-time oversight, and produces
              clean Tally inputs at the press of a button. PayMint is built to be exactly
              that.
            </Para>

            {/* Section: Technical detail */}
            <SectionTitle eyebrow="Technical Notes" title="For the buyers in due-diligence mode." />
            <BulletList
              items={[
                "Stack: Capacitor wrapping a React + Vite SPA, served from Firebase Hosting via the Vercel-grade CDN edge. Backend on Firestore (Native mode) with persistent local cache and multi-tab persistence.",
                "Auth: Firebase Auth (email/password) with browserLocalPersistence so users stay signed in across app restarts. Device binding requires admin approval for new devices on a previously-active account.",
                "Security: Firestore Security Rules enforce all role-based permissions server-side. Client-side checks exist for UX only. Append-only audit log; even super admins cannot delete or modify historical entries.",
                "OTA updates: Capacitor app loads the live web URL inline, so deploys reach every installed phone within ~5 seconds of next app open. A version-checker polls /version.json every 90 seconds when foregrounded; users running an outdated build see a banner offering one-tap refresh.",
                "Data residency: Firestore region is Asia-South1 (Mumbai). Customer data never leaves the chosen region. SOC 2 / ISO 27001 documentation packages available on request.",
                "Backup: Service-account-driven export script archives Firestore snapshots to a private bucket on a configurable schedule. Restore path is documented in the data-integrity playbook.",
              ]}
            />

            {/* Section: Conclusion */}
            <SectionTitle eyebrow="The Bottom Line" title="What this means for similar operations." />
            <Para>
              If you operate 3 or more branches and are still running expense management on
              Excel + WhatsApp + manual Tally entry, the math is straightforward: you are
              losing two-to-three days per month to data entry, a meaningful percentage of
              your reconciliation accuracy to manual error, and your audit position to
              missing provenance.
            </Para>
            <Para>
              PayMint at ₹999 per branch per month is roughly 50× cheaper than hiring a
              dedicated finance staffer to do the same job — and it does it in real time,
              with full audit trail, across every branch, on every device, 24/7. Nibir
              Motors is one customer. The pattern repeats.
            </Para>
            <Para>
              If your operation looks anything like this — book a 20-minute walkthrough.
              We&apos;ll demo PayMint live, against your specific branch shape, and provide
              a sandbox link the same day.
            </Para>
          </div>
        </article>

        {/* ── CTA ─────────────────────────────────────────────────── */}
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
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(249,115,22,0.10)",
                border: "1px solid rgba(249,115,22,0.30)",
              }}
            >
              <Building2 size={13} style={{ color: "#F97316" }} />
              <span
                className="text-[10px] uppercase font-medium"
                style={{ color: "#F97316", letterSpacing: "0.2em" }}
              >
                Run a similar operation?
              </span>
            </div>
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
              20-minute live walkthrough. Same-day sandbox link. ₹999/branch/month.
              Free 14-day pilot, no credit card.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products/paymint/demo?utm_source=case-study&utm_campaign=nibir"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #F97316, #EA6C0A)",
                  color: "#fff",
                  boxShadow:
                    "0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)",
                }}
              >
                Book a Demo
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/products/paymint"
                className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300"
                style={{
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.20)",
                }}
              >
                Explore PayMint
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ─── Article sub-components ────────────────────────────────────────

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mt-14 mb-6">
      <p
        className="text-[11px] uppercase font-medium mb-3"
        style={{ color: "#F97316", letterSpacing: "0.3em" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-light leading-tight"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed mb-5" style={{ color: "#CBD5E1" }}>
      {children}
    </p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mb-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle2
            size={16}
            className="flex-shrink-0 mt-1"
            style={{ color: "#F97316" }}
          />
          <span className="text-base leading-relaxed" style={{ color: "#CBD5E1" }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  body: string;
}) {
  return (
    <div
      className="my-7 rounded-xl p-6"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1px solid rgba(249,115,22,0.20)",
          }}
        >
          <Icon size={18} style={{ color: "#F97316" }} />
        </div>
        <h3 className="text-lg font-medium" style={{ color: "#fff" }}>
          {title}
        </h3>
      </div>
      <div
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: "#CBD5E1" }}
      >
        {body}
      </div>
    </div>
  );
}

function ResultsGrid({
  items,
}: {
  items: { metric: string; before: string; after: string; delta: string }[];
}) {
  return (
    <div className="my-7 grid sm:grid-cols-2 gap-3">
      {items.map((r) => (
        <div
          key={r.metric}
          className="rounded-xl p-5"
          style={{
            background: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-wider mb-3"
            style={{ color: "#71717A" }}
          >
            {r.metric}
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="text-xs line-through"
              style={{ color: "#52525B" }}
            >
              {r.before}
            </span>
            <ArrowRight size={11} style={{ color: "#F97316" }} />
            <span
              className="text-base font-semibold"
              style={{ color: "#fff" }}
            >
              {r.after}
            </span>
          </div>
          <div
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "#34D399" }}
          >
            {r.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-10 rounded-xl p-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,115,22,0.05) 0%, transparent 100%)",
        border: "1px solid rgba(249,115,22,0.15)",
      }}
    >
      <Quote
        size={48}
        strokeWidth={1}
        style={{
          color: "rgba(249,115,22,0.15)",
          position: "absolute",
          top: 24,
          left: 24,
        }}
      />
      <div className="relative pl-12">
        <p
          className="text-lg md:text-xl leading-relaxed font-light italic mb-4"
          style={{ color: "#fff", letterSpacing: "-0.005em" }}
        >
          &ldquo;{children}&rdquo;
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{
              background: "linear-gradient(135deg, #F97316, #EA6C0A)",
              color: "#fff",
            }}
          >
            NM
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#fff" }}>
              Nibir Motors Pvt. Ltd.
            </div>
            <div className="text-[10px]" style={{ color: "#52525B" }}>
              7 branches · West Bengal · Live on PayMint
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
