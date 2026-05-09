import type { Metadata } from "next";

/**
 * /industries/* — emergency noindex.
 *
 * Two reasons this surface needs to disappear from Google immediately:
 *
 * 1. The content sells deprecated VoiceCore (BFSI, healthcare, etc.
 *    pages are framed as "VoiceCore for {industry}").
 *
 * 2. The pages liberally claim regulatory alignment — "RBI
 *    Cybersecurity Framework", "FERPA", "HIPAA" — without underlying
 *    audit evidence. The Phase 4 audit flagged this as the highest-
 *    risk content on the site: an aspirational compliance claim that
 *    we cannot defend if a regulator or buyer asks for proof.
 *
 * Treatment until the C-2 rewrite ships:
 *   - robots: noindex, nofollow → Google de-indexes on next crawl
 *   - Pages still serve for direct links (so we don't break inbound
 *     traffic from anywhere those URLs are referenced)
 *   - Excluded from sitemap (see next-sitemap.config.js)
 *
 * The eventual rewrite will (a) reposition around PayMint and (b)
 * only claim compliance status we can actually demonstrate.
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

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
