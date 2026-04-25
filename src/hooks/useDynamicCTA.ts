"use client";
import { useVisitorStore } from "@/stores/visitor-store";
import { useReturnVisitor } from "./useReturnVisitor";
import { usePathname } from "next/navigation";

interface CTAConfig {
  label: string;
  href: string;
  urgency: "low" | "medium" | "high";
}

export function useDynamicCTA(): CTAConfig {
  const score                  = useVisitorStore((s) => s.behaviorScore);
  const visitedPricingPage     = useVisitorStore((s) => s.visitedPricingPage);
  const visitedAlternativesPage = useVisitorStore((s) => s.visitedAlternativesPage);
  const isReturn               = useReturnVisitor();
  const pathname               = usePathname();

  const onAlternativesPage = pathname.includes("alternatives");
  const onPricingPage      = pathname.includes("pricing");

  // Priority order: highest-intent state wins
  if (score >= 76) {
    return { label: "Get Priority Access — 3 Spots Left", href: "/signup", urgency: "high" };
  }
  if (score >= 51) {
    return { label: "Claim Your Spot — Limited Beta", href: "/signup", urgency: "high" };
  }
  if (onAlternativesPage || visitedAlternativesPage) {
    return { label: "Switch to VoiceCore — Free Migration", href: "/signup", urgency: "medium" };
  }
  if (isReturn) {
    return { label: "Welcome Back — Resume Your Trial", href: "/signup", urgency: "medium" };
  }
  if (onPricingPage || visitedPricingPage) {
    return { label: "Start Your Free Trial", href: "/signup", urgency: "medium" };
  }
  return { label: "Join the Waitlist — Free", href: "/signup", urgency: "low" };
}
