/**
 * IndexNow — submit URLs to Bing/Yandex/Seznam for near-instant indexing.
 *
 * Why this and not the legacy Google/Bing sitemap-ping endpoints:
 * Google deprecated /ping?sitemap= in June 2023; Bing followed. Both
 * now return 410 Gone. IndexNow is the modern protocol both Bing and
 * Yandex (and indirectly Google, via Bing) actually honor in 2026.
 *
 * Public-by-design: the key is not a secret. The verification file at
 * /<key>.txt must be served from the same host so search engines can
 * confirm ownership. We hardcode + commit the key so the verification
 * file and the API caller always agree.
 *
 * https://www.indexnow.org/documentation
 */

import { SITE_URL } from "@/lib/seo";

export const INDEXNOW_KEY = "fdd4e2e9b5da47d964f12e8a42a8e8b2";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  error?: string;
}

/**
 * Submit one or more URLs to IndexNow. Returns immediately on success
 * (200/202) or with the error status from the API.
 *
 * Up to 10,000 URLs per request per IndexNow spec, but we cap at 1000
 * defensively and chunk above that.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (urls.length === 0) {
    return { ok: true, status: 200, submitted: 0 };
  }

  const host = new URL(SITE_URL).host;
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

  // Chunk to 1000 per request — defensive against the 10k limit.
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 1000) {
    chunks.push(urls.slice(i, i + 1000));
  }

  let totalSubmitted = 0;
  let lastStatus = 0;
  for (const chunk of chunks) {
    const body = {
      host,
      key: INDEXNOW_KEY,
      keyLocation,
      urlList: chunk,
    };
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      lastStatus = res.status;
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          ok: false,
          status: res.status,
          submitted: totalSubmitted,
          error: text || res.statusText,
        };
      }
      totalSubmitted += chunk.length;
    } catch (err) {
      return {
        ok: false,
        status: 0,
        submitted: totalSubmitted,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return { ok: true, status: lastStatus, submitted: totalSubmitted };
}
