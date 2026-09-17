create table public.sat_question_bank (
  id text primary key,
  subject text not null check (subject in ('english','math')),
  module text not null check (module in ('rw1','rw2','math1','math2')),
  question_number integer not null check (question_number > 0),
  source_page integer not null,
  answer_page integer not null,
  correct_answer text not null,
  accepted_answers jsonb not null default '[]'::jsonb,
  response_type text not null check (response_type in ('multiple-choice','student-produced')),
  question_lines jsonb,
  explanation_lines jsonb,
  needs_visual boolean not null default false,
  content_status text not null default 'metadata' check (content_status in ('metadata','verified','imported')),
  updated_at timestamptz not null default now(),
  unique (module, question_number)
);

alter table public.sat_question_bank enable row level security;
revoke all on table public.sat_question_bank from anon;
revoke all on table public.sat_question_bank from authenticated;
grant select on table public.sat_question_bank to anon;
grant select on table public.sat_question_bank to authenticated;
grant select, insert, update, delete on table public.sat_question_bank to service_role;

create policy "question_bank_public_read"
  on public.sat_question_bank for select
  to anon, authenticated
  using (true);

create index sat_question_bank_subject_module_idx
  on public.sat_question_bank(subject, module, question_number);
