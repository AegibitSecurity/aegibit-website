import { describe, expect, it } from "vitest";
import { shouldGateProtectedApi } from "./proxy-gate";

/**
 * Regression suite for the proxy gate.
 *
 * The most important test in this file is "POST /api/leads is public
 * even without a session cookie". A previous version of the proxy
 * gated /api/leads unconditionally, silently 401'ing every form
 * submit on the marketing site (waitlist, contact, demo, exit-intent,
 * AIRA, PayMint, VoiceCore, signup). Lost leads = lost revenue =
 * exactly the kind of bug a $1B-target company cannot ship twice.
 *
 * Every case below corresponds to a real production code path. If you
 * change PROTECTED_API_PATHS or PUBLIC_METHODS_BY_PATH, this file is
 * the contract you must update.
 */

describe("shouldGateProtectedApi", () => {
  describe("public lead-capture POST", () => {
    it("POST /api/leads without session → NOT gated (public form submit)", () => {
      expect(shouldGateProtectedApi("/api/leads", "POST", false)).toBe(false);
    });

    it("POST /api/leads with session → NOT gated (admin can also submit)", () => {
      expect(shouldGateProtectedApi("/api/leads", "POST", true)).toBe(false);
    });
  });

  describe("admin reads on /api/leads", () => {
    it("GET /api/leads without session → gated (admin list)", () => {
      expect(shouldGateProtectedApi("/api/leads", "GET", false)).toBe(true);
    });

    it("GET /api/leads with session → NOT gated (admin authenticated)", () => {
      expect(shouldGateProtectedApi("/api/leads", "GET", true)).toBe(false);
    });

    it("PATCH /api/leads without session → gated (admin write)", () => {
      expect(shouldGateProtectedApi("/api/leads", "PATCH", false)).toBe(true);
    });

    it("DELETE /api/leads without session → gated", () => {
      expect(shouldGateProtectedApi("/api/leads", "DELETE", false)).toBe(true);
    });
  });

  describe("admin-only endpoints (no public methods)", () => {
    it("GET /api/analytics without session → gated", () => {
      expect(shouldGateProtectedApi("/api/analytics", "GET", false)).toBe(true);
    });

    it("POST /api/analytics without session → still gated (no public method carve-out)", () => {
      expect(shouldGateProtectedApi("/api/analytics", "POST", false)).toBe(true);
    });

    it("GET /api/analytics with session → NOT gated", () => {
      expect(shouldGateProtectedApi("/api/analytics", "GET", true)).toBe(false);
    });

    it("GET /api/admin/health without session → gated", () => {
      expect(shouldGateProtectedApi("/api/admin/health", "GET", false)).toBe(true);
    });
  });

  describe("unprotected paths", () => {
    it("POST /api/contact → never gated by this function (not in protected set)", () => {
      expect(shouldGateProtectedApi("/api/contact", "POST", false)).toBe(false);
    });

    it("POST /api/visitors → never gated (telemetry)", () => {
      expect(shouldGateProtectedApi("/api/visitors", "POST", false)).toBe(false);
    });

    it("POST /api/newsletter → never gated", () => {
      expect(shouldGateProtectedApi("/api/newsletter", "POST", false)).toBe(false);
    });

    it("GET / (homepage) → never gated", () => {
      expect(shouldGateProtectedApi("/", "GET", false)).toBe(false);
    });

    it("GET /api/admin/login → never gated (login itself must be reachable)", () => {
      expect(shouldGateProtectedApi("/api/admin/login", "POST", false)).toBe(false);
    });
  });

  describe("path-prefix guard (exact match only)", () => {
    it("POST /api/leads/something → not in protected set, NOT gated", () => {
      // PROTECTED_API_PATHS uses Set.has which is exact-match. A child
      // path is by design not gated here (route handler is the
      // authority). This test pins the behavior so a future contributor
      // doesn't silently switch to startsWith.
      expect(shouldGateProtectedApi("/api/leads/123", "POST", false)).toBe(false);
    });
  });
});
