import { COMPANY_DESCRIPTION } from "@/content/product-catalog";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ConsentedAnalytics } from "@/components/shared/ConsentedAnalytics";
import { ConsentBanner } from "@/components/shared/ConsentBanner";
import { TrackingProvider } from "@/components/shared/TrackingProvider";
import { MarketingChrome } from "@/components/shared/MarketingChrome";
import { SITE_URL } from "@/lib/seo";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  // Use the normalized SITE_URL from src/lib/seo so metadataBase
  // always emits www.aegibit.com regardless of whether
  // NEXT_PUBLIC_APP_URL is set to apex or www in Vercel. Bug surfaced
  // in Search Console: homepage <link rel=canonical> was pointing at
  // apex `https://aegibit.com`, which Google treated as duplicate of
  // www.aegibit.com and refused to index either.
  metadataBase: new URL(SITE_URL),
  alternates: {
    // Canonical URL prevents Google from treating www.aegibit.com,
    // aegibit.com, and *.vercel.app as separate websites. Edge proxy
    // (src/proxy.ts) also enforces this with 308s.
    canonical: "/",
  },
  // Note: icons + opengraph image are auto-injected by Next.js from the
  // file conventions in src/app, see icon.tsx, apple-icon.tsx,
  // opengraph-image.tsx, twitter-image.tsx, and public/icon.svg.
  // We override only the bits the convention can't infer.
  manifest: "/manifest.webmanifest",
  title: {
    default: "AEGIBIT Global Consulting | Business Software & Development",
    template: "%s | AEGIBIT",
  },
  description:
    COMPANY_DESCRIPTION,
  keywords: [
    "AEGIBIT",
    "operational software",
    "multi-branch expense management",
    "PayMint",
    "custom business software",
    "cybersecurity software India",
    "SaaS for dealerships",
    "audit-grade software",
    "Tally integration",
    "Zero Trust",
  ],
  authors: [{ name: "AEGIBIT Global Consulting" }],
  applicationName: "AEGIBIT",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.aegibit.com",
    siteName: "AEGIBIT",
    title: "AEGIBIT, Built to Outlast",
    description:
      COMPANY_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIBIT, Built to Outlast",
    description:
      COMPANY_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#000] text-white">
        {/*
          Skip-to-content link, first focusable element on every
          page. Keyboard users hit Tab once and can jump past the
          navbar straight to <main>. Visually hidden until focused
          (see .skip-to-content in globals.css). Each page wraps
          its content in <main id="main-content"> so this anchor
          resolves cleanly.
        */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <TrackingProvider>{children}</TrackingProvider>
        {/*
          Site-wide marketing chrome, scroll progress, mobile CTA,
          social proof, exit-intent, live badge. Self-gates by pathname
          (renders null on /admin, /dashboard, /api, /signup, /login).
          Each child has its own internal triggers (engagement score,
          mobile detection, etc.). See MarketingChrome.tsx for the full
          rationale + the "why each component" doc.
        */}
        <MarketingChrome />
        <ConsentBanner />
        <ConsentedAnalytics />
      </body>
    </html>
  );
}
