import { z } from "zod";

export const leadSchema = z.object({
  name:      z.string().max(100).optional(),
  email:     z.string().email().max(200),
  company:   z.string().max(100).optional(),
  phone:     z.string().max(20).optional(),
  teamSize:  z.string().max(20).optional(),
  message:   z.string().max(2000).optional(),
  source:    z.enum(["waitlist", "contact", "demo", "exit_intent", "paymint_demo", "voicecore_waitlist", "aira_waitlist"]),
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

// Event-type taxonomy. Add new types here, never as ad-hoc strings at the
// call site, so the dashboard funnel queries can rely on a closed enum.
//   pageview              → route navigation (set automatically per pathname)
//   scroll                → scroll-depth milestone reached (25/50/75/100)
//   click                 → generic click counter (engagement signal)
//   cta_click             → ★ named CTA button clicked. event_data carries
//                            { cta_id, cta_label, target_url? }. The funnel
//                            pipeline keys on cta_id to attribute conversions.
//   form_focus            → user first-touched any input on a lead form
//   form_submit           → form successfully submitted
//   exit_intent           → mouse-out detected near top of viewport
//   time_update           → 30-second heartbeat
//   experiment_exposure   → A/B variant assignment fired when a component
//                            renders an experiment variant. event_data:
//                            { experiment, variant }. The experiments
//                            dashboard groups conversions by these.
//   chat_open             → Aira chat widget opened by visitor (P3-S10)
//   chat_message          → user sent a message to Aira. event_data
//                            carries { length: <chars> } so we can spot
//                            high-engagement conversations in the funnel.
//   chat_lead             → email captured via the chat widget; the
//                            corresponding /api/leads insert fires the
//                            normal hot-lead pipeline.
export const VISITOR_EVENT_TYPES = [
  "pageview",
  "scroll",
  "click",
  "cta_click",
  "form_focus",
  "form_submit",
  "exit_intent",
  "time_update",
  "experiment_exposure",
  "chat_open",
  "chat_message",
  "chat_lead",
] as const;
export type VisitorEventType = (typeof VISITOR_EVENT_TYPES)[number];

export const visitorEventSchema = z.object({
  visitorId: z.string().uuid(),
  eventType: z.enum(VISITOR_EVENT_TYPES),
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
