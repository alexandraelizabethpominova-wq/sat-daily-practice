create table public.sat_parsing_issue_reports (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  practice_test_id text not null check (practice_test_id ~ '^practice-test-[0-9]+$'),
  subject text not null check (subject in ('english','math')),
  module text not null check (module in ('rw1','rw2','math1','math2')),
  question_number integer not null check (question_number > 0),
  context text not null check (context in ('practice','session-review','question-bank','performance')),
  message text check (message is null or char_length(message) <= 1000),
  status text not null default 'open' check (status in ('open','resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sat_parsing_issue_reports enable row level security;
revoke all on table public.sat_parsing_issue_reports from anon;
revoke all on table public.sat_parsing_issue_reports from authenticated;
grant select, insert, update, delete on table public.sat_parsing_issue_reports to authenticated;
grant select, insert, update, delete on table public.sat_parsing_issue_reports to service_role;

create policy "parsing_reports_select_all"
  on public.sat_parsing_issue_reports for select
  to authenticated
  using (true);

create policy "parsing_reports_insert_own"
  on public.sat_parsing_issue_reports for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "parsing_reports_update_all"
  on public.sat_parsing_issue_reports for update
  to authenticated
  using (true)
  with check (true);

create policy "parsing_reports_delete_all"
  on public.sat_parsing_issue_reports for delete
  to authenticated
  using (true);

create index sat_parsing_issue_reports_user_status_idx
  on public.sat_parsing_issue_reports(user_id, status, created_at desc);

create index sat_parsing_issue_reports_question_idx
  on public.sat_parsing_issue_reports(practice_test_id, question_id);
