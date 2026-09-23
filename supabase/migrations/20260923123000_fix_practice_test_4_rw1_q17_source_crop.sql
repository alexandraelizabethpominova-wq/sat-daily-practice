-- Preserve the full Practice Test 4 Reading & Writing Module 1 Q17 source crop.
-- The full crop contains the complete four-column table and question text.
-- Blank right/bottom whitespace is trimmed only in the rendered comparison preview,
-- so display scaling can fill the pane without cutting source content.
update public.sat_question_bank
set
  source_crop = jsonb_build_object(
    'x', 28,
    'y', 107.03,
    'width', 541,
    'height', 627.97
  ),
  updated_at = now()
where id = 'rw1-17'
  and practice_test_id = 'practice-test-4';
