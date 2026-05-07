import type { Metadata } from "next";

/**
 * Canonical site URL — always includes the `www.` prefix even if the
 * env var is set to the apex domain. The Vercel proxy 308-redirects
 * apex → www, so apex URLs in JSON-LD/OG/canonical tags would force
 * Google to follow an extra hop and dilute ranking signals. This
 * helper normalizes everywhere downstream.
 *
 * Operators can set NEXT_PUBLIC_APP_URL to either apex or www and the
 * site behaves the same way.
 */
function normalizeCanonical(input: string | undefined): string {
  const raw = (input ?? "https://www.aegibit.com").trim().replace(/\/+$/, "");
  // Force https + www on aegibit.com hosts; leave other hosts alone
  // so localhost / preview URLs continue to work.
  try {
    const u = new URL(raw);
    if (u.hostname === "aegibit.com") u.hostname = "www.aegibit.com";
    if (u.hostname.endsWith(".aegibit.com") || u.hostname === "aegibit.com" || u.hostname === "www.aegibit.com") {
      u.protocol = "https:";
      u.port = "";
    }
    return u.toString().replace(/\/$/, "");
  } catch {
    return "https://www.aegibit.com";
  }
}

export const SITE_URL = normalizeCanonical(process.env.NEXT_PUBLIC_APP_URL);
const BASE_URL = SITE_URL;
const SITE_NAME = "AEGIBIT";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${opts.path ?? ""}`;
  return {
    metadataBase: new URL(BASE_URL),
    title: `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    keywords: opts.keywords,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(opts.title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical: url },
  };
}

export function buildBreadcrumbJsonLd(crumbs: { name: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE_URL}${c.href}` } : {}),
    })),
  };
}
