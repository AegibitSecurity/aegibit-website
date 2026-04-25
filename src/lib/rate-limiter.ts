import { RateLimiterMemory } from "rate-limiter-flexible";

export const visitorLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export const eventLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60,
});

export const leadLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (e: unknown) {
    const err = e as { msBeforeNext?: number };
    return {
      allowed: false,
      retryAfter: err.msBeforeNext ? Math.ceil(err.msBeforeNext / 1000) : 60,
    };
  }
}
