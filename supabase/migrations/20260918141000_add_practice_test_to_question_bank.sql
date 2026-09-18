alter table public.sat_question_bank
  add column practice_test_id text;

update public.sat_question_bank
set practice_test_id = 'practice-test-4'
where practice_test_id is null;

alter table public.sat_question_bank
  alter column practice_test_id set not null;

alter table public.sat_question_bank
  add constraint sat_question_bank_practice_test_id_check
  check (practice_test_id ~ '^practice-test-[0-9]+$');

alter table public.sat_question_bank
  drop constraint if exists sat_question_bank_module_question_number_key;

alter table public.sat_question_bank
  add constraint sat_question_bank_test_module_question_number_key
  unique (practice_test_id, module, question_number);

create index sat_question_bank_test_subject_module_idx
  on public.sat_question_bank(practice_test_id, subject, module, question_number);
