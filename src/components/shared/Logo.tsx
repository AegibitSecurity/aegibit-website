import Link from "next/link";

interface LogoProps { size?: "sm" | "md" | "lg"; linkHref?: string; }

/**
 * AEGIBIT logo lockup — the "A" mark + AEGI/BIT wordmark.
 *
 * The mark is two angled strokes (no crossbar): the left leg is white,
 * the right leg is canonical brand orange (#F97316). A soft orange
 * drop-shadow keeps the premium glow without the heavy circular ring
 * the previous shield mark sat inside. Geometry matches public/icon.svg,
 * icon.tsx, apple-icon.tsx and opengraph-image.tsx exactly so the brand
 * reads identically from a 16px tab to a share card.
 */
export function Logo({ size = "md", linkHref = "/" }: LogoProps) {
  const box = size === "sm" ? 26 : size === "lg" ? 38 : 32;
  const fs  = size === "sm" ? "0.78rem" : size === "lg" ? "1rem" : "0.85rem";

  const content = (
    <div className="flex items-center gap-2.5 select-none">

      {/* "A" mark — two offset blades (white left rises to apex,
          orange right splays from the notch), with a soft orange glow */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={box}
          height={box}
          viewBox="0 0 512 512"
          fill="none"
          style={{ filter: "drop-shadow(0 0 7px rgba(249,115,22,0.38))" }}
        >
          <defs>
            <linearGradient id="aegibit-logo-w" x1="0.05" y1="0" x2="0.55" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#EDEDF0" />
              <stop offset="100%" stopColor="#C2C2C9" />
            </linearGradient>
            <linearGradient id="aegibit-logo-o" x1="0.05" y1="0" x2="0.45" y2="1">
              <stop offset="0%" stopColor="#FFB061" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#E05B04" />
            </linearGradient>
          </defs>
          {/* White left blade */}
          <path
            d="M286 100 L224 130 L124 426 L196 426 Z"
            fill="url(#aegibit-logo-w)"
            stroke="url(#aegibit-logo-w)"
            strokeWidth="16"
            strokeLinejoin="round"
          />
          {/* Orange right blade */}
          <path
            d="M272 162 L328 182 L388 426 L322 426 Z"
            fill="url(#aegibit-logo-o)"
            stroke="url(#aegibit-logo-o)"
            strokeWidth="16"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <span style={{
        letterSpacing: "0.22em",
        fontSize: fs,
        fontFamily: "var(--font-geist-sans, sans-serif)",
        fontWeight: 500,
        lineHeight: 1,
      }}>
        <span style={{ color: "#FFFFFF" }}>AEGI</span>
        <span style={{ color: "#F97316" }}>BIT</span>
      </span>
    </div>
  );

  return linkHref ? <Link href={linkHref}>{content}</Link> : content;
}
