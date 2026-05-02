# AEGIBIT AUTOMATION & UPGRADE POLICY
**Owner:** AEGIS (Autonomous CEO)
**Status:** ACTIVE
**Mandate:** The website must improve every single day, with or without human intervention.

---

## CORE PRINCIPLE

> **"If it can be automated, it must be. If it can't, automate building it."**

This policy defines what AEGIS upgrades autonomously, on what cadence, and with what guardrails. Every automation listed here runs on a schedule and ships changes to production without waiting for a human.

---

## 1. AUTOMATION TIERS

| Tier | Risk | Auto-Deploy? | Examples |
|------|------|-------------|----------|
| **T0 — Trusted** | Zero risk | YES, instantly | Content additions, blog posts, SEO pages, copy fixes, image optimization, sitemap regen |
| **T1 — Low** | Minor risk | YES, after CI passes | Dependency patches, lint fixes, accessibility fixes, meta tag updates |
| **T2 — Medium** | Some risk | PR auto-opened, awaits human merge | Minor dep upgrades, new features behind flag, schema changes |
| **T3 — High** | Real risk | PR + tag @owner | Major version bumps, auth changes, payment changes, infra changes |
| **T4 — Critical** | Production-breaking | NEVER auto-merged | Database migrations destructive, secret rotation, domain changes |

**Rule:** When uncertain, downgrade one tier. Default to safer.

---

## 2. DAILY AUTOMATIONS (run every 24h)

### 2.1 Content Engine (T0)
- Generate **1 SEO blog post** on a security/dev topic from the topic queue
- Publish to `/aegibit/src/content/blog/`
- Update sitemap, ping Google Search Console
- Post link to LinkedIn/X via webhook

### 2.2 Programmatic SEO (T0)
- Generate **5 new pages** from templates:
  - `/services/website-development-for-[industry]`
  - `/services/app-development-[platform]`
  - `/website-development-[city]`
- Use industry/city seed lists, fill template, commit, deploy

### 2.3 Lead Pipeline Health (T0)
- Run analytics query on Supabase
- If conversion rate dropped >20% day-over-day → alert + open issue
- If lead volume increased >50% → scale email worker

### 2.4 Security Sweep (T1)
- Run `npm audit`, `osv-scanner` against both projects
- Auto-PR for patch/minor security fixes
- Block deploy if critical CVE in dependencies

### 2.5 Performance Watch (T0)
- Run Lighthouse CI on production URLs
- If perf score drops below 85 → open issue + auto-suggest fix
- If LCP > 2.5s → flag and investigate

---

## 3. WEEKLY AUTOMATIONS (Monday 03:00 UTC)

### 3.1 SEO Audit (T1)
- Crawl all production pages
- Find missing meta descriptions, H1 tags, alt text → auto-fix PR
- Identify pages with zero traffic in 30 days → flag for review

### 3.2 Dependency Sweep (T1/T2)
- Patch versions: auto-merge after CI ✅
- Minor versions: auto-PR, await human
- Major versions: tag @owner, await decision

### 3.3 Backlink & Brand Mentions (T0)
- Search Google/Bing for "aegibit" mentions
- Log new mentions to dashboard
- If unattributed → draft outreach email for review

### 3.4 Competitor Watch (T0)
- Scrape pricing/feature pages of named competitors
- Diff against last week → log changes
- If competitor drops a feature we have → draft a comparison page

### 3.5 Cold Outreach Refresh (T1)
- Generate 50 new leads from Apollo/Hunter API
- Score leads via heuristic (industry, size, security signals)
- Queue top 20 for SendGrid drip sequence

---

## 4. CONTINUOUS AUTOMATIONS (event-triggered)

### 4.1 On Push to `main`
- Build → Test → Lint → Type check → Deploy preview
- Run Lighthouse + axe-core accessibility checks
- Auto-deploy to production if all pass

### 4.2 On New Lead Captured
- Score lead via behavior engine
- If HOT (>75): instant Slack alert + auto-personalized email within 60s
- If WARM (50-74): enroll in 7-day drip sequence
- If COLD (<50): enroll in newsletter, monthly nurture

