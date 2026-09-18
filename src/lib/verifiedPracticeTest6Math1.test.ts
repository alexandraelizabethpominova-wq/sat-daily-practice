import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {PRACTICE_TEST_6_CROPS} from './practiceTest6Data'
import {questionVisualSpecs} from './questionVisuals'
import {VERIFIED_PRACTICE_TEST_6_MATH1,verifiedPracticeTest6Math1Content} from './verifiedPracticeTest6Math1'

describe('Practice Test 6 Math Module 1 verified parsing',()=>{
  it('has structured verified fixtures for all 27 questions',()=>{
    expect(Object.keys(VERIFIED_PRACTICE_TEST_6_MATH1)).toHaveLength(27)
    for(let number=1;number<=27;number++){
      const content=verifiedPracticeTest6Math1Content(number)
      expect(content,`Q${number}`).toBeTruthy()
      expect(content.lines.length,`Q${number} lines`).toBeGreaterThan(0)
    }
    const bank=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-6'&&question.module==='math1')
    expect(bank).toHaveLength(27)
    expect(bank.every(question=>question.questionMode==='text'&&question.contentStatus==='verified')).toBe(true)
  })

  it('keeps Q1 source comparison tightly cropped',()=>{
    expect(PRACTICE_TEST_6_CROPS.math1[1]).toEqual({x:35.9,y:109.1,width:242.4,height:175})
  })

  it('models Q2 as text plus a scatterplot and graphical answer-choice grid',()=>{
    expect(verifiedPracticeTest6Math1Content(2).lines).toEqual([
      'The scatterplot shows the relationship between two variables, $x$ and $y$.',
      'Which of the following graphs shows the most appropriate model for the data?',
    ])
    expect(questionVisualSpecs('practice-test-6:math1-2')).toEqual([
      {afterLine:0,crop:{x:.17,y:.09,width:.34,height:.27},exact:true,kind:'figure'},
      {afterLine:1,crop:{x:.02,y:.40,width:.96,height:.60},exact:true,kind:'choice-grid'},
    ])
  })

  it('uses source visuals only for genuinely visual questions',()=>{
    const visualQuestions=Object.entries(VERIFIED_PRACTICE_TEST_6_MATH1)
      .filter(([,content])=>content.needsVisual)
      .map(([number])=>Number(number))
    expect(visualQuestions).toEqual([2,5,14,15,21,23,24])
    for(const number of visualQuestions)expect(questionVisualSpecs(`practice-test-6:math1-${number}`).length).toBeGreaterThan(0)
  })

  it('keeps table questions semantic',()=>{
    expect(verifiedPracticeTest6Math1Content(11).needsVisual).toBe(false)
    expect(verifiedPracticeTest6Math1Content(11).lines.filter(line=>line.includes('\t')).length).toBe(16)
    expect(verifiedPracticeTest6Math1Content(19).lines.filter(line=>line.includes('\t')).length).toBe(6)
    expect(verifiedPracticeTest6Math1Content(26).lines.filter(line=>line.includes('\t')).length).toBe(4)
  })

  it('keeps visual crops free of duplicated question text',()=>{
    expect(questionVisualSpecs('practice-test-6:math1-14')).toEqual([
      {afterLine:-1,crop:{x:.10,y:.03,width:.82,height:.36},exact:true,kind:'figure'},
    ])
    expect(questionVisualSpecs('practice-test-6:math1-15')).toEqual([
      {afterLine:-1,crop:{x:.06,y:.07,width:.88,height:.43},exact:true,kind:'figure'},
    ])
    expect(questionVisualSpecs('practice-test-6:math1-21')).toEqual([
      {afterLine:-1,crop:{x:.05,y:.08,width:.90,height:.58},exact:true,kind:'figure'},
    ])
    expect(questionVisualSpecs('practice-test-6:math1-23')).toEqual([
      {afterLine:-1,crop:{x:.08,y:.02,width:.84,height:.24},exact:true,kind:'figure'},
    ])
    expect(questionVisualSpecs('practice-test-6:math1-24')).toEqual([
      {afterLine:-1,crop:{x:.08,y:.02,width:.84,height:.28},exact:true,kind:'figure'},
    ])
  })
})
