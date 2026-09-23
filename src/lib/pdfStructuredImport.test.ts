import {describe,expect,it} from 'vitest'
import {questionExtractionCrop} from './pdfStructuredImport'
import type {PracticeQuestion} from '../types'

function makeQuestion(overrides:Partial<PracticeQuestion>={}):PracticeQuestion{
  return{
    id:'practice-test-6:math2-25',
    practiceTestId:'practice-test-6',
    subject:'math',
    module:'math2',
    number:25,
    sourcePage:49,
    answerPage:45,
    correctAnswer:'C',
    acceptedAnswers:['C'],
    responseType:'multiple-choice',
    sourceCrop:{x:332.3,y:355.3,width:242.4,height:364.7},
    contentStatus:'verified',
    questionMode:'image-fallback',
    ...overrides,
  }
}

describe('questionExtractionCrop',()=>{
  it('prefers the verified source crop carried by the question metadata',()=>{
    const question=makeQuestion()
    expect(questionExtractionCrop(question)).toEqual(question.sourceCrop)
  })

  it('falls back to legacy crop routing when sourceCrop is absent',()=>{
    const question=makeQuestion({
      id:'practice-test-4:math2-25',
      practiceTestId:'practice-test-4',
      sourceCrop:null,
    })
    expect(questionExtractionCrop(question)).toBeTruthy()
  })
})
