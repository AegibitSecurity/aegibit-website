import { describe, expect, it } from "vitest";
import { getExperimentVariant, EXPERIMENTS } from "./experiments";

/**
 * Properties the assignment must satisfy for the experiment results
 * to be statistically interpretable. Failing any of these silently
 * corrupts every conclusion drawn from the funnel dashboard, so the
 * gate here is load-bearing.
 */

describe("getExperimentVariant", () => {
  it("returns control when visitorId is missing (avoids first-paint flicker)", () => {
    expect(getExperimentVariant(null, "hero_cta_copy")).toBe("control_explore");
  });

  it("is deterministic — same visitorId always gets same variant", () => {
    const v1 = getExperimentVariant("visitor-abc-123", "hero_cta_copy");
    const v2 = getExperimentVariant("visitor-abc-123", "hero_cta_copy");
    const v3 = getExperimentVariant("visitor-abc-123", "hero_cta_copy");
    expect(v1).toBe(v2);
    expect(v2).toBe(v3);
  });

  it("different visitorIds get statistically-distributed variants (not all control)", () => {
    const counts = { control_explore: 0, variant_demo: 0 };
    for (let i = 0; i < 1000; i++) {
      const v = getExperimentVariant(`visitor-${i}`, "hero_cta_copy");
      if (v) counts[v as keyof typeof counts]++;
    }
    // 50/50 split with FNV-1a should give ~500 each. Tolerance ±15%
    // for sample noise. If this ever flakes the hash is degenerate.
    expect(counts.control_explore).toBeGreaterThan(350);
    expect(counts.control_explore).toBeLessThan(650);
    expect(counts.variant_demo).toBeGreaterThan(350);
    expect(counts.variant_demo).toBeLessThan(650);
  });

  it("only ever returns variants from the experiment's variant list", () => {
    const valid = EXPERIMENTS.hero_cta_copy.variants as readonly string[];
    for (let i = 0; i < 100; i++) {
      const v = getExperimentVariant(`v-${i}`, "hero_cta_copy");
      expect(valid).toContain(v);
    }
  });

  it("returns control when experiment is disabled", () => {
    // Mutate the config to simulate a disabled experiment without
    // touching the canonical EXPERIMENTS object's exported shape.
    const original = EXPERIMENTS.hero_cta_copy.enabled;
    (EXPERIMENTS.hero_cta_copy as { enabled: boolean }).enabled = false;
    try {
      expect(getExperimentVariant("any-visitor", "hero_cta_copy")).toBe(
        "control_explore",
      );
    } finally {
      (EXPERIMENTS.hero_cta_copy as { enabled: boolean }).enabled = original;
    }
  });
});
