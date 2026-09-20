import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {questionCropForParts} from './questionCrops'
import {questionVisualSpecs} from './questionVisuals'
import {readingTableSpec} from './readingTables'
import {
  PRACTICE_TEST_7_ANSWER_PAGES,
  PRACTICE_TEST_7_ANSWERS,
  PRACTICE_TEST_7_CROPS,
  PRACTICE_TEST_7_PAGES,
} from './practiceTest7Data'

describe('Practice Test 7 Reading & Writing Module 2 quality import',()=>{
  const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='rw2')

  it('registers all 33 questions with scoped IDs',()=>{
    expect(questions).toHaveLength(33)
    expect(new Set(questions.map(question=>question.id)).size).toBe(33)
    expect(questions.every(question=>question.id===`practice-test-7:rw2-${question.number}`)).toBe(true)
    expect(questions.every(question=>question.subject==='english')).toBe(true)
    expect(questions.every(question=>question.responseType==='multiple-choice')).toBe(true)
  })

  it('matches verified source, explanation, and scoring mappings',()=>{
    for(const question of questions){
      expect(question.sourcePage).toBe(PRACTICE_TEST_7_PAGES.rw2[question.number])
      expect(question.answerPage).toBe(PRACTICE_TEST_7_ANSWER_PAGES.rw2[question.number])
      expect(question.correctAnswer).toBe(PRACTICE_TEST_7_ANSWERS.rw2[question.number])
      expect(question.acceptedAnswers).toEqual([question.correctAnswer])
      expect(question.contentStatus).toBe('verified')
      expect(question.questionMode).toBe('text')
    }
  })

  it('routes every question through its verified Practice Test 7 source crop',()=>{
    for(const question of questions){
      const crop=PRACTICE_TEST_7_CROPS.rw2[question.number]
      expect(question.sourceCrop).toEqual(crop)
      expect(questionCropForParts('practice-test-7','rw2',question.number)).toEqual(crop)
      expect(crop.x).toBeGreaterThanOrEqual(0)
      expect(crop.y).toBeGreaterThanOrEqual(0)
      expect(crop.width).toBeGreaterThan(0)
      expect(crop.height).toBeGreaterThan(0)
      expect(crop.x+crop.width).toBeLessThanOrEqual(612)
      expect(crop.y+crop.height).toBeLessThanOrEqual(720)
    }
  })

  it('keeps Q12 and Q13 as semantic tables, not raster figures',()=>{
    const q12=readingTableSpec('practice-test-7:rw2-12')
    const q13=readingTableSpec('practice-test-7:rw2-13')
    expect(q12?.headers).toEqual(['Highest average surface temperature (Fahrenheit)','Percentage of bus stops with shaded shelter'])
    expect(q12?.rows).toHaveLength(5)
    expect(q13?.headers).toEqual(['Country','Total area (square miles)','Population'])
    expect(q13?.rows).toEqual([
      ['Kuwait','6,880','4,268,873'],
      ['Bahrain','304','1,472,233'],
      ['Qatar','4,471','2,695,122'],
    ])
    expect(questionVisualSpecs('practice-test-7:rw2-12')).toEqual([])
    expect(questionVisualSpecs('practice-test-7:rw2-13')).toEqual([])
  })

  it('uses no raster visual fallbacks in the module',()=>{
    expect(questions.flatMap(question=>questionVisualSpecs(question.id))).toHaveLength(0)
  })

  it('keeps the final questions clear of the module STOP area',()=>{
    expect(PRACTICE_TEST_7_CROPS.rw2[32].height).toBe(521)
    expect(PRACTICE_TEST_7_CROPS.rw2[33].height).toBe(521)
    expect(PRACTICE_TEST_7_CROPS.rw2[32].y+PRACTICE_TEST_7_CROPS.rw2[32].height).toBeLessThan(640)
    expect(PRACTICE_TEST_7_CROPS.rw2[33].y+PRACTICE_TEST_7_CROPS.rw2[33].height).toBeLessThan(640)
  })
})
