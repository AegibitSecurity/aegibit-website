import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import {
  BrainCircuit, Sparkles, Database, Gauge, Workflow, ShieldCheck,
  Boxes, Globe, ArrowRight, Lock, Layers, TrendingUp,
  Users, FileText, Smartphone, RefreshCw, Command,
} from "lucide-react";

/**
 * /products/cortex, the AEGIBIT Cortex product page.
 *
 * Cortex is AEGIBIT's AI-powered, multi-tenant CRM and revenue platform:
 * live web app (cortex.aegibit.com), plus offline-first mobile apps.
 * Honesty bar, unchanged: everything described here is a capability that
 * is BUILT and deployed per the Cortex repo status (phases 1-13, all
 * "Built"), and the positioning rests only on the market-gap analysis'
 * VERIFIED differentiators, never the refuted / do-not-cite claims. No
 * customer counts, no fabricated metrics. Cortex is a browser SaaS, so
 * "run it on your computer" launches the real web app, there is no
 * desktop installer and we do not pretend there is one.
 */

const PAGE_PATH = "/products/cortex";
const APP_URL = "https://cortex.aegibit.com";
const REGISTER_URL = "https://cortex.aegibit.com/register";
// Branded download link on our own domain. It 302-redirects (see next.config.ts)
// to the GitHub release asset on the fixed `cortex-latest` tag, so the shareable
// URL stays clean and stable while the file behind it is replaced each build.
const ANDROID_APK_URL = "/download/cortex-android";
const ANDROID_VERSION = "1.1.0";

export const metadata: Metadata = buildMetadata({
  title: "AEGIBIT Cortex: The AI CRM That Does the Data Entry For You",
  description:
    "AEGIBIT Cortex is an AI-powered, multi-tenant CRM and revenue platform. Zero-entry AI capture, a built-in data-quality engine, native CPQ and invoicing, transparent pricing, and offline-first mobile. Runs in any browser. Powered by AEGIBIT.",
  path: PAGE_PATH,
  keywords: [
    "AI CRM",
    "CRM software",
    "sales automation platform",
    "CPQ quotation software",
    "CRM for SMB and mid-market",
    "HubSpot alternative",
    "Salesforce alternative",
    "AEGIBIT Cortex",
    "AEGIBIT",
  ],
});

// Each capability maps to a VERIFIED pain / differentiator in the Cortex
// market-gap analysis (docs/04). No refuted stats are used anywhere.
const FEATURES = [
  { icon: Sparkles, title: "AI that does the data entry, not just chat", body: "Reps lose most of their day to admin, industry research puts non-selling work near 70% of their time. Cortex auto-logs emails, calls, and meetings straight into the timeline and auto-fills the record. You confirm with one click instead of filling a form. This is the single highest-ROI thing an AI can do in a CRM." },
  { icon: Database, title: "A data-quality engine, built in", body: "Bad CRM data quietly costs revenue. Cortex ships real-time duplicate detection (exact and fuzzy), a clean merge experience, validation rules, and a tenant Data Health score that nudges you on stale records, capabilities most suites sell as a paid add-on, included here." },
  { icon: TrendingUp, title: "Everything to close, on one platform", body: "Native CPQ and quotation with tax and GST, versioning, an approval workflow with discount tiers, and invoicing, all in the core. Not bolt-on hubs, not integrations you rent, not a per-module upsell every quarter." },
  { icon: Command, title: "Low-click, role-tailored, Linear-fast", body: "A command palette, inline editing, and keyboard-first flows. Rep, manager, finance, and support each get a home screen built for their job. Cortex is designed to log anything in under three clicks, the opposite of the click-heavy incumbents people quietly resent." },
  { icon: BrainCircuit, title: "ROI-instrumented AI, not demo flash", body: "Summaries, deal-risk scoring, and forecasting, each tied to a measurable time-saved or revenue-surfaced number. A provider-agnostic engine runs across models with automatic fallback, so the intelligence layer never goes dark." },
  { icon: RefreshCw, title: "No lock-in, by design", body: "One-click full data export, a documented schema, and guided importers from Salesforce, HubSpot, Pipedrive, and Zoho. We win by being easy to join and easy to leave, the opposite of the switching-cost trap that keeps people on tools they dislike." },
  { icon: Boxes, title: "Enterprise extensions in the core", body: "An assignment engine with five routing modes, a universal activity timeline, source analytics, shareable links with engagement tracking, and a universal inventory and matching engine with dashboards and CSV exports." },
  { icon: Smartphone, title: "A real field-sales mobile app", body: "Offline-first mobile with a genuine sync engine and an offline outbox, auth, leads, deals, and an AI copilot in your pocket, a true field tool, not a shrunk-down web view." },
] as const;

