import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/auth";
import {
  startAction,
  finishAction,
  recordCompleted,
  type AgentActionRow,
  type AgentTier,
  type AgentCategory,
  type AgentStatus,
} from "@/lib/agent-actions";

export const dynamic = "force-dynamic";

/**
 * /api/admin/agent-actions — Multi-Agent Orchestrator audit log API.
 *
 * GET (cookie auth via requireAdmin):
 *   List recent agent_actions rows.
 *   Query params:
 *     ?limit=N        (default 100, max 500)
 *     ?agent=NAME     (filter by agent identifier)
 *     ?status=STATUS  (filter by status)
 *
 * POST (server-to-server bearer via DASHBOARD_SECRET):
 *   Record an agent action.
 *   Body shapes:
 *     { op: "start", ...AgentActionStart }
 *       → { id: "uuid" }
 *     { op: "finish", id: "uuid", startedAt?: number, ...AgentActionFinish }
 *       → { ok: true }
 *     { op: "record", ...AgentActionStart, ...AgentActionFinish, duration_ms?: number }
 *       → { id: "uuid" }
 *
 * The bearer auth on POST is intentional — automation scripts run
 * outside the browser and authenticate server-to-server via the
 * rotated DASHBOARD_SECRET. The same secret already gates
 * /api/admin/deploy-notify, so the operational pattern is consistent.
 */

const ALLOWED_TIERS = new Set<AgentTier>(["T0", "T1", "T2", "T3", "T4"]);
const ALLOWED_CATEGORIES = new Set<AgentCategory>([
  "content", "seo", "infra", "security", "ops", "outreach", "test",
]);

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const url = new URL(req.url);
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? 100)));
  const agent = url.searchParams.get("agent");
  const status = url.searchParams.get("status") as AgentStatus | null;

  const supabase = getServiceClient();
  let q = supabase
    .from("agent_actions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (agent) q = q.eq("agent", agent);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ rows: (data ?? []) as AgentActionRow[] });
}

export async function POST(req: NextRequest) {
  // Bearer auth — automation scripts authenticate server-to-server.
  const auth = req.headers.get("authorization");
  if (!process.env.DASHBOARD_SECRET || auth !== `Bearer ${process.env.DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const op = body.op;
  if (op === "start") {
    if (
      typeof body.agent !== "string" ||
      typeof body.action !== "string" ||
      typeof body.tier !== "string" ||
      typeof body.category !== "string"
    ) {
      return NextResponse.json({ error: "Missing required: agent, action, tier, category" }, { status: 400 });
    }
    if (!ALLOWED_TIERS.has(body.tier as AgentTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.has(body.category as AgentCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    const id = await startAction({
      agent: body.agent,
      category: body.category as AgentCategory,
      tier: body.tier as AgentTier,
      action: body.action,
      summary: typeof body.summary === "string" ? body.summary : undefined,
      metadata: typeof body.metadata === "object" && body.metadata !== null
        ? (body.metadata as Record<string, unknown>)
        : undefined,
    });
    return NextResponse.json({ id }, { status: id ? 201 : 500 });
  }

  if (op === "finish") {
    if (typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (body.status !== "success" && body.status !== "failed" && body.status !== "skipped") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await finishAction(body.id, {
      status: body.status,
      outcome: typeof body.outcome === "object" && body.outcome !== null
        ? (body.outcome as Record<string, unknown>)
        : undefined,
      metadata: typeof body.metadata === "object" && body.metadata !== null
        ? (body.metadata as Record<string, unknown>)
        : undefined,
      startedAt: typeof body.startedAt === "number" ? body.startedAt : undefined,
    });
    return NextResponse.json({ ok: true });
  }

  if (op === "record") {
    if (
      typeof body.agent !== "string" ||
      typeof body.action !== "string" ||
      typeof body.tier !== "string" ||
      typeof body.category !== "string" ||
      typeof body.status !== "string"
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!ALLOWED_TIERS.has(body.tier as AgentTier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.has(body.category as AgentCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (body.status !== "success" && body.status !== "failed" && body.status !== "skipped") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const id = await recordCompleted({
      agent: body.agent,
      category: body.category as AgentCategory,
      tier: body.tier as AgentTier,
      action: body.action,
      summary: typeof body.summary === "string" ? body.summary : undefined,
      metadata: typeof body.metadata === "object" && body.metadata !== null
        ? (body.metadata as Record<string, unknown>)
        : undefined,
      status: body.status,
      outcome: typeof body.outcome === "object" && body.outcome !== null
        ? (body.outcome as Record<string, unknown>)
        : undefined,
      duration_ms: typeof body.duration_ms === "number" ? body.duration_ms : undefined,
    });
    return NextResponse.json({ id }, { status: id ? 201 : 500 });
  }

  return NextResponse.json({ error: "Unknown op (expected start | finish | record)" }, { status: 400 });
}
