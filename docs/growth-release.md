# Growth foundation release

This release adds two scoped service pages and a services index while preserving noindex on legacy service pages. It unifies public portfolio descriptions, narrows unsupported outcome claims on the company and Nibir project pages, replaces attributed solution quotes with a project reference, and explains the difference between accounting exports and live integration.

The authenticated Growth & SEO page reads aggregate counts from existing visitors and leads tables. It does not publish raw leads, API credentials, private Search Console data, inferred revenue or fabricated AI visibility. Counts use 28 complete Asia/Kolkata days; Google reports use their own timezone. No database migration is required. The install page now explains the existing Cortex FAQ relationship: RightForce is its Android app.

Contact changes retain the existing endpoint and notification workflow. A duplicate response is not tracked as a new submission. Declined analytics consent blocks telemetry even if a visitor ID remains in memory. Live notification delivery still needs an approved controlled submission.

Generated daily content now requires ENABLE_CONTENT_DRAFTS=true to run; generated PRs are drafts without automatic merge. Monitoring jobs remain enabled. Review any already-open content PR separately; this change does not cancel a previously scheduled merge.

Remaining evidence gates: signed customer outcome/quote evidence, product-specific security verification, external profile ownership, live database/notification verification, mobile interaction QA and paid AI research authorization. No ranking, client-count or revenue promise is made.
