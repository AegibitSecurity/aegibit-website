import type { NextConfig } from "next";

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
          // ── CSP. We dropped `unsafe-eval` from script-src — a real
          //    XSS-mitigation upgrade. `unsafe-inline` stays for now
          //    because the marketing pages emit inline JSON-LD blocks
          //    (structured-data SEO); migrating those to nonces is a
          //    separate slice (filed as A-2). connect-src `https:` is
          //    deliberately broad until we enumerate every third-party
          //    domain (Supabase, Resend, Vercel Analytics, Upstash) —
          //    also a follow-up.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https: wss:",
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
