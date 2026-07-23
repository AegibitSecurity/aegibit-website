import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { DownloadCountBadge } from "@/components/shared/DownloadCountBadge";
import {
  Gauge, Bell, Lock, ShieldCheck, RefreshCw, Sparkles,
  Workflow, ArrowRight, Download, Globe, TimerReset,
} from "lucide-react";

/**
 * /products/leadsync, the LeadSync product page.
 *
 * LeadSync is AEGIBIT's dealership operating system: a premium mobile
 * OS for automobile dealerships, running live in the field with a real
 * dealership group. Same honesty bar as every product page: the
 * features listed are what is shipped and live today (Phase 1); the
 * Phase 2 roadmap is clearly marked "Coming soon". APK is distributed
 * via a pinned GitHub release and counted through /api/download/leadsync
 * (standing rule: exact, live download numbers).
 */

const PAGE_PATH = "/products/leadsync";
const CONSOLE_URL = "https://leadsync.ssgroupindia.net";
const APK_URL = "https://github.com/AegibitSecurity/aegibit-website/releases/download/leadsync-v0.1.0/Leadsync.apk";

export const metadata: Metadata = buildMetadata({
  title: "LeadSync: The Dealership Operating System",
  description:
    "LeadSync is AEGIBIT's mobile operating system for automobile dealerships. One canvas from lead to delivery: premium interface, field-proven reliability, silent updates. Android and web. Powered by AEGIBIT.",
  path: PAGE_PATH,
  keywords: [
    "dealership management app",
    "automobile dealership software",
    "lead management app dealership",
    "dealership CRM India",
    "LeadSync",
    "AEGIBIT",
  ],
});

const FEATURES = [
  { icon: Workflow, title: "One dealership journey, one canvas", body: "Built around the full front-of-house flow: lead, enquiry, booking, test drive, and onward to delivery. The navigable shell, pipeline, and inbox are live today, and the deeper workflow engine grafts onto this same canvas." },
  { icon: Gauge, title: "A command dashboard, not a spreadsheet", body: "Quick stats, an activity timeline, a customers carousel, and task cards the moment you open the app. The state of the floor in one glance, on the phone in your pocket." },
  { icon: Bell, title: "Notification center that respects attention", body: "Grouped, filterable notifications instead of an unread flood. Pipeline, inbox, and profile live in glassmorphic bottom tabs a salesperson can drive one-handed." },
  { icon: Lock, title: "Phone + OTP sign-in, tokens locked down", body: "No passwords to leak. Staff sign in with phone and OTP; session tokens live in the device's secure store with automatic refresh underneath." },
  { icon: ShieldCheck, title: "Field-proven reliability rules", body: "Every network call in a UI hot path races a hard timeout and surfaces a retry in place, never a frozen spinner. A splash watchdog guarantees the app opens. These rules exist because a live dealership runs on this app every day." },
  { icon: TimerReset, title: "Updates that never interrupt a sale", body: "Improvements ship over the air and activate on the next cold start, never mid-session. No reinstalls, no update nags, no frozen screens in front of a customer." },
  { icon: Sparkles, title: "An interface customers can see", body: "Matte-black design system, 60 to 120 fps native animations, haptic feedback on every meaningful tap. It looks premium because the dealership's brand deserves premium." },
  { icon: Globe, title: "Android and web from one codebase", body: "The same app runs as a native Android APK and as a web console in any browser, one codebase, always in sync." },
] as const;

const SECURITY = [
  { icon: Lock, text: "Session tokens in the device secure store, with automatic refresh" },
  { icon: ShieldCheck, text: "Hard timeouts on every hot-path call, retry in place, never a freeze" },
  { icon: RefreshCw, text: "Over-the-air updates activate on cold start only, never mid-session" },
] as const;

function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${PAGE_PATH}#app`,
    name: "LeadSync",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Dealership Management",
    operatingSystem: "Android, Web",
    url: `${SITE_URL}${PAGE_PATH}`,
    installUrl: APK_URL,
    description:
      "Dealership operating system by AEGIBIT: lead-to-delivery workflow, command dashboard, notification center, phone + OTP auth, field-proven reliability, silent over-the-air updates.",
    author: { "@id": `${SITE_URL}/#org` },
    brand: { "@id": `${SITE_URL}/#org` },
    featureList: [
      "Lead to delivery pipeline shell",
      "Command dashboard with stats, timeline, and tasks",
      "Grouped, filterable notification center",
      "Phone + OTP authentication with secure token storage",
      "Hard-timeout reliability rules on every hot path",
      "Silent over-the-air updates",
      "Android APK and web console from one codebase",
    ],
  };
}

