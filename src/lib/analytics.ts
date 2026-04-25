// Server-side analytics helpers
export function buildAnalyticsSummary(visitors: unknown[], leads: unknown[]) {
  const v = visitors as { behavior_score: number; device: string; country: string; created_at: string }[];
  const l = leads as { source: string; created_at: string }[];

  const avgScore = v.length
    ? Math.round(v.reduce((s, x) => s + (x.behavior_score ?? 0), 0) / v.length)
    : 0;

  const deviceBreakdown = v.reduce<Record<string, number>>((acc, x) => {
    const d = x.device ?? "unknown";
    acc[d] = (acc[d] ?? 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(
    v.reduce<Record<string, number>>((acc, x) => {
      const c = x.country ?? "unknown";
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const leadSources = l.reduce<Record<string, number>>((acc, x) => {
    const s = x.source ?? "unknown";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  return { avgScore, deviceBreakdown, topCountries, leadSources };
}

export function getTimeframeDates(timeframe: string): Date {
  const now = new Date();
  if (timeframe === "7d")  { now.setDate(now.getDate() - 7); return now; }
  if (timeframe === "30d") { now.setDate(now.getDate() - 30); return now; }
  now.setHours(0, 0, 0, 0); // today
  return now;
}
