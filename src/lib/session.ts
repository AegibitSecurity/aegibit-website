import type { SessionOptions } from "iron-session";

export interface AdminSession {
  admin: boolean;
  loggedInAt: number;
}

export const SESSION_COOKIE = "aegibit_session";

/**
 * Iron-session config for the AEGIBIT admin surface. The cookie is
 * encrypted+signed with SESSION_SECRET (server-only, never NEXT_PUBLIC_*).
 *
 * Why httpOnly + Secure + SameSite=Lax + 8h ttl:
 *  - httpOnly  → JS in the browser cannot read it (mitigates XSS exfil)
 *  - secure    → only sent over HTTPS; Vercel-prod traffic is always TLS
 *  - sameSite  → "lax" allows top-level GETs (e.g. clicking /dashboard
 *                from a bookmark), blocks cross-site POSTs (CSRF)
 *  - ttl 8h    → admin sessions are intentionally short-lived
 */
export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to at least 32 characters. " +
        "Generate one with: openssl rand -base64 48",
    );
  }
  return {
    password,
    cookieName: SESSION_COOKIE,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
    ttl: 60 * 60 * 8,
  };
}
