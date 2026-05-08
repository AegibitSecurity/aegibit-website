import type { Metadata } from "next";

/**
 * /locations/* — Programmatic location pages from AEGIBIT's earlier
 * services-shop positioning ("websites and apps starting at $499/month
 * for businesses in <City>").
 *
 * Same disposition as /services/* (see services/layout.tsx):
 * AEGIBIT has pivoted to a product company. These pages claim a
 * pricing tier that doesn't exist on /pricing, contradict the actual
 * brand positioning, and risk Google penalising us for thin/templated
 * content with fictional offers.
 *
 * Treatment until we make a permanent disposition decision:
 *   • robots: noindex, nofollow → Google de-indexes on next crawl
 *   • Pages still serve normally for anyone with a direct link
 *
 * Long-term options:
 *   (a) Delete entirely (likely the right call — they have no traffic
 *       value beyond the abandoned services positioning)
 *   (b) Rebrand each into a real "PayMint for <city> dealerships"
 *       page with the actual pricing and the Nibir Motors anchor —
 *       only worth doing if a city ever produces meaningful inbound
 *
 * Decision deferred — noindex stops the brand bleeding now.
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

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
