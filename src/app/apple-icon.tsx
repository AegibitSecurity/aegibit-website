import { ImageResponse } from "next/og";

/**
 * iPhone / iPad home-screen icon (and tab icon on Safari). Next.js generates
 * a 180×180 PNG at build and auto-injects <link rel="apple-touch-icon"
 * href="/apple-icon"> into every page.
 *
 * Same AEGIBIT "A" mark as icon.tsx and public/icon.svg, scaled up.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#000000",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 512 512" fill="none">
          {/* White left blade (rises to apex) */}
          <path d="M286 100 L224 130 L124 426 L196 426 Z" fill="#FFFFFF" />
          {/* Orange right blade (splays from the notch) */}
          <path d="M272 162 L328 182 L388 426 L322 426 Z" fill="#F97316" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
