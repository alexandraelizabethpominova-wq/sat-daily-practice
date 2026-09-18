import {describe,expect,it} from 'vitest'
import {PRACTICE_TEST_6_CROPS} from './practiceTest6Data'
import {questionVisualSpecs} from './questionVisuals'
import {verifiedPracticeTest6Math1Content} from './verifiedPracticeTest6Math1'

describe('Practice Test 6 Math Module 1 visual parsing',()=>{
  it('keeps Q1 source comparison tightly cropped',()=>{
    expect(PRACTICE_TEST_6_CROPS.math1[1]).toEqual({x:35.9,y:109.1,width:242.4,height:175})
  })

  it('models Q2 as text plus a scatterplot and graphical answer-choice grid',()=>{
    expect(verifiedPracticeTest6Math1Content(2).lines).toEqual([
      'The scatterplot shows the relationship between two variables, $x$ and $y$.',
      'Which of the following graphs shows the most appropriate model for the data?',
    ])
    expect(questionVisualSpecs('practice-test-6:math1-2')).toEqual([
      {afterLine:0,crop:{x:.14,y:.065,width:.40,height:.27},exact:true,kind:'figure'},
      {afterLine:1,crop:{x:.03,y:.46,width:.94,height:.52},exact:true,kind:'choice-grid'},
    ])
  })

  it('keeps Q1-Q10 as valid verified structured fixtures',()=>{
    for(let number=1;number<=10;number++){
      expect(verifiedPracticeTest6Math1Content(number),`Q${number}`).toBeTruthy()
      expect(verifiedPracticeTest6Math1Content(number).lines.length,`Q${number} lines`).toBeGreaterThan(0)
    }
  })
})
