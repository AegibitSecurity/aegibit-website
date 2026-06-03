/**
 * PayMint Snapshot, single entry point.
 *
 * Mirror of src/lib/mcp-scan/scan.ts: parse → analyze → optional
 * Groq narrative → return the structured result.
 *
 * The HTTP route handles auth, rate limits, payload caps, and
 * observability. This module is "given a CSV string, return a
 * SnapshotResult."
 */

import type { SnapshotResult } from "./types";
import { parseCsv } from "./parse";
import { analyze } from "./analyze";
import { explainSnapshot } from "./explain";

export async function buildSnapshot(csv: string): Promise<SnapshotResult> {
  const parsed = parseCsv(csv);
  const snapshot = analyze(parsed.rows, parsed.warnings);
  // The analyzer doesn't see parser-dropped rows; carry the count through.
  snapshot.rows_total += parsed.rows_dropped;
  snapshot.rows_dropped = parsed.rows_dropped;

  const narrative =
    snapshot.rows_parsed > 0 ? await explainSnapshot(snapshot) : null;

  return { snapshot, narrative };
}
