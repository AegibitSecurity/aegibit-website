// CI guard: fails the build if any em-dash appears under src/.
//
// AEGIBIT hard rule (set by Rahul): the website must NEVER contain
// em-dashes. This runs in the Test workflow on every pull request and
// push, so a stray em-dash can never reach production again, whether it
// comes from a human edit, a paste, or an automation.
//
// The needle is built from its codepoint (U+2014) so this guard file
// itself never contains a literal em-dash.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const SRC = path.join(ROOT, "src");
const EXTS = new Set([".ts", ".tsx", ".mdx", ".md", ".js", ".jsx", ".css", ".json"]);
const EM = String.fromCodePoint(0x2014); // em-dash, never a literal in this file
const offenders = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walk(p);
    } else if (EXTS.has(path.extname(p))) {
      const lines = fs.readFileSync(p, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (line.includes(EM)) offenders.push(`${path.relative(ROOT, p)}:${i + 1}`);
      });
    }
  }
}

if (fs.existsSync(SRC)) walk(SRC);

if (offenders.length > 0) {
  console.error(`Found ${offenders.length} em-dash(es). The website must never contain em-dashes:`);
  for (const o of offenders) console.error("  " + o);
  console.error("Replace each with a comma, colon, period, or hyphen as the grammar fits.");
  process.exit(1);
}

console.log("check-no-emdash: clean. No em-dashes found under src/.");
