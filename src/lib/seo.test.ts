import { describe, expect, it, vi } from "vitest";

/**
 * Tests for the canonical-host normalizer in src/lib/seo.ts.
 *
 * The normalizer is the SEO-correctness chokepoint: every JSON-LD URL,
 * every breadcrumb, every OG canonical goes through SITE_URL. If the
 * normalizer regresses, Google sees split ranking signals between
 * apex and www and our SEO compounds backwards.
 *
 * Each test sets process.env.NEXT_PUBLIC_APP_URL, re-imports the module
 * (vitest cache-busts), and inspects the resolved SITE_URL.
 */

async function getSiteUrl(env: string | undefined): Promise<string> {
  if (env === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = env;
  vi.resetModules();
  const mod = await import("./seo");
  return mod.SITE_URL;
}

describe("SITE_URL canonical normalizer", () => {
  it("apex aegibit.com is forced to www.aegibit.com", async () => {
    expect(await getSiteUrl("https://aegibit.com")).toBe("https://www.aegibit.com");
  });

  it("www.aegibit.com passes through unchanged", async () => {
    expect(await getSiteUrl("https://www.aegibit.com")).toBe("https://www.aegibit.com");
  });

  it("trailing slash is stripped", async () => {
    expect(await getSiteUrl("https://www.aegibit.com/")).toBe("https://www.aegibit.com");
  });

  it("http apex is upgraded to https www", async () => {
    expect(await getSiteUrl("http://aegibit.com")).toBe("https://www.aegibit.com");
  });

  it("missing env var falls back to canonical www", async () => {
    expect(await getSiteUrl(undefined)).toBe("https://www.aegibit.com");
  });

  it("localhost dev URLs pass through unchanged (don't break local dev)", async () => {
    expect(await getSiteUrl("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("vercel.app preview URLs pass through unchanged (so previews work)", async () => {
    expect(await getSiteUrl("https://aegibit-website-git-x.vercel.app")).toBe(
      "https://aegibit-website-git-x.vercel.app",
    );
  });

  it("a corrupt env value (unparseable URL) falls back to canonical", async () => {
    expect(await getSiteUrl("not a url")).toBe("https://www.aegibit.com");
  });
});
