import { log, withJob } from "./_lib.mjs";

await withJob("lead-health-check", async () => {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  // Diagnostic: log presence + length only (NEVER the value itself).
  log("lead-health-check", `URL present=${!!url} len=${url.length} startsWithHttps=${url.startsWith("https://")}`);
  log("lead-health-check", `KEY present=${!!key} len=${key.length} looksLikeJWT=${key.split(".").length === 3}`);
  if (!url || !key) { log("lead-health-check", "Supabase env not set — skipping", "warn"); return; }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const yest = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const safeFetch = async (q) => {
    try { const r = await fetch(`${url}/rest/v1/${q}`, { headers }); return r.ok ? await r.json() : []; }
    catch { return []; }
  };

  const [tL, yL, tV, yV] = await Promise.all([
    safeFetch(`leads?select=id&created_at=gte.${since}`),
    safeFetch(`leads?select=id&created_at=gte.${yest}&created_at=lt.${since}`),
    safeFetch(`visitors?select=id&created_at=gte.${since}`),
    safeFetch(`visitors?select=id&created_at=gte.${yest}&created_at=lt.${since}`),
  ]);

  const tConv = tV.length ? tL.length / tV.length : 0;
  const yConv = yV.length ? yL.length / yV.length : 0;
  const drop = yConv ? ((yConv - tConv) / yConv) * 100 : 0;

  log("lead-health-check", `today: leads=${tL.length} visitors=${tV.length} conv=${(tConv*100).toFixed(2)}%`);
  log("lead-health-check", `yesterday: leads=${yL.length} visitors=${yV.length} conv=${(yConv*100).toFixed(2)}%`);
  if (drop > 20) log("lead-health-check", `ALERT: conv dropped ${drop.toFixed(1)}%`, "error");
});
