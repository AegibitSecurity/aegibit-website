import type { Metadata } from "next";

/**
 * /use-cases/* — emergency noindex.
 *
 * Same disposition as /alternatives/*: these pages were authored
 * during the VoiceCore positioning ("VoiceCore for SOC teams",
 * "VoiceCore for IT helpdesk", etc.). VoiceCore was renamed to Aira;
 * the use-cases content sells a product that no longer exists.
 *
 * Treatment until the C-2 rewrite ships:
 *   - robots: noindex, nofollow → Google de-indexes on next crawl
 *   - Pages still serve normally for direct links
 *   - Excluded from sitemap (see next-sitemap.config.js)
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

export default function UseCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
