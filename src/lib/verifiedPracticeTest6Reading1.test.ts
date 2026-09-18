import {describe,expect,it} from 'vitest'
import {parseReadingQuestion} from '../design-system/molecules/ReadingQuestionLines'
import {PRACTICE_TEST_6_CROPS} from './practiceTest6Data'
import {questionVisualSpec} from './questionVisuals'
import {VERIFIED_PRACTICE_TEST_6_READING1,verifiedPracticeTest6Reading1Content} from './verifiedPracticeTest6Reading1'

describe('Practice Test 6 Reading Module 1 verified content',()=>{
  it('has verified structured content for every question',()=>{
    expect(Object.keys(VERIFIED_PRACTICE_TEST_6_READING1)).toHaveLength(33)
    for(let number=1;number<=33;number++){
      const content=verifiedPracticeTest6Reading1Content(number)
      expect(content,`Q${number}`).toBeTruthy()
      expect(content.lines.length,`Q${number} lines`).toBeGreaterThan(0)
      const parsed=parseReadingQuestion(content.lines)
      expect(parsed.choices.map(choice=>choice.label).join(''),`Q${number} choices`).toBe('ABCD')
      expect(parsed.stem,`Q${number} stem`).not.toBe('')
    }
  })

  it('keeps the car-production table semantic instead of rasterizing it',()=>{
    const lines=verifiedPracticeTest6Reading1Content(11).lines
    expect(lines[0]).toContain('Annual Car Production')
    expect(lines.filter(line=>line.includes('\t'))).toHaveLength(5)
    expect(verifiedPracticeTest6Reading1Content(11).needsVisual).toBe(false)
  })

  it('uses source visuals only for the two graph questions',()=>{
    const visualQuestions=Object.entries(VERIFIED_PRACTICE_TEST_6_READING1)
      .filter(([,content])=>content.needsVisual)
      .map(([number])=>Number(number))
    expect(visualQuestions).toEqual([14,15])
    expect(questionVisualSpec('practice-test-6:rw1-14')).toBeTruthy()
    expect(questionVisualSpec('practice-test-6:rw1-15')).toBeTruthy()
  })

  it('uses a full-width source crop for Q14 because the graph and choices span both columns',()=>{
    expect(PRACTICE_TEST_6_CROPS.rw1[14]).toEqual({x:35.9,y:109.1,width:546.2,height:610.9})
  })
})
