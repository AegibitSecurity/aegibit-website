import { withJob, log, loadState, saveState } from "./_lib.mjs";

// 4-step nurture sequence (step 0 = confirmation, sent synchronously by /api/leads).
// Cadence: T+1d, T+3d, T+7d, T+12d. After 14d of signup we stop.
// Two flavours: "paymint" (highest-intent lead source) and "default" (waitlist/contact).

const SEQUENCES = {
  paymint: [
    {
      step: 1, dueHours: 24,
      subject: "How Nibir Motors saved 12 hours/week with PayMint",
      bodyHtml: ({ name }) => emailShell({
        heading: "A live PayMint story.",
        intro: `${greet(name)}While we line up your demo, here's a 90-second look at what changes when expense capture moves to PayMint.`,
        body: `
          <p style="${P}">Nibir Motors runs 7 branches across West Bengal. Before PayMint:</p>
          <ul style="${UL}">
            <li>Vouchers reached HQ 5–9 days late.</li>
            <li>Branch managers reconciled cash by hand every Friday.</li>
            <li>Audit trail = a stack of paper in a steel almirah.</li>
          </ul>
          <p style="${P}">After 30 days on PayMint:</p>
          <ul style="${UL}">
            <li><b style="color:#fff">Same-day visibility</b> on every branch's spend.</li>
            <li><b style="color:#fff">12 hrs/week</b> reclaimed for the accounts team.</li>
            <li><b style="color:#fff">100% audit-ready</b> — every voucher photographed, geo-tagged, time-stamped.</li>
          </ul>
        `,
        cta: { label: "Read the full Nibir case study", href: "https://www.aegibit.com/case-studies/nibir-motors" },
      }),
    },
    {
      step: 2, dueHours: 72,
      subject: "3 expense leaks every multi-branch business has",
      bodyHtml: ({ name }) => emailShell({
        heading: "The leaks you can't see.",
        intro: `${greet(name)}Three quiet expense leaks we see in almost every multi-branch operation we onboard:`,
        body: `
          <p style="${P}"><b style="color:#fff">1. Phantom vendors.</b> Same vendor, three spellings, three GST numbers. PayMint's vendor master flags duplicates within 24 hours of import.</p>
          <p style="${P}"><b style="color:#fff">2. Petty-cash drift.</b> ₹500 here, ₹1,200 there — over a year, one branch can lose ₹4–8 lakh to "miscellaneous." Closing-balance reconciliation per shift fixes it.</p>
          <p style="${P}"><b style="color:#fff">3. Late approvals = late closes.</b> A 3-day approval lag means month-end takes a week. PayMint's WhatsApp-first approval flow drops it to under 4 hours.</p>
        `,
        cta: { label: "See PayMint live in 20 minutes", href: "https://www.aegibit.com/products/paymint/demo" },
      }),
    },
    {
      step: 3, dueHours: 24 * 7,
      subject: "Last call: a 1-on-1 walkthrough this week",
      bodyHtml: ({ name }) => emailShell({
        heading: "Want to claim your slot?",
        intro: `${greet(name)}We held a slot for you this week. If a 20-minute walkthrough still makes sense, just reply with two times that work and we'll lock it in.`,
        body: `
          <p style="${P}">No deck, no fluff — we'll show PayMint with your branch structure pre-loaded so you can judge it on your own data.</p>
        `,
        cta: { label: "Pick a time →", href: "https://www.aegibit.com/products/paymint/demo" },
      }),
    },
    {
      step: 4, dueHours: 24 * 12,
      subject: "Closing the loop on your PayMint demo",
      bodyHtml: ({ name }) => emailShell({
        heading: "Closing the loop.",
        intro: `${greet(name)}If now isn't the right time, no worries — I'll archive this thread.`,
        body: `
          <p style="${P}">If anything changes — new branch coming online, audit cycle starting, finance team getting overwhelmed — just reply to this email and we'll pick it up.</p>
          <p style="${P}">In the meantime, the live web app is at <a href="https://nibir-vault.web.app" style="color:#F97316">nibir-vault.web.app</a> if you want to poke around.</p>
        `,
        cta: { label: "Try PayMint anyway", href: "https://nibir-vault.web.app" },
      }),
    },
  ],
  default: [
    {
      step: 1, dueHours: 24,
      subject: "What we'd build for you (a 60-second walkthrough)",
      bodyHtml: ({ name }) => emailShell({
        heading: "Quick context on AEGIBIT.",
        intro: `${greet(name)}Two-line version of how we work:`,
        body: `
          <p style="${P}"><b style="color:#fff">We build, secure, and ship</b> — full-stack web/app + the security layer most teams skip. Bootstrapped, founder-led, no juniors on your project.</p>
          <p style="${P}">If a 20-minute call to scope your project would help, hit reply with a couple of times that work for you.</p>
        `,
        cta: { label: "See what we've built", href: "https://www.aegibit.com/case-studies" },
      }),
    },
    {
      step: 2, dueHours: 24 * 4,
      subject: "How we ship without breaking budgets",
      bodyHtml: ({ name }) => emailShell({
        heading: "How we keep budgets honest.",
        intro: `${greet(name)}Three things we do differently:`,
        body: `
          <ul style="${UL}">
            <li><b style="color:#fff">Fixed-fee scopes</b> on Phase 1 so you know what you're spending before we start.</li>
            <li><b style="color:#fff">Security baked in</b> — OWASP Top 10, secret scanning, SSO, RLS — not a $20K add-on at the end.</li>
            <li><b style="color:#fff">A working preview every Friday</b>, not a 12-week silence.</li>
          </ul>
        `,
        cta: { label: "Public pricing →", href: "https://www.aegibit.com/pricing" },
      }),
    },
    {
      step: 3, dueHours: 24 * 10,
      subject: "Still on your radar?",
      bodyHtml: ({ name }) => emailShell({
        heading: "Still on your radar?",
        intro: `${greet(name)}Wanted to bump this once. If we're not the right fit right now, just reply "later" and I'll hold off.`,
        body: `<p style="${P}">If you'd like a 20-minute scoping call, send two times that work for you.</p>`,
        cta: { label: "Or browse the work", href: "https://www.aegibit.com/case-studies" },
      }),
    },
  ],
};

