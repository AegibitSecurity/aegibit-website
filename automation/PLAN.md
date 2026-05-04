# AEGIBIT Automation Plan — Source of Truth

> **Philosophy.** AEGIBIT is a $1B+ premium global technology and security company.
> Every ship must pass: *Does this feel like a $1B company feature? Is it differentiated? Can it scale massively?*
> If it's a commodity SaaS pattern, **we don't ship it as a priority.**
> Last updated: 2026-05-04 by Aira

---

## The four pillars (every ship must satisfy)

1. **Enterprise-grade first** — typed, accessible (WCAG AA), responsive, observable, audit-ready. No MVP shortcuts.
2. **AI-first** — every feature explores AI leverage; predictive over reactive.
3. **Security-first** — zero-trust, secure-by-default, audit trails, no leaked data through any new surface.
4. **Automation-first** — system runs itself; human action only at the moments that need judgment.

---

## Hard rules (non-negotiable)

1. **Zero spend.** Free tiers + open source only. No paid SaaS without explicit Rahul approval. Anthropic API counts as paid — items needing an LLM are flagged "Awaiting LLM budget approval".
2. **Don't break running automations.** Add new scripts and new workflow files. Never silently modify `daily-automation.yml`, `weekly-automation.yml`, `monthly-automation.yml`, `friday-pdf.yml`, `security.yml`, `lead-nurture.yml`.
3. **Security covenant.** Never log emails, tokens, or PII directly. Use length/redaction. Never commit secrets. New surfaces (public API routes) must validate input rigorously and block private/internal addresses.
4. **No auto-send to humans.** Outbound, sales, marketing emails to third parties must open a draft PR for human review — never auto-send.
5. **Kill switch respected.** Every script must check `automation/PAUSE` (use `withJob` from `_lib.mjs`).
6. **PR-first delivery.** Open a PR for review; let CI gate it. Direct push to `main` only for documentation/state-file updates (`PLAN.md`, `state.json`).
7. **No Supabase schema changes** without Rahul's explicit approval. Use file-based persistence in `automation/data/` if storage is needed.

---

## Already shipped (DO NOT REIMPLEMENT, DO NOT MODIFY)

| Workflow | Cadence | What it does |
|----------|---------|-------------|
| `daily-automation.yml` | 03:00 UTC daily | blog post + 5 SEO pages, audit, Lighthouse, lead-health |
| `weekly-automation.yml` | Mon 03:00 UTC | npm patch sweep, competitor watch, brand mentions |
| `monthly-automation.yml` | 1st @ 02:00 UTC | revenue report, cost audit |
| `friday-pdf.yml` | Fri 21:00 IST | weekend build-plan PDF → emails Rahul |
| `security.yml` | 06:00 UTC daily | CodeQL, OSV, Gitleaks, npm audit fix PR |
| `lead-nurture.yml` | every 6h | 4-step lead follow-up (PayMint + default flavours) |

---

## Open items — ship in this order (each must clear the $1B test)

### 1. Public Security Posture Scanner — `aegibit.com/tools/scan` 🛡️🚀
**Why $1B-grade.** Branded, viral, on-mission. We are the security company; we should be the company you go to when you want to know how secure a domain is. Becomes a permanent lead-gen weapon, generates organic backlinks (every scan result is shareable), qualifies enterprise intent (anyone scanning is shopping for security work).

**What to build.**
- API route `src/app/api/scan/route.ts` (POST + GET, rate-limited via existing `src/lib/rate-limiter.ts`)
  - Input: `domain` (string, validated as a public hostname)
  - Output JSON: `{ tlsGrade, hsts, csp, xFrameOptions, xContentTypeOptions, referrerPolicy, permissionsPolicy, openPorts: [], commonAdminPathsExposed: [], emailsLeakedFromMx: bool, dnssec, caaRecords, score: 0-100, generatedAt, scanDurationMs }`
  - **SSRF guardrail**: refuse private/loopback/link-local IPs. Resolve domain, validate the resolved IP is public, only then connect.
  - 30s hard timeout per check; total 60s.
