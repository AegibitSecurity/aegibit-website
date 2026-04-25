import type { BehaviorTier } from "@/types/visitor";

interface BehaviorInputs {
  pagesViewed: number;
  scrollDepthMax: number;
  onPricingPage: boolean;
  clickedCTA: boolean;
  startedForm: boolean;
  submittedForm: boolean;
  timeOnSiteSeconds: number;
  isReturnVisitor: boolean;
  bouncedEarly: boolean;
}

export function calculateBehaviorScore(inputs: BehaviorInputs): number {
  let score = 0;

  score += Math.min(inputs.pagesViewed * 5, 25);
  if (inputs.scrollDepthMax > 50)  score += 10;
  if (inputs.scrollDepthMax > 75 && inputs.onPricingPage) score += 15;
  if (inputs.clickedCTA)    score += 20;
  if (inputs.startedForm)   score += 25;
  if (inputs.submittedForm) score += 30;
  if (inputs.timeOnSiteSeconds > 120)  score += 10;
  if (inputs.timeOnSiteSeconds > 300)  score += 15;
  if (inputs.isReturnVisitor) score += 5;
  if (inputs.bouncedEarly)  score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function getBehaviorTier(score: number): BehaviorTier {
  if (score <= 20) return "cold";
  if (score <= 50) return "warm";
  if (score <= 75) return "hot";
  return "ready";
}

export function getDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
  return "desktop";
}

export function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

export function getOS(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Other";
}
