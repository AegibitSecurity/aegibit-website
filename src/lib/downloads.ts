import { Redis } from "@upstash/redis";
import { getServiceClient } from "@/lib/supabase-admin";

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
  // Evergreen "latest" is SAFE here (unlike this repo's releases, which Aira's
  // installer shares): leadsync-releases is a dedicated single-product repo, so
  // /releases/latest always resolves to the newest LeadSync APK. The LeadSync
  // app's in-app updater also downloads through /api/download/leadsync, so this
  // one target keeps the website button AND in-app updates on the same file
  // with zero future edits: publish a new release there and both pick it up.
  leadsync: "https://github.com/AegibitSecurity/leadsync-releases/releases/latest/download/Leadsync.apk",
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

const PAYMINT_DOWNLOAD_CTA_IDS = [
  "paymint_hero_download_apk",
  "paymint_bottom_download_apk",
];

/**
 * PayMint download baseline: 100 downloads across all distribution
 * channels through 2026-07-04, per Rahul's offline distribution
 * tracker (owner-attested on 2026-07-04). PayMint was distributed
 * directly to dealership staff (WhatsApp / hands-on installs), which
 * the website's click telemetry never saw, website clicks recorded
 * only 1 by that date. The site counts live on top of this baseline:
 * displayed total = 100 + website download clicks since the baseline
 * date. Do not change the baseline without an updated owner-attested
 * record.
 */
const PAYMINT_OFFLINE_BASELINE = 100;
const PAYMINT_BASELINE_SINCE = "2026-07-03T18:30:00.000Z"; // 2026-07-04 00:00 IST

/**
 * PayMint Android downloads: owner-attested offline baseline plus real
 * recorded click telemetry (visitor_events in Supabase) since the
 * baseline date. `today` uses IST midnight (the business operates in
 * India).
 */
export async function getPayMintDownloadStats(): Promise<{ total: number; today: number } | null> {
  try {
    const supabase = getServiceClient();
    const base = () =>
      supabase
        .from("visitor_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "cta_click")
        .in("event_data->>cta_id", PAYMINT_DOWNLOAD_CTA_IDS);

    const nowUtcMs = Date.now();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const ist = new Date(nowUtcMs + istOffsetMs);
    ist.setUTCHours(0, 0, 0, 0);
    const istMidnightUtc = new Date(ist.getTime() - istOffsetMs).toISOString();

    const [sinceBaselineRes, todayRes] = await Promise.all([
      base().gte("timestamp", PAYMINT_BASELINE_SINCE),
      base().gte("timestamp", istMidnightUtc),
    ]);
    if (sinceBaselineRes.error || todayRes.error) return null;
    return {
      total: PAYMINT_OFFLINE_BASELINE + (sinceBaselineRes.count ?? 0),
      today: todayRes.count ?? 0,
    };
  } catch {
    return null;
  }
}
