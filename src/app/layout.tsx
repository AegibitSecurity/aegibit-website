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
    default: "AEGIBIT — Securing Tomorrow, Today",
    template: "%s | AEGIBIT",
  },
  description:
    "AI, Cybersecurity, and Automation for enterprises that cannot afford failure.",
  keywords: ["enterprise security", "AI automation", "cybersecurity", "Zero Trust", "India SaaS"],
  authors: [{ name: "AEGIBIT Security" }],
  applicationName: "AEGIBIT",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.aegibit.com",
    siteName: "AEGIBIT",
    title: "AEGIBIT — Securing Tomorrow, Today",
    description:
      "AI, Cybersecurity, and Automation for enterprises that cannot afford failure.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aegibit",
    creator: "@aegibit",
    title: "AEGIBIT — Securing Tomorrow, Today",
    description: "AI, Cybersecurity, and Automation for enterprises.",
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
