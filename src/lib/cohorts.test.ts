import { describe, expect, it } from "vitest";
import { classifyUtm, COHORT_IDS, type CohortId } from "./cohorts";

/**
 * Pure-function tests for the UTM cohort matcher. The full getCohort()
 * resolution (including high_intent / returning / default) reads from
 * the zustand store and document.cookie — too many side effects for a
 * Node-only test runner. classifyUtm captures the UTM logic in a pure
 * function so we can lock string-matching + priority order without a
 * jsdom dependency.
 *
 * If any of these fail, the cohort engine has lost its UTM fidelity —
 * Google Ads spend stops getting attributed, LinkedIn outreach stops
 * getting credit, email-campaign clickthrough goes to the wrong copy.
 */

describe("classifyUtm — paid traffic detection", () => {
  it("utm_medium=cpc returns from_paid (any source)", () => {
    expect(classifyUtm({ source: null, medium: "cpc", campaign: null })?.id).toBe("from_paid");
    expect(classifyUtm({ source: "anything", medium: "cpc", campaign: "x" })?.id).toBe("from_paid");
  });

  it("utm_source=google_ads returns from_paid", () => {
    expect(classifyUtm({ source: "google_ads", medium: null, campaign: null })?.id).toBe("from_paid");
  });

  it("utm_source=google returns from_paid (Google Ads default)", () => {
    expect(classifyUtm({ source: "google", medium: null, campaign: null })?.id).toBe("from_paid");
  });

  it("utm_source=facebook returns from_paid", () => {
    expect(classifyUtm({ source: "facebook", medium: null, campaign: null })?.id).toBe("from_paid");
    expect(classifyUtm({ source: "meta", medium: null, campaign: null })?.id).toBe("from_paid");
  });

  it("case-insensitive matching", () => {
    expect(classifyUtm({ source: "GOOGLE", medium: null, campaign: null })?.id).toBe("from_paid");
    expect(classifyUtm({ source: null, medium: "CPC", campaign: null })?.id).toBe("from_paid");
  });

  it("trims whitespace", () => {
    expect(classifyUtm({ source: "  google  ", medium: null, campaign: null })?.id).toBe("from_paid");
  });
});

describe("classifyUtm — social traffic detection", () => {
  it("utm_source=linkedin returns from_social", () => {
    expect(classifyUtm({ source: "linkedin", medium: null, campaign: null })?.id).toBe("from_social");
  });

  it("utm_source=twitter returns from_social", () => {
    expect(classifyUtm({ source: "twitter", medium: null, campaign: null })?.id).toBe("from_social");
    expect(classifyUtm({ source: "x", medium: null, campaign: null })?.id).toBe("from_social");
  });

  it("utm_source=instagram returns from_social", () => {
    expect(classifyUtm({ source: "instagram", medium: null, campaign: null })?.id).toBe("from_social");
  });

  it("utm_source=youtube returns from_social", () => {
    expect(classifyUtm({ source: "youtube", medium: null, campaign: null })?.id).toBe("from_social");
  });
});

describe("classifyUtm — email traffic detection", () => {
  it("utm_medium=email returns from_email", () => {
    expect(classifyUtm({ source: null, medium: "email", campaign: null })?.id).toBe("from_email");
    expect(classifyUtm({ source: "newsletter", medium: "email", campaign: "weekly" })?.id).toBe("from_email");
  });
});

describe("classifyUtm — priority order (paid > social > email)", () => {
  it("paid beats social when both could match (medium=cpc, source=linkedin)", () => {
    // Real scenario: a LinkedIn Ads click — utm_medium=cpc, utm_source=linkedin.
    // Should classify as paid (paid is the bigger spend signal we want to attribute).
    expect(classifyUtm({ source: "linkedin", medium: "cpc", campaign: null })?.id).toBe("from_paid");
  });

  it("paid beats email when medium=cpc trumps email", () => {
    expect(classifyUtm({ source: null, medium: "cpc", campaign: null })?.id).toBe("from_paid");
  });

  it("known social source beats unrelated medium", () => {
    expect(classifyUtm({ source: "linkedin", medium: "social", campaign: null })?.id).toBe("from_social");
  });
});

describe("classifyUtm — null and unknown handling", () => {
  it("returns null when no UTM matches", () => {
    expect(classifyUtm({ source: null, medium: null, campaign: null })).toBeNull();
  });

  it("returns null for unknown sources", () => {
    expect(classifyUtm({ source: "internal-link", medium: "referral", campaign: null })).toBeNull();
    expect(classifyUtm({ source: "case-study", medium: null, campaign: null })).toBeNull();
  });

  it("empty-string source treated as null", () => {
    expect(classifyUtm({ source: "", medium: "", campaign: null })).toBeNull();
  });
});

describe("CohortId enumeration completeness", () => {
  it("contains all 6 cohorts in priority order", () => {
    // If a contributor adds a new cohort, this test forces them to
    // think about where it sits in the priority order. Order matters
    // for getCohort() — first match wins.
    const expected: CohortId[] = [
      "high_intent",
      "from_paid",
      "from_social",
      "from_email",
      "returning",
      "default",
    ];
    expect([...COHORT_IDS]).toEqual(expected);
  });
});
