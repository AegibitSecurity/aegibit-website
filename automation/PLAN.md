# AEGIBIT Automation Plan — Source of Truth

> Read this first. Cross-checked against the codebase before each ship.
> Last updated: 2026-05-04

## Hard rules (non-negotiable)

1. **Zero spend.** Free tiers + open source only. No paid SaaS without explicit Rahul approval.
2. **Don't break running automations.** Add new scripts and new workflow files. Never silently modify `daily-automation.yml`, `weekly-automation.yml`, `monthly-automation.yml`, `friday-pdf.yml`, `security.yml`, `lead-nurture.yml`.
3. **Security covenant.** Never log emails, tokens, or PII directly. Use length/redaction. Never commit secrets.
4. **No auto-send to humans.** Outbound, sales, marketing emails to third parties must open a PR for human review — never auto-send.
5. **Kill switch respected.** Every script must check `automation/PAUSE` (use `withJob` from `_lib.mjs`).
6. **PR-first delivery.** Open a PR for review; let CI gate it. Direct push to `main` only for documentation/state-file updates.

## Already shipped (DO NOT REIMPLEMENT)

| Workflow | Cadence | What it does |
|----------|---------|-------------|
| daily-automation.yml | 03:00 UTC daily | blog post + 5 SEO pages, audit, Lighthouse, lead-health |
| weekly-automation.yml | Mon 03:00 UTC | npm patch sweep, competitor watch, brand mentions |
| monthly-automation.yml | 1st @ 02:00 UTC | revenue report, cost audit |
| friday-pdf.yml | Fri 21:00 IST | weekend build-plan PDF → emails Rahul |
| security.yml | 06:00 UTC daily | CodeQL, OSV, Gitleaks, npm audit fix PR |
| lead-nurture.yml | every 6h | 4-step lead follow-up (paymint + default flavours) |

## Open items — ship in this order

### 1. Outbound draft generator  *(Acquisition)*
Daily script picks 10–20 ICP companies from `automation/config.json` (or scrapes a static seed list), drafts personalized cold-outreach emails, opens a **draft PR** for Rahul to review/approve. **Never auto-sends.** Output: `automation/outbound/<date>/<n>.md` files with subject + body + research notes. New workflow `outbound-drafts.yml`, daily 04:00 UTC.

### 2. Exit-intent popup  *(Conversion)*
Pure frontend component on `/products/paymint`, `/pricing`, `/case-studies/*`. Triggers on mouseleave-to-top with cooldown cookie. Captures email → `/api/leads` with `source: "exit_intent"` (already supported in [src/app/api/leads/route.ts:9](src/app/api/leads/route.ts:9)). No backend changes.

### 3. Cal.com auto-booking widget  *(Conversion)*
Replace "reply with two times" CTAs on demo + nurture pages with a Cal.com embed (free tier). Add `<CalEmbed>` component, point at Rahul's free Cal account. Update [products/paymint/demo/page.tsx](src/app/products/paymint/demo/page.tsx) and the lead-nurture step-3 email CTA.

### 4. A/B test harness  *(Conversion)*
Cookie-based 50/50 split on hero headline at `/`. Two variants. Track which variant the lead saw via UTM-style param, store in `leads.metadata`. New util `src/lib/ab.ts`. No paid feature flag service.

### 5. NPS prompt automation  *(Retention)*
After 14 days post-signup, Resend an NPS prompt email (1–10). Capture replies into Supabase. Pre-revenue: this is groundwork; activates when first paying customer onboards.

### 6. Programmatic backlink outreach  *(Acquisition)*
Generate weekly draft pitches to 20 prospect blogs/podcasts based on AEGIBIT's published content. Open as draft PR. Never auto-send.

### 7. UTM-personalized landing snippets  *(Conversion)*
If `?utm_source=linkedin`, swap hero subhead + CTA. Cookie-based persistence. No external service.

### 8. PayMint tenant auto-provisioning  *(Activation — DEFER)*
Requires PayMint app coordination (separate repo: NIBIR-EXPENSES-APP). Don't ship until that side has a tenant API.

## Definition of "ship"

A ship is complete when:
1. New code is pushed to `main` (or merged via auto-merged PR for docs/state).
2. For features: a PR is open with CI green and a human-readable description.
3. This `PLAN.md` is updated: move the item from "Open" to "Shipped (timestamp + commit hash)".
4. `automation/state.json` `metrics.planItemsShipped` is incremented.

## Anti-patterns to avoid

- ❌ Adding tasks not on this list without updating PLAN.md first.
- ❌ Touching the leads API (`src/app/api/leads/route.ts`) without explicit approval — it's the revenue funnel.
- ❌ Modifying Supabase schema. The remote agent has no schema access; defer schema changes.
- ❌ Adding paid dependencies (Stripe live mode, paid Cal.com tier, paid email volume).
- ❌ Auto-merging anything that isn't already classed as auto-mergeable in [AUTOMATION_POLICY.md](#) (T0 content, T1 deps).
