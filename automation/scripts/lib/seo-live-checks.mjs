/**
 * Live SEO check library — pure functions over fetched HTML.
 *
 * Extracts the SEO-relevant head signals from a rendered page and runs
 * a battery of checks. No I/O here; the orchestrator
 * (seo-live-audit.mjs) does the crawling, cross-page checks, scoring,
 * regression detection, and alerting.
 *
 * Regex extraction (not a DOM parser) is deliberate: zero new deps
 * (zero-spend) and the targets are well-formed Next.js-emitted tags.
 */

const CANONICAL_HOST = "www.aegibit.com";

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'");
}

/** Find a <meta> tag matching identifier attr=val (any attr order) and return its content. */
function metaContent(html, idAttr, idVal) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const idRe = new RegExp(`${idAttr}\\s*=\\s*["']${idVal}["']`, "i");
  for (const tag of tags) {
    if (idRe.test(tag)) {
      const c = tag.match(/content\s*=\s*["']([\s\S]*?)["']/i);
      if (c) return decodeEntities(c[1]).trim();
    }
  }
  return null;
}

export function extractSeo(html) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalM = html.match(
    /<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i,
  );
  let canonical = null;
  if (canonicalM) {
    const href = canonicalM[0].match(/href\s*=\s*["']([^"']+)["']/i);
    canonical = href ? href[1] : null;
  }
  const langM = html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i);

  // JSON-LD blocks — validate each parses.
  const jsonld = [];
  const ldRe = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html))) {
    const raw = m[1].trim();
    try {
      JSON.parse(raw);
      jsonld.push({ valid: true });
    } catch (e) {
      jsonld.push({ valid: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;

  return {
    title: titleM ? decodeEntities(titleM[1]).trim() : null,
    description: metaContent(html, "name", "description"),
    canonical,
    robots: metaContent(html, "name", "robots"),
    ogTitle: metaContent(html, "property", "og:title"),
    ogImage: metaContent(html, "property", "og:image"),
    h1Count,
    lang: langM ? langM[1] : null,
    jsonldCount: jsonld.length,
    jsonldInvalid: jsonld.filter((j) => !j.valid).length,
  };
}

/**
 * Run per-page checks. Returns an array of { level, code, msg }.
 * level: "error" (breaks indexing / rich results) | "warn" | "info".
 */
export function runPageChecks(url, status, seo) {
  const issues = [];
  const add = (level, code, msg) => issues.push({ level, code, msg });

  // ── Reachability ────────────────────────────────────────────────
  if (status !== 200) {
    add("error", "bad_status", `Returns HTTP ${status} (a sitemap URL must be a live 200).`);
    return issues; // no point checking head of a non-200
  }

  // ── Title ───────────────────────────────────────────────────────
  if (!seo.title) {
    add("error", "no_title", "Missing <title>.");
  } else {
    const len = seo.title.length;
    if (len < 15) add("warn", "title_short", `Title is ${len} chars (aim 30–60).`);
    if (len > 65) add("warn", "title_long", `Title is ${len} chars (Google truncates ~60).`);
  }

  // ── Meta description ────────────────────────────────────────────
  if (!seo.description) {
    add("warn", "no_description", "Missing meta description.");
  } else {
    const len = seo.description.length;
    if (len < 50) add("warn", "desc_short", `Description is ${len} chars (aim 70–160).`);
    if (len > 165) add("warn", "desc_long", `Description is ${len} chars (Google truncates ~160).`);
  }

  // ── Canonical ───────────────────────────────────────────────────
  if (!seo.canonical) {
    add("error", "no_canonical", "Missing <link rel=canonical>.");
  } else {
    let host = null;
    try {
      host = new URL(seo.canonical, url).host;
    } catch {
      add("error", "canonical_unparseable", `Canonical is not a valid URL: ${seo.canonical}`);
    }
    if (host && host !== CANONICAL_HOST) {
      add("error", "canonical_wrong_host", `Canonical host is ${host}, expected ${CANONICAL_HOST}.`);
    }
  }

  // ── Accidental noindex (a sitemap URL should NEVER be noindex) ───
  if (seo.robots && /noindex/i.test(seo.robots)) {
    add("error", "noindex_on_indexable", `robots meta is "${seo.robots}" — this indexable page is set to noindex.`);
  }

  // ── Headings ────────────────────────────────────────────────────
  if (seo.h1Count === 0) add("warn", "no_h1", "No <h1> on the page.");
  if (seo.h1Count > 1) add("warn", "multi_h1", `${seo.h1Count} <h1> elements (prefer exactly one).`);

  // ── Open Graph (share cards) ────────────────────────────────────
  if (!seo.ogTitle) add("warn", "no_og_title", "Missing og:title.");
  if (!seo.ogImage) add("warn", "no_og_image", "Missing og:image (no share-card preview).");

  // ── Structured data ─────────────────────────────────────────────
  if (seo.jsonldInvalid > 0) {
    add("error", "invalid_jsonld", `${seo.jsonldInvalid} JSON-LD block(s) fail to parse — rich results will be dropped.`);
  }

  // ── i18n hygiene ────────────────────────────────────────────────
  if (!seo.lang) add("info", "no_html_lang", "No <html lang> attribute.");

  return issues;
}

export const SEVERITY_WEIGHT = { error: 8, warn: 1, info: 0 };
