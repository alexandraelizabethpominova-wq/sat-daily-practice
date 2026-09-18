alter table public.sat_user_profiles
  add column is_admin boolean not null default false;

-- Keep the admin flag backend-managed. Browser clients may edit only normal profile fields.
revoke insert, update on table public.sat_user_profiles from authenticated;
grant insert (user_id, display_name, school, grade, parent_guardian_name, parent_guardian_email, about, updated_at)
  on public.sat_user_profiles to authenticated;
grant update (display_name, school, grade, parent_guardian_name, parent_guardian_email, about, updated_at)
  on public.sat_user_profiles to authenticated;

drop policy if exists "parsing_reports_select_own" on public.sat_parsing_issue_reports;
create policy "parsing_reports_select_own_or_admin"
  on public.sat_parsing_issue_reports for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1 from public.sat_user_profiles profile
      where profile.user_id = (select auth.uid())
        and profile.is_admin = true
    )
  );

drop policy if exists "parsing_reports_update_own" on public.sat_parsing_issue_reports;
create policy "parsing_reports_update_admin"
  on public.sat_parsing_issue_reports for update
  to authenticated
  using (exists (
    select 1 from public.sat_user_profiles profile
    where profile.user_id = (select auth.uid())
      and profile.is_admin = true
  ))
  with check (exists (
    select 1 from public.sat_user_profiles profile
    where profile.user_id = (select auth.uid())
      and profile.is_admin = true
  ));

drop policy if exists "parsing_reports_delete_own" on public.sat_parsing_issue_reports;
create policy "parsing_reports_delete_own_or_admin"
  on public.sat_parsing_issue_reports for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1 from public.sat_user_profiles profile
      where profile.user_id = (select auth.uid())
        and profile.is_admin = true
    )
  );