export default function LeadSyncPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "LeadSync", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,189,248,0.10) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.35)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10B981" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10B981" }} />
              </span>
              <span className="text-[11px] uppercase font-medium" style={{ color: "#10B981", letterSpacing: "0.2em" }}>
                Live in the field · Android and Web
              </span>
            </div>
            <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff" }}>
              LeadSync.{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                The Dealership OS.
              </span>
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              A premium mobile operating system for automobile dealerships. Lead to delivery on one canvas, with an
              interface your customers can see and reliability rules proven on a live dealership floor. Chosen by
              Nibir Motors as their second AEGIBIT platform after PayMint proved itself across all seven branches.
              Runs as an Android app and in any browser. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={`mailto:contact@aegibit.com?subject=LeadSync for my dealership`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#38BDF8", color: "#000" }}
              >
                Get LeadSync for your dealership <ArrowRight size={16} />
              </a>
              <a
                href={`${SITE_URL}/api/download/leadsync`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Download size={15} /> Download for Android
              </a>
              <a
                href={CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                <Globe size={15} /> Open web console
              </a>
            </div>
            <div className="mt-7 flex justify-center">
              <DownloadCountBadge app="leadsync" source="via aegibit.com" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 lg:px-12 py-20 md:py-24 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#38BDF8", letterSpacing: "0.2em" }}>
                Everything below is live today
              </p>
              <h2 className="font-light" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff" }}>
                Run the showroom floor from a phone
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-7" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}>
                      <Icon size={20} style={{ color: "#38BDF8" }} />
                    </div>
                    <h3 className="font-medium mb-2" style={{ fontSize: "1.15rem", color: "#fff" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>{f.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security and reliability */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[11px] uppercase font-medium mb-4" style={{ color: "#38BDF8", letterSpacing: "0.2em" }}>
              Built by a security company
            </p>
            <h2 className="font-light mb-10" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", color: "#fff" }}>
              Engineered for a floor that cannot freeze
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

        {/* Pricing + roadmap */}
        <section className="px-6 lg:px-12 py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-8" style={{ background: "linear-gradient(180deg, #041420 0%, #0a0a0a 100%)", border: "1px solid rgba(56,189,248,0.30)" }}>
              <p className="text-[11px] uppercase font-bold mb-3" style={{ color: "#38BDF8", letterSpacing: "0.16em" }}>Enterprise</p>
              <p className="mb-2" style={{ fontSize: "1.6rem", color: "#fff", fontWeight: 500 }}>Priced per dealership</p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#A1A1AA" }}>Deployment, onboarding, and support scoped to your group. Tell us your floor size and we will give you a straight number.</p>
              <a
                href={`mailto:contact@aegibit.com?subject=LeadSync for my dealership`}
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#38BDF8" }}
              >
                Talk to us <ArrowRight size={15} />
              </a>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[11px] uppercase font-bold mb-4" style={{ color: "#71717A", letterSpacing: "0.16em" }}>Coming soon</p>
              <ul className="space-y-4">
                <li className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#D4D4D8", fontWeight: 500 }}>Full pipeline kanban.</span>{" "}
                  The complete lead workflow, drag and drop across stages.
                </li>
                <li className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#D4D4D8", fontWeight: 500 }}>Finance and allocation workflows.</span>{" "}
                  Finance, insurance, documents, and vehicle allocation on the same canvas.
                </li>
                <li className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
                  <span style={{ color: "#D4D4D8", fontWeight: 500 }}>Dealership ops console.</span>{" "}
                  The management view across branches.
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
              Put your dealership on LeadSync.
            </h2>
            <p className="text-base leading-relaxed mb-9" style={{ color: "#A1A1AA" }}>
              One canvas from lead to delivery, an interface your customers can see, and reliability proven on a live
              floor. Powered by AEGIBIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={`mailto:contact@aegibit.com?subject=LeadSync for my dealership`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: "#38BDF8", color: "#000" }}
              >
                Get LeadSync for your dealership <ArrowRight size={16} />
              </a>
              <a
                href={`${SITE_URL}/api/download/leadsync`}
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
