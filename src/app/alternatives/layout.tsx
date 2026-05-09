import type { Metadata } from "next";

/**
 * /alternatives/* — emergency noindex.
 *
 * Why: a Google search for "Aegibit company" surfaces these pages
 * actively selling **AEGIBIT VoiceCore** — a product that was
 * renamed to Aira months ago. The alternatives templates were
 * authored during the VoiceCore positioning and now actively
 * misrepresent AEGIBIT to anyone searching the brand name.
 *
 * Compounding the problem (per the Phase 4 audit): every alternatives
 * page is the same 15-row "us=true, them=false" feature checkbox
 * spam, which Google's HCU treats as low-value duplicate content
 * regardless of the underlying product positioning.
 *
 * Treatment until the C-2 rewrite ships:
 *   - robots: noindex, nofollow → Google de-indexes on next crawl
 *   - Pages still serve normally for direct links
 *   - Excluded from sitemap (see next-sitemap.config.js)
 *
 * The proper fix (tomorrow's Aira session continues) is to rewrite
 * the alternatives positioning around PayMint with substantive
 * comparisons, not boolean checkboxes. Until then, noindex stops
 * the brand bleeding.
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

export default function AlternativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
