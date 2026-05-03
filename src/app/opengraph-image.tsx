import { ImageResponse } from "next/og";

/**
 * OpenGraph share card. Next.js generates a 1200×630 PNG at build and
 * auto-injects <meta property="og:image"> into every page that doesn't
 * override it. WhatsApp / X / LinkedIn / Slack / Telegram / Discord all
 * crawl this URL when someone pastes an aegibit.com link.
 *
 * Layout: full-bleed black, centered shield mark, wordmark below in
 * orange, tagline in muted orange. Mirrors the brand reference exactly.
 */

export const alt = "AEGIBIT — Securing Tomorrow, Today";
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
        {/* Subtle warm radial — matches the live homepage hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 45% at 50% 35%, rgba(249,115,22,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Shield mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <svg width="240" height="240" viewBox="0 0 512 512" fill="none">
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
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            letterSpacing: "0.18em",
            color: "#F97316",
            display: "flex",
          }}
        >
          AEGIBIT
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
