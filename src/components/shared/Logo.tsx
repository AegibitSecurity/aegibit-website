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

      {/* "A" mark */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={box}
          height={box}
          viewBox="0 0 512 512"
          fill="none"
          style={{ filter: "drop-shadow(0 0 7px rgba(249,115,22,0.40))" }}
        >
          {/* Left leg — white */}
          <path
            d="M256 84 L122 430 L194 430 L256 168 Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinejoin="round"
          />
          {/* Right leg — canonical brand orange */}
          <path
            d="M256 84 L390 430 L318 430 L256 168 Z"
            fill="#F97316"
            stroke="#F97316"
            strokeWidth="14"
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
