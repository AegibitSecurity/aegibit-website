import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { buildSnapshot } from "@/lib/paymint-snapshot/snapshot";
import { checkRateLimit, paymintSnapshotLimiter } from "@/lib/rate-limiter";

/**
 * POST /api/paymint-snapshot
 *
 * The PayMint Snapshot endpoint. Public — no auth (it's a marketing-
 * site lead-magnet, every visitor uses it). Rate-limited per IP via
 * Upstash so a single visitor can't burn the Groq free-tier quota
 * for the whole site.
 *
 * Request body:
 *   { csv: string }            // Tally-style CSV the visitor pasted or uploaded
 *
 * Response (200):
 *   {
 *     snapshot: Snapshot,      // structural aggregates (counts, ranges, top-N, anomalies)
 *     narrative: string | null // Groq plain-English summary; null on Groq failure
 *   }
 *
 * Response codes:
 *   400 — malformed JSON / missing csv field / payload over 512 KB
 *   429 — visitor hit the per-IP rate limit; Retry-After header set
 *
 * Privacy posture (mirrored from /api/mcp-scan):
 *   The endpoint does NOT persist the CSV, the parsed rows, or the
 *   IP. Inputs land in process memory only for the duration of the
 *   request. Groq sees only the aggregated Snapshot (pinned by
 *   src/lib/paymint-snapshot/snapshot.test.ts), never raw rows.
 */

interface SnapshotRequestBody {
  csv?: string;
}

const CSV_BYTE_CAP = 512 * 1024; // 512 KB — covers ~6 months of small-business expense data; hard cap on abuse.

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(paymintSnapshotLimiter, ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many snapshots this hour. Try again after the limit resets.",
        retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: SnapshotRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const csv = typeof body.csv === "string" ? body.csv : "";
  if (!csv) {
    return NextResponse.json(
      { error: "Missing `csv` field in request body." },
      { status: 400 },
    );
  }

  const byteLen =
    typeof TextEncoder !== "undefined" ? new TextEncoder().encode(csv).length : csv.length;
  if (byteLen > CSV_BYTE_CAP) {
    return NextResponse.json(
      {
        error:
          `CSV is ${byteLen} bytes; the web preview is capped at ` +
          `${CSV_BYTE_CAP} bytes. For larger uploads, request a PayMint demo ` +
          `at /products/paymint/demo.`,
      },
      { status: 400 },
    );
  }

  const result = await buildSnapshot(csv);
  return NextResponse.json(result);
}
