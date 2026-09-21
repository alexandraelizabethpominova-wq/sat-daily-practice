create table if not exists public.sat_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  vibe text check (vibe is null or vibe in ('love-it','pretty-good','needs-work')),
  message text not null check (char_length(message) between 1 and 2000),
  context text check (context is null or char_length(context) <= 100),
  created_at timestamptz not null default now()
);

alter table public.sat_feedback enable row level security;

drop policy if exists "Anyone can submit SAT feedback" on public.sat_feedback;
create policy "Anyone can submit SAT feedback"
on public.sat_feedback
for insert
to anon, authenticated
with check (user_id is null or user_id = auth.uid());

revoke all on public.sat_feedback from anon, authenticated;
grant insert on public.sat_feedback to anon, authenticated;

create index if not exists sat_feedback_created_at_idx
on public.sat_feedback(created_at desc);

create index if not exists sat_feedback_user_id_idx
on public.sat_feedback(user_id)
where user_id is not null;
