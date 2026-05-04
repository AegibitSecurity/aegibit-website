import type { Metadata } from "next";

/**
 * /services/* — Programmatic services pages from AEGIBIT's earlier
 * services-shop positioning ("we build websites and apps for X industry").
 *
 * AEGIBIT has since pivoted to a product-company posture (PayMint,
 * VoiceCore, Aira AI). The services pages now create brand confusion
 * in Google search results — a prospect researching "AEGIBIT" sees us
 * described as a contracting agency, contradicting our actual positioning.
 *
 * Treatment (until we make a permanent disposition decision):
 *   • robots: noindex, nofollow → Google de-indexes them on next crawl
 *   • Pages still serve normally for anyone with a direct link
 *   • Excluded from sitemap (see next-sitemap.config.js)
 *
 * Long-term options:
 *   (a) Delete entirely if no organic traffic of value
 *   (b) Rebrand as "AEGIBIT software solutions for X industry" with
 *       PayMint / VoiceCore positioning instead of contracting framing
 *
 * Decision deferred — noindex stops the brand bleeding immediately.
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

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
