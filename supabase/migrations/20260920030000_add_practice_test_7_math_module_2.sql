-- Practice Test 7 Math Module 2 canonical metadata and source mapping.
-- All 27 questions were checked individually against the supplied question PDF,
-- scoring guide, and answer-explanation PDF. Structured question text is bundled
-- in the application; this migration provides the shared canonical metadata.

insert into public.sat_question_bank(
  id,practice_test_id,subject,module,question_number,source_page,answer_page,
  correct_answer,accepted_answers,response_type,source_crop,content_status,
  question_mode,updated_at
)
select
  x.id,'practice-test-7','math','math2',x.question_number,x.source_page,x.answer_page,
  x.correct_answer,x.accepted_answers,x.response_type,x.source_crop,'verified','text',now()
from jsonb_to_recordset($ps7_math2$
[{"id":"practice-test-7:math2-1","question_number":1,"source_page":44,"answer_page":39,"correct_answer":"A","accepted_answers":["A"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":109.1,"width":242.4,"height":165}},{"id":"practice-test-7:math2-2","question_number":2,"source_page":44,"answer_page":39,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":329,"width":242.4,"height":145}},{"id":"practice-test-7:math2-3","question_number":3,"source_page":44,"answer_page":39,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":314.3,"y":109.1,"width":242.4,"height":330}},{"id":"practice-test-7:math2-4","question_number":4,"source_page":44,"answer_page":40,"correct_answer":"A","accepted_answers":["A"],"response_type":"multiple-choice","source_crop":{"x":314.3,"y":500,"width":242.4,"height":170}},{"id":"practice-test-7:math2-5","question_number":5,"source_page":45,"answer_page":40,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":53.9,"y":109.1,"width":242.4,"height":230}},{"id":"practice-test-7:math2-6","question_number":6,"source_page":45,"answer_page":40,"correct_answer":"2850","accepted_answers":["2850"],"response_type":"student-produced","source_crop":{"x":53.9,"y":400,"width":242.4,"height":150}},{"id":"practice-test-7:math2-7","question_number":7,"source_page":45,"answer_page":40,"correct_answer":"11/4","accepted_answers":["11/4","2.75"],"response_type":"student-produced","source_crop":{"x":53.9,"y":590,"width":242.4,"height":130}},{"id":"practice-test-7:math2-8","question_number":8,"source_page":45,"answer_page":40,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":109.1,"width":242.4,"height":130}},{"id":"practice-test-7:math2-9","question_number":9,"source_page":45,"answer_page":41,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":295,"width":242.4,"height":145}},{"id":"practice-test-7:math2-10","question_number":10,"source_page":45,"answer_page":41,"correct_answer":"D","accepted_answers":["D"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":500,"width":242.4,"height":170}},{"id":"practice-test-7:math2-11","question_number":11,"source_page":46,"answer_page":41,"correct_answer":"D","accepted_answers":["D"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":109.1,"width":242.4,"height":205}},{"id":"practice-test-7:math2-12","question_number":12,"source_page":46,"answer_page":41,"correct_answer":"D","accepted_answers":["D"],"response_type":"multiple-choice","source_crop":{"x":314.3,"y":109.1,"width":242.4,"height":415}},{"id":"practice-test-7:math2-13","question_number":13,"source_page":46,"answer_page":42,"correct_answer":"4.41","accepted_answers":["4.41","441/100"],"response_type":"student-produced","source_crop":{"x":314.3,"y":585,"width":242.4,"height":135}},{"id":"practice-test-7:math2-14","question_number":14,"source_page":47,"answer_page":42,"correct_answer":"153","accepted_answers":["153"],"response_type":"student-produced","source_crop":{"x":53.9,"y":109.1,"width":242.4,"height":140}},{"id":"practice-test-7:math2-15","question_number":15,"source_page":47,"answer_page":42,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":53.9,"y":275,"width":242.4,"height":315}},{"id":"practice-test-7:math2-16","question_number":16,"source_page":47,"answer_page":42,"correct_answer":"A","accepted_answers":["A"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":109.1,"width":242.4,"height":380}},{"id":"practice-test-7:math2-17","question_number":17,"source_page":48,"answer_page":43,"correct_answer":"A","accepted_answers":["A"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":109.1,"width":242.4,"height":270}},{"id":"practice-test-7:math2-18","question_number":18,"source_page":48,"answer_page":43,"correct_answer":"D","accepted_answers":["D"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":440,"width":242.4,"height":180}},{"id":"practice-test-7:math2-19","question_number":19,"source_page":48,"answer_page":43,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":314.3,"y":109.1,"width":242.4,"height":235}},{"id":"practice-test-7:math2-20","question_number":20,"source_page":48,"answer_page":44,"correct_answer":"120","accepted_answers":["120"],"response_type":"student-produced","source_crop":{"x":314.3,"y":395,"width":242.4,"height":160}},{"id":"practice-test-7:math2-21","question_number":21,"source_page":48,"answer_page":44,"correct_answer":"1660","accepted_answers":["1660"],"response_type":"student-produced","source_crop":{"x":314.3,"y":605,"width":242.4,"height":115}},{"id":"practice-test-7:math2-22","question_number":22,"source_page":49,"answer_page":44,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":53.9,"y":109.1,"width":242.4,"height":300}},{"id":"practice-test-7:math2-23","question_number":23,"source_page":49,"answer_page":45,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":53.9,"y":455,"width":242.4,"height":265}},{"id":"practice-test-7:math2-24","question_number":24,"source_page":49,"answer_page":45,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":109.1,"width":242.4,"height":200}},{"id":"practice-test-7:math2-25","question_number":25,"source_page":49,"answer_page":45,"correct_answer":"C","accepted_answers":["C"],"response_type":"multiple-choice","source_crop":{"x":332.3,"y":355,"width":242.4,"height":190}},{"id":"practice-test-7:math2-26","question_number":26,"source_page":50,"answer_page":46,"correct_answer":"B","accepted_answers":["B"],"response_type":"multiple-choice","source_crop":{"x":35.9,"y":109.1,"width":242.4,"height":180}},{"id":"practice-test-7:math2-27","question_number":27,"source_page":50,"answer_page":46,"correct_answer":"14","accepted_answers":["14"],"response_type":"student-produced","source_crop":{"x":314.3,"y":109.1,"width":242.4,"height":135}}]
$ps7_math2$::jsonb) as x(
  id text,
  question_number integer,
  source_page integer,
  answer_page integer,
  correct_answer text,
  accepted_answers jsonb,
  response_type text,
  source_crop jsonb
)
on conflict (id) do update set
  practice_test_id=excluded.practice_test_id,
  subject=excluded.subject,
  module=excluded.module,
  question_number=excluded.question_number,
  source_page=excluded.source_page,
  answer_page=excluded.answer_page,
  correct_answer=excluded.correct_answer,
  accepted_answers=excluded.accepted_answers,
  response_type=excluded.response_type,
  source_crop=excluded.source_crop,
  content_status='verified',
  question_mode='text',
  updated_at=now();
