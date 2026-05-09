import type { Metadata } from "next";

/**
 * /integrations/* — emergency noindex.
 *
 * Same disposition as /alternatives/* and /use-cases/*: integration
 * pages were authored around the VoiceCore positioning. Most of them
 * describe voice-AI integrations (Slack voice-commands, etc.) that
 * no longer reflect AEGIBIT's actual product (PayMint, an expense-
 * capture SaaS). Tally / Razorpay / Zoho integrations that ARE
 * relevant to PayMint will be authored fresh in the C-2 rewrite.
 *
 * Treatment until the rewrite ships:
 *   - robots: noindex, nofollow → Google de-indexes on next crawl
 *   - Pages still serve for direct links
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

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
