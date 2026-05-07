import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Per-page OpenGraph card.
 *
 * Pages emit `<meta property="og:image" content="/api/og?title=...&desc=...">`
 * and this route renders a 1200×630 PNG with the requested title and
 * subtitle on the canonical AEGIBIT brand chrome (orange shield, dark
 * background, wordmark, tagline).
 *
 * PNG (not SVG) because LinkedIn/WhatsApp crawlers are inconsistent
 * on SVG support. ImageResponse from next/og handles font fallbacks,
 * sizing, and edge-cacheable generation for us.
 *
 * Cached for 24h at the edge — same page hit twice doesn't re-render.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "AEGIBIT").slice(0, 120);
  const description = (
    searchParams.get("description") ?? "Built to Outlast"
  ).slice(0, 200);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* Warm radial accent */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(249,115,22,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Top row: logo + brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 60,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 512 512" fill="none">
            <path
              d="M256 64 L96 130 L96 268 Q96 380 256 478 Q416 380 416 268 L416 130 Z"
              fill="#F97316"
            />
            <path
              d="M256 100 L128 152 L128 268 Q128 358 256 440 Q384 358 384 268 L384 152 Z"
              fill="#000000"
            />
            <path
              d="M168 282 L240 358 L378 188"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="46"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "#FFFFFF",
              display: "flex",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>AEGI</span>
            <span style={{ color: "#F97316" }}>BIT</span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            display: "flex",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            fontWeight: 400,
            color: "#A1A1AA",
            lineHeight: 1.4,
            display: "flex",
            maxWidth: 980,
          }}
        >
          {description}
        </div>

        {/* Spacer pushes footer down */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Footer URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#F97316",
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            www.aegibit.com
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#52525B",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Built to Outlast
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
      },
    },
  );
}
