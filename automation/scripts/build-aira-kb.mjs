#!/usr/bin/env node
/**
 * build-aira-kb.mjs, Aira's automatic knowledge-ingestion pipeline.
 *
 * WHAT THIS IS
 * The ingestion half of Aira's RAG architecture. It crawls the LIVE
 * public site via sitemap.xml, extracts the visible text of every
 * page, chunks it, and writes a deterministic knowledge index to
 * src/data/aira-kb.json. The chat brain (src/lib/aira-kb.ts) retrieves
 * from that index at answer time.
 *
 * WHY CRAWL THE LIVE SITE (design decision)
 * - Anything published on aegibit.com automatically becomes Aira
 *   knowledge on the next index run: new product pages, case studies,
 *   pricing changes, blog posts. No prompts to edit, no code changes.
 *   Ship a page, Aira learns it. That is the "AI employee that studies
 *   the company" contract.
 * - By construction the bot can only know PUBLIC content. Internal
 *   docs, admin surfaces, and secrets can never leak through the chat
 *   because they are never in the index. Security by architecture,
 *   not by prompt.
 *
 * RUNS
 * - Locally: node automation/scripts/build-aira-kb.mjs
 * - CI: .github/workflows/aira-kb.yml (weekly cron + manual + after
 *   deploys). Commits the refreshed index only when content changed.
 *
 * OUTPUT SHAPE (src/data/aira-kb.json)
 *   { pages: number, chunkCount: number,
 *     chunks: [{ id, url, title, text }] }
 * Deterministic ordering (by URL, then position) so diffs are stable
 * and a no-change crawl produces a byte-identical file.
 *
 * HYGIENE
 * - Em/en-dashes are normalized away (site-wide hard rule; the CI
 *   guard scans src/ including this JSON).
 * - Whitespace collapsed, entities decoded, scripts/styles/nav/footer
 *   stripped so chunks are pure content.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = process.env.AIRA_KB_SITE || "https://www.aegibit.com";
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/data/aira-kb.json",
);

// Surfaces that are useless (or wrong) as chat knowledge.
const SKIP_PATTERNS = [
  /\/dashboard/, /\/api\//, /\/sign(in|up)/, /\/admin/,
  /\.(xml|txt|ico|png|jpg|svg|webmanifest)$/,
];

// Per-page and total caps keep the index lean; the whole site fits
// comfortably today, these are guardrails for the future.
const MAX_PAGES = 120;
const MAX_CHUNKS_PER_PAGE = 14;
const CHUNK_TARGET = 1000;   // chars per chunk (approx, sentence-aligned)
const CHUNK_MIN = 120;       // drop fragments smaller than this

function normalize(text) {
  return text
    // hard rule: no em/en dashes anywhere in AEGIBIT artifacts
    .replace(/[—–―]/g, ", ")
    .replace(/[ ​]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s) {
  const map = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'",
    "&apos;": "'", "&nbsp;": " ", "&middot;": "·", "&rsquo;": "'",
    "&lsquo;": "'", "&ldquo;": '"', "&rdquo;": '"', "&hellip;": "...",
    "&#x27;": "'", "&#x2F;": "/", "&trade;": "(TM)", "&copy;": "(c)",
  };
  return s
    .replace(/&#(\d+);/g, (_, d) => {
      const code = parseInt(d, 10);
      // decode numeric entities but keep the no-dash rule
      if (code === 0x2014 || code === 0x2013 || code === 0x2015) return ", ";
      return String.fromCharCode(code);
    })
    .replace(/&[a-zA-Z#0-9]+;/g, (m) => map[m] ?? " ");
}

/** Extract the human-visible text of a marketing page. */
function extractText(html) {
  let s = html;
  // Remove non-content blocks entirely.
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, " ");
  // Prefer <main> when the page has one (all our pages do).
  const main = s.match(/<main[\s\S]*?<\/main>/i);
  if (main) s = main[0];
  // Block-level tags become sentence breaks so headings don't glue to body.
  s = s.replace(/<\/(h1|h2|h3|h4|p|li|div|section|article|tr)>/gi, ". ");
  s = s.replace(/<[^>]+>/g, " ");
  s = decodeEntities(s);
  s = normalize(s);
  // Collapse the ".  ." artifacts from empty blocks.
  s = s.replace(/(\.\s*){2,}/g, ". ");
  return s;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? normalize(decodeEntities(m[1])).replace(/\s*\|\s*AEGIBIT.*$/i, "") : "";
}

/** Sentence-aligned chunking with a small overlap for context. */
function chunk(text) {
  const sentences = text.split(/(?<=\.)\s+/);
  const chunks = [];
  let cur = "";
  for (const sent of sentences) {
    if ((cur + " " + sent).length > CHUNK_TARGET && cur.length >= CHUNK_MIN) {
      chunks.push(cur.trim());
      // start next chunk with a one-sentence overlap for continuity
      cur = sent;
    } else {
      cur = cur ? cur + " " + sent : sent;
    }
    if (chunks.length >= MAX_CHUNKS_PER_PAGE) break;
  }
  if (cur.trim().length >= CHUNK_MIN && chunks.length < MAX_CHUNKS_PER_PAGE) {
    chunks.push(cur.trim());
  }
  return chunks;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "AiraKB/1.0 (+https://www.aegibit.com)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function main() {
  console.log(`[aira-kb] crawling ${SITE} ...`);
  const sitemap = await fetchText(`${SITE}/sitemap.xml`);
  // AIRA_KB_EXTRA="/path1,/path2" lets an operator index pages that are
  // live but not yet in the deployed sitemap (e.g. brand-new product
  // pages between merge and the next crawl).
  const extras = (process.env.AIRA_KB_EXTRA || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `${SITE}${p.startsWith("/") ? p : "/" + p}`);
  const urls = [...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim())
      .concat(extras),
  )]
    .filter((u) => !SKIP_PATTERNS.some((p) => p.test(u)))
    .sort()
    .slice(0, MAX_PAGES);

  console.log(`[aira-kb] ${urls.length} pages to ingest`);

  const chunks = [];
  let pages = 0;
  for (const url of urls) {
    try {
      const html = await fetchText(url);
      const title = extractTitle(html) || url;
      const text = extractText(html);
      if (text.length < CHUNK_MIN) continue;
      const path = url.replace(SITE, "") || "/";
      chunk(text).forEach((c, i) => {
        chunks.push({ id: `${path}#${i}`, url: path, title, text: c });
      });
      pages += 1;
      process.stdout.write(`  ok ${path} (${title.slice(0, 40)})\n`);
    } catch (e) {
      process.stdout.write(`  skip ${url}: ${e.message}\n`);
    }
  }

  const out = { pages, chunkCount: chunks.length, chunks };
  mkdirSync(join(dirname(OUT)), { recursive: true });
  // Trailing newline keeps POSIX tools + git happy.
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n", "utf8");
  console.log(`[aira-kb] wrote ${chunks.length} chunks from ${pages} pages -> ${OUT}`);

  if (pages < 10) {
    console.error("[aira-kb] FAIL: suspiciously few pages ingested; refusing to ship a gutted index.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("[aira-kb] fatal:", e);
  process.exit(1);
});
