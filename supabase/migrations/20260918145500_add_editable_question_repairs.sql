alter table public.sat_question_bank
  add column if not exists visual_crop jsonb,
  add column if not exists visual_after_line integer;

alter table public.sat_question_bank
  drop constraint if exists sat_question_bank_visual_after_line_check;
alter table public.sat_question_bank
  add constraint sat_question_bank_visual_after_line_check
  check (visual_after_line is null or visual_after_line >= -1);

-- During the current QA phase, every signed-in user may repair parsed content.
grant update (question_lines, needs_visual, visual_crop, visual_after_line, content_status, updated_at)
  on public.sat_question_bank to authenticated;

drop policy if exists "question_bank_authenticated_update" on public.sat_question_bank;
create policy "question_bank_authenticated_update"
  on public.sat_question_bank for update
  to authenticated
  using (true)
  with check (true);
