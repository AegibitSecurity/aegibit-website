/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://aegibitsecurity.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/dashboard", "/dashboard/*", "/api/*", "/login"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/dashboard", "/api/", "/login"] },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async (config) => {
    const { alternatives } = await import("./src/content/alternatives.ts");
    const { useCases }     = await import("./src/content/use-cases.ts");
    const { integrations } = await import("./src/content/integrations.ts");
    const { industries }   = await import("./src/content/industries.ts");
    const { blogPosts }    = await import("./src/content/blog-posts.ts");

    return [
      ...alternatives.map((a) => ({ loc: `/alternatives/${a.slug}`, changefreq: "monthly", priority: 0.8 })),
      ...useCases.map((u)     => ({ loc: `/use-cases/${u.slug}`,     changefreq: "monthly", priority: 0.8 })),
      ...integrations.map((i) => ({ loc: `/integrations/${i.slug}`,  changefreq: "monthly", priority: 0.7 })),
      ...industries.map((i)   => ({ loc: `/industries/${i.slug}`,    changefreq: "monthly", priority: 0.8 })),
      ...blogPosts.map((p)    => ({ loc: `/blog/${p.slug}`,          changefreq: "weekly",  priority: 0.9 })),
    ];
  },
};
