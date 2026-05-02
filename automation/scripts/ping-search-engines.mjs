import { loadConfig, log, withJob } from "./_lib.mjs";

await withJob("ping-search-engines", async () => {
  const cfg = loadConfig();
  const sitemap = `${cfg.siteUrl}/sitemap.xml`;
  const targets = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
  ];
  for (const url of targets) {
    try {
      const res = await fetch(url, { method: "GET" });
      log("ping-search-engines", `${url} → ${res.status}`);
    } catch (e) {
      log("ping-search-engines", `${url} failed: ${e.message}`, "warn");
    }
  }
});
