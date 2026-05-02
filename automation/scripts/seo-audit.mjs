// Static SEO audit — flags missing metadata in src/app/**/page.tsx.
import fs from "node:fs";
import path from "node:path";
import { ROOT, log, withJob } from "./_lib.mjs";

await withJob("seo-audit", async () => {
  const issues = [];
  const appDir = path.join(ROOT, "src", "app");
  if (!fs.existsSync(appDir)) { log("seo-audit", "No src/app dir"); return; }
  walk(appDir, (file) => {
    if (!/page\.(tsx|ts)$/.test(file)) return;
    const src = fs.readFileSync(file, "utf8");
    const rel = path.relative(ROOT, file);
    if (!/export\s+const\s+metadata/.test(src) && !/generateMetadata/.test(src)) {
      issues.push({ file: rel, issue: "missing metadata export" });
    }
    if (!/<h1[\s>]/.test(src) && !src.includes("h1=")) {
      issues.push({ file: rel, issue: "no <h1> detected (heuristic)" });
    }
  });
  fs.mkdirSync(path.join(ROOT, "automation", "logs"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "automation", "logs", "seo-audit.json"),
    JSON.stringify({ when: new Date().toISOString(), issues }, null, 2));
  log("seo-audit", `${issues.length} issues found`);
});

function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, cb); else cb(p);
  }
}
