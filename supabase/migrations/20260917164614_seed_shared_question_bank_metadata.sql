with modules as (
  select 'rw1'::text module, 'english'::text subject, 33 count,
    array[4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,17,17]::int[] source_pages,
    array[2,3,3,4,4,5,5,6,6,7,7,8,8,9,10,11,11,12,12,12,13,13,13,14,14,15,15,15,16,16,16,17,17]::int[] answer_pages,
    array['B','A','A','C','A','B','D','B','B','D','C','D','A','B','C','A','A','A','A','D','D','D','B','C','B','A','C','D','A','A','D','D','C']::text[] answers
  union all
  select 'rw2','english',33,
    array[18,18,19,19,19,19,20,20,21,21,22,22,23,24,24,24,25,25,25,26,26,26,26,27,27,27,28,28,28,29,29,30,30]::int[],
    array[18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,27,27,28,28,28,29,29,29,30,30,31,31,32,32,32,33,33]::int[],
    array['D','D','B','B','B','B','A','C','C','A','A','B','D','C','C','A','B','D','C','A','B','D','D','A','B','B','A','A','C','C','A','A','B']::text[]
  union all
  select 'math1','math',27,
    array[34,34,34,34,35,35,35,35,35,36,36,36,36,36,37,37,37,37,38,38,38,38,38,39,39,39,39]::int[],
    array[34,34,34,35,35,35,35,35,36,36,36,37,37,37,38,38,38,39,39,39,40,40,40,41,41,42,43]::int[],
    array['B','A','B','D','A','9','10','A','B','D','A','C','1/5','80','D','B','B','A','C','100','361/8','B','D','C','C','D','5']::text[]
  union all
  select 'math2','math',27,
    array[42,42,42,42,43,43,43,43,43,44,44,44,44,44,45,45,45,45,46,46,46,46,47,47,48,48,48]::int[],
    array[44,44,44,45,45,45,45,46,46,46,46,47,48,48,48,48,49,49,50,50,51,51,51,51,52,52,53]::int[],
    array['B','B','C','A','A','15 or -5','50','B','D','A','A','B','3/10','2','A','C','B','D','A','15/17','51','A','C','C','D','B','600']::text[]
), rows as (
  select m.*, gs as question_number,
    m.source_pages[gs] source_page,
    m.answer_pages[gs] answer_page,
    m.answers[gs] correct_answer
  from modules m cross join lateral generate_series(1,m.count) gs
)
insert into public.sat_question_bank(id,subject,module,question_number,source_page,answer_page,correct_answer,accepted_answers,response_type,content_status)
select module||'-'||question_number,
  subject,module,question_number,source_page,answer_page,correct_answer,
  case
    when module='math1' and question_number=6 then '["9"]'::jsonb
    when module='math1' and question_number=7 then '["10"]'::jsonb
    when module='math1' and question_number=13 then '["1/5",".2"]'::jsonb
    when module='math1' and question_number=14 then '["80"]'::jsonb
    when module='math1' and question_number=20 then '["100"]'::jsonb
    when module='math1' and question_number=21 then '["361/8","45.12","45.13"]'::jsonb
    when module='math1' and question_number=27 then '["5"]'::jsonb
    when module='math2' and question_number=6 then '["15","-5"]'::jsonb
    when module='math2' and question_number=7 then '["50"]'::jsonb
    when module='math2' and question_number=13 then '[".3","3/10"]'::jsonb
    when module='math2' and question_number=14 then '["2"]'::jsonb
    when module='math2' and question_number=20 then '["15/17",".8824",".8823"]'::jsonb
    when module='math2' and question_number=21 then '["51"]'::jsonb
    when module='math2' and question_number=27 then '["600"]'::jsonb
    else jsonb_build_array(correct_answer)
  end,
  case when module in ('math1','math2') and question_number in (6,7,13,14,20,21,27) then 'student-produced' else 'multiple-choice' end,
  'metadata'
from rows
on conflict (id) do update set
  subject=excluded.subject,module=excluded.module,question_number=excluded.question_number,
  source_page=excluded.source_page,answer_page=excluded.answer_page,correct_answer=excluded.correct_answer,
  accepted_answers=excluded.accepted_answers,response_type=excluded.response_type,updated_at=now();
