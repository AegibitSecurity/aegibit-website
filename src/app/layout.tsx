import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { TrackingProvider } from "@/components/shared/TrackingProvider";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.aegibit.com"),
  alternates: {
    // Canonical URL prevents Google from treating www.aegibit.com,
    // aegibit.com, and *.vercel.app as separate websites. Edge
    // middleware (src/middleware.ts) also enforces this with 308s.
    canonical: "/",
  },
  // Note: icons + opengraph image are auto-injected by Next.js from the
  // file conventions in src/app — see icon.tsx, apple-icon.tsx,
  // opengraph-image.tsx, twitter-image.tsx, and public/icon.svg.
  // We override only the bits the convention can't infer.
  manifest: "/manifest.webmanifest",
  title: {
    default: "AEGIBIT — Built to Outlast | Cybersecurity-First Operational Software",
    template: "%s | AEGIBIT",
  },
  description:
    "AEGIBIT builds operational software for businesses that can't afford a leak. Cybersecurity-first. Real-time across every branch. Engineered to outlast — for dealerships, multi-branch SMEs, and mission-critical operations.",
  keywords: [
    "AEGIBIT",
    "operational software",
    "multi-branch expense management",
    "PayMint",
    "VoiceCore",
    "cybersecurity software India",
    "SaaS for dealerships",
    "audit-grade software",
    "Tally integration",
    "Zero Trust",
  ],
  authors: [{ name: "AEGIBIT Security" }],
  applicationName: "AEGIBIT",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.aegibit.com",
    siteName: "AEGIBIT",
    title: "AEGIBIT — Built to Outlast",
    description:
      "Cybersecurity-first software company. Operational platforms for multi-branch businesses, dealerships, mission-critical SMEs. Built to outlast.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aegibit",
    creator: "@aegibit",
    title: "AEGIBIT — Built to Outlast",
    description:
      "Operational software for businesses that can't afford a leak. Cybersecurity-first. Real-time. Built to outlast.",
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
        <TrackingProvider>{children}</TrackingProvider>
        <Analytics />
      </body>
    </html>
  );
}
