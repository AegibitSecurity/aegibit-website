"use client";
import { setConsent } from "@/lib/consent";
export function PrivacyChoices() {
  return <button className="text-xs text-zinc-400 underline" onClick={() => {
    setConsent("denied");
    window.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
    window.clarity?.("stop");
    // Reload ends all already-loaded analytics code, including third-party listeners.
    window.location.reload();
  }}>Turn off optional analytics</button>;
}
