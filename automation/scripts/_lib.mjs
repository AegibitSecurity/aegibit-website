// Shared utilities for AEGIS automation. Repo root = the directory containing this automation/ folder.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..", "..");
export const AUTOMATION_DIR = path.join(ROOT, "automation");
export const LOGS_DIR = path.join(AUTOMATION_DIR, "logs");
export const REPORTS_DIR = path.join(AUTOMATION_DIR, "reports");
export const STATE_FILE = path.join(AUTOMATION_DIR, "state.json");
export const CONFIG_FILE = path.join(AUTOMATION_DIR, "config.json");

export function isPaused() {
  return fs.existsSync(path.join(AUTOMATION_DIR, "PAUSE"));
}

/**
 * Per-job auto-disable check. Enforces AUTOMATION_POLICY §9
 * "If the same automation fails 3 times in a row: disable that workflow."
 *
 * Until now §9 was documentation only. Now withJob() refuses to run any
 * job whose consecutiveFailures counter has reached the threshold. The
 * job exits cleanly with status=skipped (NOT failed) so it doesn't
 * compound failures on the audit log.
 *
 * Operator can re-enable by running:
 *   node automation/scripts/aegis-reenable.mjs <jobName>
 * which resets the consecutiveFailures counter to 0 in state.json.
 *
 * Threshold can be overridden via env (AEGIS_AUTODISABLE_THRESHOLD=5)
 * for ops who want a longer leash; default 3 matches policy.
 */
export const AUTODISABLE_THRESHOLD = (() => {
  const v = parseInt(process.env.AEGIS_AUTODISABLE_THRESHOLD ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : 3;
})();

export function isAutoDisabled(jobName) {
  const state = loadState();
  const failures = state.consecutiveFailures?.[jobName] ?? 0;
  return failures >= AUTODISABLE_THRESHOLD;
}

export function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
}

export function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { lastRuns: {}, consecutiveFailures: {}, metrics: {} };
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

export function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

export function log(jobName, message, level = "info") {
  ensureDir(LOGS_DIR);
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(path.join(LOGS_DIR, `${jobName}.log`), line);
  const fn = level === "error" ? console.error : console.log;
  fn(`[${jobName}] ${message}`);
}

export function recordRun(jobName, success, meta = {}) {
  const state = loadState();
  state.lastRuns ??= {};
  state.consecutiveFailures ??= {};
  state.lastRuns[jobName] = { timestamp: new Date().toISOString(), success, ...meta };
  if (success) state.consecutiveFailures[jobName] = 0;
  else state.consecutiveFailures[jobName] = (state.consecutiveFailures[jobName] || 0) + 1;
  saveState(state);
  return state;
}

// ─── P2-S4 — Multi-Agent Orchestrator audit log integration ────────
//
// Every withJob() invocation now also writes start/finish records to
// the agent_actions Supabase table via the /api/admin/agent-actions
// endpoint. The state.json + log file flow is preserved so existing
// dashboards / introspection don't change.
//
// Defensive design: if DASHBOARD_SECRET / SITE_URL / network are
// missing, the audit calls silently no-op. The agent itself keeps
// running. Lost audit fidelity is preferable to cascade-failing
// every cron job.
//
// Job → tier/category mapping is defined here once so individual
// scripts don't have to think about it. Source: AUTOMATION_POLICY.md
// §1 tier system.
const JOB_TAXONOMY = {
  "generate-blog-post":      { tier: "T0", category: "content"  },
  "generate-seo-pages":      { tier: "T0", category: "seo"      },
  "seo-audit":               { tier: "T1", category: "seo"      },
  "ping-search-engines":     { tier: "T0", category: "seo"      },
  "lead-health-check":       { tier: "T0", category: "ops"      },
  "lead-nurture":            { tier: "T1", category: "outreach" },
  "competitor-watch":        { tier: "T0", category: "ops"      },
  "brand-mentions":          { tier: "T0", category: "outreach" },
  "friday-pdf":              { tier: "T0", category: "ops"      },
  "send-friday-report":      { tier: "T0", category: "ops"      },
  "audit-report":            { tier: "T1", category: "security" },
  "monthly-revenue-report":  { tier: "T0", category: "ops"      },
  "cost-audit":              { tier: "T0", category: "ops"      },
};

