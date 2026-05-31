/**
 * AEGIBIT social poster template.
 *
 * Builds an HD 1600x900 (16:9, X-landscape) on-brand SVG from a post
 * spec, ready to rasterize with sharp. One flexible layout:
 *
 *   - black canvas + warm orange radial glow (matches the live site)
 *   - brand lockup top-left (the offset-blade "A" mark + AEGI/BIT)
 *   - badge pill top-right
 *   - 1-4 headline lines (per-line color + size, auto-stacked)
 *   - optional sub line (gray)
 *   - optional "finding card" (the scanner-result motif, for security posts)
 *   - footer: value line + URL (orange) + @handle
 *
 * Fonts: uses a common system sans stack (Arial / Segoe UI / Liberation)
 * which resolves on the local machine. Images are PRE-RENDERED locally
 * and committed to social/queue/ — the daily cron only emails them, so
 * CI never has to rasterize text (avoids headless font issues).
 */

const BRAND = {
  white: "#FFFFFF",
  orange: "#F97316",
  gray: "#A1A1AA",
  faint: "#71717A",
  card: "#0D0D0D",
  hairline: "rgba(255,255,255,0.08)",
};

const SANS = "Arial, 'Segoe UI', 'Liberation Sans', Helvetica, sans-serif";
const MONO = "Consolas, 'DejaVu Sans Mono', 'Courier New', monospace";

const SEV_COLOR = {
  CRITICAL: "#F87171",
  HIGH: "#F97316",
  MEDIUM: "#FACC15",
  LOW: "#60A5FA",
  INFO: "#A1A1AA",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {object} spec
 *   badge:    string
 *   headline: Array<{ t:string, c?:string, size?:number }>
 *   sub?:     string
 *   card?:    { sev:string, id:string, title:string, meta?:string }
 *   footer:   { text:string, url:string, handle?:string }
 */
export function buildSvg(spec) {
  const handle = spec.footer.handle || "@aegibitsec";

  // ── Headline (auto-stacked from y=300) ──────────────────────────
  let y = 300;
  const headline = (spec.headline || [])
    .map((line) => {
      const size = line.size || 80;
      const t = `<text x="110" y="${y}" font-family="${SANS}" font-size="${size}" font-weight="800" fill="${line.c || BRAND.white}">${esc(line.t)}</text>`;
      y += Math.round(size * 1.16);
      return t;
    })
    .join("\n  ");
  let afterHeadline = y;

  // ── Optional sub line ───────────────────────────────────────────
  let sub = "";
  if (spec.sub) {
    sub = `<text x="110" y="${afterHeadline + 6}" font-family="${SANS}" font-size="36" fill="${BRAND.gray}">${esc(spec.sub)}</text>`;
  }

  // ── Optional finding card (fixed band so it never collides) ──────
  let card = "";
  if (spec.card) {
    const sev = (spec.card.sev || "CRITICAL").toUpperCase();
    const sevColor = SEV_COLOR[sev] || BRAND.orange;
    const cy = 586;
    card = `
  <rect x="110" y="${cy}" width="1380" height="150" rx="16" fill="${BRAND.card}" stroke="${BRAND.hairline}" stroke-width="1.5"/>
  <rect x="110" y="${cy}" width="5" height="150" rx="2.5" fill="${sevColor}"/>
  <rect x="150" y="${cy + 30}" width="${28 + sev.length * 13}" height="40" rx="8" fill="${sevColor}22" stroke="${sevColor}66" stroke-width="1.5"/>
  <text x="${150 + (28 + sev.length * 13) / 2}" y="${cy + 57}" text-anchor="middle" font-family="${SANS}" font-size="20" font-weight="700" letter-spacing="1.5" fill="${sevColor}">${esc(sev)}</text>
  <rect x="${166 + sev.length * 13}" y="${cy + 30}" width="200" height="40" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"/>
  <text x="${266 + sev.length * 13}" y="${cy + 57}" text-anchor="middle" font-family="${MONO}" font-size="20" fill="${BRAND.gray}">${esc(spec.card.id)}</text>
  <text x="150" y="${cy + 118}" font-family="${SANS}" font-size="26" fill="#E4E4E7">${esc(spec.card.title)}</text>
  ${spec.card.meta ? `<text x="1450" y="${cy + 64}" text-anchor="end" font-family="${MONO}" font-size="22" fill="${BRAND.faint}">${esc(spec.card.meta)}</text>` : ""}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <radialGradient id="glow" cx="72%" cy="14%" r="60%">
      <stop offset="0%" stop-color="#F97316" stop-opacity="0.18"/>
      <stop offset="45%" stop-color="#F97316" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#F97316" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mw" x1="0.05" y1="0" x2="0.55" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#EDEDF0"/><stop offset="100%" stop-color="#C2C2C9"/>
    </linearGradient>
    <linearGradient id="mo" x1="0.05" y1="0" x2="0.45" y2="1">
      <stop offset="0%" stop-color="#FB923C"/><stop offset="50%" stop-color="#F97316"/><stop offset="100%" stop-color="#E05B04"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="900" fill="#000000"/>
  <rect width="1600" height="900" fill="url(#glow)"/>

  <g transform="translate(110, 86) scale(0.174)">
    <path d="M286 100 L224 130 L124 426 L196 426 Z" fill="url(#mw)" stroke="url(#mw)" stroke-width="16" stroke-linejoin="round"/>
    <path d="M272 162 L328 182 L388 426 L322 426 Z" fill="url(#mo)" stroke="url(#mo)" stroke-width="16" stroke-linejoin="round"/>
  </g>
  <text x="188" y="150" font-family="${SANS}" font-size="40" font-weight="700" letter-spacing="6"><tspan fill="#FFFFFF">AEGI</tspan><tspan fill="#F97316">BIT</tspan></text>

  <rect x="${1490 - (spec.badge.length * 14 + 56)}" y="104" width="${spec.badge.length * 14 + 56}" height="52" rx="26" fill="rgba(249,115,22,0.10)" stroke="#F97316" stroke-opacity="0.45" stroke-width="1.5"/>
  <text x="${1490 - (spec.badge.length * 14 + 56) / 2}" y="138" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" letter-spacing="3" fill="#F97316">${esc(spec.badge)}</text>

  ${headline}
  ${sub}
  ${card}

  <line x1="110" y1="800" x2="1490" y2="800" stroke="${BRAND.hairline}" stroke-width="1.5"/>
  <text x="110" y="846" font-family="${SANS}" font-size="27" fill="${BRAND.gray}">${esc(spec.footer.text)}  <tspan fill="#F97316" font-weight="700">${esc(spec.footer.url)}</tspan></text>
  <text x="1490" y="846" text-anchor="end" font-family="${SANS}" font-size="27" font-weight="700" fill="#FFFFFF">${esc(handle)}</text>
</svg>`;
}
