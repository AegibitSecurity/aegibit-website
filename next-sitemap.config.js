/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Canonical host is www.aegibit.com — set NEXT_PUBLIC_APP_URL in Vercel
  // to https://www.aegibit.com to override. Fallback now matches the real
  // production domain (was incorrectly pointing at a different brand).
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://www.aegibit.com",
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  // Don't index private surfaces or stale services-era pages.
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/api/*",
    "/login",
    "/icon",
    "/apple-icon",
    "/opengraph-image",
    "/twitter-image",
    // Services pages (legacy contracting-shop framing) — kept alive
    // for direct traffic but de-indexed via /services/layout.tsx
    // robots metadata. Excluded from sitemap so we don't tell Google
    // about pages we're simultaneously asking it not to index.
    "/services",
    "/services/*",
  ],
  additionalPaths: async (config) => {
    const { alternatives } = await import("./src/content/alternatives.ts");
    const { useCases }     = await import("./src/content/use-cases.ts");
    const { integrations } = await import("./src/content/integrations.ts");
    const { industries }   = await import("./src/content/industries.ts");
    const { blogPosts }    = await import("./src/content/blog-posts.ts");
    const { SOLUTIONS }    = await import("./src/content/solutions.ts");

    return [
      // ── Products (manually included so a missed auto-detection never
      //    silently drops a flagship landing page from the index). ────
      { loc: "/products/paymint",      changefreq: "weekly",  priority: 0.95 },
      { loc: "/products/paymint/demo", changefreq: "monthly", priority: 0.85 },
      { loc: "/products/voicecore",    changefreq: "weekly",  priority: 0.9  },

      // ── Case studies — pillar SEO authority assets. ─────────────────
      { loc: "/case-studies/nibir-motors", changefreq: "monthly", priority: 0.9 },

      // ── Comparison pages — high-intent acquisition keywords. ───────
      ...(await import("./src/content/comparisons.ts")).COMPARISONS.map((c) => ({
        loc: `/compare/${c.slug}`,
        changefreq: "monthly",
        priority: 0.92,
      })),

      // ── PayMint solution / SEO landing pages — high priority because
      //    these are designed to acquire intent traffic. ───────────────
      ...SOLUTIONS.map((s) => ({
        loc: `/solutions/${s.slug}`,
        changefreq: "weekly",
        priority: 0.9,
      })),

      // ── Programmatic content collections ────────────────────────────
      ...alternatives.map((a) => ({ loc: `/alternatives/${a.slug}`, changefreq: "monthly", priority: 0.8 })),
      ...useCases.map((u)     => ({ loc: `/use-cases/${u.slug}`,     changefreq: "monthly", priority: 0.8 })),
      ...integrations.map((i) => ({ loc: `/integrations/${i.slug}`,  changefreq: "monthly", priority: 0.7 })),
      ...industries.map((i)   => ({ loc: `/industries/${i.slug}`,    changefreq: "monthly", priority: 0.8 })),
      ...blogPosts.map((p)    => ({ loc: `/blog/${p.slug}`,          changefreq: "weekly",  priority: 0.9 })),
    ];
  },
};
