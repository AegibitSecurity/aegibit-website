import { ImageResponse } from "next/og";

/**
 * iPhone / iPad home-screen icon (and tab icon on Safari). Next.js generates
 * a 180×180 PNG at build and auto-injects <link rel="apple-touch-icon"
 * href="/apple-icon"> into every page.
 *
 * Same shield-and-check mark as icon.tsx and public/icon.svg, scaled up.
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
        <svg width="160" height="160" viewBox="0 0 512 512" fill="none">
          {/* Solid orange shield */}
          <path
            d="M256 64 L96 130 L96 268 Q96 380 256 478 Q416 380 416 268 L416 130 Z"
            fill="#F97316"
          />
          {/* Inner black cutout — bold orange ring */}
          <path
            d="M256 100 L128 152 L128 268 Q128 358 256 440 Q384 358 384 268 L384 152 Z"
            fill="#000000"
          />
          {/* White checkmark — long arm extends past the upper-right shield edge */}
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
