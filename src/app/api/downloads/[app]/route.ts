import { NextResponse } from "next/server";
import {
  getAiraDownloads,
  getCounterDownloads,
  getMcpShieldMonthlyDownloads,
  getPayMintDownloadStats,
} from "@/lib/downloads";

/**
 * Live download-count API (standing rule: exact, real numbers, live
 * synced 24/7). The DownloadStats strip on every product page fetches
 * this on mount, on tab focus, and on a short poll while visible, so
 * the displayed number increases the moment anyone downloads.
 *
 * - vestiq (and future self-hosted apps): reads our Redis counter,
 *   which /api/download/[app] increments in real time.
 * - aira: GitHub Releases lifetime count (upstream fetch data-cached
 *   ~1h to respect GitHub rate limits; GitHub itself aggregates
 *   near-real-time).
 * - mcp-shield: PyPI public stats, last 30 days (PyPI publishes daily).
 *
 * count: null means "source unreachable"; the UI then keeps its last
 * known number instead of showing something invented.
 */

export const dynamic = "force-dynamic";

const LIVE_APPS = new Set(["vestiq", "aira", "mcp-shield", "paymint", "leadsync"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ app: string }> },
) {
  const { app } = await params;
  if (!LIVE_APPS.has(app)) {
    return NextResponse.json({ error: "Unknown app" }, { status: 404 });
  }

  let count: number | null;
  let today: number | null = null;
  if (app === "aira") count = await getAiraDownloads();
  else if (app === "mcp-shield") count = await getMcpShieldMonthlyDownloads();
  else if (app === "paymint") {
    const stats = await getPayMintDownloadStats();
    count = stats?.total ?? null;
    today = stats?.today ?? null;
  } else count = await getCounterDownloads(app);

  return NextResponse.json(
    { app, count, ...(today !== null ? { today } : {}) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
