import { NextResponse } from "next/server";
import { DOWNLOAD_TARGETS, recordDownload } from "@/lib/downloads";

/**
 * Counting download redirect. Every downloadable app on the site links
 * here instead of the raw file, so the site can always show exact, real
 * download numbers (standing rule). Increments downloads:<app> in Redis
 * and 302-redirects to the actual artifact. Counting never blocks the
 * download: on any failure the redirect still happens.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ app: string }> },
) {
  const { app } = await params;
  const target = DOWNLOAD_TARGETS[app];
  if (!target) {
    return NextResponse.json({ error: "Unknown app" }, { status: 404 });
  }
  await recordDownload(app);
  return NextResponse.redirect(target, 302);
}
