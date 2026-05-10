import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiraLanding } from "@/components/sections/aira/AiraLanding";

export const metadata: Metadata = {
  title: "Aira — Voice control for your desktop",
  description:
    "Aira is AEGIBIT's voice-controlled desktop assistant. Free download for Windows. Wake by voice — she opens apps, drafts messages, schedules reminders, and acts on your tools. Hindi, Bengali, English, and four more Indian languages. Voice biometric secured. Local-first. Built in India.",
  keywords: [
    "Aira",
    "AEGIBIT Aira",
    "voice control Windows",
    "desktop voice assistant",
    "Hindi voice assistant",
    "Bengali voice assistant",
    "Indian voice software",
    "voice biometric authentication",
    "local-first voice software",
    "AEGIBIT product",
  ],
  alternates: { canonical: "/products/aira" },
  openGraph: {
    title: "Aira — Voice control for your desktop",
    description:
      "AEGIBIT's voice-controlled desktop assistant. Free download for Windows. Wake by voice — opens apps, drafts messages, schedules reminders, acts. Hindi · Bengali · English · 4 more.",
    type: "website",
    url: "https://www.aegibit.com/products/aira",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aira — Voice control for your desktop",
    description:
      "Voice-controlled desktop assistant by AEGIBIT. Hindi · Bengali · English. Voice biometric. Local-first. Built in India.",
  },
  robots: { index: true, follow: true },
};

export default function AiraPage() {
  return (
    <>
      <Navbar />
      <main>
        <AiraLanding />
      </main>
      <Footer />
    </>
  );
}
