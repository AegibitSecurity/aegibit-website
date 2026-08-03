import { Redis } from "@upstash/redis";

/**
 * Live presence, "how many people are on the site RIGHT NOW".
 *
 * Mechanism: every active tab heartbeats POST /api/presence roughly
 * twice a minute (and pauses when the tab is hidden). Each heartbeat
 * writes the visitor id into a Redis sorted set scored by timestamp.
 * The live count is simply "members seen in the last WINDOW seconds",
 * pruned on read. Honest by construction: no sampling, no estimates,
 * one member per real visitor id.
 *
 * Cost honesty (zero-spend check): each heartbeat is 2 Redis commands
 * and each dashboard poll is 2. At today's traffic that is well under
 * the Upstash free tier's daily command budget; revisit if the site
 * ever sees thousands of concurrent visitors (a nice problem).
 */

const KEY = "presence:live";
/** A visitor counts as "on the site" if they pinged in the last 75s
 *  (2 missed 30s heartbeats + slack). */
const WINDOW_SEC = 75;

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

/** Record one heartbeat. Never throws, presence must never break a page. */
export async function recordPresence(visitorId: string): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    const now = Date.now();
    await redis.zadd(KEY, { score: now, member: visitorId });
    // Key self-heals if the site goes quiet: expire after 10 minutes.
    await redis.expire(KEY, 600);
  } catch {
    // Presence is best-effort telemetry.
  }
}

/** Count visitors active within the window. Null = Redis unavailable. */
export async function getLiveCount(): Promise<number | null> {
  try {
    const redis = getRedis();
    if (!redis) return null;
    const cutoff = Date.now() - WINDOW_SEC * 1000;
    await redis.zremrangebyscore(KEY, 0, cutoff);
    const n = await redis.zcard(KEY);
    return typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}
