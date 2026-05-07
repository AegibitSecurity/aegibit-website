"use client";

import { TrackedLink } from "@/components/shared/TrackedLink";
import { useExperiment } from "@/hooks/useExperiment";

/**
 * Hero primary CTA — first live A/B experiment.
 *
 * Experiment: hero_cta_copy
 *   control_explore  → "Explore Our Products" → /#products
 *   variant_demo     → "Get a demo"           → /products/paymint/demo
 *
 * The two cta_ids are intentionally distinct so the existing funnel
 * dashboard groups them as separate rows — per-variant conversion
 * read-out for free, no new dashboard code.
 */
export function HeroPrimaryCTA() {
  const variant = useExperiment("hero_cta_copy");

  if (variant === "variant_demo") {
    return (
      <TrackedLink
        href="/products/paymint/demo"
        ctaId="hero_explore_products_v_demo"
        ctaLabel="Get a demo"
        ctaSection="hero"
        className="text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #F97316, #EA6C0A)",
          padding: "13px 30px",
          borderRadius: "10px",
          minWidth: "220px",
          textAlign: "center",
          boxShadow: "0 0 18px rgba(249,115,22,0.32), 0 2px 6px rgba(0,0,0,0.4)",
          display: "inline-block",
        }}
      >
        Get a demo
      </TrackedLink>
    );
  }

  // control_explore — current copy
  return (
    <TrackedLink
      href="#products"
      ctaId="hero_explore_products_v_control"
      ctaLabel="Explore Our Products"
      ctaSection="hero"
      className="text-sm font-semibold text-white transition-all hover:opacity-90"
      style={{
        background: "linear-gradient(135deg, #F97316, #EA6C0A)",
        padding: "13px 30px",
        borderRadius: "10px",
        minWidth: "220px",
        textAlign: "center",
        boxShadow: "0 0 18px rgba(249,115,22,0.32), 0 2px 6px rgba(0,0,0,0.4)",
        display: "inline-block",
      }}
    >
      Explore Our Products
    </TrackedLink>
  );
}
