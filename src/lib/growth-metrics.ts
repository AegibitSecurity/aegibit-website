/** 28 complete business days, ending at midnight Asia/Kolkata (UTC+05:30).
 * Search Console uses a different reporting timezone; do not join daily totals.
 */
export function growthWindow(now = new Date()) {
  const offset = 330 * 60 * 1000;
  const local = new Date(now.getTime() + offset);
  const until = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - offset);
  const since = new Date(until.getTime() - 28 * 86400000);
  return { since: since.toISOString(), until: until.toISOString(), timezone: "Asia/Kolkata", days: 28 };
}
export function knownCount(result: { count: number | null; error: unknown }): number | null {
  return result.error || result.count === null ? null : result.count;
}
export function coveragePercent(attributed: number | null, total: number | null): number | null {
  if (attributed === null || total === null || total <= 0 || attributed > total) return null;
  return Math.round(attributed / total * 1000) / 10;
}
