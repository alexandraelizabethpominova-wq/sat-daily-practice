update public.sat_question_bank
set visual_crop='{"x":0.12,"y":0.18,"width":0.76,"height":0.44}'::jsonb,
    updated_at=now()
where id='practice-test-5:math2-11' and practice_test_id='practice-test-5';