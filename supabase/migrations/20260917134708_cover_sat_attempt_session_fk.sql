drop index if exists public.sat_attempts_session_idx;
create index sat_attempts_session_user_idx on public.sat_attempts(session_id, user_id);
