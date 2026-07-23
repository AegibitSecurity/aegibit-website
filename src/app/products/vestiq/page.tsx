import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { DownloadStats } from "@/components/shared/DownloadStats";
import {
  Receipt, FileText, MessageCircle, Users, Wallet, Repeat,
  BarChart3, ShieldCheck, Scissors, RefreshCw, ArrowRight,
  Download, Globe, Lock, MapPin,
} from "lucide-react";

/**
 * /products/vestiq, the Vestiq product page.
 *
 * Vestiq is AEGIBIT's Boutique OS: mobile-first billing and shop
 * management for Indian boutiques and tailoring businesses. Live at
 * vestiq.aegibit.com, Android APK available. Every feature listed here
 * is live in production today (per the product brief); the two upcoming
 * items are clearly marked "Coming soon". Honesty bar unchanged.
 */

export const revalidate = 300; // refresh the live download counter

const PAGE_PATH = "/products/vestiq";
const APP_URL = "https://vestiq.aegibit.com";
const APK_URL = "https://vestiq.aegibit.com/Vestiq.apk";

export const metadata: Metadata = buildMetadata({
  title: "Vestiq: Boutique Billing and Shop Management App",
  description:
    "Vestiq is AEGIBIT's Boutique OS. Mobile-first billing and shop management for Indian boutiques and tailoring businesses. Branded PDF bills, WhatsApp sharing, payment tracking, exchanges, reports, and leakage protection. Powered by AEGIBIT.",
  path: PAGE_PATH,
  keywords: [
    "boutique billing app",
    "boutique management software",
    "tailoring shop software",
    "billing app for boutique India",
    "boutique POS app",
    "Vestiq",
    "AEGIBIT",
  ],
});

const FEATURES = [
  { icon: Receipt, title: "Professional billing in seconds", body: "Itemized bills with a built-in boutique catalog (Saree, Party Wear Saree, Blouse, Designer Blouse, Kurti and more) plus custom items, quantity steppers, and automatic totals. Discounts by percentage, round-off, and net bill value computed live. Bills numbered like BAB/0001/26-27, with shop initials, sequence, and the Indian financial year." },
  { icon: FileText, title: "Branded PDF bills, automatically", body: "Every bill generates a PDF with the boutique's own logo banner, shop address and phone numbers, a PAID stamp when settled or a PAYMENT DUE watermark with pay-by date when money is pending, a thank-you greeting, and the shop's exchange policy printed in bold red." },
  { icon: MessageCircle, title: "WhatsApp-native sharing", body: "One tap opens the customer's WhatsApp chat with a warm greeting and the bill link prefilled, even if the number is not saved in contacts. Customers open a live bill page styled exactly like the paper bill that always shows current status: pay the balance and the same link shows PAID." },
  { icon: Users, title: "Know every customer's standing instantly", body: "Customers are identified by phone number. The moment a returning customer's number is typed on a new bill, the app shows their standing: a red card with exact pending bills and amounts, or a green all-clear with their visit history. The Customers tab totals all pending money, debtors first." },
  { icon: Wallet, title: "Full payment tracking", body: "Cash, UPI, card, bank. Advances, partials, refunds. Bills settle automatically when fully paid and reopen if a payment is removed. One-tap WhatsApp payment reminders." },
  { icon: Repeat, title: "Product exchanges done right", body: "Exchange any item on the same bill: a cheaper replacement leaves an advance balance for the next purchase; a dearer one shows exactly what remains to collect. Old items stay visible struck-through, discounts reset for the fresh deal, and a dedicated Exchange tab lists every exchange ever made." },
  { icon: BarChart3, title: "Reports the owner actually needs", body: "Cash-in-hand and UPI-in-hand that never reset at midnight, opening balances, collections by day, week, month, and financial year, expense tracking per vendor with purpose, and an item sales dashboard showing quantity, revenue share, and totals per product with a chart." },
  { icon: ShieldCheck, title: "Leakage protection built in", body: "Staff cannot delete or edit bills, payments, or discounts. Only the owner can delete, and every action lands in a permanent audit log. Undocumented discounts are flagged. A bill cannot quietly disappear." },
  { icon: Scissors, title: "Tailoring workflow", body: "Production orders with customizable stages, worker (Masterji and Karigar) assignment and payout tracking, and customer measurement records." },
  { icon: RefreshCw, title: "Always up to date", body: "The app updates itself silently. Every improvement AEGIBIT ships reaches every boutique's phone within minutes, no reinstall." },
] as const;

const SECURITY = [
  { icon: Lock, text: "Every boutique's data is isolated with database-level row security" },
  { icon: ShieldCheck, text: "Financial records are immutable by design, tracked to the paisa" },
  { icon: MapPin, text: "Hosted in India (Mumbai region)" },
] as const;

