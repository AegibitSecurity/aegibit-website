import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VoiceCoreLanding } from "@/components/sections/voicecore/VoiceCoreLanding";

export const metadata: Metadata = {
  title: "VoiceCore — Voice-First Business Operations | AEGIBIT",
  description:
    "VoiceCore is AEGIBIT's voice-first operations platform — run your business through natural-language commands in Hindi, Bengali, English. Biometric voice auth. Early access open.",
  keywords: [
    "VoiceCore",
    "voice-first SaaS",
    "voice biometric authentication",
    "voice business operations",
    "AEGIBIT VoiceCore",
    "Indian language voice AI",
  ],
  alternates: { canonical: "/products/voicecore" },
  openGraph: {
    title: "VoiceCore — Voice-First Business Operations",
    description:
      "Run your business by voice. Hindi, Bengali, English. Biometric auth. Engineered by a cybersecurity company.",
    type: "website",
    url: "https://www.aegibit.com/products/voicecore",
    siteName: "AEGIBIT",
  },
  robots: { index: true, follow: true },
};

export default function VoiceCorePage() {
  return (
    <>
      <Navbar />
      <main>
        <VoiceCoreLanding />
      </main>
      <Footer />
    </>
  );
}
