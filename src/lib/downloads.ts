import { Redis } from "@upstash/redis";

/**
 * Download counting, the honest way (standing rule from Rahul: the site
 * always shows exact, real download numbers per app, Play Store style).
 *
 * Three sources, all real:
 *  - Vestiq: our own counter. Every APK download from the site goes
 *    through /api/download/vestiq which INCRs downloads:vestiq in the
 *    same Upstash Redis the rate limiter uses, then redirects to the
 *    file. The counter legitimately starts at zero the day this ships;
 *    we never fabricate or backfill.
 *  - Aira: GitHub Releases asset download_count, which GitHub has been
 *    counting since day one (true lifetime number).
 *  - MCP Shield: PyPI public download stats (pypistats.org), last 30 days.
 *
 * Every getter is null-safe: if a source is unreachable the page simply
 * renders no number rather than a made-up one.
 */

// Allowlist of apps served through the counting redirect.
export const DOWNLOAD_TARGETS: Record<string, string> = {
  vestiq: "https://vestiq.aegibit.com/Vestiq.apk",
};

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

/** Increment the counter for an allowlisted app. Never throws. */
export async function recordDownload(app: string): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis || !(app in DOWNLOAD_TARGETS)) return;
    await redis.incr(`downloads:${app}`);
  } catch {
    // Counting must never block a download.
  }
}

/** Exact count from our own counter (0 is a real value; null = source down). */
export async function getCounterDownloads(app: string): Promise<number | null> {
  try {
    const redis = getRedis();
    if (!redis) return null;
    const v = await redis.get<number>(`downloads:${app}`);
    return typeof v === "number" ? v : 0;
  } catch {
    return null;
  }
}

/** Lifetime Aira installer downloads, summed across all GitHub releases. */
export async function getAiraDownloads(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/AegibitSecurity/aegibit-website/releases?per_page=100",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const releases: { assets?: { name?: string; download_count?: number }[] }[] = await res.json();
    let total = 0;
    for (const r of releases) {
      for (const a of r.assets ?? []) {
        if (a.name?.toLowerCase().endsWith(".exe")) total += a.download_count ?? 0;
      }
    }
    return total;
  } catch {
    return null;
  }
}

/** MCP Shield pip installs over the last 30 days (PyPI public stats). */
export async function getMcpShieldMonthlyDownloads(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://pypistats.org/api/packages/aegibit-mcp-shield/recent",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data: { data?: { last_month?: number } } = await res.json();
    const n = data.data?.last_month;
    return typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}