function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${PAGE_PATH}#app`,
    name: "Vestiq",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Billing and Shop Management",
    operatingSystem: "Android, Web",
    url: `${SITE_URL}${PAGE_PATH}`,
    installUrl: APK_URL,
    description:
      "Boutique OS by AEGIBIT. Mobile-first billing and shop management for Indian boutiques and tailoring businesses: branded PDF bills, WhatsApp sharing, payment tracking, exchanges, reports, and leakage protection.",
    author: { "@id": `${SITE_URL}/#org` },
    brand: { "@id": `${SITE_URL}/#org` },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: "599",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "599",
        priceCurrency: "INR",
        unitText: "boutique/month",
      },
      availability: "https://schema.org/InStock",
      description: "Standard plan at 599 rupees per boutique per month.",
    },
    featureList: [
      "Itemized billing with boutique catalog",
      "Branded PDF bills with PAID and PAYMENT DUE states",
      "WhatsApp-native bill sharing and live bill pages",
      "Customer standing by phone number",
      "Cash, UPI, card, and bank payment tracking",
      "Product exchanges with advance balances",
      "Owner reports and item sales dashboard",
      "Immutable records with owner-only deletes and audit log",
      "Tailoring production orders and measurements",
      "Silent automatic updates",
    ],
  };
}

export default async function VestiqPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Vestiq", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10B981" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10B981" }} />
              </span>
              <span className="text-[11px] uppercase font-medium" style={{ color: "#10B981", letterSpacing: "0.2em" }}>
                Live · Android and Web
              </span>
            </div>
            <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
              Vestiq.{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #F97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                The Boutique OS.
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              Born inside Burimar Abha Boutique, its founding client, and built around how a real boutique actually
              runs. Mobile-first billing and shop management for Indian boutiques and tailoring businesses. Branded bills,
              WhatsApp-native sharing, airtight payment tracking, and leakage protection. Runs as an Android app and in
              any browser. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={`mailto:contact@aegibit.com?subject=Vestiq for my boutique`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#F97316", color: "#000" }}
              >
                Get Vestiq for your boutique <ArrowRight size={16} />
              </a>
              <a
                href={`${SITE_URL}/api/download/vestiq`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Download size={15} /> Download for Android
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Globe size={15} /> Open in browser
              </a>
            </div>
          </div>
        </section>

        {/* Exact live download count (standing rule: real numbers only) */}
        <DownloadStats app="vestiq" />

        {/* Features */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
                Everything below is live today
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Run the whole boutique from your phone
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}>
                      <Icon size={20} style={{ color: "#F97316" }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.15rem", color: "#fff" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security posture */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#F97316", letterSpacing: "0.2em" }}>
              Built by a security company
            </p>
            <h2 className="font-light mb-10" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#fff" }}>
              Your books, protected like they matter
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

        {/* Pricing + coming soon */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8" style={{ background: "linear-gradient(180deg, #1a1004 0%, #0a0a0a 100%)", border: "1px solid rgba(249,115,22,0.30)" }}>
              <p className="text-[11px] uppercase font-bold mb-3" style={{ color: "#F97316", letterSpacing: "0.16em" }}>Simple pricing</p>
              <p className="mb-2"><span style={{ fontSize: "2.6rem", color: "#fff", fontWeight: 600 }}>₹599</span><span className="text-sm" style={{ color: "#A1A1AA" }}> per boutique per month</span></p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#A1A1AA" }}>One plan, everything included, silent updates forever. No hardware, no setup fee.</p>
              <a
                href={`mailto:contact@aegibit.com?subject=Vestiq for my boutique`}
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#F97316" }}
              >
                Get Vestiq for your boutique <ArrowRight size={15} />
              </a>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] uppercase font-bold mb-4" style={{ color: "#71717A", letterSpacing: "0.16em" }}>Coming soon</p>
              <ul className="space-y-4">
                <li className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#D4D4D8", fontWeight: 500 }}>Automatic WhatsApp bill delivery.</span>{" "}
                  Bills delivered straight to customers via the WhatsApp Business API.
                </li>
                <li className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#D4D4D8", fontWeight: 500 }}>AI-assisted measurement capture.</span>{" "}
                  Faster, cleaner tailoring measurements.
                </li>
              </ul>
              <p className="text-xs mt-6" style={{ color: "#52525B" }}>Marked upcoming honestly: these are not live yet.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", color: "#fff" }}>
              Put your boutique on Vestiq.
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              Billing, customers, payments, exchanges, tailoring, and reports, all in one app that protects your money.
              Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={`mailto:contact@aegibit.com?subject=Vestiq for my boutique`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#F97316", color: "#000" }}
              >
                Get Vestiq for your boutique <ArrowRight size={16} />
              </a>
              <a
                href={`${SITE_URL}/api/download/vestiq`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Download size={15} /> Download for Android
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
