import { log, withJob } from "./_lib.mjs";

await withJob("monthly-revenue-report", async () => {
  if (!process.env.STRIPE_SECRET_KEY) { log("monthly-revenue-report", "STRIPE_SECRET_KEY not set; skipping", "warn"); return; }
  log("monthly-revenue-report", "Stub — wire Stripe REST + Resend email");
});
