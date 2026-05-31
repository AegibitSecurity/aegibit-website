/**
 * Pre-renders the AEGIBIT social queue.
 *
 * Reads automation/data/social-posts.json and, for each post, writes:
 *   social/queue/<date>.png   — HD 1600x900 on-brand image
 *   social/queue/<date>.txt   — the caption, ready to copy-paste
 *
 * Run LOCALLY (where system fonts resolve) whenever the queue needs
 * refilling. The committed PNGs are what the daily cron emails — CI
 * never rasterizes text, so headless font gaps can't break delivery.
 *
 *   node automation/scripts/render-social-queue.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { buildSvg } from "./lib/social-template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const DATA = join(ROOT, "automation", "data", "social-posts.json");
const OUT = join(ROOT, "social", "queue");

mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(readFileSync(DATA, "utf8"));

let ok = 0;
for (const post of posts) {
  const svg = buildSvg(post);
  const png = await sharp(Buffer.from(svg), { density: 192 })
    .resize(1600, 900)
    .png()
    .toBuffer();
  writeFileSync(join(OUT, `${post.date}.png`), png);
  writeFileSync(join(OUT, `${post.date}.txt`), post.caption, "utf8");
  console.log(`rendered ${post.date}.png (${png.length} bytes) + caption`);
  ok++;
}
console.log(`\ndone — ${ok}/${posts.length} posts in social/queue/`);
