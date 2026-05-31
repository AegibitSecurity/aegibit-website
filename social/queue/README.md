# AEGIBIT social queue

Pre-rendered, pre-approved daily posts for **@aegibitsec**.

- `<YYYY-MM-DD>.png` — HD 1600×900 on-brand image
- `<YYYY-MM-DD>.txt` — caption, copy-paste ready

**How it flows:** `.github/workflows/social-daily.yml` runs at 02:30 UTC
(08:00 IST) daily, finds that day's entry, and emails the image +
caption via Resend so it can be posted with a copy-paste. The cron only
reads these files — it never renders (no headless-font risk).

**Refill the queue:** add entries to `automation/data/social-posts.json`,
then run `node automation/scripts/render-social-queue.mjs` locally (where
system fonts resolve) and commit the new `.png` + `.txt` files.
