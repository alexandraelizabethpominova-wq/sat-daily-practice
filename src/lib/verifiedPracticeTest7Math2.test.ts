import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {questionVisualSpecs} from './questionVisuals'
import {VERIFIED_PRACTICE_TEST_7_MATH2,verifiedPracticeTest7Math2Content} from './verifiedPracticeTest7Math2'

describe('Practice Test 7 Math Module 2 verified parsing',()=>{
  it('has structured verified fixtures for all 27 questions',()=>{
    expect(Object.keys(VERIFIED_PRACTICE_TEST_7_MATH2)).toHaveLength(27)
    for(let number=1;number<=27;number++){
      const content=verifiedPracticeTest7Math2Content(number)
      expect(content,`Q${number}`).toBeTruthy()
      expect(content.lines.length,`Q${number} lines`).toBeGreaterThan(0)
    }
    const bank=QUESTION_BANK.filter(question=>question.practiceTestId==='practice-test-7'&&question.module==='math2')
    expect(bank).toHaveLength(27)
    expect(bank.every(question=>question.questionMode==='text'&&question.contentStatus==='verified')).toBe(true)
  })

  it('uses source visuals only for the two genuine graph questions',()=>{
    const visualQuestions=Object.entries(VERIFIED_PRACTICE_TEST_7_MATH2)
      .filter(([,content])=>content.needsVisual)
      .map(([number])=>Number(number))
    expect(visualQuestions).toEqual([3,12])
    for(const number of visualQuestions){
      expect(questionVisualSpecs(`practice-test-7:math2-${number}`).length).toBeGreaterThan(0)
    }
  })

  it('keeps graph placement in source reading order',()=>{
    expect(questionVisualSpecs('practice-test-7:math2-3')[0]?.afterLine).toBe(-1)
    expect(questionVisualSpecs('practice-test-7:math2-12')[0]?.afterLine).toBe(0)
  })

  it('keeps Q16 and Q22 tables semantic rather than raster images',()=>{
    const q16=verifiedPracticeTest7Math2Content(16)
    const q22=verifiedPracticeTest7Math2Content(22)
    expect(q16.needsVisual).toBe(false)
    expect(q16.lines).toContain('x\ty')
    expect(q22.needsVisual).toBe(false)
    expect(q22.lines.slice(0,4)).toEqual(['x\tf(x)','-4\t0','-19/5\t1','-18/5\t2'])
  })

  it('preserves representative complex math notation',()=>{
    expect(verifiedPracticeTest7Math2Content(7).lines[0]).toContain('\\frac{1}{4}')
    expect(verifiedPracticeTest7Math2Content(17).lines[0]).toContain('h^{15}q^7')
    expect(verifiedPracticeTest7Math2Content(18).lines[0]).toContain('\\begin{aligned}')
    expect(verifiedPracticeTest7Math2Content(20).lines[1]).toContain('\\sqrt{k}')
    expect(verifiedPracticeTest7Math2Content(27).lines[0]).toContain('x^2+8x+k')
  })
})
