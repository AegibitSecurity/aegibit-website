import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import {
  Smartphone, ShieldCheck, Fingerprint, EyeOff, ArrowRight,
  Download, Lock, CheckCircle2, ScanSearch,
} from "lucide-react";

/**
 * /products/cortex/install - the guided, verifiable Android install page.
 *
 * Purpose: Cortex is distributed as a direct APK (deliberately not on the
 * Play Store), so Android shows its standard sideload warnings. This page
 * turns that moment into a trust moment: it explains each warning with the
 * exact wording, publishes the release's SHA-256 fingerprint so anyone can
 * verify the file, and states plainly which permissions Cortex never asks
 * for. Honesty bar: every claim here is verifiable - the fingerprint is
 * computed from the actual `cortex-latest` release asset, and the
 * permission list matches the shipped Android manifest (foreground-service
 * location only, no background location, no contacts/SMS/call-log access).
 *
 * MAINTENANCE: when a new APK is uploaded to the `cortex-latest` release,
 * update APK_SHA256 (+ version/size) below. Compute it with:
 *   certutil -hashfile cortex.apk SHA256
 */

const PAGE_PATH = "/products/cortex/install";
const ANDROID_APK_URL = "/download/cortex-android";
const APK_VERSION = "1.1.0";
const APK_SIZE = "110 MB";
const APK_UPDATED = "29 August 2026";
const APK_SHA256 = "09279a18ba0aa3cf4acd5267eac78458d8c8352ba8d0991941194ae6c4595802";
const VIRUSTOTAL_URL = `https://www.virustotal.com/gui/file/${APK_SHA256}`;

export const metadata: Metadata = buildMetadata({
  title: "Install AEGIBIT Cortex on Android: Verified APK, Fingerprint & Guide",
  description:
    "The official, signed AEGIBIT Cortex Android app. Step-by-step install guide, the release's SHA-256 fingerprint for independent verification, a multi-engine antivirus scan link, and a plain statement of the permissions Cortex never requests.",
  path: PAGE_PATH,
  keywords: [
    "AEGIBIT Cortex Android app",
    "Cortex APK download",
    "verified APK install",
    "Cortex attendance app",
    "AEGIBIT",
  ],
});

const ACCENT = "#818CF8";
const OK = "#10B981";
const WARN = "#F59E0B";

// The three standard Android sideload prompts, with the exact action to take.
const STEPS = [
  {
    n: "1",
    title: "Chrome asks about the download",
    dialogTitle: "File might be harmful",
    dialogBody: "cortex.apk · Do you want to download cortex.apk anyway?",
    action: "Tap “Download anyway”",
  },
  {
    n: "2",
    title: "Android asks for one-time permission",
    dialogTitle: "Install unknown apps",
    dialogBody: "Your phone is not allowed to install unknown apps from this source.",
    action: "Tap “Settings” → allow this source → go back",
  },
  {
    n: "3",
    title: "Play Protect double-checks",
    dialogTitle: "App from unknown developer",
    dialogBody: "Play Protect doesn’t recognise this app’s developer.",
    action: "Tap “More details” → “Install anyway”",
  },
];

const NEVER = [
  "Contacts",
  "SMS or call logs",
  "Files and photos on your phone",
  "Microphone",
  "Location when you are off shift",
];

