import { z } from "zod";

export const leadSchema = z.object({
  name:      z.string().max(100).optional(),
  email:     z.string().email().max(200),
  company:   z.string().max(100).optional(),
  phone:     z.string().max(20).optional(),
  teamSize:  z.string().max(20).optional(),
  message:   z.string().max(2000).optional(),
  source:    z.enum(["waitlist", "contact", "demo", "exit_intent"]),
  page:      z.string().max(500),
  visitorId: z.string().uuid().optional(),
});

export const visitorSchema = z.object({
  sessionId:   z.string().uuid(),
  userAgent:   z.string().max(500).optional(),
  device:      z.enum(["desktop", "mobile", "tablet"]).optional(),
  browser:     z.string().max(100).optional(),
  os:          z.string().max(100).optional(),
  referrer:    z.string().max(500).optional(),
  utmSource:   z.string().max(100).optional().nullable(),
  utmMedium:   z.string().max(100).optional().nullable(),
  utmCampaign: z.string().max(100).optional().nullable(),
  landingPage: z.string().max(500),
});

export const visitorEventSchema = z.object({
  visitorId: z.string().uuid(),
  eventType: z.enum(["pageview", "scroll", "click", "form_focus", "form_submit", "exit_intent", "time_update"]),
  eventData: z.record(z.string(), z.unknown()).optional(),
  page:      z.string().max(500),
});

export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")       // strip HTML tags
    .replace(/javascript:/gi, "")  // strip JS protocol
    .replace(/on\w+\s*=/gi, "")    // strip inline handlers
    .trim()
    .slice(0, 5000);
}

/** Client-safe: strip HTML before displaying user input */
export function sanitizeForDisplay(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Validate email format client-side before submit */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
