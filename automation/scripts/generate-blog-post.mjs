// Maintains a content-idea backlog from the topic queue. Tier T0.
//
// HISTORY: this script used to write stub .mdx files into
// src/content/blog/. Those files were never rendered (the blog route
// reads only src/content/blog-posts.ts), so they were dead weight, and
// the stub template even reintroduced em-dashes. Worse, every stub was
// byte-identical filler that openly said "this is a stub", which would
// have damaged the brand if it had ever shipped.
//
// NOW: instead of fake-publishing, it queues each topic as an idea in
// automation/content-backlog.json for a deliberate, human-written
// cornerstone post in blog-posts.ts (the real rendered source). No dead
// files, no auto-published filler, no em-dashes.
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadConfig, loadState, saveState, log, withJob, slugify } from "./_lib.mjs";

await withJob("generate-blog-post", async () => {
  const cfg = loadConfig();
  const state = loadState();
  const queue = cfg.content.blogTopicQueue || [];
  const used = new Set((state.metrics?.usedBlogTopics) || []);
  const topic = queue.find((t) => !used.has(t));
  if (!topic) { log("generate-blog-post", "No new topics in queue."); return; }
  const slug = slugify(topic);

  const backlogPath = path.join(ROOT, "automation", "content-backlog.json");
  let backlog = [];
  if (fs.existsSync(backlogPath)) {
    try { backlog = JSON.parse(fs.readFileSync(backlogPath, "utf8")); } catch { backlog = []; }
  }
  if (backlog.some((b) => b.slug === slug)) {
    log("generate-blog-post", `Already queued: ${slug}`);
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  backlog.push({ topic, slug, queuedAt: today, status: "idea" });
  fs.writeFileSync(backlogPath, JSON.stringify(backlog, null, 2) + "\n");

  log("generate-blog-post", `Queued content idea: ${topic}`);
  state.metrics ??= {};
  state.metrics.usedBlogTopics = [...used, topic];
  saveState(state);
});
