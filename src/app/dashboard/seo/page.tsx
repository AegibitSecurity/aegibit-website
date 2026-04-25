import type { Metadata } from "next";

export const metadata: Metadata = { title: "SEO Metrics | Dashboard" };

const SEO_PAGES = [
  { path: "/alternatives/*", count: 20, label: "Alternatives" },
  { path: "/use-cases/*",    count: 15, label: "Use Cases" },
  { path: "/integrations/*", count: 20, label: "Integrations" },
  { path: "/industries/*",   count: 6,  label: "Industries" },
  { path: "/blog/*",         count: 5,  label: "Blog Posts" },
  { path: "/glossary/*",     count: 8,  label: "Glossary Terms" },
];

export default function SeoPage() {
  const total = SEO_PAGES.reduce((s, p) => s + p.count, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">SEO Pages</h1>
      <p className="text-[#52525B] text-sm mb-8">{total} programmatic pages indexed for organic traffic.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {SEO_PAGES.map((p) => (
          <div key={p.path} className="p-5 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
            <p className="text-3xl font-bold text-white mb-1">{p.count}</p>
            <p className="text-[#52525B] text-xs mono-label">{p.label}</p>
            <p className="text-[#3F3F46] text-xs mt-1 font-mono">{p.path}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
        <h2 className="text-white font-semibold mb-3">Sitemap</h2>
        <p className="text-[#52525B] text-sm mb-2">Auto-generated on every build via next-sitemap.</p>
        <a href="/sitemap.xml" target="_blank"
          className="text-[#F97316] text-sm hover:opacity-80 transition-opacity">
          View sitemap.xml →
        </a>
      </div>
    </div>
  );
}
