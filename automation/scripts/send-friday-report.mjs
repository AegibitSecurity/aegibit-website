// Emails the Friday PDF to Rahul. Prefers Resend (already a dep), falls back to SendGrid.
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadState, log, withJob } from "./_lib.mjs";

await withJob("send-friday-report", async () => {
  const state = loadState();
  const rel = state.metrics?.lastFridayPdfPath;
  if (!rel) { log("send-friday-report", "No PDF path in state — did friday-pdf run?", "warn"); return; }
  const pdfPath = path.join(ROOT, rel);
  if (!fs.existsSync(pdfPath)) { log("send-friday-report", `PDF missing: ${pdfPath}`, "warn"); return; }

  const to = process.env.REPORT_TO || "contact@aegibit.com";
  const pdf = fs.readFileSync(pdfPath);
  const filename = path.basename(pdfPath);
  const subject = `Weekend Build Plan — ${new Date().toISOString().split("T")[0]}`;
  const body = "Rahul,\n\nThree ideas we can ship this weekend. Budget + architecture + revenue inside.\n\nPick one. I'll auto-publish a launch post Monday morning.\n\n— AEGIS";

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "AEGIS <aegis@aegibit.com>",
        to: [to],
        subject,
        text: body,
        attachments: [{ filename, content: pdf.toString("base64") }],
      }),
    });
    log("send-friday-report", `Resend → ${res.status}`);
    return;
  }

  if (process.env.SENDGRID_API_KEY) {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "aegis@aegibit.com", name: "AEGIS" },
        subject,
        content: [{ type: "text/plain", value: body }],
        attachments: [{ filename, type: "application/pdf", content: pdf.toString("base64") }],
      }),
    });
    log("send-friday-report", `SendGrid → ${res.status}`);
    return;
  }

  log("send-friday-report", "No email provider key set (RESEND_API_KEY or SENDGRID_API_KEY) — PDF saved but not emailed", "warn");
});
