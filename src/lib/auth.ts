import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { scryptSync, timingSafeEqual, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionOptions, type AdminSession } from "@/lib/session";

// scrypt cost parameters. N=2^14 is OWASP's "interactive" floor and runs
// in ~50ms on a Vercel lambda. maxmem is set explicitly because Node's
// default (32 MB) is exactly at the threshold for these params and trips
// ERR_CRYPTO_INVALID_SCRYPT_PARAMS on some runtimes.
const SCRYPT_N = 1 << 14;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;
const KEY_LEN = 64;

/**
 * Hash a plaintext admin password into the storage format used in
 * ADMIN_PASSWORD_HASH. Format: `scrypt:<saltHex>:<derivedHex>` (colon
 * separator chosen so dotenv `$VAR` expansion does not corrupt the
 * value when stored in .env files or Vercel env settings).
 */
export function hashPassword(plaintext: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(plaintext, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  });
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(plaintext: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  let actual: Buffer;
  try {
    actual = scryptSync(plaintext, salt, expected.length, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: SCRYPT_MAXMEM,
    });
  } catch {
    return false;
  }
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/**
 * Server-component / server-action accessor. Reads the encrypted session
 * cookie via `next/headers` and returns the typed payload (or null).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    getSessionOptions(),
  );
  return session.admin ? session : null;
}

/**
 * Route-handler guard. Use at the top of every protected API route:
 *
 *   const guard = await requireAdmin();
 *   if (guard) return guard;
 *
 * Returns `null` when authorized, or a 401 NextResponse when not.
 * Never throws — caller doesn't need a try/catch around it.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const session = await getAdminSession();
    if (!session?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
