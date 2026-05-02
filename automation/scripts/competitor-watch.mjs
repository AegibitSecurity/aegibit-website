import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT, loadConfig, log, withJob } from "./_lib.mjs";

await withJob("competitor-watch", async () => {
  const cfg = loadConfig();
  const stateFile = path.join(ROOT, "automation", "logs", "competitor-state.json");
  let prev = {};
  if (fs.existsSync(stateFile)) prev = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const next = {};
  for (const c of cfg.competitors || []) {
    try {
      const res = await fetch(c.pricingUrl, { headers: { "User-Agent": "AEGIS-CompetitorWatch/1.0" } });
      const body = await res.text();
      const hash = crypto.createHash("sha256").update(body).digest("hex");
      next[c.name] = { hash, when: new Date().toISOString(), url: c.pricingUrl };
      if (prev[c.name] && prev[c.name].hash !== hash) log("competitor-watch", `CHANGE at ${c.name}`);
      else log("competitor-watch", `${c.name}: no change`);
    } catch (e) { log("competitor-watch", `${c.name} fetch failed: ${e.message}`, "warn"); }
  }
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(next, null, 2));
});
