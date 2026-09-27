alter table public.sat_question_bank
  add column if not exists visual_specs jsonb not null default '[]'::jsonb;
