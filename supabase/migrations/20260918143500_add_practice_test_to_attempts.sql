alter table public.sat_attempts
  add column practice_test_id text;

update public.sat_attempts
set practice_test_id = 'practice-test-4'
where practice_test_id is null;

alter table public.sat_attempts
  alter column practice_test_id set not null;

alter table public.sat_attempts
  add constraint sat_attempts_practice_test_id_check
  check (practice_test_id ~ '^practice-test-[0-9]+$');

create index sat_attempts_user_test_question_idx
  on public.sat_attempts(user_id, practice_test_id, question_id);