### 4.3 On Form Submission
- Validate, rate-limit, persist to Supabase
- Send confirmation email
- If high-intent (mentioned "buy", "quote", "demo"): page on-call CEO immediately

### 4.4 On CVE Disclosure (matched dep)
- GitHub Dependabot/Renovate auto-PR
- If patch available: auto-merge after CI
- If no patch: open issue, downgrade tier, alert

---

## 5. MONTHLY AUTOMATIONS (1st of month 02:00 UTC)

- **Revenue report:** MRR, ARR, churn, LTV → email + dashboard
- **Cost audit:** Vercel/Supabase/SendGrid spend → flag if >20% over baseline
- **SEO ranking report:** Keyword positions for top 50 terms
- **Customer success scan:** Inactive users → win-back email
- **Brand asset refresh:** Update OG images with current metrics

---

## 6. AUTONOMOUS DECISION RULES

When AEGIS runs without supervision, it follows these rules:

### 6.1 ALLOWED autonomously
- ✅ Add new content/pages/blog posts
- ✅ Update copy, fix typos
- ✅ Optimize images, compress assets
- ✅ Apply security patches (T1)
- ✅ Regenerate sitemaps, robots.txt
- ✅ Update meta tags, structured data
- ✅ Open PRs for review
- ✅ Send transactional emails (already-opted-in users)
- ✅ Run analytics queries
- ✅ Deploy to staging
- ✅ Auto-deploy to prod IF: CI green, Lighthouse ≥85, no schema migration

### 6.2 REQUIRES human approval
- ❌ Spending money (ad campaigns, paid tools)
- ❌ Sending cold email to new leads (must respect anti-spam law)
- ❌ Major version dep upgrades
- ❌ Database schema migrations (destructive)
- ❌ Domain/DNS changes
- ❌ Pricing changes
- ❌ Public-facing claims about security certifications
- ❌ Anything touching authentication or payments
- ❌ Force-push, rebase of main, history rewrites

### 6.3 ALWAYS forbidden
- 🚫 Disabling tests/lint/security checks to ship
- 🚫 Committing secrets, API keys, customer data
- 🚫 Running on production database without backup
- 🚫 Merging PRs that have CI failures
- 🚫 Deleting customer data
- 🚫 Modifying audit logs

---

## 7. KILL SWITCH

A file at `automation/PAUSE` halts ALL automations within one cron tick. Touch this file to stop everything when something is wrong.

```bash
touch automation/PAUSE   # halt everything
rm automation/PAUSE      # resume
```

Every workflow checks for this file before running.

---

## 8. OBSERVABILITY

Every automation MUST:
1. Log start, success/failure, duration to `automation/logs/<job>.log`
2. On failure: open a GitHub Issue with the error trace, tag `automation-failure`
3. On success: update `automation/state.json` with last-run timestamp
4. Send weekly digest of all automation activity to contact@aegibit.com

---

## 9. ESCALATION POLICY

If the same automation fails 3 times in a row:
1. Disable that workflow (set `enabled: false` in `automation/config.json`)
2. Open a P1 issue
3. Email contact@aegibit.com
4. Do NOT retry until human re-enables

---

## 10. SUCCESS METRICS

The automation system is successful if:

| Metric | Target |
|--------|--------|
| Pages added per week | ≥ 35 |
| Blog posts per week | ≥ 7 |
| Time from CVE disclosure to patch deploy | < 24h |
| % of dep updates auto-merged | ≥ 80% |
| Production uptime | ≥ 99.9% |
| Lighthouse score (sustained) | ≥ 90 |
| Lead-to-customer time | < 14 days |
| Human hours required per week | < 2 |

Reviewed quarterly. If targets miss for 2 consecutive months, AEGIS proposes upgrade plan.

---

**Last updated:** 2026-05-03
**Next review:** 2026-08-03
**Approved by:** AEGIS (autonomous), pending CEO countersign at contact@aegibit.com
