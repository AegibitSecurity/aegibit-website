import { Redis } from "@upstash/redis";
import { randomUUID } from "node:crypto";
import { getServiceClient } from "./supabase-admin";
import { sendEnquiryEmail } from "./send-enquiry-email";
import { notifyTeam } from "./notify-enquiry-team";
const dueKey = "enquiry-outbox:v1:due";
const jobKey = (id: string) => `enquiry-outbox:v1:${id}`;
type Job = { created: number; attempts: number; firstAttempt?: number; team?: string; acknowledgement?: string; state: "pending" | "accepted" | "needs_review"; lastError?: string };
function client() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN || !process.env.RESEND_API_KEY) throw new Error("Email queue unavailable");
  return Redis.fromEnv();
}
// Persist only IDs and delivery metadata. Customer details remain in the protected database.
// Queue before saving: the worker verifies the matching DB row before sending anything.
export async function queueEnquiry(id: string) {
  const redis = client();
  const job: Job = { created: Date.now(), attempts: 0, state: "pending" };
  await redis.set(jobKey(id), job);
  await redis.zadd(dueKey, { score: Date.now() + 60_000, member: id });
}
export async function processEnquiry(id: string): Promise<{ ok: boolean }> {
  const redis = client();
  const lock = `${jobKey(id)}:lock`, token = randomUUID();
  if (!await redis.set(lock, token, { nx: true, ex: 120 })) return { ok: false };
  try {
    const job = await redis.get<Job>(jobKey(id));
    if (!job || job.state !== "pending") { await redis.zrem(dueKey, id); return { ok: job?.state === "accepted" }; }
    const { data, error } = await getServiceClient().from("leads").select("id,email,name,company,phone,message,source,page").eq("id", id).maybeSingle();
    if (error) { await redis.zadd(dueKey, { score: Date.now() + 300_000, member: id }); return { ok: false }; }
    if (!data) {
      if (Date.now() - job.created < 600_000) return { ok: false };
      await redis.zrem(dueKey, id); await redis.del(jobKey(id)); return { ok: false };
    }
    // Resend deduplicates for 24h. Never auto-retry uncertain sends beyond that window.
    if (job.attempts >= 6 || (job.firstAttempt && Date.now() - job.firstAttempt >= 23 * 3600_000)) {
      job.state = "needs_review"; job.lastError = "Retry limit reached; review provider logs before any manual resend.";
      await redis.set(jobKey(id), job); await redis.zrem(dueKey, id); return { ok: false };
    }
    job.firstAttempt ??= Date.now(); job.attempts++;
    await redis.set(jobKey(id), job);
    try {
      if (!job.acknowledgement) {
        const result = await sendEnquiryEmail(data, { idempotencyKey: `enquiry:${id}:ack:v1` });
        if (result.ok && result.id) { job.acknowledgement = result.id; await redis.set(jobKey(id), job); }
      }
      if (!job.team) {
        const result = await notifyTeam({ ...data, heat: "warm", journey: null, idempotencyKey: `enquiry:${id}:team:v1` });
        if (result.ok && result.id) { job.team = result.id; await redis.set(jobKey(id), job); }
      }
    } catch { job.lastError = "Provider request failed or outcome uncertain; retry uses the same idempotency key."; }
    if (job.team && job.acknowledgement) {
      job.state = "accepted"; delete job.lastError;
      await redis.set(jobKey(id), job); await redis.zrem(dueKey, id);
    } else {
      await redis.set(jobKey(id), job);
      await redis.zadd(dueKey, { score: Date.now() + Math.min(3600_000, 300_000 * 2 ** (job.attempts - 1)), member: id });
    }
    return { ok: job.state === "accepted" };
  } finally {
    await redis.eval('if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end', [lock], [token]);
  }
}
export async function drainEnquiries() {
  const redis = client();
  const ids = await redis.zrange<string[]>(dueKey, 0, Date.now(), { byScore: true, offset: 0, count: 10 });
  const results = await Promise.allSettled(ids.map(processEnquiry));
  return { examined: ids.length, accepted: results.filter(r => r.status === "fulfilled" && r.value.ok).length };
}
export async function enquiryDelivery(id: string) {
  const redis = client();
  const [job, followup] = await Promise.all([redis.get<Job>(jobKey(id)), redis.get<{status:string}>(`enquiry-followup:v1:${id}`)]);
  return { acknowledgement: job?.acknowledgement ? "accepted" : job?.state ?? "untracked", ownerNotification: job?.team ? "accepted" : job?.state ?? "untracked", followup: followup?.status ?? "untracked" };
}