const P = "font-size:15px;line-height:1.6;color:#A1A1AA;margin:0 0 16px;";
const UL = "font-size:15px;line-height:1.7;color:#A1A1AA;margin:0 0 16px;padding-left:18px;";
const greet = (name) => name ? `Hi ${name},<br/><br/>` : "Hi,<br/><br/>";

function emailShell({ heading, intro, body, cta }) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#000;color:#fff;padding:40px 32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
        <div style="width:32px;height:32px;border-radius:7px;background:#000;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(249,115,22,0.4);">
          <span style="color:#F97316;font-size:18px;font-weight:700;">✓</span>
        </div>
        <span style="font-size:16px;font-weight:300;letter-spacing:0.18em;">
          <span style="color:#fff;">AEGI</span><span style="color:#F97316;">BIT</span>
        </span>
      </div>
      <h1 style="font-size:24px;font-weight:300;line-height:1.25;margin:0 0 18px;letter-spacing:-0.01em;color:#fff;">${heading}</h1>
      <p style="${P}">${intro}</p>
      ${body}
      <div style="margin:28px 0;">
        <a href="${cta.href}" style="display:inline-block;background:linear-gradient(135deg,#F97316,#EA6C0A);color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:700;letter-spacing:0.01em;">${cta.label}</a>
      </div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;"/>
      <p style="font-size:11px;color:#52525B;margin:0;">
        AEGIBIT Security · <a href="https://www.aegibit.com" style="color:#F97316;text-decoration:none;">www.aegibit.com</a><br/>
        Reply "stop" to unsubscribe from this thread.
      </p>
    </div>
  `;
}

await withJob("lead-nurture", async () => {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const resendKey = (process.env.RESEND_API_KEY || "").trim();

  if (!url || !key) { log("lead-nurture", "Supabase env not set — skipping", "warn"); return; }
  if (!resendKey) { log("lead-nurture", "RESEND_API_KEY not set — skipping", "warn"); return; }

  // Pull leads from the last 14 days. Active funnel only.
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const res = await fetch(
    `${url}/rest/v1/leads?select=id,email,name,source,created_at&created_at=gte.${since}&order=created_at.desc`,
    { headers }
  );
  if (!res.ok) { log("lead-nurture", `Supabase fetch failed: ${res.status}`, "error"); throw new Error("supabase fetch"); }
  const leads = await res.json();
  log("lead-nurture", `Pulled ${leads.length} leads from last 14d`);

  const state = loadState();
  state.nurtureSent ??= {}; // { "<email>": { "<step>": "<isoTimestamp>" } }
  let sent = 0, skipped = 0, errors = 0;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  for (const lead of leads) {
    const email = (lead.email || "").trim().toLowerCase();
    if (!email) { skipped++; continue; }

    const flavour = lead.source === "paymint_demo" ? "paymint" : "default";
    const seq = SEQUENCES[flavour];
    const ageHours = (Date.now() - new Date(lead.created_at).getTime()) / 3_600_000;

    // Find the latest step that's due AND not yet sent.
    const due = [...seq].reverse().find(s => ageHours >= s.dueHours);
    if (!due) { skipped++; continue; }

    const sentMap = state.nurtureSent[email] || {};
    if (sentMap[due.step]) { skipped++; continue; }

    try {
      const r = await resend.emails.send({
        from: "Rahul (AEGIBIT) <noreply@aegibit.com>",
        to: [email],
        replyTo: ["contact@aegibit.com"],
        subject: due.subject,
        html: due.bodyHtml({ name: lead.name }),
      });
      if (r.error) throw new Error(r.error.message || JSON.stringify(r.error));
      state.nurtureSent[email] = { ...sentMap, [due.step]: new Date().toISOString() };
      saveState(state);
      sent++;
      log("lead-nurture", `sent step=${due.step} flavour=${flavour} to=<${email.length} chars>`);
    } catch (err) {
      errors++;
      log("lead-nurture", `send failed step=${due.step} err=${err.message}`, "error");
    }
  }

  // Prune nurture log for emails older than 30 days to bound state.json size.
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  for (const [em, steps] of Object.entries(state.nurtureSent)) {
    const newest = Math.max(...Object.values(steps).map(t => new Date(t).getTime()));
    if (newest < cutoff) delete state.nurtureSent[em];
  }
  saveState(state);

  state.metrics ??= {};
  state.metrics.nurtureEmailsSent = (state.metrics.nurtureEmailsSent || 0) + sent;
  saveState(state);

  log("lead-nurture", `done sent=${sent} skipped=${skipped} errors=${errors}`);
});
