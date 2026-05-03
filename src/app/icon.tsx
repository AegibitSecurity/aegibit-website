import { ImageResponse } from "next/og";

/**
 * Browser-tab favicon. Next.js generates a 32×32 PNG from this at build,
 * and auto-injects <link rel="icon" href="/icon"> into every page. Google
 * search results crawl this URL.
 *
 * Design: AEGIBIT shield mark — black rounded square, orange shield ring,
 * bold white check. Identical to apple-icon.tsx and public/icon.svg so the
 * brand reads consistently from a 16×16 tab to a 1024×1024 app launcher.
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
        <svg width="32" height="32" viewBox="0 0 512 512" fill="none">
          {/* Solid orange shield */}
          <path
            d="M256 64 L96 130 L96 268 Q96 380 256 478 Q416 380 416 268 L416 130 Z"
            fill="#F97316"
          />
          {/* Inner black cutout — gives the bold orange ring look */}
          <path
            d="M256 100 L128 152 L128 268 Q128 358 256 440 Q384 358 384 268 L384 152 Z"
            fill="#000000"
          />
          {/* White checkmark, bold; long arm sweeps up & out past the shield */}
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
    ),
    { ...size },
  );
}
