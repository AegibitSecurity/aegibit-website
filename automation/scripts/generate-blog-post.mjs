// Generates a daily blog post from the topic queue. Tier T0.
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadConfig, loadState, saveState, log, withJob, slugify } from "./_lib.mjs";

await withJob("generate-blog-post", async () => {
  const cfg = loadConfig();
  const state = loadState();
  const queue = cfg.content.blogTopicQueue;
  const used = new Set((state.metrics?.usedBlogTopics) || []);
  const topic = queue.find((t) => !used.has(t)) || queue[Math.floor(Math.random() * queue.length)];
  const slug = slugify(topic);

  const outDir = path.join(ROOT, "src", "content", "blog");
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `${slug}.mdx`);
  if (fs.existsSync(filePath)) { log("generate-blog-post", `Exists: ${filePath}`); return; }

  const today = new Date().toISOString().split("T")[0];
  fs.writeFileSync(filePath, `---
title: "${topic.replace(/"/g, "\\\"")}"
slug: "${slug}"
publishedAt: "${today}"
author: "AEGIBIT Security Team"
tags: ["security", "development", "automation"]
description: "${topic} — practical guidance from the AEGIBIT security team."
---

# ${topic}

> Published ${today} by the AEGIBIT Security Team.

## Summary

This is a stub for "${topic}" — published by AEGIS daily content automation.
A follow-up pass will expand this into a full guide.

## Why this matters

Security and development are converging. If you build software that handles user data,
payments, or identity, this topic is on your roadmap whether you planned for it or not.

## What we recommend

1. **Inventory** — know what you have before you secure it.
2. **Threat-model** — write down what you're protecting and from whom.
3. **Defense in depth** — no single control should be load-bearing.
4. **Monitor** — what you can't observe, you can't defend.
5. **Iterate** — security is a process, not a project.

## How AEGIBIT helps

We build secure websites, mobile apps, and SaaS products. If this topic is keeping you up
at night, [book a free security audit](/contact) — we'll find the gaps in 30 minutes.
`);

  log("generate-blog-post", `Created ${filePath} for: ${topic}`);
  state.metrics ??= {};
  state.metrics.usedBlogTopics = [...used, topic];
  state.metrics.blogPostsPublished = (state.metrics.blogPostsPublished || 0) + 1;
  saveState(state);
});
