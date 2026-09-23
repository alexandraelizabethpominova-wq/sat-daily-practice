-- Practice Test 4 Reading & Writing Module 1 Q17.
-- Keep the table as structured UI data and persist only prose/stem/choices in question_lines.
-- The original-source crop is widened because the table spans beyond the normal left-column crop.

update public.sat_question_bank
set
  question_lines = jsonb_build_array(
    'Mycorrhizal fungi in soil benefits many plants, substantially increasing the mass of some. A student conducted an experiment to illustrate this effect. The student chose three plant species for the experiment, including two that are mycorrhizal hosts (species known to benefit from mycorrhizal fungi) and one nonmycorrhizal species (a species that doesn’t benefit from and may even be harmed by mycorrhizal fungi). The student then grew several plants from each species both in soil containing mycorrhizal fungi and in soil that had been treated to kill mycorrhizal and other fungi. After several weeks, the student measured the plants’ average mass and was surprised to discover that _______',
    'Which choice most effectively uses data from the table to complete the statement?',
    'A) broccoli grown in soil containing mycorrhizal fungi had a slightly higher average mass than broccoli grown in soil that had been treated to kill fungi.',
    'B) corn grown in soil containing mycorrhizal fungi had a higher average mass than broccoli grown in soil containing mycorrhizal fungi.',
    'C) marigolds grown in soil containing mycorrhizal fungi had a much higher average mass than marigolds grown in soil that had been treated to kill fungi.',
    'D) corn had the highest average mass of all three species grown in soil that had been treated to kill fungi, while marigolds had the lowest.'
  ),
  source_crop = '{"x":28,"y":107.03,"width":541,"height":627.97}'::jsonb,
  question_mode = 'text',
  content_status = 'verified',
  updated_at = now()
where id = 'rw1-17'
  and practice_test_id = 'practice-test-4';
