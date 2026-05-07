// Submit our sitemap URLs to IndexNow.
// Replaces the legacy Google/Bing /ping?sitemap= endpoints, both of
// which were deprecated in mid-2023 (now 410 Gone). IndexNow is the
// modern protocol Bing + Yandex actually honor, and Google reads via
// Bing.
//
// Wired into:
//   - .github/workflows/daily-automation.yml seo-watch job
//   - Any other place that previously called this script
//
// Behavior:
//   - Reads sitemap URLs from <siteUrl>/sitemap.xml
//   - POSTs the full URL list to api.indexnow.org
//   - Treats 200 + 202 as success; any other response logged + exits 1
//   - On three consecutive failures the AEGIS escalation policy fires
//     (see automation/scripts/_lib.mjs withJob)

import { loadConfig, log, withJob } from "./_lib.mjs";

const INDEXNOW_KEY = "fdd4e2e9b5da47d964f12e8a42a8e8b2";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

await withJob("ping-search-engines", async () => {
  const cfg = loadConfig();
  const sitemapUrl = `${cfg.siteUrl}/sitemap.xml`;

  // Pull the URL list out of the sitemap.
  log("ping-search-engines", `Fetching sitemap ${sitemapUrl}`);
  const sitemapRes = await fetch(sitemapUrl);
  if (!sitemapRes.ok) {
    throw new Error(`Sitemap fetch failed: ${sitemapRes.status} ${sitemapRes.statusText}`);
  }
  const xml = await sitemapRes.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  log("ping-search-engines", `Parsed ${urls.length} URLs from sitemap`);

  if (urls.length === 0) {
    log("ping-search-engines", "Sitemap empty; nothing to submit", "warn");
    return;
  }

  const host = new URL(cfg.siteUrl).host;
  const keyLocation = `${cfg.siteUrl}/${INDEXNOW_KEY}.txt`;

  // Chunk to 1000 per call (IndexNow allows 10000 but we stay
  // conservative — keeps individual failures small).
  for (let i = 0; i < urls.length; i += 1000) {
    const chunk = urls.slice(i, i + 1000);
    const body = { host, key: INDEXNOW_KEY, keyLocation, urlList: chunk };
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`IndexNow chunk ${i / 1000 + 1} failed: ${res.status} ${text}`);
    }
    log(
      "ping-search-engines",
      `IndexNow ack chunk ${i / 1000 + 1}: ${res.status} (${chunk.length} urls)`,
    );
  }

  log("ping-search-engines", `✓ Submitted ${urls.length} URLs to IndexNow`);
});
