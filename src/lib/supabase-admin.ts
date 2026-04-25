import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _adminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase admin client using the service role key.
 *
 * ⚠️  NEVER import this file in client components or pages.
 *     It must only be used inside /api route handlers.
 *     The service role key bypasses all Row Level Security.
 */
export function getAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "These must be set in .env.local and must never be exposed to the browser."
    );
  }

  _adminClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _adminClient;
}

// Alias kept for backward compat with existing API routes
export const getServiceClient = getAdminClient;
