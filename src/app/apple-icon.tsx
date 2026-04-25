import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#000",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="155" height="155" viewBox="0 0 100 120" fill="none">
          <defs>
            <linearGradient id="ap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <path
            d="M50 5 L8 22 L8 58 C8 82 26 100 50 108 C74 100 92 82 92 58 L92 22 Z"
            fill="rgba(249,115,22,0.1)"
            stroke="url(#ap)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M30 85 L50 30 L70 85"
            fill="none"
            stroke="url(#ap)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M37 68 L63 68" fill="none" stroke="url(#ap)" strokeWidth="7" strokeLinecap="round" />
          <rect x="36" y="88" width="5" height="12" rx="2.5" fill="#F97316" opacity="0.7" />
          <rect x="44" y="84" width="5" height="16" rx="2.5" fill="#F97316" opacity="0.85" />
          <rect x="52" y="81" width="5" height="19" rx="2.5" fill="#F97316" />
          <rect x="60" y="84" width="5" height="16" rx="2.5" fill="#F97316" opacity="0.85" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
