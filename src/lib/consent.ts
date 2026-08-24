"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie-consent state for DPDP-aligned tracking.
 *
 * The site does behavioural analytics (device/browser/OS, page views,
 * scroll depth, live presence) tied to a first-party visitor id, plus
 * Vercel Analytics. Under India's DPDP Act 2023 this non-essential
 * processing should run only after the visitor consents. The essential
 * iron-session security cookie is NOT gated by this (it is strictly
 * necessary for the app to function and carries no profiling).
 *
 * Consent is stored in a first-party cookie so the choice persists and
 * is readable synchronously. A window event lets live components
 * (the Vercel Analytics gate, the visitor-tracking hook) react the
 * instant the visitor chooses, with no reload.
 */

export type ConsentState = "granted" | "denied";

const COOKIE = "aegibit_consent";
export const CONSENT_EVENT = "aegibit-consent-change";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function getConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)aegibit_consent=(granted|denied)/);
  return (m?.[1] as ConsentState) ?? null;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "granted";
}

export function setConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=${state}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

/** Subscribe to consent changes. Returns an unsubscribe function. */
export function onConsentChange(cb: (state: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent).detail as ConsentState);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

// ── React binding ─────────────────────────────────────────────────
// useSyncExternalStore is the idiomatic way to read an external value
// (the consent cookie) reactively without setState-in-effect, and it
// handles SSR/hydration via the server snapshot (always null on the
// server, so first client paint matches, then updates post-hydration).
function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
}

export function useConsent(): ConsentState | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}
