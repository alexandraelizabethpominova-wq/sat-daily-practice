create table public.sat_sessions (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  mode text not null check (mode in ('english','math','both')),
  question_count integer not null check (question_count > 0),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.sat_attempts (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  session_id uuid not null,
  question_id text not null,
  subject text not null check (subject in ('english','math')),
  module text not null,
  question_number integer not null check (question_number > 0),
  selected_answer text not null,
  correct_answer text not null,
  correct boolean not null,
  self_graded boolean not null default false,
  elapsed_ms integer not null check (elapsed_ms >= 0),
  created_at timestamptz not null default now(),
  constraint sat_attempts_session_user_fk
    foreign key (session_id, user_id)
    references public.sat_sessions(id, user_id)
    on delete cascade
);

alter table public.sat_sessions enable row level security;
alter table public.sat_attempts enable row level security;

revoke all on table public.sat_sessions from anon;
revoke all on table public.sat_attempts from anon;
grant select, insert, update, delete on table public.sat_sessions to authenticated;
grant select, insert, update, delete on table public.sat_attempts to authenticated;
grant select, insert, update, delete on table public.sat_sessions to service_role;
grant select, insert, update, delete on table public.sat_attempts to service_role;

create policy "users_select_own_sessions"
  on public.sat_sessions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users_insert_own_sessions"
  on public.sat_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users_update_own_sessions"
  on public.sat_sessions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users_delete_own_sessions"
  on public.sat_sessions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users_select_own_attempts"
  on public.sat_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users_insert_own_attempts"
  on public.sat_attempts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users_update_own_attempts"
  on public.sat_attempts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users_delete_own_attempts"
  on public.sat_attempts
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index sat_sessions_user_started_idx
  on public.sat_sessions(user_id, started_at desc);

create index sat_attempts_user_created_idx
  on public.sat_attempts(user_id, created_at desc);

create index sat_attempts_user_question_idx
  on public.sat_attempts(user_id, question_id);

create index sat_attempts_session_idx
  on public.sat_attempts(session_id);
