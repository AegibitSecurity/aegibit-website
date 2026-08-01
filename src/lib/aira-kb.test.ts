import { describe, expect, it } from "vitest";
import { buildKnowledgeBlock, expandQuery, retrieve, PRODUCT_CATALOG } from "./aira-kb";

/**
 * Retrieval-quality tests for Aira's RAG engine. These pin the
 * consultant behavior that matters commercially: a visitor describes a
 * BUSINESS PAIN in plain words, and retrieval must surface the right
 * product's pages even when the words never mention the product.
 *
 * They run against the real crawled index (src/data/aira-kb.json), so
 * they double as a canary: if a future crawl guts a product's page,
 * the matching test fails and the regression is caught in CI, not by
 * a confused prospect.
 */

function urls(query: string): string[] {
  return retrieve(query, 6).map((c) => c.url);
}

describe("intent expansion", () => {
  it("expands attendance pain toward Cortex/HRMS vocabulary", () => {
    const terms = expandQuery("employees fake attendance");
    expect(terms).toContain("cortex");
    expect(terms).toContain("hrms");
    expect(terms).toContain("payroll");
  });

  it("expands spreadsheet pain toward automation vocabulary", () => {
    const terms = expandQuery("I spend too much time in Excel");
    expect(terms).toContain("automation");
    expect(terms).toContain("workflow");
  });

  it("keeps original tokens alongside expansions", () => {
    const terms = expandQuery("boutique billing dues");
    expect(terms).toContain("boutique");
    expect(terms).toContain("vestiq");
  });
});

describe("business-pain retrieval (the consultant guarantee)", () => {
  it("attendance fraud pain retrieves Cortex", () => {
    expect(urls("I am losing money because employees fake attendance")).toContain(
      "/products/cortex",
    );
  });

  it("multi-branch expense pain retrieves PayMint", () => {
    expect(urls("we lose track of petty cash expenses across our branches")).toContain(
      "/products/paymint",
    );
  });

  it("boutique billing pain retrieves Vestiq", () => {
    expect(urls("I run a boutique and my billing and customer dues are a mess")).toContain(
      "/products/vestiq",
    );
  });

  it("dealership sales pain retrieves LeadSync", () => {
    expect(urls("our dealership showroom loses leads between enquiry and delivery")).toContain(
      "/products/leadsync",
    );
  });

  it("website need retrieves the web-development page", () => {
    const got = urls("we need a website for our company in Kolkata");
    expect(got.some((u) => u.includes("website-development") || u === "/work")).toBe(true);
  });

  it("pricing questions retrieve the pricing page", () => {
    expect(urls("how much does it cost, what is the price")).toContain("/pricing");
  });
});

describe("retrieval mechanics", () => {
  it("is deterministic", () => {
    const a = urls("expense management for dealerships");
    const b = urls("expense management for dealerships");
    expect(a).toEqual(b);
  });

  it("caps results at k", () => {
    expect(retrieve("expense branch dealership software", 4).length).toBeLessThanOrEqual(4);
  });

  it("returns at most 2 chunks per page (diversity guard)", () => {
    const counts = new Map<string, number>();
    for (const c of retrieve("paymint expense voucher approvals audit", 6)) {
      counts.set(c.url, (counts.get(c.url) ?? 0) + 1);
    }
    for (const n of counts.values()) expect(n).toBeLessThanOrEqual(2);
  });

  it("returns empty for stopword-only queries instead of noise", () => {
    expect(retrieve("the and of to is", 6)).toEqual([]);
  });
});

describe("knowledge block assembly", () => {
  it("includes source markers and deduped sources", () => {
    const kb = buildKnowledgeBlock("expense tracking for branches");
    expect(kb.text).toContain("[Source: ");
    const urlSet = new Set(kb.sources.map((s) => s.url));
    expect(urlSet.size).toBe(kb.sources.length);
  });

  it("degrades gracefully when nothing matches", () => {
    const kb = buildKnowledgeBlock("zzzz qqqq xxxx");
    expect(kb.sources).toEqual([]);
    expect(kb.text).toContain("no specific page matched");
  });
});

describe("product catalog (always-present cross-sell layer)", () => {
  it("lists every live product with its URL", () => {
    for (const u of [
      "/products/cortex",
      "/products/paymint",
      "/products/leadsync",
      "/products/vestiq",
      "/products/aira",
      "/products/mcp-shield",
    ]) {
      expect(PRODUCT_CATALOG).toContain(u);
    }
  });

  it("carries the ecosystem cross-sell plays", () => {
    expect(PRODUCT_CATALOG).toContain("PayMint + LeadSync");
  });
});
