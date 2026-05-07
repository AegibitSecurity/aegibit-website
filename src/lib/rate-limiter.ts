import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * AEGIBIT rate-limiter — serverless-safe.
 *
 * Why this exists: `RateLimiterMemory` lives inside one lambda instance.
 * On Vercel, a single attacker hits N parallel cold-start lambdas and
 * gets N × points before any one instance trips the limit. The cap
 * stops working under exactly the conditions where it matters.
 *
 * The fix: route rate-limit state through an out-of-process store. We
 * use Upstash Redis (free tier, atomic INCR with TTL — the textbook
 * pattern). It's the same library Vercel uses in their own templates.
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are not set, we
 * fall back to the in-memory limiter (preserves the old broken-but-
 * acceptable behavior) and log a single warning. This means the deploy
 * is safe to ship before Upstash is configured — operators add the env
 * vars when ready and a redeploy upgrades the limiter automatically.
 *
 * Failure mode: if Upstash itself returns an error, we fail OPEN (allow
 * the request) rather than fail CLOSED (deny). Same posture as the old
 * in-memory limiter. We don't punish a legitimate visitor for our
 * own outage.
 */

export interface LimiterConfig {
  name: string;       // namespace prefix in Redis keys
  points: number;     // max requests
  durationSec: number; // window in seconds
}

export const visitorLimiter: LimiterConfig = {
  name: "visitor",
  points: 10,
  durationSec: 60,
};

export const eventLimiter: LimiterConfig = {
  name: "event",
  points: 30,
  durationSec: 60,
};

export const leadLimiter: LimiterConfig = {
  name: "lead",
  points: 5,
  durationSec: 60,
};

// ── Upstash backend (lazy-initialised so module import doesn't crash
//    when env vars are absent — only callers of checkRateLimit see it). ──

let _redis: Redis | null = null;
const _upstashCache = new Map<string, Ratelimit>();
let _warnedAboutFallback = false;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

function getUpstashLimiter(cfg: LimiterConfig): Ratelimit | null {
  const cached = _upstashCache.get(cfg.name);
  if (cached) return cached;
  const redis = getRedis();
  if (!redis) return null;
  const rl = new Ratelimit({
    redis,
    // Sliding-window is more accurate than fixed-window under bursty
    // traffic and only marginally more expensive (1 extra Redis call).
    limiter: Ratelimit.slidingWindow(cfg.points, `${cfg.durationSec} s`),
    prefix: `aegibit:rl:${cfg.name}`,
    analytics: false,
  });
  _upstashCache.set(cfg.name, rl);
  return rl;
}

// ── In-memory fallback (preserves prior behavior when Upstash absent) ──

const _memoryLimiters = new Map<string, RateLimiterMemory>();
function getMemoryLimiter(cfg: LimiterConfig): RateLimiterMemory {
  const cached = _memoryLimiters.get(cfg.name);
  if (cached) return cached;
  const lim = new RateLimiterMemory({
    points: cfg.points,
    duration: cfg.durationSec,
    keyPrefix: cfg.name,
  });
  _memoryLimiters.set(cfg.name, lim);
  return lim;
}

// ── Public API (unchanged signature — callers don't move) ──────────

export async function checkRateLimit(
  cfg: LimiterConfig,
  key: string,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  // Path A: Upstash (correct, serverless-safe).
  const upstash = getUpstashLimiter(cfg);
  if (upstash) {
    try {
      const res = await upstash.limit(key);
      return res.success
        ? { allowed: true }
        : {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)),
          };
    } catch (err) {
      // Fail open — we'd rather let a legit visitor through than block
      // every form submission because Upstash had a bad minute.
      console.error("[ratelimit] upstash error, failing open:", err);
      return { allowed: true };
    }
  }

  // Path B: in-memory fallback — broken under multi-lambda but
  // preserves old behavior so a deploy without Upstash configured does
  // not regress anything.
  if (!_warnedAboutFallback) {
    console.warn(
      "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN not set — falling back to " +
        "in-memory limiter. Per-instance counters DO NOT enforce limits " +
        "across parallel lambdas. Set Upstash env vars to fix.",
    );
    _warnedAboutFallback = true;
  }
  const lim = getMemoryLimiter(cfg);
  try {
    await lim.consume(key);
    return { allowed: true };
  } catch (e: unknown) {
    const err = e as { msBeforeNext?: number };
    return {
      allowed: false,
      retryAfter: err.msBeforeNext ? Math.ceil(err.msBeforeNext / 1000) : 60,
    };
  }
}