export default function CortexInstallPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "AEGIBIT Cortex", href: "/products/cortex" },
    { name: "Install on Android", href: PAGE_PATH },
  ]);

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" style={{ background: "#000" }}>
        {/* Hero */}
        <section className="relative px-6 lg:px-12 pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(129,140,248,0.12) 0%, transparent 70%)" }} />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(129,140,248,0.10)", border: "1px solid rgba(129,140,248,0.35)" }}>
              <ShieldCheck size={13} style={{ color: ACCENT }} />
              <span className="text-[11px] uppercase font-medium" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Official download &middot; signed by AEGIBIT
              </span>
            </div>
            <h1 className="font-light leading-tight mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: "#fff" }}>
              Install Cortex on Android.{" "}
              <span style={{ background: "linear-gradient(135deg, #fff 0%, #818CF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Verified, fingerprinted, yours.
              </span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl mx-auto mb-9" style={{ color: "#A1A1AA" }}>
              Cortex ships directly from AEGIBIT, not an app store, so you always get the exact build we
              signed. This page gives you the file, the proof it is genuine, and what to expect during install.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={ANDROID_APK_URL}
                download
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: ACCENT, color: "#000" }}
              >
                <Download size={16} /> Download Cortex for Android
              </a>
              <a
                href="/products/cortex"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}
              >
                About Cortex <ArrowRight size={15} />
              </a>
            </div>
            <p className="mt-5 text-xs" style={{ color: "#52525B" }}>
              Version {APK_VERSION} &middot; {APK_SIZE} &middot; updated {APK_UPDATED} &middot; Android 8.0+
            </p>
          </div>
        </section>

        {/* Trust strip */}
        <section className="px-6 lg:px-12 pb-16">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
            {[
              { icon: Fingerprint, t: "Fingerprinted release", b: "Every build's SHA-256 is published here. A file that doesn't match isn't ours." },
              { icon: ScanSearch, t: "Independently scanned", b: "Check this exact file against 70+ antivirus engines on VirusTotal, not our word." },
              { icon: EyeOff, t: "Minimal permissions", b: "No contacts, no SMS, no files, no off-shift tracking. Attendance needs only what it needs." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <c.icon size={18} style={{ color: ACCENT }} className="mb-3" />
                <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#fff" }}>{c.t}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#A1A1AA" }}>{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why the warnings */}
        <section className="px-6 lg:px-12 py-16 md:py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                What to expect
              </p>
              <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#fff" }}>
                Android warns for every app installed outside the Play Store.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-xl mx-auto" style={{ color: "#A1A1AA" }}>
                These prompts appear for all direct-download apps, including the direct APKs banks publish
                themselves. They mean &ldquo;this didn&rsquo;t come through Google&rsquo;s store&rdquo;, not
                &ldquo;this app is unsafe&rdquo;. Here is each screen and exactly what to tap.
              </p>
            </div>

            <div className="space-y-6">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-5">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full font-semibold text-sm"
                    style={{ width: 34, height: 34, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.4)", color: ACCENT }}
                  >
                    {s.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold mb-2" style={{ color: "#fff" }}>{s.title}</h3>
                    <div className="rounded-xl px-5 py-4 max-w-md" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: WARN }}>&#9888; {s.dialogTitle}</p>
                      <p className="text-[13px] mb-2.5" style={{ color: "#A1A1AA" }}>{s.dialogBody}</p>
                      <p className="text-[13px] font-semibold" style={{ color: ACCENT }}>&rarr; {s.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fingerprint */}
        <section className="px-6 lg:px-12 py-16 md:py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Verify before you trust
              </p>
              <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#fff" }}>
                The fingerprint that cannot be faked.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-xl mx-auto" style={{ color: "#A1A1AA" }}>
                Every genuine copy of this release has exactly one SHA-256 fingerprint. If a file claiming to
                be Cortex shows a different one, it did not come from us: delete it and download from this page.
              </p>
            </div>

            <div className="rounded-2xl p-6 md:p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[11px] uppercase font-medium mb-3" style={{ color: "#52525B", letterSpacing: "0.18em" }}>
                SHA-256 &middot; cortex.apk &middot; v{APK_VERSION}
              </p>
              <code
                className="block text-[13px] leading-relaxed break-all rounded-xl px-5 py-4 mb-5"
                style={{ background: "#0A0F1A", color: "#6EE7B7", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {APK_SHA256}
              </code>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <p className="text-[13px]" style={{ color: "#A1A1AA" }}>
                  <Lock size={13} className="inline mr-1.5 -mt-0.5" style={{ color: OK }} />
                  Windows: <code style={{ color: "#D4D4D8" }}>certutil -hashfile cortex.apk SHA256</code>
                </p>
                <a
                  href={VIRUSTOTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[13px] self-start"
                  style={{ border: "1px solid rgba(16,185,129,0.4)", color: OK }}
                >
                  <ScanSearch size={14} /> Open the VirusTotal scan
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Permissions honesty */}
        <section className="px-6 lg:px-12 py-16 md:py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase font-medium mb-4" style={{ color: ACCENT, letterSpacing: "0.2em" }}>
                Permissions, in plain words
              </p>
              <h2 className="font-light mb-5" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", color: "#fff" }}>
                Only what attendance needs. Nothing else.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#fff" }}>Cortex asks for</h3>
                <ul className="space-y-2.5">
                  <li className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: "#A1A1AA" }}>
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: OK }} />
                    <span><b style={{ color: "#D4D4D8" }}>Location, while clocked in</b> - for office geofencing. Tracking starts at clock-in and stops at clock-out, with a visible notification the whole time.</span>
                  </li>
                  <li className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: "#A1A1AA" }}>
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: OK }} />
                    <span><b style={{ color: "#D4D4D8" }}>Camera</b> - only for the punch selfie you take yourself.</span>
                  </li>
                  <li className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: "#A1A1AA" }}>
                    <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: OK }} />
                    <span><b style={{ color: "#D4D4D8" }}>Notifications</b> - approvals, payslips, and reminders from your company.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#fff" }}>Cortex never requests</h3>
                <ul className="space-y-2.5">
                  {NEVER.map((n) => (
                    <li key={n} className="flex gap-2.5 text-[13px]" style={{ color: "#A1A1AA" }}>
                      <EyeOff size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#52525B" }} />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 lg:px-12 py-16 md:py-20 border-t text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="max-w-xl mx-auto">
            <Smartphone size={20} className="mx-auto mb-5" style={{ color: ACCENT }} />
            <h2 className="font-light mb-6" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", color: "#fff" }}>
              Ready when you are.
            </h2>
            <a
              href={ANDROID_APK_URL}
              download
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: ACCENT, color: "#000" }}
            >
              <Download size={16} /> Download Cortex v{APK_VERSION}
            </a>
            <p className="mt-6 text-xs" style={{ color: "#52525B" }}>
              Questions about a warning on your specific phone?{" "}
              <a href="mailto:contact@aegibit.com?subject=Cortex Android install" style={{ color: ACCENT }}>
                contact@aegibit.com
              </a>{" "}
              - we answer fast.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
