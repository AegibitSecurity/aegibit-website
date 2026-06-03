import { ImageResponse } from "next/og";

/**
 * Browser-tab + search-result favicon (PNG). Next.js generates this at
 * build and auto-injects <link rel="icon" href="/icon" sizes="48x48">.
 *
 * Sized at 48×48, Google's recommended favicon size is a multiple of
 * 48px (48/96/144). The earlier 32×32 was below that bar and got
 * deprioritised in Search results. The static src/app/favicon.ico
 * (16/32/48 multi-size) is the belt-and-braces companion that crawlers
 * hitting /favicon.ico directly will pick up.
 *
 * Design: the AEGIBIT "A" mark, white left blade rising to the apex,
 * orange right blade splaying from the notch, on a black rounded
 * square. Solid fills (crispest at small size, Satori-safe). Geometry
 * matches apple-icon.tsx, favicon.ico, and public/icon.svg.
 */

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          background: "#000000",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 512 512" fill="none">
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
