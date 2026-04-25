// Stripe client — server-side only
// Import only inside API routes, never in client components

let _stripe: unknown = null;

export async function getStripeClient() {
  if (_stripe) return _stripe as import("stripe").default;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set in .env.local");
  const Stripe = (await import("stripe")).default;
  _stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  return _stripe as import("stripe").default;
}
