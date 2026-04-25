import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, visitorLimiter } from "@/lib/rate-limiter";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  teamSize:          z.number().int().min(1).max(10000),
  hoursPerWeekWasted: z.number().min(0).max(100),
  avgHourlyCost:     z.number().min(0).max(50000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(visitorLimiter, `roi_${ip}`);
  if (!allowed) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

  const { teamSize, hoursPerWeekWasted, avgHourlyCost } = parsed.data;

  const weeklyWasteCost   = teamSize * hoursPerWeekWasted * avgHourlyCost;
  const annualWasteCost   = weeklyWasteCost * 52;
  const aegibitCostMonthly = teamSize * 2499;  // Business plan INR
  const annualAegibitCost  = aegibitCostMonthly * 12;
  const annualSavings      = annualWasteCost - annualAegibitCost;
  const roi                = annualWasteCost > 0
    ? Math.round(((annualSavings) / annualAegibitCost) * 100)
    : 0;

  return NextResponse.json({
    weeklyWasteCost:  Math.round(weeklyWasteCost),
    annualWasteCost:  Math.round(annualWasteCost),
    annualAegibitCost: Math.round(annualAegibitCost),
    annualSavings:    Math.round(annualSavings),
    roiPercent:       roi,
    paybackMonths:    annualSavings > 0 ? Math.round(annualAegibitCost / (annualSavings / 12)) : null,
  });
}
