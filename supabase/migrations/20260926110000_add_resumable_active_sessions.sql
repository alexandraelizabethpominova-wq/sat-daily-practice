alter table public.sat_sessions
  add column if not exists status text not null default 'completed',
  add column if not exists question_ids jsonb not null default '[]'::jsonb,
  add column if not exists current_index integer not null default 0,
  add column if not exists draft_answer text not null default '',
  add column if not exists session_settings jsonb not null default '{}'::jsonb,
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.sat_sessions
  drop constraint if exists sat_sessions_status_check;

alter table public.sat_sessions
  add constraint sat_sessions_status_check
  check (status in ('active','completed','abandoned'));

alter table public.sat_sessions
  drop constraint if exists sat_sessions_current_index_check;

alter table public.sat_sessions
  add constraint sat_sessions_current_index_check
  check (current_index >= 0);

update public.sat_sessions
set
  status = case when ended_at is null then 'abandoned' else 'completed' end,
  last_activity_at = coalesce(ended_at, started_at, created_at, now()),
  updated_at = now()
where status = 'completed'
  and (question_ids = '[]'::jsonb or ended_at is null);

create index if not exists sat_sessions_user_status_activity_idx
  on public.sat_sessions(user_id,status,last_activity_at desc);

create unique index if not exists sat_sessions_one_active_per_user_idx
  on public.sat_sessions(user_id)
  where status = 'active';
