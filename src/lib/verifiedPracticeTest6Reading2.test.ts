import {describe,expect,it} from 'vitest'
import {parseReadingQuestion} from '../design-system/molecules/ReadingQuestionLines'
import {PRACTICE_TEST_6_CROPS} from './practiceTest6Data'
import {questionVisualSpec} from './questionVisuals'
import {VERIFIED_PRACTICE_TEST_6_READING2,verifiedPracticeTest6Reading2Content} from './verifiedPracticeTest6Reading2'

describe('Practice Test 6 Reading Module 2 verified content',()=>{
  it('has verified structured content for all 33 questions',()=>{
    expect(Object.keys(VERIFIED_PRACTICE_TEST_6_READING2)).toHaveLength(33)
    for(let number=1;number<=33;number++){
      const content=verifiedPracticeTest6Reading2Content(number)
      expect(content,`Q${number}`).toBeTruthy()
      const parsed=parseReadingQuestion(content.lines)
      expect(parsed.choices.map(choice=>choice.label).join(''),`Q${number} choices`).toBe('ABCD')
      expect(parsed.stem,`Q${number} stem`).not.toBe('')
    }
  })

  it('keeps Q13 as text plus a verified graph region',()=>{
    expect(verifiedPracticeTest6Reading2Content(13).needsVisual).toBe(true)
    expect(questionVisualSpec('practice-test-6:rw2-13')).toEqual({
      afterLine:-1,
      crop:{x:.02,y:.02,width:.46,height:.56},
      exact:true,
    })
    expect(PRACTICE_TEST_6_CROPS.rw2[13]).toEqual({x:35.9,y:109.1,width:546.2,height:610.9})
  })

  it('reconstructs Q15 as a semantic table rather than an image',()=>{
    const content=verifiedPracticeTest6Reading2Content(15)
    expect(content.needsVisual).toBe(false)
    expect(content.lines.filter(line=>line.includes('\t'))).toHaveLength(4)
    expect(content.lines[0]).toBe('Mean Ratings for Patients after 21 Days')
  })

  it('preserves the literary passage separation in Q6',()=>{
    expect(verifiedPracticeTest6Reading2Content(6).lines).toContain('[[SAT_PARAGRAPH_BREAK]]')
  })
})
