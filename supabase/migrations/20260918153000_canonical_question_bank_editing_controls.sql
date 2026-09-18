
alter table public.sat_question_bank
  add column if not exists source_crop jsonb,
  add column if not exists question_mode text not null default 'text';

alter table public.sat_question_bank
  drop constraint if exists sat_question_bank_question_mode_check;

alter table public.sat_question_bank
  add constraint sat_question_bank_question_mode_check
  check (question_mode in ('text','image-fallback'));

create table if not exists public.sat_question_bank_config (
  singleton boolean primary key default true check (singleton = true),
  editing_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.sat_question_bank_config(singleton,editing_enabled)
values(true,true)
on conflict(singleton) do nothing;

alter table public.sat_question_bank_config enable row level security;

revoke all on table public.sat_question_bank_config from anon;
revoke all on table public.sat_question_bank_config from authenticated;
grant select on table public.sat_question_bank_config to anon, authenticated;
grant update(editing_enabled,updated_at) on table public.sat_question_bank_config to authenticated;
grant all on table public.sat_question_bank_config to service_role;

drop policy if exists "question_bank_config_public_read" on public.sat_question_bank_config;
create policy "question_bank_config_public_read"
  on public.sat_question_bank_config for select
  to anon, authenticated
  using (true);

drop policy if exists "question_bank_config_authenticated_update" on public.sat_question_bank_config;
create policy "question_bank_config_authenticated_update"
  on public.sat_question_bank_config for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "question_bank_authenticated_update" on public.sat_question_bank;
create policy "question_bank_authenticated_update"
  on public.sat_question_bank for update
  to authenticated
  using (
    exists (
      select 1
      from public.sat_question_bank_config config
      where config.singleton = true and config.editing_enabled = true
    )
  )
  with check (
    exists (
      select 1
      from public.sat_question_bank_config config
      where config.singleton = true and config.editing_enabled = true
    )
  );

grant update (
  question_lines,
  needs_visual,
  visual_crop,
  visual_after_line,
  source_crop,
  question_mode,
  content_status,
  source_page,
  answer_page,
  correct_answer,
  accepted_answers,
  response_type,
  updated_at
) on public.sat_question_bank to authenticated;
