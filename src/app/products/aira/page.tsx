import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiraLanding } from "@/components/sections/aira/AiraLanding";

export const metadata: Metadata = {
  title: "Aira — Your Voice. Built Into Execution. | AEGIBIT",
  description:
    "Aira is AEGIBIT's voice-first AI co-founder. Wake her with your voice; she opens apps, drafts messages, schedules reminders, and acts on your tools — in Hindi, Bengali, English, and four more Indian languages. Voice biometric secured. Local-first. Reserve early access.",
  keywords: [
    "Aira",
    "AEGIBIT Aira",
    "AI co-founder",
    "voice-first AI assistant",
    "Indian voice AI",
    "Hindi voice AI",
    "Bengali voice AI",
    "voice biometric authentication",
    "executive voice assistant",
    "AEGIBIT product",
  ],
  alternates: { canonical: "/products/aira" },
  openGraph: {
    title: "Aira — Your Voice. Built Into Execution.",
    description:
      "AEGIBIT's voice-first AI co-founder. Wake her with your voice; she opens apps, drafts messages, schedules reminders, acts. Hindi · Bengali · English · 4 more.",
    type: "website",
    url: "https://www.aegibit.com/products/aira",
    siteName: "AEGIBIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aira — Your Voice. Built Into Execution.",
    description:
      "Voice-first AI co-founder by AEGIBIT. Hindi · Bengali · English. Voice biometric. Local-first.",
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
