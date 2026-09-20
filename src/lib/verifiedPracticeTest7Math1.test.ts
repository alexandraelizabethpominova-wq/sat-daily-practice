import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {questionVisualSpecs} from './questionVisuals'
import {VERIFIED_PRACTICE_TEST_7_MATH1,verifiedPracticeTest7Math1Content} from './verifiedPracticeTest7Math1'

describe('Practice Test 7 Math Module 1 verified parsing',()=>{
  it('has structured verified fixtures for all 27 questions',()=>{
    expect(Object.keys(VERIFIED_PRACTICE_TEST_7_MATH1)).toHaveLength(27)
    for(let number=1;number<=27;number++){
      const content=verifiedPracticeTest7Math1Content(number)
      expect(content,`Q${number}`).toBeTruthy()
      expect(content.lines.length,`Q${number} lines`).toBeGreaterThan(0)
    }
    const bank=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='math1')
    expect(bank).toHaveLength(27)
    expect(bank.every(question=>question.questionMode==='text'&&question.contentStatus==='verified')).toBe(true)
  })

  it('uses source visuals only for genuinely visual questions',()=>{
    const visualQuestions=Object.entries(VERIFIED_PRACTICE_TEST_7_MATH1)
      .filter(([,content])=>content.needsVisual)
      .map(([number])=>Number(number))
    expect(visualQuestions).toEqual([1,5,8,11,20])
    for(const number of visualQuestions){
      expect(questionVisualSpecs(`practice-test-7:math1-${number}`).length).toBeGreaterThan(0)
    }
  })

  it('keeps visual placement in source reading order',()=>{
    expect(questionVisualSpecs('practice-test-7:math1-1')[0]?.afterLine).toBe(0)
    expect(questionVisualSpecs('practice-test-7:math1-5')[0]?.afterLine).toBe(0)
    expect(questionVisualSpecs('practice-test-7:math1-8')[0]?.afterLine).toBe(-1)
    expect(questionVisualSpecs('practice-test-7:math1-11')[0]?.afterLine).toBe(-1)
    expect(questionVisualSpecs('practice-test-7:math1-20')[0]?.afterLine).toBe(0)
  })

  it('keeps Q24 as a semantic table rather than a raster image',()=>{
    const q24=verifiedPracticeTest7Math1Content(24)
    expect(q24.needsVisual).toBe(false)
    expect(q24.lines.slice(0,4)).toEqual(['x\ty','-2s\t24','-s\t21','s\t15'])
  })

  it('preserves complex math notation in structured form',()=>{
    expect(verifiedPracticeTest7Math1Content(3).lines[0]).toBe('$$|p|+61=65$$')
    expect(verifiedPracticeTest7Math1Content(14).lines[0]).toContain('\\begin{aligned}')
    expect(verifiedPracticeTest7Math1Content(18).lines[0]).toContain('^{t/790}')
    expect(verifiedPracticeTest7Math1Content(19).lines[0]).toBe('$$\\frac{12}{n}-\\frac{2}{t}=-\\frac{2}{w}$$')
    expect(verifiedPracticeTest7Math1Content(27).lines[0]).toBe('$$f(x)=(x-2)(x+15)$$')
  })
})
