import {describe,expect,it} from 'vitest'
import {reflowProseLines} from './StructuredQuestionLines'

describe('reflowProseLines',()=>{
  it('reconstructs wrapped SAT prose while keeping split answer choices separate',()=>{
    const lines=[
      'Research conducted by planetary scientist Katarina',
      'Miljkovic suggests that the Moon’s surface may not',
      'accurately ________ early impact events. When the',
      'Moon was still forming, its surface was softer, and',
      'asteroid or meteoroid impacts would have left less',
      'of an impression; thus, evidence of early impacts',
      'may no longer be present.',
      'Which choice completes the text with the most',
      'logical and precise word or phrase?',
      'A)',
      'reflect',
      'B)',
      'receive',
      'C)',
      'evaluate',
      'D)',
      'mimic',
    ]

    expect(reflowProseLines(lines)).toEqual([
      'Research conducted by planetary scientist Katarina Miljkovic suggests that the Moon’s surface may not accurately ________ early impact events. When the Moon was still forming, its surface was softer, and asteroid or meteoroid impacts would have left less of an impression; thus, evidence of early impacts may no longer be present.',
      'Which choice completes the text with the most logical and precise word or phrase?',
      'A) reflect',
      'B) receive',
      'C) evaluate',
      'D) mimic',
    ])
  })

  it('keeps wrapped text inside each full answer choice until the next choice starts',()=>{
    expect(reflowProseLines([
      'Which choice best supports the claim?',
      'A) The first answer begins here and',
      'continues on the next extracted line.',
      'B) The second answer stays separate.',
      'C) Third answer.',
      'D) Fourth answer.',
    ])).toEqual([
      'Which choice best supports the claim?',
      'A) The first answer begins here and continues on the next extracted line.',
      'B) The second answer stays separate.',
      'C) Third answer.',
      'D) Fourth answer.',
    ])
  })
})
