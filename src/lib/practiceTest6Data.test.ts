import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {
  PRACTICE_TEST_6_ACCEPTED,
  PRACTICE_TEST_6_ANSWER_PAGES,
  PRACTICE_TEST_6_ANSWERS,
  PRACTICE_TEST_6_CROPS,
  PRACTICE_TEST_6_PAGES,
} from './practiceTest6Data'

const expectedCounts={rw1:33,rw2:33,math1:27,math2:27} as const
const studentProduced=new Set(['math1-6','math1-7','math1-13','math1-14','math1-20','math1-21','math1-27','math2-6','math2-7','math2-13','math2-14','math2-20','math2-21','math2-27'])

describe('Practice Test 6 quality import',()=>{
  const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-6')

  it('registers all 120 questions with practice-test-scoped IDs',()=>{
    expect(questions).toHaveLength(120)
    expect(new Set(questions.map(question=>question.id)).size).toBe(120)
    for(const [module,count] of Object.entries(expectedCounts)){
      expect(questions.filter(question=>question.module===module)).toHaveLength(count)
    }
    expect(questions.every(question=>question.id===`practice-test-6:${question.module}-${question.number}`)).toBe(true)
  })

  it('matches the verified page, explanation, answer, and response metadata',()=>{
    for(const question of questions){
      expect(question.sourcePage).toBe(PRACTICE_TEST_6_PAGES[question.module][question.number])
      expect(question.answerPage).toBe(PRACTICE_TEST_6_ANSWER_PAGES[question.module][question.number])
      expect(question.correctAnswer).toBe(PRACTICE_TEST_6_ANSWERS[question.module][question.number])
      const key=`${question.module}-${question.number}`
      expect(question.responseType).toBe(studentProduced.has(key)?'student-produced':'multiple-choice')
      expect(question.acceptedAnswers).toEqual(PRACTICE_TEST_6_ACCEPTED[question.module]?.[question.number]??[question.correctAnswer])
    }
  })

  it('uses verified source-backed crops without cross-test fallback',()=>{
    for(const question of questions){
      const crop=PRACTICE_TEST_6_CROPS[question.module][question.number]
      expect(question.sourceCrop).toEqual(crop)
      expect(question.contentStatus).toBe('verified')
      expect(question.questionMode).toBe('image-fallback')
      expect(crop.x).toBeGreaterThanOrEqual(0)
      expect(crop.y).toBeGreaterThanOrEqual(0)
      expect(crop.width).toBeGreaterThan(0)
      expect(crop.height).toBeGreaterThan(0)
      expect(crop.x+crop.width).toBeLessThanOrEqual(612)
      expect(crop.y+crop.height).toBeLessThanOrEqual(720)
    }
  })

  it('keeps all official student-produced accepted forms',()=>{
    expect(PRACTICE_TEST_6_ACCEPTED.math1?.[13]).toEqual(['.5','1/2'])
    expect(PRACTICE_TEST_6_ACCEPTED.math1?.[14]).toEqual(['7.5','15/2'])
    expect(PRACTICE_TEST_6_ACCEPTED.math1?.[20]).toEqual(['189/5','37.8'])
    expect(PRACTICE_TEST_6_ACCEPTED.math2?.[20]).toEqual(['.2916','.2917','7/24'])
  })
})
