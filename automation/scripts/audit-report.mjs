import fs from "node:fs";
import { log, withJob } from "./_lib.mjs";

const auditFile = process.argv[2];
if (!auditFile) { console.error("Usage: audit-report.mjs <audit.json>"); process.exit(1); }

await withJob("audit-report", async () => {
  if (!fs.existsSync(auditFile)) { log("audit-report", `No file at ${auditFile}`); return; }
  const raw = fs.readFileSync(auditFile, "utf8").trim();
  if (!raw) return;
  const data = JSON.parse(raw);
  const sev = data.metadata?.vulnerabilities || {};
  log("audit-report", `critical=${sev.critical||0} high=${sev.high||0} moderate=${sev.moderate||0} low=${sev.low||0}`);
  if ((sev.critical || 0) > 0) {
    log("audit-report", "CRITICAL CVEs present — deploy gate engaged", "error");
    process.exitCode = 2;
  }
});
