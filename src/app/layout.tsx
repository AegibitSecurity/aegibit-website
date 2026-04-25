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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://aegibitsecurity.com"),
  title: {
    default: "AEGIBIT — Securing Tomorrow, Today",
    template: "%s | AEGIBIT",
  },
  description:
    "AI, Cybersecurity, and Automation for enterprises that cannot afford failure.",
  keywords: ["enterprise security", "AI automation", "cybersecurity", "Zero Trust", "India SaaS"],
  authors: [{ name: "AEGIBIT Security" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aegibitsecurity.com",
    siteName: "AEGIBIT",
    title: "AEGIBIT — Securing Tomorrow, Today",
    description: "AI, Cybersecurity, and Automation for enterprises that cannot afford failure.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIBIT",
    description: "AI, Cybersecurity, and Automation for enterprises.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06080C",
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
