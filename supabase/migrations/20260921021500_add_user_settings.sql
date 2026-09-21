create table public.sat_user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sat_user_settings enable row level security;

revoke all on table public.sat_user_settings from anon;
grant select, insert, update, delete on table public.sat_user_settings to authenticated;
grant select, insert, update, delete on table public.sat_user_settings to service_role;

create policy "users_select_own_settings"
  on public.sat_user_settings for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "users_insert_own_settings"
  on public.sat_user_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users_update_own_settings"
  on public.sat_user_settings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users_delete_own_settings"
  on public.sat_user_settings for delete to authenticated
  using ((select auth.uid()) = user_id);
