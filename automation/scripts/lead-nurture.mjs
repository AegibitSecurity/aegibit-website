import { withJob, log } from "./_lib.mjs";

// Read-only enquiry review. A form submission is not a marketing subscription.
// Automatic sequences require explicit subscription and unsubscribe suppression
// records before they can be reintroduced. Never publish lead identities in git.
await withJob("lead-nurture", async () => {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) throw new Error("Enquiry review unavailable: database configuration missing");
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const response = await fetch(`${url}/rest/v1/leads?select=id&status=eq.new&created_at=gte.${since}`, {
    method: "HEAD", headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Enquiry review failed: HTTP ${response.status}`);
  const total = response.headers.get("content-range")?.split("/")[1];
  if (!total || !/^\d+$/.test(total)) throw new Error("Enquiry count unavailable");
  log("lead-nurture", `${total} new enquiries in the last 14 days. Review /dashboard/leads. No marketing emails sent.`);
});
