import Link from "next/link";

interface LogoProps { size?: "sm" | "md" | "lg"; linkHref?: string; }

export function Logo({ size = "md", linkHref = "/" }: LogoProps) {
  const box = size === "sm" ? 28 : size === "lg" ? 40 : 34;
  const fs  = size === "sm" ? "0.78rem" : size === "lg" ? "1rem" : "0.85rem";

  const content = (
    <div className="flex items-center gap-2.5 select-none">

      {/* Logo icon with professional 3-layer glow */}
      <div className="relative flex-shrink-0 flex items-center justify-center">

        {/* Layer 1 — outermost pulse ring, slow expand + fade */}
        <div
          className="absolute rounded-full"
          style={{
            width: box + 16, height: box + 16,
            borderRadius: "50%",
            background: "rgba(249,115,22,0.0)",
            boxShadow: "0 0 0 1px rgba(249,115,22,0.18)",
            animation: "logo-pulse 4s ease-out infinite",
          }}
        />

        {/* Layer 2 — mid glow ring, delayed */}
        <div
          className="absolute rounded-full"
          style={{
            width: box + 8, height: box + 8,
            borderRadius: "50%",
            boxShadow: "0 0 0 1px rgba(249,115,22,0.28)",
            animation: "logo-pulse 4s ease-out infinite 1.3s",
          }}
        />

        {/* Layer 3 — icon container with inner glow */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: box, height: box,
            border: "1.5px solid rgba(249,115,22,0.6)",
            background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)",
            boxShadow:
              "0 0 0 3px rgba(249,115,22,0.08)," +   /* soft halo */
              "0 0 10px rgba(249,115,22,0.35)," +      /* inner glow */
              "0 0 22px rgba(249,115,22,0.15)," +      /* mid spread */
              "inset 0 1px 0 rgba(255,255,255,0.08)",  /* subtle rim light */
          }}
        >
          <svg width={box * 0.46} height={box * 0.52} viewBox="0 0 18 21" fill="none">
            <path
              d="M9 1L1 4V10C1 15 4.8 19.2 9 20.5C13.2 19.2 17 15 17 10V4L9 1Z"
              fill="#F97316"
              opacity="0.95"
            />
            <path
              d="M5.5 10.5L8 13L12.5 8"
              stroke="#fff"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <span style={{
        letterSpacing: "0.2em",
        fontSize: fs,
        fontFamily: "var(--font-geist-sans, sans-serif)",
        fontWeight: 600,
        lineHeight: 1,
      }}>
        <span style={{ color: "#FFFFFF" }}>AEGI</span>
        <span style={{ color: "#F97316" }}>BIT</span>
      </span>
    </div>
  );

  return linkHref ? <Link href={linkHref}>{content}</Link> : content;
}
