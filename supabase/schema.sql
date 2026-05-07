-- Run this entire file in your Supabase SQL Editor
-- Project: knabpkdynxggojyyjydl

-- ─────────────────────────────────────────
-- VISITORS
-- ─────────────────────────────────────────
create table if not exists visitors (
  id                    uuid primary key default gen_random_uuid(),
  session_id            text not null,
  ip_address            text,
  user_agent            text,
  device                text check (device in ('desktop','mobile','tablet')),
  browser               text,
  os                    text,
  country               text,
  city                  text,
  referrer              text,
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  landing_page          text not null,
  pages_viewed          text[] default '{}',
  scroll_depth_max      int  default 0,
  time_on_site_seconds  int  default 0,
  click_count           int  default 0,
  form_interactions     int  default 0,
  exit_intent_triggered boolean default false,
  behavior_score        int  default 0,
  is_active             boolean default true,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index if not exists visitors_session_id_idx on visitors(session_id);
create index if not exists visitors_created_at_idx on visitors(created_at desc);
create index if not exists visitors_is_active_idx  on visitors(is_active);

-- ─────────────────────────────────────────
-- VISITOR EVENTS
-- ─────────────────────────────────────────
create table if not exists visitor_events (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  uuid references visitors(id) on delete cascade,
  event_type  text not null,
  event_data  jsonb,
  page        text not null,
  timestamp   timestamptz default now()
);

create index if not exists visitor_events_visitor_id_idx on visitor_events(visitor_id);
create index if not exists visitor_events_timestamp_idx  on visitor_events(timestamp desc);

-- ─────────────────────────────────────────
-- LEADS
-- ─────────────────────────────────────────
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text not null,
  company     text,
  phone       text,
  team_size   text,
  message     text,
  source      text not null,
  page        text not null,
  visitor_id  uuid,
  score       int  default 0,
  status      text default 'new' check (status in ('new','contacted','qualified','converted')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(email, source)
);

create index if not exists leads_email_idx      on leads(email);
create index if not exists leads_status_idx     on leads(status);
create index if not exists leads_created_at_idx on leads(created_at desc);

-- ─────────────────────────────────────────
-- PAGE VIEWS
-- ─────────────────────────────────────────
create table if not exists page_views (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  uuid references visitors(id) on delete cascade,
  page        text not null,
  referrer    text,
  duration    int  default 0,
  timestamp   timestamptz default now()
);

create index if not exists page_views_visitor_id_idx on page_views(visitor_id);

-- ─────────────────────────────────────────
-- WAITLIST (separate from leads for clarity)
-- ─────────────────────────────────────────
create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  name        text,
  company     text,
  source_page text,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- AGENT ACTIONS (multi-agent audit log) — P2-S4
-- ─────────────────────────────────────────
-- Every autonomous agent action (blog post generated, SEO page
-- shipped, lead nurture fired, dependency PR opened, etc.) writes a
-- row here. Append-only by convention; the only mutation is the
-- terminal status/outcome update at the end of a run.
--
-- Required by AUTOMATION_POLICY.md §8 (observability) and the Aira
-- Charter Phase 2 / Multi-Agent Orchestration Layer requirement that
-- every agent action be auditable.
--
-- Read by /api/admin/agent-actions and rendered at /dashboard/agents.
-- ─────────────────────────────────────────
create table if not exists agent_actions (
  id           uuid primary key default gen_random_uuid(),
  agent        text not null,                       -- agent identifier (e.g. "generate-blog-post")
  category     text check (category in ('content','seo','infra','security','ops','outreach','test')),
  tier         text check (tier in ('T0','T1','T2','T3','T4')),
  action       text not null,                       -- short verb form: "published", "opened-pr", etc.
  summary      text,                                -- 1-2 sentence dashboard description
  metadata     jsonb,                               -- structured payload: pr_url, commit_sha, target_path
  status       text not null default 'in_progress'
                check (status in ('in_progress','success','failed','skipped')),
  outcome      jsonb,                               -- error message, side-effects, etc. (terminal)
  duration_ms  int,
  started_at   timestamptz default now(),
  ended_at     timestamptz
);

create index if not exists agent_actions_started_at_idx on agent_actions(started_at desc);
create index if not exists agent_actions_agent_idx      on agent_actions(agent);
create index if not exists agent_actions_status_idx     on agent_actions(status);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Service role key bypasses RLS entirely.
-- Anon key (frontend) has no access to these tables.
-- ─────────────────────────────────────────
alter table visitors       enable row level security;
alter table visitor_events enable row level security;
alter table leads          enable row level security;
alter table page_views     enable row level security;
alter table waitlist       enable row level security;
alter table agent_actions  enable row level security;

-- No public SELECT/INSERT policies — all access via service role through API routes only.

-- ─────────────────────────────────────────
-- HELPER: update visitor scroll depth
-- Called from /api/visitors/events
-- ─────────────────────────────────────────
create or replace function update_visitor_scroll(p_visitor_id uuid, p_depth int)
returns void language plpgsql security definer as $$
begin
  update visitors
  set
    scroll_depth_max = greatest(scroll_depth_max, p_depth),
    updated_at       = now()
  where id = p_visitor_id;
end;
$$;

-- ─────────────────────────────────────────
-- HELPER: mark visitor inactive
-- ─────────────────────────────────────────
create or replace function mark_visitor_inactive()
returns trigger language plpgsql as $$
begin
  -- Called via cron or cleanup job, not a trigger
  return new;
end;
$$;