const SECURITY = [
  { icon: Lock, text: "Multi-tenant isolation enforced at the database with PostgreSQL Row-Level Security, a tenant_id on every row" },
  { icon: ShieldCheck, text: "JWT with refresh-token rotation and reuse detection, plus TOTP multi-factor authentication" },
  { icon: Layers, text: "Role-based access control with custom roles and dynamic permissions from day one" },
] as const;

const PRICING_POINTS = [
  "Flat, per-seat pricing with all core modules included",
  "No feature paywalls on CPQ, approvals, invoicing, support, or reporting",
  "No punitive tier cliffs, and no charging for breadth you never use",
] as const;

function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${PAGE_PATH}#app`,
    name: "AEGIBIT Cortex",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Customer Relationship Management",
    operatingSystem: "Web, Android, iOS",
    url: `${SITE_URL}${PAGE_PATH}`,
    installUrl: APP_URL,
    description:
      "AI-powered, multi-tenant CRM and revenue platform by AEGIBIT: zero-entry AI capture, built-in data-quality engine, native CPQ and invoicing, approval workflows, offline-first mobile, and transparent pricing. Multi-tenant isolation via PostgreSQL Row-Level Security.",
    author: { "@id": `${SITE_URL}/#org` },
    brand: { "@id": `${SITE_URL}/#org` },
    featureList: [
      "Zero-entry AI activity capture and auto-fill",
      "Built-in data-quality engine with dedupe, merge, and health score",
      "Native CPQ and quotation with tax and GST",
      "Approval workflows with discount tiers",
      "Invoicing in the core",
      "Deal pipeline with Kanban and stage history",
      "ROI-instrumented AI: summaries, deal-risk, forecasting",
      "One-click data export and guided importers (anti-lock-in)",
      "Offline-first mobile with sync engine",
      "Multi-tenant isolation via PostgreSQL Row-Level Security",
    ],
  };
}