function auditEnabled() {
  return Boolean(process.env.DASHBOARD_SECRET && (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL));
}

function auditEndpoint() {
  const base = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://www.aegibit.com").replace(/\/+$/, "");
  return `${base}/api/admin/agent-actions`;
}

async function auditPost(payload) {
  if (!auditEnabled()) return null;
  try {
    const res = await fetch(auditEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DASHBOARD_SECRET}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[agent-audit] POST ${payload.op ?? "?"} → ${res.status}: ${text}`);
      return null;
    }
    return await res.json().catch(() => null);
  } catch (err) {
    console.error(`[agent-audit] network error: ${err.message}`);
    return null;
  }
}

async function auditStart(jobName, summary) {
  const tax = JOB_TAXONOMY[jobName] ?? { tier: "T0", category: "ops" };
  const result = await auditPost({
    op: "start",
    agent: jobName,
    action: "run",
    summary: summary ?? `${jobName} started`,
    tier: tax.tier,
    category: tax.category,
    metadata: {
      ci: Boolean(process.env.GITHUB_ACTIONS),
      run_id: process.env.GITHUB_RUN_ID,
      run_attempt: process.env.GITHUB_RUN_ATTEMPT,
    },
  });
  return result?.id ?? null;
}

async function auditFinish(id, status, durationMs, outcome) {
  if (!id) return;
  await auditPost({
    op: "finish",
    id,
    status,
    startedAt: Date.now() - (durationMs ?? 0),
    outcome,
  });
}

export async function withJob(jobName, fn) {
  if (isPaused()) {
    log(jobName, "PAUSED (global kill switch) — skipping", "warn");
    // Audit-record the skip so the dashboard can show why nothing ran
    const skipId = await auditStart(jobName, "skipped: global PAUSE file present");
    await auditFinish(skipId, "skipped", 0, { reason: "automation/PAUSE present" });
    process.exit(0);
  }
  if (isAutoDisabled(jobName)) {
    const failures = loadState().consecutiveFailures?.[jobName] ?? 0;
    log(
      jobName,
      `AUTO-DISABLED — ${failures} consecutive failures ≥ threshold ${AUTODISABLE_THRESHOLD}. ` +
        `Per AUTOMATION_POLICY §9, this job is paused until manually re-enabled. ` +
        `To re-enable: node automation/scripts/aegis-reenable.mjs ${jobName}`,
      "error",
    );
    const skipId = await auditStart(
      jobName,
      `skipped: auto-disabled after ${failures} consecutive failures`,
    );
    await auditFinish(skipId, "skipped", 0, {
      reason: "auto-disabled per AUTOMATION_POLICY §9",
      consecutive_failures: failures,
      threshold: AUTODISABLE_THRESHOLD,
    });
    process.exit(0);
  }
  const start = Date.now();
  const auditId = await auditStart(jobName);
  try {
    log(jobName, "Starting");
    const result = await fn();
    const ms = Date.now() - start;
    log(jobName, `Done in ${ms}ms`);
    recordRun(jobName, true, { durationMs: ms });
    await auditFinish(auditId, "success", ms, { duration_ms: ms });
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    log(jobName, `FAILED: ${err.stack || err.message}`, "error");
    const state = recordRun(jobName, false, { error: err.message });
    await auditFinish(auditId, "failed", ms, {
      error: err.message,
      consecutive_failures: state.consecutiveFailures[jobName] ?? 1,
    });
    if ((state.consecutiveFailures[jobName] || 0) >= 3) {
      log(jobName, "Three consecutive failures — escalating per policy §9", "error");
    }
    process.exit(1);
  }
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
