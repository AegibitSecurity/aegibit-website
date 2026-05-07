/**
 * Pure-function gate logic for the AEGIBIT proxy (src/proxy.ts).
 *
 * Lives in src/lib/* so it is reachable from the unit-test runner
 * (vitest config scopes tests to src/lib/**). The proxy itself is a
 * thin wrapper that supplies pathname / method / cookie-presence and
 * acts on the returned decision.
 *
 * Why this is its own file:
 *   We had a P0 incident where the proxy gated POST /api/leads, which
 *   is the public lead-capture endpoint every marketing form submits
 *   to. Visitors silently 401'd; we lost leads until the issue was
 *   found via a Slack-webhook smoke test. The fix was a one-line
 *   carve-out, but the regression-prevention cost is much higher: the
 *   gate has to be exercised by tests so it can never regress again.
 *   That requires a pure function to assert against.
 */

/**
 * Set of API pathnames whose admin-only methods require a session
 * cookie. The proxy short-circuits unauthenticated requests with a 401
 * before they hit Node + DB. Each route handler ALSO calls
 * `requireAdmin` defensively — proxy is short-circuit only, not
 * authoritative.
 */
export const PROTECTED_API_PATHS: ReadonlySet<string> = new Set([
  "/api/leads",
  "/api/analytics",
  "/api/admin/health",
]);

/**
 * Methods on a PROTECTED_API_PATHS endpoint that are PUBLIC and must
 * NOT be gated by the proxy.
 *
 * /api/leads is dual-purpose:
 *   - POST → public lead capture (every form on the marketing site)
 *   - GET  → admin lead list (requireAdmin in route handler)
 * Only POST is exempted here. GET / PUT / PATCH / DELETE all gate.
 */
export const PUBLIC_METHODS_BY_PATH: Readonly<Record<string, ReadonlySet<string>>> = {
  "/api/leads": new Set(["POST"]),
};

/**
 * Decide whether the proxy should respond with 401 BEFORE dispatching
 * to the route handler.
 *
 * @returns true  → proxy should 401
 *          false → proxy should fall through (route handler runs)
 *
 * Note: this function does NOT check the dashboard prefix or canonical
 * host redirects. Those concerns live in proxy.ts directly because
 * they need the full NextRequest / NextResponse APIs.
 */
export function shouldGateProtectedApi(
  pathname: string,
  method: string,
  hasSession: boolean,
): boolean {
  if (!PROTECTED_API_PATHS.has(pathname)) return false;
  if (hasSession) return false;
  const publicMethods = PUBLIC_METHODS_BY_PATH[pathname];
  const isPublicMethod = publicMethods?.has(method) ?? false;
  return !isPublicMethod;
}