export default function CortexPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "AEGIBIT Cortex", href: PAGE_PATH },
  ]);

  const ACCENT = "#818CF8"; // indigo, Cortex's identity accent

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(129,140,248,0.12) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10B981" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10B981" }} />
              </span>
              <span className="text-[11px] uppercase font-medium" style={{ color: "#10B981", letterSpacing: "0.2em" }}>
                Live · Web, Android and iOS
              </span>
            </div>
            <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
              AEGIBIT Cortex.{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #818CF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                The AI CRM that does the data entry for you.
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              A multi-tenant CRM, sales-automation, quotation, and customer-success platform, rebuilt around one idea:
              the software should do the admin, not the salesperson. Zero-entry AI capture, a data-quality engine, native
              CPQ and invoicing, transparent pricing, and a real offline mobile app. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#818CF8", color: "#000" }}
              >
                Create your workspace <ArrowRight size={16} />
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Globe size={15} /> Open Cortex on your computer
              </a>
              <a
                href={ANDROID_APK_URL}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(129,140,248,0.35)", color: "#fff", background: "rgba(129,140,248,0.10)" }}
              >
                <Smartphone size={15} /> Download Android app
              </a>
              <a
                href="mailto:contact@aegibit.com?subject=Cortex demo for my team"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                Book a demo
              </a>
            </div>
            <p className="mt-6 text-xs" style={{ color: "#52525B" }}>
              Cortex runs in any modern browser, nothing to install. Prefer the field app?{" "}
              Download the Android APK (v{ANDROID_VERSION}) above, tap the file, and allow install
              from your browser when Android asks. On iPhone? Email us, an iOS build is on the way.
            </p>
          </div>
        </section>

        {/* The problem it solves */}
        <section className="px-6 lg:px-12 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
              The problem
            </p>
            <h2 className="font-light mb-6" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#fff" }}>
              CRMs were supposed to remove busywork. Most of them added it.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
              Bad data costs revenue. Pricing hides behind tier cliffs and per-module upsells. Reps spend the majority
              of their day on data entry instead of selling, and the interfaces are so click-heavy that even the market
              leaders are rebuilding them. Cortex was designed by studying exactly what people complain about, and
              winning on every one of those points.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Why teams switch to Cortex
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Built to win on the four things people hate about CRMs
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)" }}>
                      <Icon size={20} style={{ color: ACCENT }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.15rem", color: "#fff" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Who it is for
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#fff" }}>
                SMB and mid-market teams that sell
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, role: "Sales reps", line: "Stop typing. Auto-logged activity and one-click confirm means more time in front of customers." },
                { icon: Gauge, role: "Sales managers", line: "A real-time pipeline, deal-risk, and forecasting, without chasing the team for updates." },
                { icon: FileText, role: "Finance and RevOps", line: "Native CPQ, approvals, and invoicing with clean, exportable data they can trust." },
                { icon: Workflow, role: "Founders and ops", line: "One transparent-priced platform that replaces a stack of add-ons, with no lock-in." },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.role} className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Icon size={20} style={{ color: ACCENT }} className="mb-4" />
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.05rem", color: "#fff" }}>{p.role}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{p.line}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
              Built by a security company
            </p>
            <h2 className="font-light mb-10" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#fff" }}>
              Your customer data, isolated at the database
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {SECURITY.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.text} className="rounded-xl p-6 text-left" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Icon size={18} style={{ color: "#10B981" }} className="mb-3" />
                    <p className="text-sm leading-relaxed" style={{ color: "#D4D4D8" }}>{s.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing philosophy */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8" style={{ background: "linear-gradient(180deg, #0b0b1a 0%, #0a0a0a 100%)", border: "1px solid rgba(129,140,248,0.30)" }}>
              <p className="text-[11px] uppercase font-bold mb-3" style={{ color: ACCENT, letterSpacing: "0.16em" }}>Pricing is a feature</p>
              <p className="mb-4" style={{ fontSize: "1.5rem", color: "#fff", fontWeight: 500 }}>Flat per seat. Everything included.</p>
              <ul className="space-y-3 mb-6">
                {PRICING_POINTS.map((t) => (
                  <li key={t} className="text-sm leading-relaxed flex gap-2" style={{ color: "#A1A1AA" }}>
                    <span style={{ color: ACCENT }}>·</span> {t}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:contact@aegibit.com?subject=Cortex pricing for my team"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                Get a straight number <ArrowRight size={15} />
              </a>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] uppercase font-bold mb-4" style={{ color: "#71717A", letterSpacing: "0.16em" }}>What is inside, today</p>
              <ul className="space-y-3">
                {[
                  "CRM: companies, contacts, deals, Kanban, dedupe, lead conversion",
                  "Sales: CPQ, quotations, approval workflow, invoicing",
                  "AI: auto-capture, summaries, deal-risk, forecasting",
                  "Mobile: offline-first Android and iOS with a real sync engine",
                  "Enterprise: assignment engine, timeline, analytics, inventory matching",
                ].map((t) => (
                  <li key={t} className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                    <span style={{ color: "#10B981" }}>✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff" }}>
              Put your revenue team on Cortex.
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              The AI does the data entry, the data stays clean, and everything you need to close lives on one platform.
              Open it in your browser right now, nothing to install. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#818CF8", color: "#000" }}
              >
                Create your workspace <ArrowRight size={16} />
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Globe size={15} /> Open Cortex
              </a>
              <a
                href={ANDROID_APK_URL}
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(129,140,248,0.35)", color: "#fff", background: "rgba(129,140,248,0.10)" }}
              >
                <Smartphone size={15} /> Download Android app
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
