/**
 * AGOS Collection Layer, v1. Turns REAL observed signals into
 * proposals for the Decision Engine. No signal, no proposal; the
 * system never invents work to look busy.
 *
 * v1 collectors (all local/free, no external APIs):
 *   1. kb-freshness    is Aira's knowledge index stale?
 *   2. coverage-gaps   noindexed sections still waiting for real
 *                      content (each one is lost GEO surface)
 *   3. stale-content   blog posts untouched > 60 days (freshness
 *                      protects rankings)
 *
 * Phase B adds: GSC query mining, news/CVE feeds, competitor deltas,
 * lead-pattern signals. Same proposal contract, richer inputs.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function collectProposals() {
  const proposals = [];

  // ── 1. Knowledge-index freshness ─────────────────────────────────
  const kbPath = join(ROOT, "src/data/aira-kb.json");
  if (existsSync(kbPath)) {
    const ageDays = (Date.now() - statSync(kbPath).mtimeMs) / 864e5;
    if (ageDays > 8) {
      proposals.push({
        id: `kb-refresh-${new Date().toISOString().slice(0, 10)}`,
        type: "kb-refresh",
        worker: "geo",
        title: "Refresh the Aira knowledge index from the live site",
        detail: `aira-kb.json is ${Math.round(ageDays)} days old (threshold 8). A stale index degrades both Aira's answers and /llms.txt.`,
        dedupeKey: `kb-refresh-week-${isoWeek()}`,
      });
    }
  }

  // ── 2. Coverage gaps (noindexed sections = dead GEO surface) ─────
  for (const section of ["glossary", "alternatives"]) {
    const layout = join(ROOT, `src/app/${section}/layout.tsx`);
    if (existsSync(layout) && /index:\s*false/.test(readFileSync(layout, "utf8"))) {
      proposals.push({
        id: `coverage-${section}`,
        type: "coverage-gap",
        worker: "geo",
        title: `Build real content for /${section} and lift its noindex`,
        detail: `/${section}/* is deliberately noindexed as a placeholder. Filling it with genuine, schema-marked content converts dead pages into indexable, AI-citable assets.`,
        dedupeKey: `coverage-${section}`,
      });
    }
  }

  // ── 3. Stale blog content ────────────────────────────────────────
  const blogDir = join(ROOT, "src/app/(marketing)/blog");
  if (existsSync(blogDir)) {
    const stale = readdirSync(blogDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("["))
      .map((e) => {
        const page = join(blogDir, e.name, "page.tsx");
        return existsSync(page)
          ? { slug: e.name, ageDays: (Date.now() - statSync(page).mtimeMs) / 864e5 }
          : null;
      })
      .filter((x) => x && x.ageDays > 60)
      .sort((a, b) => b.ageDays - a.ageDays)
      .slice(0, 3); // top 3 stalest per run, steady drip beats a flood

    for (const s of stale) {
      proposals.push({
        id: `stale-${s.slug}`,
        type: "stale-refresh",
        worker: "seo",
        title: `Refresh aging article: /blog/${s.slug}`,
        detail: `Untouched for ${Math.round(s.ageDays)} days. Freshness review: update facts, tighten copy, re-verify links, re-date honestly if substantially improved.`,
        dedupeKey: `stale-${s.slug}-q${quarter()}`,
      });
    }
  }

  return proposals;
}

function isoWeek() {
  const d = new Date();
  const start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return `${d.getUTCFullYear()}w${Math.ceil((((d - start) / 864e5) + start.getUTCDay() + 1) / 7)}`;
}
function quarter() {
  const d = new Date();
  return `${d.getUTCFullYear()}q${Math.floor(d.getUTCMonth() / 3) + 1}`;
}
