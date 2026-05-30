import { ImageResponse } from "next/og";

/**
 * Browser-tab favicon. Next.js generates a 32×32 PNG from this at build,
 * and auto-injects <link rel="icon" href="/icon"> into every page. Google
 * search results crawl this URL.
 *
 * Design: the AEGIBIT "A" mark — two angled strokes (white left leg,
 * orange right leg, no crossbar) on a black rounded square. Identical
 * geometry to apple-icon.tsx and public/icon.svg so the brand reads
 * consistently from a 16×16 tab to a 1024×1024 app launcher.
 *
 * Solid fills (not gradients) at this size — crispest at 16–32px and
 * avoids Satori gradient-rendering quirks in next/og.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#000000",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="27" height="27" viewBox="0 0 512 512" fill="none">
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
