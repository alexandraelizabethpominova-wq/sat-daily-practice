import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {questionCropForParts} from './questionCrops'
import {questionVisualSpec} from './questionVisuals'
import {verifiedPracticeTest5Math1Content} from './verifiedPracticeTest5Math1'

describe('Practice Test 5 Math Module 1 verified content',()=>{
  it('has an explicit verified display definition for every question',()=>{
    for(let number=1;number<=27;number++){
      expect(verifiedPracticeTest5Math1Content(number),`Q${number}`).toBeTruthy()
      expect(questionCropForParts('practice-test-5','math1',number),`Q${number} crop`).toBeTruthy()
    }
  })

  it('uses structured source visuals only where required',()=>{
    expect([1,3,6,8,20].map(number=>Boolean(questionVisualSpec(`practice-test-5:math1-${number}`)))).toEqual([true,true,true,true,true])
    expect(verifiedPracticeTest5Math1Content(16)?.imageFallback).toBe(true)
  })

  it('does not expose Practice Test 4 crop geometry to unverified Practice Test 5 modules',()=>{
    expect(questionCropForParts('practice-test-5','math2',1)).toBeUndefined()
    expect(questionCropForParts('practice-test-6','math1',1)).toBeUndefined()
    expect(questionCropForParts('practice-test-4','math1',1)).toBeTruthy()
  })

  it('contains the PS5 Q1 wording and not the PS4 Q1 wording',()=>{
    const text=verifiedPracticeTest5Math1Content(1)?.lines.join(' ')??''
    expect(text).toContain('system of a linear equation and a nonlinear equation')
    expect(text).not.toContain('after-school activities')
  })

  it('keeps all PS5 Math Module 1 question IDs scoped to Practice Test 5',()=>{
    const questions=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-5'&&question.module==='math1')
    expect(questions).toHaveLength(27)
    expect(questions.every(question=>question.id===`practice-test-5:math1-${question.number}`)).toBe(true)
  })
})
