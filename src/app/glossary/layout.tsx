import type { Metadata } from "next";

/**
 * /glossary/* — emergency noindex.
 *
 * The Phase 4 audit flagged glossary entries as one-paragraph stubs
 * with related terms not even rendered as links. Thin content +
 * no internal-link equity = exactly the pattern Google's HCU
 * penalises. Indexing these pages currently does us net harm:
 *   - they don't rank for the terms they target
 *   - they bring down the perceived authority of the rest of the site
 *
 * Treatment until the C-2 / C-8 rewrite ships:
 *   - robots: noindex, nofollow → Google de-indexes on next crawl
 *   - Pages still serve for direct links
 *   - Excluded from sitemap (see next-sitemap.config.js)
 *
 * The eventual rewrite either (a) makes each glossary entry a real
 * 800+ word security primer with proper internal linking, or (b)
 * deletes the surface entirely. Decision deferred.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
