import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "AEGIBIT — Securing Tomorrow, Today";
  const description = searchParams.get("description") ?? "AI · Cybersecurity · Automation";

  // Returns SVG as OG image fallback (no canvas needed)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0A0A"/>
  <rect x="0" y="0" width="1200" height="2" fill="#FF6A00"/>
  <!-- Grid pattern -->
  <defs>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <!-- Shield -->
  <path d="M600 80 L480 130 L480 220 C480 290 530 350 600 370 C670 350 720 290 720 220 L720 130 Z" fill="none" stroke="#FF6A00" stroke-width="2" opacity="0.3"/>
  <!-- Brand -->
  <text x="100" y="320" font-family="system-ui, sans-serif" font-weight="800" font-size="72" fill="white" letter-spacing="-2">${escapeXml(title)}</text>
  <text x="100" y="380" font-family="system-ui, sans-serif" font-weight="400" font-size="28" fill="#A1A1AA">${escapeXml(description)}</text>
  <text x="100" y="560" font-family="system-ui, sans-serif" font-weight="600" font-size="20" fill="#FF6A00">www.aegibit.com</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
