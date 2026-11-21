"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global { interface Window { clarity?: Clarity; } }
export function ClarityAnalytics() {
  const consent = useConsent();
  const path = usePathname();
  useEffect(() => {
    const publicPage = !/^\/(admin|dashboard|api|login|signup)(\/|$)/.test(path);
    if (consent !== "granted" || !publicPage) {
      window.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
      window.clarity?.("stop");
      return;
    }
    if (document.getElementById("aegibit-clarity")) return;
    const queue: Clarity = (...args) => { queue.q = [...(queue.q ?? []), args]; };
    window.clarity = window.clarity ?? queue;
    window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    const script = document.createElement("script");
    script.id = "aegibit-clarity";
    script.async = true;
    script.src = "https://www.clarity.ms/tag/zh9bino7kd";
    document.head.appendChild(script);
  }, [consent, path]);
  return null;
}
