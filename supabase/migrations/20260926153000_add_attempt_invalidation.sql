alter table public.sat_attempts
  add column if not exists invalidated_at timestamptz,
  add column if not exists invalid_reason text;

create index if not exists sat_attempts_valid_history_idx
  on public.sat_attempts(user_id,created_at)
  where invalidated_at is null;
