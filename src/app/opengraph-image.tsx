import { ImageResponse } from "next/og";

/**
 * OpenGraph share card. Next.js generates a 1200×630 PNG at build and
 * auto-injects <meta property="og:image"> into every page that doesn't
 * override it. WhatsApp / X / LinkedIn / Slack / Telegram / Discord all
 * crawl this URL when someone pastes an aegibit.com link.
 *
 * Layout: full-bleed black, centered "A" mark (white + orange legs),
 * AEGI/BIT wordmark below, tagline in muted orange. Mirrors the brand
 * reference exactly.
 */

export const alt = "AEGIBIT, Securing Tomorrow, Today";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Subtle warm radial, matches the live homepage hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 45% at 50% 35%, rgba(249,115,22,0.10) 0%, transparent 70%)",
          }}
        />

        {/* "A" mark, two angled strokes, white left + orange right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <svg width="210" height="210" viewBox="0 0 512 512" fill="none">
            {/* White left blade (rises to apex) */}
            <path d="M286 100 L224 130 L124 426 L196 426 Z" fill="#FFFFFF" />
            {/* Orange right blade (splays from the notch) */}
            <path d="M272 162 L328 182 L388 426 L322 426 Z" fill="#F97316" />
          </svg>
        </div>

        {/* Wordmark, AEGI white, BIT orange (the official lockup) */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            letterSpacing: "0.18em",
            display: "flex",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>AEGI</span>
          <span style={{ color: "#F97316" }}>BIT</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 18,
            fontSize: 30,
            fontWeight: 500,
            color: "#F97316",
            letterSpacing: "0.04em",
            display: "flex",
          }}
        >
          Securing Tomorrow, Today
        </div>
      </div>
    ),
    { ...size },
  );
}
