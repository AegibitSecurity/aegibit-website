import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "AEGIBIT VoiceCore — Speak. Secure. Execute.",
    template: "%s | AEGIBIT VoiceCore",
  },
  description:
    "India's first enterprise-grade, security-native AI Voice SaaS platform. Zero Trust voice workflows for BFSI, healthcare, and enterprise security teams.",
  keywords: [
    "AI voice assistant",
    "enterprise security",
    "voice biometric",
    "BFSI security",
    "zero trust",
    "audit logs",
    "India SaaS",
    "RBAC",
  ],
  authors: [{ name: "AEGIBIT Security" }],
  creator: "AEGIBIT Security",
  publisher: "AEGIBIT Security",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aegibitsecurity.com",
    siteName: "AEGIBIT VoiceCore",
    title: "AEGIBIT VoiceCore — Speak. Secure. Execute.",
    description:
      "India's first enterprise-grade, security-native AI Voice SaaS platform.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEGIBIT VoiceCore",
    description: "Enterprise AI Voice — Built For Security",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#040810",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
