-- Correct Practice Test 4 Reading & Writing Module 1 Q17 source crop.
-- Q17 was accidentally stored with nearly full-page width (541pt), leaving a large
-- blank area on the right. It belongs to the normal left SAT column (263pt).
update public.sat_question_bank
set
  source_crop = jsonb_build_object(
    'x', 28,
    'y', 107.03,
    'width', 263,
    'height', 627.97
  ),
  updated_at = now()
where id = 'rw1-17'
  and practice_test_id = 'practice-test-4';
