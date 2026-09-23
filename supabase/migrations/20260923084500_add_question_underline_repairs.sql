-- Preserve source underlining for reported Reading & Writing parsing issues.
-- Underline markup is intentionally stored inline so the shared repair editor can
-- round-trip emphasis without requiring a separate formatting schema.

update public.sat_question_bank
set
  question_lines = jsonb_build_array(
    'The majority of plastics today wind up in landfills or are, at best, recycled into materials that have a very limited range of applications. To address this problem, chemist Guoliang Liu and colleagues designed a reactor that melts polyethylene and polypropylene—two widely used plastics—into a wax. The wax can then be transformed into a surfactant <u>(a chemical compound usable as a detergent)</u>. With this promising new method, plastic waste could be turned into a range of useful cleaning products.',
    'Which choice best states the function of the underlined portion of the text?',
    'A) It clarifies the meaning of a scientific term.',
    'B) It describes an environmental concern.',
    'C) It explains the significance of a scientific discovery.',
    'D) It identifies a result that confused the team.'
  ),
  content_status = 'verified',
  question_mode = 'text',
  needs_visual = false,
  updated_at = now()
where id = 'practice-test-7:rw1-7'
  and practice_test_id = 'practice-test-7';

update public.sat_question_bank
set
  question_lines = jsonb_build_array(
    'The following text is adapted from Herman Melville’s 1855 novel Israel Potter. Israel is a young man wandering through New England during the late eighteenth century.',
    'He hired himself out for three months; at the end of that time to receive for his wages two hundred acres of land lying in New Hampshire. [...] His employer proving false to the contract in the matter of the land, and there being no law in the country to force him to fulfil it, Israel—<u>who, however brave-hearted, and even much of a dare-devil upon a pinch, seems nevertheless to have evinced, throughout many parts of his career, a singular patience and mildness</u>—was obliged to look round for other means of livelihood than clearing out a farm for himself in the wilderness.',
    'Which choice best describes the function of the underlined portion in the text as a whole?',
    'A) It implies that Israel treasures a particular characteristic of his personality when that characteristic should usually be regarded as a flaw.',
    'B) It suggests that if not for a certain aspect of his character, Israel might not have been as easily thwarted in his ambition to establish a farm.',
    'C) It shows why Israel would not have been able to undertake the enormous amount of labor necessary to run a farm even if he had owned the necessary property.',
    'D) It explains why, when the situation requires it, Israel is able to undertake courageous acts that others would generally avoid.'
  ),
  content_status = 'verified',
  question_mode = 'text',
  needs_visual = false,
  updated_at = now()
where id = 'practice-test-6:rw1-8'
  and practice_test_id = 'practice-test-6';
