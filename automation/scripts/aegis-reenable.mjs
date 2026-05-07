#!/usr/bin/env node
// Operator utility: re-enable an auto-disabled agent.
//
// Usage:
//   node automation/scripts/aegis-reenable.mjs <jobName>
//
// Resets state.consecutiveFailures[jobName] to 0 in automation/state.json
// so the next cron tick (or manual trigger) will run the job again. The
// audit log on /dashboard/agents will show the next run's success/failure
// fresh from this point.
//
// Why this isn't automatic: a job that fails 3 times almost always has
// a real problem (broken env var, bad code, third-party outage). Auto-
// retrying past the threshold compounds damage. The 1-line CLI here
// puts a human (you) explicitly in the loop before the agent runs again.

import { loadState, saveState, log } from "./_lib.mjs";

const jobName = process.argv[2];
if (!jobName) {
  console.error("Usage: node automation/scripts/aegis-reenable.mjs <jobName>");
  console.error("Example: node automation/scripts/aegis-reenable.mjs lead-nurture");
  process.exit(1);
}

const state = loadState();
const before = state.consecutiveFailures?.[jobName] ?? 0;
if (before === 0) {
  console.log(`[aegis-reenable] ${jobName}: consecutiveFailures already 0. Nothing to do.`);
  process.exit(0);
}

state.consecutiveFailures ??= {};
state.consecutiveFailures[jobName] = 0;
saveState(state);

log("aegis-reenable", `Reset ${jobName} consecutiveFailures: ${before} → 0`);
console.log(
  `[aegis-reenable] ${jobName} re-enabled. Next cron / workflow_dispatch will run.`,
);
console.log(
  `[aegis-reenable] Don't forget: commit + push automation/state.json so the change persists across CI runs.`,
);
