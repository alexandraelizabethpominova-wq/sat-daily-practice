import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {
  PRACTICE_TEST_7_ACCEPTED,
  PRACTICE_TEST_7_ANSWER_PAGES,
  PRACTICE_TEST_7_ANSWERS,
  PRACTICE_TEST_7_CROPS,
  PRACTICE_TEST_7_PAGES,
} from './practiceTest7Data'

const studentProduced=new Set([6,7,13,14,20,21,27])

describe('Practice Test 7 Math Module 1 quality import',()=>{
  const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='math1')

  it('registers all 27 Math Module 1 questions with scoped IDs',()=>{
    expect(questions).toHaveLength(27)
    expect(new Set(questions.map(question=>question.id)).size).toBe(27)
    expect(questions.every(question=>question.id===`practice-test-7:math1-${question.number}`)).toBe(true)
    expect(questions.every(question=>question.subject==='math')).toBe(true)
  })

  it('matches verified source page, explanation page, answer, and response metadata',()=>{
    for(const question of questions){
      expect(question.sourcePage).toBe(PRACTICE_TEST_7_PAGES.math1[question.number])
      expect(question.answerPage).toBe(PRACTICE_TEST_7_ANSWER_PAGES.math1[question.number])
      expect(question.correctAnswer).toBe(PRACTICE_TEST_7_ANSWERS.math1[question.number])
      expect(question.responseType).toBe(studentProduced.has(question.number)?'student-produced':'multiple-choice')
      expect(question.acceptedAnswers).toEqual(PRACTICE_TEST_7_ACCEPTED.math1?.[question.number]??[question.correctAnswer])
    }
  })

  it('uses verified source crops and structured text mode',()=>{
    for(const question of questions){
      const crop=PRACTICE_TEST_7_CROPS.math1[question.number]
      expect(question.sourceCrop).toEqual(crop)
      expect(question.contentStatus).toBe('verified')
      expect(question.questionMode).toBe('text')
      expect(crop.x).toBeGreaterThanOrEqual(0)
      expect(crop.y).toBeGreaterThanOrEqual(0)
      expect(crop.width).toBeGreaterThan(0)
      expect(crop.height).toBeGreaterThan(0)
      expect(crop.x+crop.width).toBeLessThanOrEqual(612)
      expect(crop.y+crop.height).toBeLessThanOrEqual(720)
    }
  })

  it('preserves every official student-produced accepted form',()=>{
    expect(PRACTICE_TEST_7_ACCEPTED.math1?.[7]).toEqual(['14','-5','-4'])
    expect(PRACTICE_TEST_7_ACCEPTED.math1?.[27]).toEqual(['-13/2','-6.5'])
  })
})


describe('Practice Test 7 Math Module 2 quality import',()=>{
  const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='math2')

  it('registers all 27 Math Module 2 questions with scoped IDs',()=>{
    expect(questions).toHaveLength(27)
    expect(new Set(questions.map(question=>question.id)).size).toBe(27)
    expect(questions.every(question=>question.id===`practice-test-7:math2-${question.number}`)).toBe(true)
    expect(questions.every(question=>question.subject==='math')).toBe(true)
  })

  it('matches verified source page, explanation page, answer, and response metadata',()=>{
    for(const question of questions){
      expect(question.sourcePage).toBe(PRACTICE_TEST_7_PAGES.math2[question.number])
      expect(question.answerPage).toBe(PRACTICE_TEST_7_ANSWER_PAGES.math2[question.number])
      expect(question.correctAnswer).toBe(PRACTICE_TEST_7_ANSWERS.math2[question.number])
      expect(question.responseType).toBe(studentProduced.has(question.number)?'student-produced':'multiple-choice')
      expect(question.acceptedAnswers).toEqual(PRACTICE_TEST_7_ACCEPTED.math2?.[question.number]??[question.correctAnswer])
    }
  })

  it('uses individually verified source crops without cross-question spillover',()=>{
    for(const question of questions){
      const crop=PRACTICE_TEST_7_CROPS.math2[question.number]
      expect(question.sourceCrop).toEqual(crop)
      expect(question.contentStatus).toBe('verified')
      expect(question.questionMode).toBe('text')
      expect(crop.x).toBeGreaterThanOrEqual(0)
      expect(crop.y).toBeGreaterThanOrEqual(0)
      expect(crop.width).toBeGreaterThan(0)
      expect(crop.height).toBeGreaterThan(0)
      expect(crop.x+crop.width).toBeLessThanOrEqual(612)
      expect(crop.y+crop.height).toBeLessThanOrEqual(720)
    }
  })

  it('preserves every official student-produced accepted form',()=>{
    expect(PRACTICE_TEST_7_ACCEPTED.math2?.[7]).toEqual(['11/4','2.75'])
    expect(PRACTICE_TEST_7_ACCEPTED.math2?.[13]).toEqual(['4.41','441/100'])
    expect(PRACTICE_TEST_7_ACCEPTED.math2?.[27]).toEqual(['14'])
  })
})
