import type { NextConfig } from "next";

// ── CSP host enumeration ─────────────────────────────────────────────
// Every external host the BROWSER actually contacts. Server-side
// destinations (Resend, Upstash from Node, etc.) don't belong here —
// CSP only governs the browser.
//
// Supabase URL is derived from env so we don't have to bump CSP every
// time the project moves. WebSocket endpoint is the same host with a
// wss:// scheme (Supabase Realtime).
const SUPABASE_HOST = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
})();

const CSP_CONNECT_SRC = [
  "'self'",
  // Vercel Web Analytics events POST to /_vercel/insights/event which
  // is same-origin (Vercel proxies it), so 'self' covers it. Listed
  // here as documentation.
  // "/_vercel/insights/* — same-origin",
  ...(SUPABASE_HOST ? [`https://${SUPABASE_HOST}`, `wss://${SUPABASE_HOST}`] : []),
  // socket.io-client connects same-origin in our setup; listed in case
  // we ever externalize. wss: kept for socket.io upgrade handshake.
  "wss://*.aegibit.com",
];

const CSP_SCRIPT_SRC = [
  "'self'",
  "'unsafe-inline'", // inline JSON-LD blocks; nonce migration filed as A-2
  // Vercel Web Analytics SDK (loaded only when Web Analytics is enabled
  // for the project). Safe even when disabled — script just no-ops.
  "https://va.vercel-scripts.com",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // ── HSTS — override Vercel's default (which lacks
          //    includeSubDomains). 2-year max-age. No `preload` yet —
          //    that's a one-way trip; defer to a follow-up slice once
          //    we have audit confidence on every subdomain.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          // ── Permissions-Policy — deny every API the marketing site
          //    doesn't use. Stops a hypothetical XSS payload from
          //    quietly opening the user's camera/mic/geolocation.
          {
            key: "Permissions-Policy",
            value: [
              "accelerometer=()",
              "autoplay=()",
              "camera=()",
              "display-capture=()",
              "encrypted-media=()",
              "fullscreen=(self)",
              "geolocation=()",
              "gyroscope=()",
              "magnetometer=()",
              "microphone=()",
              "midi=()",
              "payment=()",
              "picture-in-picture=()",
              "publickey-credentials-get=()",
              "screen-wake-lock=()",
              "sync-xhr=()",
              "usb=()",
              "xr-spatial-tracking=()",
            ].join(", "),
          },
          // ── COOP — isolates the browsing context so cross-origin
          //    windows can't reach into ours (Spectre-class mitigation).
          //    `same-origin-allow-popups` keeps OAuth-style popups
          //    working if/when we add them.
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          // ── DNS prefetch — small UX/perf win.
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // ── CSP. unsafe-eval gone (S-4). connect-src and script-src
          //    are now enumerated per-host (A-3), no more open `https:`
          //    wildcard. unsafe-inline for scripts still needed because
          //    marketing pages emit inline JSON-LD blocks (nonces
          //    migration filed as A-2).
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${CSP_SCRIPT_SRC.join(" ")}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              `connect-src ${CSP_CONNECT_SRC.join(" ")}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
