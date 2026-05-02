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

export async function withJob(jobName, fn) {
  if (isPaused()) {
    log(jobName, "PAUSED — skipping", "warn");
    process.exit(0);
  }
  const start = Date.now();
  try {
    log(jobName, "Starting");
    const result = await fn();
    const ms = Date.now() - start;
    log(jobName, `Done in ${ms}ms`);
    recordRun(jobName, true, { durationMs: ms });
    return result;
  } catch (err) {
    log(jobName, `FAILED: ${err.stack || err.message}`, "error");
    const state = recordRun(jobName, false, { error: err.message });
    if ((state.consecutiveFailures[jobName] || 0) >= 3) {
      log(jobName, "Three consecutive failures — escalating per policy §9", "error");
    }
    process.exit(1);
  }
}

export function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
