import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {questionCropForParts} from './questionCrops'
import {questionVisualSpecs} from './questionVisuals'
import {
  PRACTICE_TEST_7_ANSWER_PAGES,
  PRACTICE_TEST_7_ANSWERS,
  PRACTICE_TEST_7_CROPS,
  PRACTICE_TEST_7_PAGES,
} from './practiceTest7Data'

describe('Practice Test 7 Reading & Writing Module 1 quality import',()=>{
  const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='rw1')

  it('registers all 33 questions with scoped IDs',()=>{
    expect(questions).toHaveLength(33)
    expect(new Set(questions.map(question=>question.id)).size).toBe(33)
    expect(questions.every(question=>question.id===`practice-test-7:rw1-${question.number}`)).toBe(true)
    expect(questions.every(question=>question.subject==='english')).toBe(true)
    expect(questions.every(question=>question.responseType==='multiple-choice')).toBe(true)
  })

  it('matches the verified source, explanation, and scoring mappings',()=>{
    for(const question of questions){
      expect(question.sourcePage).toBe(PRACTICE_TEST_7_PAGES.rw1[question.number])
      expect(question.answerPage).toBe(PRACTICE_TEST_7_ANSWER_PAGES.rw1[question.number])
      expect(question.correctAnswer).toBe(PRACTICE_TEST_7_ANSWERS.rw1[question.number])
      expect(question.acceptedAnswers).toEqual([question.correctAnswer])
      expect(question.contentStatus).toBe('verified')
      expect(question.questionMode).toBe('text')
    }
  })

  it('uses the verified source crop for every question',()=>{
    for(const question of questions){
      const crop=PRACTICE_TEST_7_CROPS.rw1[question.number]
      expect(question.sourceCrop).toEqual(crop)
      expect(questionCropForParts('practice-test-7','rw1',question.number)).toEqual(crop)
      expect(crop.x).toBeGreaterThanOrEqual(0)
      expect(crop.y).toBeGreaterThanOrEqual(0)
      expect(crop.width).toBeGreaterThan(0)
      expect(crop.height).toBeGreaterThan(0)
      expect(crop.x+crop.width).toBeLessThanOrEqual(612)
      expect(crop.y+crop.height).toBeLessThanOrEqual(735)
    }
  })

  it('preserves source visuals only for the three graph questions',()=>{
    const visualQuestions=questions.filter(question=>questionVisualSpecs(question.id).length>0).map(question=>question.number)
    expect(visualQuestions).toEqual([12,15,16])
    for(const number of visualQuestions){
      const visual=questionVisualSpecs(`practice-test-7:rw1-${number}`)[0]
      expect(visual.kind).toBe('figure')
      expect(visual.afterLine).toBe(-1)
    }
  })

  it('keeps the full-width two-column source questions explicit',()=>{
    for(const number of [13,14,15,16]){
      expect(PRACTICE_TEST_7_CROPS.rw1[number].width).toBeGreaterThan(500)
    }
    expect(PRACTICE_TEST_7_CROPS.rw1[32].height).toBe(521)
    expect(PRACTICE_TEST_7_CROPS.rw1[33].height).toBe(521)
  })
})
