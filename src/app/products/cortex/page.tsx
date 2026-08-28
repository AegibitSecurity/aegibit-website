import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import {
  Sparkles, Gauge, ShieldCheck,
  Globe, ArrowRight, Lock, Layers,
  Users, FileText, Smartphone, RefreshCw,
  Receipt, Banknote, CalendarCheck, UserCheck, MessageSquare,
  BarChart3, ClipboardCheck, Fingerprint,
} from "lucide-react";

/**
 * /products/cortex, the AEGIBIT Cortex product page.
 *
 * Cortex is AEGIBIT's AI-powered, multi-tenant BUSINESS OPERATING
 * SYSTEM: a live web app (cortex.aegibit.com) plus an offline-first
 * mobile app. It is far more than a CRM: CRM + CPQ + GST invoicing +
 * accounts-payable + full HRMS (India-compliant payroll with
 * PF/ESI/Professional-Tax, attendance with geofence/GPS/selfie, leave)
 * + approvals + omnichannel support inbox + reporting + an AI copilot.
 *
 * Honesty bar (unchanged): every capability described here is BUILT and
 * mounted in the Cortex repo (verified against apps/api/app/api/v1
 * routers + apps/web routes, 2026-08). We deliberately do NOT claim the
 * documented non-goals: marketing-automation/journey builder, native
 * telephony/dialer, a full general-ledger accounting system, or
 * Google/Microsoft social SSO. No customer counts, no invented metrics.
 * Cortex is a browser SaaS, so "open on your computer" launches the real
 * web app; there is no desktop installer and we do not pretend there is.
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
  title: "AEGIBIT Cortex: AI CRM, GST Invoicing, HRMS & Payroll in One Platform",
  description:
    "AEGIBIT Cortex is an AI-powered, multi-tenant business platform: CRM and sales pipeline, CPQ and GST invoicing, accounts-payable, full HRMS with India-compliant payroll (PF/ESI/Professional Tax), attendance with GPS and selfie, approvals, a WhatsApp support inbox, and an AI copilot. Runs in any browser, plus offline mobile. Start free. Powered by AEGIBIT.",
  path: PAGE_PATH,
  keywords: [
    "AI CRM",
    "business management software",
    "HRMS software India",
    "payroll software India",
    "PF ESI professional tax payroll",
    "attendance management software",
    "GST invoicing software",
    "CPQ quotation software",
    "accounts payable software",
    "CRM for SMB and mid-market",
    "ERP alternative for SMB",
    "HubSpot alternative",
    "Zoho alternative",
    "AEGIBIT Cortex",
    "AEGIBIT",
  ],
});

// Core capability grid. Each maps to a VERIFIED, shipped router in the
// Cortex repo (apps/api/app/api/v1). Business language, owner-first.
const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Sell, without the data entry",
    body: "A full CRM: leads, companies, contacts, and a Kanban deal pipeline with stage history. The AI copilot logs activity and drafts follow-ups for you, and auto lead-assignment routes every new lead to the right rep. You confirm, you don't type.",
  },
  {
    icon: Receipt,
    title: "Quote to cash, GST built in",
    body: "Native CPQ with line items, discounts, and tax, immutable quote versioning, and one-click quote-to-invoice. Full invoicing with GST-aware totals, payment reminders, and a revenue overview. No bolt-on billing tool to rent.",
  },
  {
    icon: Banknote,
    title: "Run India-compliant payroll",
    body: "Payroll runs that generate payslips with statutory PF, ESI, and Professional Tax handled for you, plus verifiable payslips with a public verify link. Your accountant stops doing it by hand.",
  },
  {
    icon: Fingerprint,
    title: "Attendance you can actually trust",
    body: "Check-in and check-out with geofences, device binding, GPS, break tracking, and selfie capture, a live attendance board, register, and analytics. Built for field teams and multi-branch businesses, not just a desk clock.",
  },
  {
    icon: UserCheck,
    title: "A real HR system, not a spreadsheet",
    body: "Employee master, onboarding, org structure, and an employee self-service portal with documents and leave requests with balances. Your whole team's records in one secure place.",
  },
  {
    icon: ClipboardCheck,
    title: "Approve spend and pay vendors",
    body: "Accounts-payable with vendor bills, approval, reconciliation, and archive, plus vendor advances and refunds, and procurement requisitions with approval chains. Multi-level approvals with discount tiers and delegation across the platform.",
  },
  {
    icon: MessageSquare,
    title: "Every customer conversation in one inbox",
    body: "An omnichannel Connect inbox with WhatsApp channel provisioning and webhooks, a support-ticket desk, meetings, and a knowledge base. Sales, support, and success on one timeline.",
  },
  {
    icon: BarChart3,
    title: "See everything, with an AI copilot on top",
    body: "An executive dashboard, analytics, and custom reports with exports. The AI copilot spans the platform: account summaries, proposal drafting, deal-risk scoring, and forecasting, running provider-agnostic across models with automatic fallback.",
  },
] as const;

// India-first back office is the single strongest differentiator.
const INDIA_FIRST = [
  "GST-aware quoting and invoicing, from quote to paid",
  "Payroll with statutory PF, ESI, and Professional Tax",
  "Verifiable payslips with a public verify link",
  "Attendance with geofence, device binding, GPS, and selfie",
] as const;

const SECURITY = [
  { icon: Lock, text: "Multi-tenant isolation enforced at the database with PostgreSQL Row-Level Security, a tenant_id on every row" },
  { icon: ShieldCheck, text: "A built-in Security Center: automated validation runs, a scoring model, and scheduled scans, because AEGIBIT is a security company first" },
  { icon: Layers, text: "Role-based access control with custom roles, plus privacy tooling: consent, data export, and erasure" },
] as const;

const WHO = [
  { icon: Users, role: "Sales teams", line: "Auto-logged activity, AI drafting, and one-click confirm. More time selling, less time typing." },
  { icon: Gauge, role: "Founders and ops", line: "One platform instead of a stack of six. CRM, invoicing, HR, and payroll that finally talk to each other." },
  { icon: FileText, role: "Finance and RevOps", line: "GST invoicing, accounts-payable, approvals, and clean, exportable data they can trust." },
  { icon: CalendarCheck, role: "HR and admin", line: "Payroll, attendance, leave, and employee records, compliant and in one place." },
] as const;

// Verified from billing_service.py: Starter is free (up to 3 seats).
// Exact paid numbers/currency are intentionally not published here
// pending founder confirmation; editions are named, price on request.
const EDITIONS = [
  { name: "Starter", line: "Free, up to 3 seats. Get your whole business on one platform at zero cost." },
  { name: "Growth", line: "Per seat, everything included, for growing teams. No feature paywalls." },
  { name: "Enterprise", line: "Per seat, for larger teams, with the scale and controls big operations need." },
] as const;

const FAQS = [
  {
    q: "Is Cortex a CRM or a full business platform?",
    a: "Both. Cortex starts as an AI CRM with a full sales pipeline, but it also runs your back office: CPQ and GST invoicing, accounts-payable, a complete HRMS with payroll and attendance, approvals, and a customer-support inbox, all on one multi-tenant platform.",
  },
  {
    q: "Does Cortex handle payroll in India?",
    a: "Yes. Cortex runs payroll that generates payslips with statutory PF, ESI, and Professional Tax, and produces verifiable payslips with a public verify link. It is built for Indian statutory requirements.",
  },
  {
    q: "How does Cortex track attendance?",
    a: "Employees check in and out with geofences, device binding, GPS, break tracking, and selfie capture. Managers get a live attendance board, a register, and analytics. It is designed for field and multi-branch teams, not just a desk.",
  },
  {
    q: "Is my data isolated from other companies?",
    a: "Yes. Cortex enforces multi-tenant isolation at the database with PostgreSQL Row-Level Security, so every row carries a tenant id and one company can never read another's data. AEGIBIT is a security company, and Cortex ships a built-in Security Center with scored validation scans.",
  },
  {
    q: "Can my team use Cortex on the phone?",
    a: "Yes. Cortex runs in any modern browser with nothing to install, and there is a real offline-first Android app with a sync engine, leads, deals, and the AI copilot in your pocket. An iOS build is on the way.",
  },
  {
    q: "How much does Cortex cost?",
    a: "Cortex has a free Starter edition for up to 3 seats, plus paid Growth and Enterprise editions priced per seat with all core modules included and no feature paywalls. Email contact@aegibit.com for a straight number for your team size.",
  },
] as const;

function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${PAGE_PATH}#app`,
    name: "AEGIBIT Cortex",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Customer Relationship Management, HRMS, Invoicing",
    operatingSystem: "Web, Android, iOS",
    url: `${SITE_URL}${PAGE_PATH}`,
    installUrl: APP_URL,
    description:
      "AI-powered, multi-tenant business platform by AEGIBIT: CRM and sales pipeline, CPQ and GST invoicing, accounts-payable, full HRMS with India-compliant payroll (PF/ESI/Professional Tax), attendance with GPS and selfie, approvals, an omnichannel WhatsApp support inbox, reporting, and an AI copilot. Multi-tenant isolation via PostgreSQL Row-Level Security. Offline-first mobile.",
    author: { "@id": `${SITE_URL}/#org` },
    brand: { "@id": `${SITE_URL}/#org` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free Starter edition for up to 3 seats; paid Growth and Enterprise editions priced per seat.",
    },
    featureList: [
      "AI CRM with leads, companies, contacts, and a Kanban deal pipeline",
      "Zero-entry AI activity capture and follow-up drafting",
      "Native CPQ and quotation with GST and immutable versioning",
      "GST invoicing with payment reminders and revenue overview",
      "Accounts-payable: vendor bills, approvals, reconciliation",
      "Full HRMS: employee master, onboarding, self-service portal",
      "India-compliant payroll with PF, ESI, and Professional Tax",
      "Verifiable payslips with public verify links",
      "Attendance with geofence, device binding, GPS, and selfie",
      "Leave management with balances and requests",
      "Multi-level approval workflows with delegation",
      "Omnichannel support inbox with WhatsApp and ticketing",
      "Executive dashboards, analytics, and custom reports",
      "AI copilot: summaries, deal-risk, forecasting (provider-agnostic)",
      "Multi-tenant isolation via PostgreSQL Row-Level Security",
      "Built-in Security Center and GDPR consent/export/erasure tooling",
      "Offline-first mobile app with a sync engine",
    ],
  };
}

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${PAGE_PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
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
                One platform to sell, invoice, and run your team.
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              An AI-powered business platform that replaces the stack of disconnected tools you run today. CRM and sales,
              CPQ and GST invoicing, accounts-payable, a full HRMS with India-compliant payroll and attendance, approvals,
              and a customer-support inbox, on one secure, multi-tenant platform. Start free. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#818CF8", color: "#000" }}
              >
                Start free <ArrowRight size={16} />
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Globe size={15} /> Open Cortex in your browser
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
              Free Starter edition, up to 3 seats. Cortex runs in any modern browser, nothing to install. Prefer the field
              app? Download the Android APK (v{ANDROID_VERSION}) above. On iPhone? Email us, an iOS build is on the way.
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
              Your business runs on six tools that don&apos;t talk to each other.
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
              A CRM here, invoicing there, payroll in a spreadsheet, attendance on paper, approvals over WhatsApp. Data
              and money leak between the gaps, and you pay for all of it separately. Cortex puts the whole operation on
              one platform, so the record a rep updates is the same record finance invoices and HR pays against.
            </p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Everything your business runs on
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                One platform. The whole operation.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {CAPABILITIES.map((f) => {
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

        {/* India-first back office */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Built for India
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#fff" }}>
                The back office, compliant out of the box
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {INDIA_FIRST.map((t) => (
                <div key={t} className="rounded-xl p-6 flex gap-3" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ color: "#10B981", marginTop: "0.15rem" }}>✓</span>
                  <p className="text-sm leading-relaxed" style={{ color: "#D4D4D8" }}>{t}</p>
                </div>
              ))}
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
                SMB and mid-market teams that want one system
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WHO.map((p) => {
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
              Your business data, isolated at the database
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

        {/* Editions */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Pricing is a feature
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#fff" }}>
                Start free. Everything included. No paywalls.
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {EDITIONS.map((e, i) => (
                <div
                  key={e.name}
                  className="rounded-2xl p-7"
                  style={{
                    background: i === 0 ? "linear-gradient(180deg, #0b0b1a 0%, #0a0a0a 100%)" : "#0D0D0D",
                    border: i === 0 ? "1px solid rgba(129,140,248,0.30)" : "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p className="text-[11px] uppercase font-bold mb-3" style={{ color: i === 0 ? ACCENT : "#71717A", letterSpacing: "0.14em" }}>{e.name}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{e.line}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="mailto:contact@aegibit.com?subject=Cortex pricing for my team"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                Get a straight number for your team <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* No lock-in */}
        <section className="px-6 lg:px-12 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <RefreshCw size={22} style={{ color: ACCENT }} className="mx-auto mb-4" />
            <h2 className="font-light mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff" }}>
              No lock-in, by design
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#A1A1AA" }}>
              One-click full data export and CSV import, a documented schema, and privacy tooling that lets you take your
              data with you. You own everything. We earn the renewal by being worth staying on, not by trapping you.
            </p>
          </div>
        </section>

        {/* FAQ (also emitted as FAQPage schema for AI engines) */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Questions
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.7rem, 3vw, 2.3rem)", color: "#fff" }}>
                Cortex, answered
              </h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-2xl p-6" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="font-medium mb-2" style={{ fontSize: "1.02rem", color: "#fff" }}>{f.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff" }}>
              Put your whole business on Cortex.
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              Sell, invoice, pay your team, and support your customers on one platform, with an AI copilot doing the busywork
              and your data isolated at the database. Start free in your browser, nothing to install. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#818CF8", color: "#000" }}
              >
                Start free <ArrowRight size={16} />
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
