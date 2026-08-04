import type { MetadataRoute } from "next";
import { GLOSSARY } from "@/content/glossary";
import { SITE_URL } from "@/lib/seo";
import { COMPARISONS } from "@/content/comparisons";
import { SOLUTIONS } from "@/content/solutions";
import { blogPosts } from "@/content/blog-posts";

/**
 * Native dynamic sitemap (app/sitemap.ts).
 *
 * Replaces the previous next-sitemap static-file generation. That
 * approach wrote public/sitemap.xml at build, but on Vercel the
 * post-build write never reached the served deployment, production
 * served a STALE committed public/sitemap.xml frozen at 2026-05-04,
 * silently missing every page shipped since (status, changelog,
 * careers, press, the MCP Shield scanner, …) and still advertising
 * 20 noindex'd /alternatives pages. Surfaced by the live SEO guardian
 * (automation/scripts/seo-live-audit.mjs).
 *
 * A native sitemap route is served by Next directly, so it can never
 * go stale, it always reflects the current code + content.
 *
 * What's IN: every indexable surface.
 * What's OUT (by deliberate omission): internal/auth (/dashboard,
 * /admin, /login, /signup), and the noindex'd legacy/programmatic
 * collections (/services/*, /locations/*, /alternatives/*,
 * /use-cases/*, /industries/*, /integrations/*, /glossary/*) plus the
 * retired /products/voicecore (which 308-redirects to /products/aira).
 * Listing a noindex'd or redirecting URL here is a sitemap-vs-noindex
 * contradiction that wastes crawl budget, so they stay out.
 */

export const dynamic = "force-static";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFreq = NonNullable<SitemapEntry["changeFrequency"]>;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: ChangeFreq,
    lastModified: Date = now,
  ): SitemapEntry => ({ url: `${base}${path}`, lastModified, changeFrequency, priority });

  const staticPages: SitemapEntry[] = [
    entry("/", 1.0, "weekly"),

    // Products (flagship landing pages)
    entry("/products/cortex", 0.9, "weekly"),

    // Reference library (Sprint 1, exp-glossary-geo)
    entry("/glossary", 0.7, "weekly"),
    ...GLOSSARY.map((t) => entry(`/glossary/${t.slug}`, 0.6, "monthly")),
    entry("/products/paymint", 0.95, "weekly"),
    entry("/products/paymint/demo", 0.85, "monthly"),
    entry("/products/mcp-shield", 0.9, "weekly"),
    entry("/products/vestiq", 0.9, "weekly"),
    entry("/products/leadsync", 0.9, "weekly"),
    entry("/products/aira", 0.85, "weekly"),
    entry("/products/aira/changelog", 0.6, "weekly"),

    // Core marketing
    entry("/security", 0.8, "monthly"),
    entry("/features", 0.8, "monthly"),
    entry("/pricing", 0.8, "weekly"),
    entry("/about", 0.7, "monthly"),
    entry("/contact", 0.7, "monthly"),
    entry("/solutions", 0.8, "weekly"),
    entry("/case-studies/nibir-motors", 0.9, "monthly"),
    entry("/work", 0.85, "weekly"),
    entry("/blog", 0.7, "weekly"),

    // Local SEO landing (pairs with the Kolkata Google Business Profile)
    entry("/website-development-company-kolkata", 0.9, "weekly"),

    // Brand chrome
    entry("/status", 0.5, "weekly"),
    entry("/changelog", 0.6, "weekly"),
    entry("/careers", 0.5, "monthly"),
    entry("/press", 0.5, "monthly"),

    // Legal
    entry("/privacy", 0.4, "yearly"),
    entry("/terms", 0.4, "yearly"),
    entry("/dpdp", 0.5, "yearly"),
  ];

  // High-intent comparison pages
  const compare: SitemapEntry[] = COMPARISONS.map((c) =>
    entry(`/compare/${c.slug}`, 0.92, "monthly"),
  );

  // PayMint solution / SEO landing pages
  const solutions: SitemapEntry[] = SOLUTIONS.map((s) =>
    entry(`/solutions/${s.slug}`, 0.9, "weekly"),
  );

  // Blog posts, lastModified from frontmatter date (honest freshness)
  const blog: SitemapEntry[] = blogPosts.map((p) =>
    entry(`/blog/${p.slug}`, 0.9, "weekly", new Date(p.date)),
  );

  return [...staticPages, ...compare, ...solutions, ...blog];
}
