import fs from "node:fs";
import path from "node:path";
import { ROOT, log, withJob } from "./_lib.mjs";

await withJob("brand-mentions", async () => {
  const queries = ["aegibit", "AEGIBIT Security", "AEGIBIT Flow", "VoiceCore aegibit"];
  const results = queries.map(q => ({ query: q, when: new Date().toISOString(), note: "stub — wire SerpAPI/Brave Search" }));
  fs.mkdirSync(path.join(ROOT, "automation", "logs"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "automation", "logs", "brand-mentions.json"), JSON.stringify(results, null, 2));
  log("brand-mentions", `${queries.length} queries logged (stub)`);
});
