-- Question-specific canonical repair for Practice Test 6, Math Module 2, Q25.
-- The generic PDF text extractor loses radical and geometry notation for this source.

update public.sat_question_bank
set
  question_lines = jsonb_build_array(
    'In the $xy$-plane, a circle has center $C$ with coordinates $(h,k)$. Points $A$ and $B$ lie on the circle. Point $A$ has coordinates $(h+1,k+\sqrt{102})$, and $\angle ACB$ is a right angle. What is the length of $\overline{AB}$?',
    'A) $\sqrt{206}$',
    'B) $2\sqrt{102}$',
    'C) $103\sqrt{2}$',
    'D) $103\sqrt{3}$'
  ),
  question_mode = 'text',
  content_status = 'verified',
  updated_at = now()
where id = 'practice-test-6:math2-25'
  and practice_test_id = 'practice-test-6';
