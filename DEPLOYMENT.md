# AEGIBIT VoiceCore — Deployment Guide

## Prerequisites

1. Copy `.env.local.example` → `.env.local` and fill all values
2. Create a free Supabase project at supabase.com
3. Run the SQL below in Supabase SQL Editor to create tables

## Supabase Table Setup (run in SQL Editor)

```sql
create table visitors (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  ip_address text,
  user_agent text,
  device text,
  browser text,
  os text,
  country text,
  city text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  landing_page text not null,
  pages_viewed text[] default '{}',
  scroll_depth_max int default 0,
  time_on_site_seconds int default 0,
  click_count int default 0,
  form_interactions int default 0,
  exit_intent_triggered boolean default false,
  behavior_score int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table visitor_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid references visitors(id),
  event_type text not null,
  event_data jsonb,
  page text not null,
  timestamp timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company text,
  phone text,
  team_size text,
  message text,
  source text not null,
  page text not null,
  visitor_id uuid,
  score int default 0,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(email, source)
);
```

---

## Option A — Vercel (Recommended)

1. Push this repo to GitHub
2. Import to Vercel: vercel.com/new
3. Add all env vars from `.env.local` in Vercel dashboard → Settings → Environment Variables
4. Deploy → auto-deploys on every push to main

---

## Option B — Hostinger VPS

### 1. SSH into your VPS
```bash
ssh root@your-vps-ip
```

### 2. Install Node.js 20 + PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

### 3. Clone and build
```bash
git clone https://github.com/your-org/aegibit-voicecore.git
cd aegibit-voicecore
cp .env.local.example .env.local
# Edit .env.local with your values
nano .env.local
npm install
npm run build
```

### 4. Start with PM2
```bash
pm2 start npm --name aegibit -- start
pm2 save
pm2 startup
```

### 5. Nginx reverse proxy
```nginx
# /etc/nginx/sites-available/aegibit
server {
    listen 80;
    server_name aegibitsecurity.com www.aegibitsecurity.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/aegibit /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d aegibitsecurity.com -d www.aegibitsecurity.com
```

### 7. Point Hostinger DNS
In Hostinger domain panel → DNS Zone:
- A record: `@` → your VPS IP
- A record: `www` → your VPS IP

---

## Dashboard Access

Visit `/dashboard` after deployment.
Set `DASHBOARD_SECRET` in env and use that value as the Bearer token for API access.

## PM2 ecosystem.config.js

```js
module.exports = {
  apps: [{
    name: 'aegibit',
    script: 'npm',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
  }],
};
```
