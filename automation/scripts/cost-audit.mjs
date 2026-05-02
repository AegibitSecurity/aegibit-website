import { log, withJob } from "./_lib.mjs";

await withJob("cost-audit", async () => {
  log("cost-audit", "Stub — wire Vercel/Supabase billing APIs");
});
