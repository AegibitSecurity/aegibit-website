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
          {/* Left leg — white */}
          <path d="M256 84 L122 430 L194 430 L256 168 Z" fill="#FFFFFF" />
          {/* Right leg — canonical brand orange */}
          <path d="M256 84 L390 430 L318 430 L256 168 Z" fill="#F97316" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
