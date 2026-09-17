create table public.sat_user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  school text,
  grade text,
  parent_guardian_name text,
  parent_guardian_email text,
  about text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sat_user_profiles enable row level security;

revoke all on table public.sat_user_profiles from anon;
grant select, insert, update, delete on table public.sat_user_profiles to authenticated;
grant select, insert, update, delete on table public.sat_user_profiles to service_role;

create policy "users_select_own_profile"
  on public.sat_user_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "users_insert_own_profile"
  on public.sat_user_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users_update_own_profile"
  on public.sat_user_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users_delete_own_profile"
  on public.sat_user_profiles for delete to authenticated
  using ((select auth.uid()) = user_id);
