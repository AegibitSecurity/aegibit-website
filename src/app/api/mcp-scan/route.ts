import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { scanManifest } from "@/lib/mcp-scan/scan";
import { explainFindings } from "@/lib/mcp-scan/explain";
import { checkRateLimit, mcpScanLimiter } from "@/lib/rate-limiter";

/**
 * POST /api/mcp-scan
 *
 * The MCP Shield web-scanner endpoint. Public — no auth (it's a
 * marketing-site lead-magnet, every visitor uses it). Rate-limited
 * per IP via Upstash so a single visitor can't burn the Groq free-
 * tier quota for the whole site.
 *
 * Request body:
 *   { manifest: string }       // JSON string the visitor pasted
 *
 * Response (200):
 *   {
 *     kind: "tools" | "servers" | "unknown",
 *     scanned_count: number,
 *     findings: Finding[],     // sorted by severity desc
 *     warnings: string[],      // parser / dispatcher warnings
 *     summary: string | null,  // Groq plain-English narrative; null on failure
 *   }
 *
 * Response codes:
 *   400 — malformed JSON body / missing manifest field / payload too large
 *   429 — visitor hit the per-IP rate limit; Retry-After header set
 *   500 — only for truly unexpected errors (the structured checks never
 *         throw; manifest-parse failures surface as `warnings` with kind
 *         "unknown")
 *
 * Privacy posture:
 *   The endpoint does NOT persist the manifest, the IP, or the findings.
 *   Inputs land in process memory only for the duration of the request,
 *   and the response is generated synchronously. Mirrors the discipline
 *   from /privacy: we don't collect operational data unless it's useful
 *   for the visitor.
 */

interface ScanRequestBody {
  manifest?: string;
}

const MANIFEST_BYTE_CAP = 256 * 1024; // 256 KB — generous for realistic manifests, hard cap on abuse.

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, retryAfter } = await checkRateLimit(mcpScanLimiter, ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many scans this hour. Try again after the limit resets.",
        retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ScanRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const manifest = typeof body.manifest === "string" ? body.manifest : "";
  if (!manifest) {
    return NextResponse.json(
      { error: "Missing `manifest` field in request body." },
      { status: 400 },
    );
  }

  // Byte cap — protect both Groq's token budget and our own memory.
  const byteLen =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(manifest).length
      : manifest.length;
  if (byteLen > MANIFEST_BYTE_CAP) {
    return NextResponse.json(
      {
        error:
          `Manifest is ${byteLen} bytes; the web preview is capped at ` +
          `${MANIFEST_BYTE_CAP} bytes. For larger manifests, use the CLI ` +
          `(see /products/mcp-shield).`,
      },
      { status: 400 },
    );
  }

  const result = scanManifest(manifest);

  // Groq layer: best-effort plain-English narrative. If Groq is
  // unreachable / over-quota / unconfigured, we still return the
  // structured findings — they're the authoritative answer. The
  // summary is gloss, not substance.
  let summary: string | null = null;
  if (result.kind !== "unknown" && result.findings.length > 0) {
    summary = await explainFindings(result);
  }

  return NextResponse.json({
    kind: result.kind,
    scanned_count: result.scanned_count,
    findings: result.findings,
    warnings: result.warnings,
    summary,
  });
}
