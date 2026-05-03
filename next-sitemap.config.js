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
  // Don't index private surfaces or Next.js's auto-generated icon /
  // OG-image / manifest routes — those aren't user-facing pages.
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/api/*",
    "/login",
    "/icon",
    "/apple-icon",
    "/opengraph-image",
    "/twitter-image",
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
