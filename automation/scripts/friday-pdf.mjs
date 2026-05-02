// Friday-night build plan: pick 3 weekend-buildable ideas from the pool, render a PDF
// with budget + architecture for each. Saves to automation/reports/<date>.pdf.
//
// Requires: pdfkit (installed in workflow via `npm install --no-save pdfkit`).
// Locally: `npm install pdfkit` (devDependency suggestion, but no-save in CI).

import fs from "node:fs";
import path from "node:path";
import { ROOT, REPORTS_DIR, loadConfig, loadState, saveState, log, withJob, ensureDir } from "./_lib.mjs";

const MOD = await tryImport("pdfkit");
if (!MOD) {
  console.error("pdfkit not installed. Run: npm install pdfkit");
  process.exit(1);
}
const PDFDocument = MOD.default || MOD;

await withJob("friday-pdf", async () => {
  const cfg = loadConfig();
  const state = loadState();
  ensureDir(REPORTS_DIR);

  const used = new Set(state.metrics?.usedFridayIdeas || []);
  const pool = cfg.weekendIdeaPool.filter((i) => i.weekend_buildable);
  const fresh = pool.filter((i) => !used.has(i.title));
  const ideas = (fresh.length >= 3 ? fresh : pool).slice(0, 3);

  const today = new Date();
  const stamp = today.toISOString().split("T")[0];
  const pdfPath = path.join(REPORTS_DIR, `weekend-build-plan-${stamp}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 56 });
  doc.pipe(fs.createWriteStream(pdfPath));

  // Cover
  doc.fontSize(28).fillColor("#FF6A00").text("AEGIBIT", { align: "left" });
  doc.fontSize(10).fillColor("#888").text("From AEGIS to Rahul — co-founder briefing", { align: "left" });
  doc.moveDown(2);
  doc.fontSize(36).fillColor("#000").text("Weekend Build Plan", { align: "left" });
  doc.fontSize(14).fillColor("#444").text(today.toDateString(), { align: "left" });
  doc.moveDown(1.5);
  doc.fontSize(12).fillColor("#000").text(
    "Three ideas you can build Saturday and Sunday. Each includes budget, architecture, " +
    "and an honest revenue model. Pick one. Ship it. We talk Monday morning.",
    { align: "left", lineGap: 4 }
  );

  // Per-idea pages
  ideas.forEach((idea, idx) => {
    doc.addPage();
    doc.fontSize(10).fillColor("#FF6A00").text(`IDEA ${idx + 1} OF ${ideas.length}`);
    doc.moveDown(0.3);
    doc.fontSize(24).fillColor("#000").text(idea.title);
    doc.fontSize(13).fillColor("#444").text(idea.tagline, { lineGap: 3 });
    doc.moveDown(1);

    section(doc, "Budget");
    doc.fontSize(11).fillColor("#000").text(`~$${idea.budget_usd} for the weekend build (compute, APIs, domains, ads to validate).`);
    doc.moveDown(0.8);

    section(doc, "Architecture");
    archFor(doc, idea);
    doc.moveDown(0.8);

    section(doc, "Revenue model");
    revenueFor(doc, idea);
    doc.moveDown(0.8);

    section(doc, "Saturday plan");
    list(doc, [
      "Domain + Vercel project (15 min)",
      "Next.js scaffold, copy AEGIBIT design tokens (1 hr)",
      "Core feature MVP — happy path only (4 hr)",
      "Stripe link or Lemon Squeezy for payments (45 min)",
      "Landing page + waitlist + Google Analytics (2 hr)",
    ]);
    doc.moveDown(0.6);

    section(doc, "Sunday plan");
    list(doc, [
      "Polish + 1 case-study screenshot (2 hr)",
      "Post on LinkedIn, X, IndieHackers, ProductHunt-upcoming (1 hr)",
      "DM 30 ideal users with a personalized note (2 hr)",
      "Set up automation alerts for the first signup (30 min)",
      "Write the first follow-up blog post — AEGIS auto-publishes Mon (1 hr)",
    ]);
    doc.moveDown(0.6);

    section(doc, "Definition of done");
    doc.fontSize(11).fillColor("#000").text(
      "Live URL, payment works, 50+ unique visitors, ≥1 paid customer or 30+ waitlist signups by Sunday 23:59 IST."
    );
  });

  // Footer / sign-off
  doc.addPage();
  doc.fontSize(20).fillColor("#000").text("Why I picked these three");
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#444").text(
    "Each is buildable in a weekend, has a clear payer, and reinforces AEGIBIT's security-first " +
    "moat. None require us to spend more than what's in the budget line. All can fail cheap and " +
    "teach us something.",
    { lineGap: 3 }
  );
  doc.moveDown(2);
  doc.fontSize(13).fillColor("#FF6A00").text("— AEGIS");
  doc.fontSize(10).fillColor("#888").text("Auto-generated " + today.toISOString());

  doc.end();
  await new Promise((r) => doc.on("end", r));
  log("friday-pdf", `Wrote ${pdfPath}`);

  state.metrics ??= {};
  state.metrics.usedFridayIdeas = [...used, ...ideas.map((i) => i.title)];
  state.metrics.fridayReportsSent = (state.metrics.fridayReportsSent || 0) + 1;
  state.metrics.lastFridayPdfPath = path.relative(ROOT, pdfPath);
  saveState(state);
});

// ---------- helpers ----------
function section(doc, title) {
  doc.fontSize(10).fillColor("#FF6A00").text(title.toUpperCase(), { characterSpacing: 1.2 });
  doc.moveDown(0.2);
}
function list(doc, items) {
  doc.fontSize(11).fillColor("#000");
  for (const it of items) doc.text(`•  ${it}`, { indent: 6, lineGap: 3 });
}
function archFor(doc, idea) {
  const map = {
    "AEGIBIT Watchtower": "GitHub App → webhook → Cloudflare Worker → OSV/Snyk scan → auto-PR via Octokit. Postgres for state, Resend for digests. $0 hosting until 100 repos.",
    "VoiceCore Audit Trail": "Reuse VoiceCore append-only log → Postgres → REST + signed-export endpoint → Stripe metered billing per 1K events.",
    "Free Site-Vuln Scanner": "Next.js form → queue (Upstash) → headless Chromium + Lighthouse + nuclei → PDF report (pdfkit) → Resend email + Supabase lead capture.",
    "AEGIS Newsroom": "Cron worker → NVD/CVE feeds + RSS → LLM summarizer → Postgres → tiered email (free daily / paid CVE-match alerts).",
    "Compliance-as-Code Templates": "Markdown + Terraform repo → Gumroad PDF/zip → drip email onboarding via Resend.",
    "Pen-Test in a Box": "Stripe checkout → Trello card → standardized scope doc + nuclei + manual review checklist → PDF deliverable in 5 days.",
    "Stripe Webhook Vault": "Cloudflare Worker per project → KV for replay protection → forward + retry → dashboard in Next.js.",
    "AEGIBIT Affiliate Engine": "Add `?ref=<id>` capture → Postgres attribution table → Stripe Connect for payouts.",
    "AppShield Mobile SDK": "Native modules (RN/Flutter) → server-side attestation endpoint → analytics dashboard.",
    "Indian SaaS Compliance Pack": "Templates + Notion playbook + monthly audit checklist + Razorpay subscriptions.",
  };
  doc.fontSize(11).fillColor("#000").text(map[idea.title] || "TBD architecture brief.", { lineGap: 3 });
}
function revenueFor(doc, idea) {
  const map = {
    "AEGIBIT Watchtower": "$29/mo per repo. 50 repos in 3 months = $1,450 MRR. Upsell: managed remediation $499/mo.",
    "VoiceCore Audit Trail": "$0.001 per event after 100K free. Targets compliance teams. 5 customers = $500-2,000 MRR.",
    "Free Site-Vuln Scanner": "Free top-of-funnel. Convert 5% of scans → $4,999 fix engagement. Target: 200 scans/mo → $50K/mo.",
    "AEGIS Newsroom": "Free email; $19/mo for stack-matched CVE alerts. 500 free → 5% paid = $475 MRR after 90 days.",
    "Compliance-as-Code Templates": "$199 one-time per pack × 3 packs (SOC 2 / HIPAA / GDPR). Goal: 50 sales/mo = $10K.",
    "Pen-Test in a Box": "$499 fixed-fee × 4 per month = $2K MRR. Upsell: retest add-on $199.",
    "Stripe Webhook Vault": "$19/mo per project. 100 projects = $1,900 MRR. Sticky — projects rarely migrate webhooks.",
    "AEGIBIT Affiliate Engine": "Drives our own service revenue. Target: 30% of new clients via affiliates within 6 months.",
    "AppShield Mobile SDK": "$99/mo per app. 100 apps = $9,900 MRR. High retention — security SDKs don't churn.",
    "Indian SaaS Compliance Pack": "₹40K setup + ₹10K/mo. 10 clients = ₹1.4L/mo recurring. Local moat.",
  };
  doc.fontSize(11).fillColor("#000").text(map[idea.title] || "TBD revenue model.", { lineGap: 3 });
}

async function tryImport(mod) {
  try { return await import(mod); } catch { return null; }
}
