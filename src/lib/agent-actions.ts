import { getServiceClient } from "@/lib/supabase-admin";

/**
 * Agent action audit log — server-side writer.
 *
 * This is the chokepoint for the Multi-Agent Orchestrator (P2-S4 from
 * the Aira charter). Every autonomous agent action goes through here:
 *
 *   - automation/scripts/_lib.mjs withJob() wrapper writes start/end
 *     records via the REST endpoints below
 *   - in-process Next.js routes (e.g., a future /api/agent/*) write
 *     directly via this module
 *   - dashboards / observability tools read via /api/admin/agent-actions
 *
 * Schema mirrors AUTOMATION_POLICY.md §1 tier system + §8 observability:
 *   - tier T0..T4 from the policy (T0=trusted, T4=critical-never-auto)
 *   - status enum: in_progress | success | failed | skipped
 *   - metadata is freeform jsonb but conventions live in the
 *     AgentActionStart / AgentActionFinish types below
 *
 * Failure mode: write errors are LOGGED but never thrown. If the audit
 * log itself is down we still want the agent to keep running (and we'd
 * rather know through monitoring than cascade-fail every cron job).
 * The trade is: in a Supabase outage, we lose audit fidelity. Acceptable.
 */

export type AgentTier = "T0" | "T1" | "T2" | "T3" | "T4";
export type AgentCategory =
  | "content"
  | "seo"
  | "infra"
  | "security"
  | "ops"
  | "outreach"
  | "test";
export type AgentStatus = "in_progress" | "success" | "failed" | "skipped";

export interface AgentActionStart {
  agent: string;
  category: AgentCategory;
  tier: AgentTier;
  action: string;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentActionFinish {
  status: Exclude<AgentStatus, "in_progress">;
  outcome?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AgentActionRow {
  id: string;
  agent: string;
  category: AgentCategory | null;
  tier: AgentTier | null;
  action: string;
  summary: string | null;
  metadata: Record<string, unknown> | null;
  status: AgentStatus;
  outcome: Record<string, unknown> | null;
  duration_ms: number | null;
  started_at: string;
  ended_at: string | null;
}

/**
 * Open an action record. Returns the row id — pass it to finishAction()
 * when the work completes (or fails). Returns null on DB error so the
 * caller can keep going without audit coverage.
 */
export async function startAction(payload: AgentActionStart): Promise<string | null> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("agent_actions")
      .insert({
        agent: payload.agent,
        category: payload.category,
        tier: payload.tier,
        action: payload.action,
        summary: payload.summary,
        metadata: payload.metadata,
        status: "in_progress",
      })
      .select("id")
      .single();
    if (error) {
      console.error("[agent-actions] startAction insert failed:", error.message);
      return null;
    }
    return data?.id ?? null;
  } catch (err) {
    console.error("[agent-actions] startAction exception:", err);
    return null;
  }
}

/**
 * Close an action record with terminal status + duration. Idempotent
 * by id (multiple calls just overwrite the same row's terminal state,
 * which is rare but harmless).
 */
export async function finishAction(
  id: string | null,
  payload: AgentActionFinish & { startedAt?: number },
): Promise<void> {
  if (!id) return;
  try {
    const now = Date.now();
    const supabase = getServiceClient();
    const update: Record<string, unknown> = {
      status: payload.status,
      ended_at: new Date(now).toISOString(),
    };
    if (payload.outcome !== undefined) update.outcome = payload.outcome;
    if (payload.metadata !== undefined) update.metadata = payload.metadata;
    if (payload.startedAt) update.duration_ms = Math.max(0, now - payload.startedAt);

    const { error } = await supabase.from("agent_actions").update(update).eq("id", id);
    if (error) {
      console.error("[agent-actions] finishAction update failed:", error.message);
    }
  } catch (err) {
    console.error("[agent-actions] finishAction exception:", err);
  }
}

/**
 * Convenience wrapper for "fire-and-record-once" actions where we
 * don't need an in_progress row. Many automation scripts emit a single
 * terminal record; this avoids the two-call dance.
 */
export async function recordCompleted(
  payload: AgentActionStart & AgentActionFinish & { duration_ms?: number },
): Promise<string | null> {
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("agent_actions")
      .insert({
        agent: payload.agent,
        category: payload.category,
        tier: payload.tier,
        action: payload.action,
        summary: payload.summary,
        metadata: payload.metadata,
        status: payload.status,
        outcome: payload.outcome,
        duration_ms: payload.duration_ms,
        ended_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) {
      console.error("[agent-actions] recordCompleted insert failed:", error.message);
      return null;
    }
    return data?.id ?? null;
  } catch (err) {
    console.error("[agent-actions] recordCompleted exception:", err);
    return null;
  }
}