- Public UI route `src/app/tools/scan/page.tsx`
  - Hero input + scan button, animated results card grouped by category (TLS, Headers, DNS, Surface)
  - Each finding has severity, plain-English explanation, and a "Get audited by AEGIBIT" CTA when score < 70
  - Premium visual: monospace findings, traffic-light dots, gradient score ring, "share this report" button (copies a URL with the result)
- Persistence (zero-spend, file-based): cache results in `automation/data/scans/<domain-hash>.json` for 24h. **Never** store who scanned (we don't need that data; less data = less risk).
- Sitemap entry + metadata for `/tools/scan` (it's an SEO surface).

**Acceptance criteria.**
- `npm run build` passes.
- Lighthouse ≥ 90 for `/tools/scan`.
- Visiting `/api/scan?domain=aegibit.com` returns valid JSON.
- SSRF protection: `?domain=localhost` or `?domain=10.0.0.1` returns 400.
- Rate limit: 10 scans/hour per IP.
- Empty state, loading state, error state all designed.

**Do NOT.**
- Crawl pages of the scanned domain (just headers + DNS + TLS).
- Make this an authenticated feature; it's a public weapon.
- Send any emails as part of the scan flow.

---

### 2. Enterprise Trust Dossier — `aegibit.com/case-studies/<slug>/trust` 🏛️
**Why $1B-grade.** Enterprise buyers (the people writing $50K+ checks) ask: *show me your security posture.* Most companies email a PDF. We host a live, signed page that buyers self-serve. This is the page that closes deals.

**What to build.**
- Static page at `src/app/case-studies/[slug]/trust/page.tsx`
- Data source: `src/data/trust-dossiers/<slug>.json` — schema: customer name, deployment architecture (Mermaid diagram string), data flow, encryption posture, compliance attestations, audit-trail availability, uptime history (last 90 days), incident response SLA, key personnel.
- Render: rich layout with collapsible architecture diagram (use `mermaid` package — already in deps if not, audit it first), animated SLA chart, downloadable PDF version (reuse `pdfkit` from Friday workflow).
- First dossier: **Nibir Motors** (PayMint anchor customer).
- Index page at `/case-studies/<slug>/` already exists — add a prominent "View Trust Dossier" link.
- Premium typography, signed-document feel (subtle paper texture, monospace metadata, AEGIBIT seal in corner).

**Acceptance criteria.**
- `npm run build` passes; static prerendering for the Nibir page.
- Mermaid diagram renders correctly client-side.
- "Download as PDF" button generates a clean, branded PDF.
- Lighthouse ≥ 90, WCAG AA contrast verified.

**Do NOT.**
- Fabricate compliance claims (e.g., don't say "SOC 2 certified" if we aren't). Use truthful labels: "Architecture follows SOC 2 controls; certification scheduled Q3 2026" is acceptable.

---

### 3. Aira Daily Brief 📨
**Why $1B-grade.** Every billion-dollar founder has a daily intelligence brief. Bloomberg charges $24K/year for theirs. We build ours, free, AI-native, branded.

**What to build.**
- New script `automation/scripts/daily-brief.mjs`
- New workflow `.github/workflows/aira-daily-brief.yml` — runs `30 1 * * *` UTC (07:00 IST)
- Pulls in one shot:
  - **Yesterday's leads** (count by source, total, day-over-day delta) — read via Supabase REST as in `lead-health-check.mjs`
  - **Traffic** — pageviews/visitors yesterday (from `visitors` table)
  - **Conversion** — yesterday vs 7d avg
  - **Pipeline** — leads in nurture, by step
  - **Top 5 SEO pages by traffic** (if data available; otherwise omit gracefully)
  - **Anomaly flags** — anything ±30% from 7d trailing
  - **One actionable recommendation** — chosen from a heuristic ruleset (e.g., "lead conversion dropped 22% — investigate /pricing"; "no leads in 24h on default source — consider re-running outreach")
  - **One product idea seed** — pulled from a curated queue in `automation/config.json` (new field: `productIdeaQueue`)
- Renders a beautiful HTML email (same brand shell as `lead-nurture` and `confirmation`):
  - Header: date, "Aira's morning brief"
  - KPI cards (4-up grid, traffic-light deltas)
  - Pipeline mini-funnel
  - Anomalies / recommendation block
  - Product idea seed
  - Footer: "Reply to this email to assign me work today."
- Sends to `contact@aegibit.com` via Resend.
- Logs to `automation/logs/daily-brief.log`. Counters in `state.json` `metrics.dailyBriefsSent`.

**Acceptance criteria.**
- Workflow honors `automation/PAUSE`.
- If Supabase env missing, script logs a warning and exits 0 (not failure).
- Email passes Litmus-style basic compatibility (inline CSS, max width 600).
- Plain-text fallback included.

**Do NOT.**
- Include raw lead emails in the brief — show counts and aggregates only.
- Hard-fail if any single data source is unavailable.

---

### 4. Aira Lead Intelligence — AI dossier per lead 🧠 *(Tier B — needs LLM budget)*
**Why $1B-grade.** No SMB competitor does enriched lead intelligence. The moment a lead converts we know more about them than they know about us — that's the asymmetry that wins enterprise deals.

**What to build.** Per new lead: scrape email domain's public site, infer company size/sector/tech stack/security posture from public footprint, generate ICP-fit score (0–100), suggest a first-message angle. Display in `/dashboard/leads/<id>` with a "Aira Insights" panel.

**Status**: ⏸ **Awaiting LLM budget approval.** Heuristic-only v0 (no LLM) is possible but won't pass the $1B test. Defer until Rahul approves a) Anthropic API spend (~$5–20/mo at our volume) or b) a free-tier LLM that meets the bar.

---

### 5. AI Cold-Email Composer with research 🎯 *(Tier B — needs LLM budget)*
**Why $1B-grade.** Templated cold email died in 2024. $1B-grade outbound is per-prospect research → per-prospect angle → per-prospect first line.

**What to build.** Daily script picks 10–20 ICP companies from a seed list, scrapes their public site, extracts value props + recent news, drafts a personalized email per company, opens a draft PR `outbound:review` for Rahul to approve. Never auto-sends.

**Status**: ⏸ **Awaiting LLM budget approval** (same constraint as #4).

---

## Tier C — hygiene items (parking lot, not priority)

These are useful but commodity SaaS patterns. We do them after Tier A and only if the agent has nothing higher-impact open. Each must still ship at the four-pillar standard.

- Exit-intent popup on `/products/paymint`, `/pricing`
- Cal.com embed on demo pages
- A/B test harness on hero
- UTM-personalized landing snippets
- NPS prompt automation
- Programmatic backlink outreach drafts
- PayMint tenant auto-provisioning *(blocked on PayMint app coordination)*

---

## Definition of "ship"

A ship is complete when:
1. New code is on `main` (merged via PR; the agent never auto-merges its own PRs).
2. CI is green.
3. PR description explicitly addresses each of the four pillars (how the ship satisfies Enterprise / AI / Security / Automation).
4. PLAN.md is updated: item moves from "Open" to "Shipped" with date + PR URL + one-line summary.
5. `automation/state.json` `metrics.planItemsShipped` is incremented.

## Anti-patterns to avoid

- ❌ Adding items not on this plan without updating PLAN.md first.
- ❌ Touching the leads API (`src/app/api/leads/route.ts`) without explicit approval — it's the revenue funnel.
- ❌ Modifying any of the 6 already-shipped workflows.
- ❌ Modifying Supabase schema. Use file-based persistence in `automation/data/`.
- ❌ Auto-merging anything that isn't already classed auto-mergeable in existing workflows.
- ❌ Shipping a Tier C item while Tier A items are open.
- ❌ Calling a paid LLM/API without approval.

## Shipped log

- 2026-05-04 — `feat(automation): lead-nurture` — 4-step nurture sequence, every 6h, PayMint + default flavours. PR: a96d3eb. (Activation pillar.)
