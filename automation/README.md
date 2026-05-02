# AEGIS Autonomous Operations

This directory keeps the AEGIBIT website upgrading itself 24/7 — even when Rahul is offline.

## Workflows (`.github/workflows/`)

| Workflow | Cadence | What it does |
|----------|---------|-------------|
| `daily-automation.yml` | 03:00 UTC daily | Daily blog post + 5 SEO pages + audit + Lighthouse + lead health |
| `weekly-automation.yml` | Mondays 03:00 UTC | Dep patch sweep, competitor watch, brand mentions |
| `friday-pdf.yml` | Fridays 21:00 IST | **Generates weekend build-plan PDF and emails Rahul** |
| `monthly-automation.yml` | 1st @ 02:00 UTC | Revenue report, cost audit |
| `security.yml` | 06:00 UTC daily + on dep change | CodeQL, OSV, Gitleaks, npm audit auto-fix PR |

## Files

- `../AUTOMATION_POLICY.md` — read this first. Tiers, allow/forbid, escalation.
- `config.json` — knobs: thresholds, content queues, weekend idea pool.
- `state.json` — persistent state (last runs, metrics, used topics/ideas).
- `PAUSE` — touch this file to halt all automation. `rm` to resume.
- `scripts/` — Node ESM scripts.
- `logs/` — append-only per-job logs.
- `reports/` — generated weekly PDFs.

## Required GitHub Secrets

Settings → Secrets and variables → Actions:

**Required:**
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — for analytics scripts
- `RESEND_API_KEY` — to email Rahul the Friday PDF (already a dep in package.json)

**Optional (skip until needed):**
- `SENDGRID_API_KEY` — backup mailer
- `STRIPE_SECRET_KEY` — monthly revenue report

Vercel deploy uses the existing GitHub→Vercel integration — no token needed in workflows.

## Test locally

```bash
npm run automation:blog
npm run automation:seo-pages
npm run automation:friday-pdf   # generates PDF in automation/reports/
```

## Pause everything

```bash
touch automation/PAUSE
git add automation/PAUSE && git commit -m "ops: pause" && git push
```

Resume: `rm automation/PAUSE`, commit, push.
