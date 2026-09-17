import {describe,expect,it} from 'vitest'
import {answerLabel,matchesAnswer} from './answerCompare'
import {QUESTION_BANK} from './questionBank'

const question=(id:string)=>QUESTION_BANK.find(item=>item.id===id)!

describe('matchesAnswer',()=>{
  it('checks multiple-choice responses case-insensitively',()=>{
    expect(matchesAnswer(question('math1-1'),'b')).toBe(true)
    expect(matchesAnswer(question('math1-1'),' A ')).toBe(false)
  })

  it('accepts equivalent fraction and decimal grid-in answers',()=>{
    expect(matchesAnswer(question('math1-13'),'1/5')).toBe(true)
    expect(matchesAnswer(question('math1-13'),'0.2')).toBe(true)
    expect(matchesAnswer(question('math1-13'),'2/10')).toBe(true)
  })

  it('accepts every official alternative for questions with multiple answers',()=>{
    expect(matchesAnswer(question('math2-6'),'15')).toBe(true)
    expect(matchesAnswer(question('math2-6'),'-5')).toBe(true)
    expect(matchesAnswer(question('math2-6'),'5')).toBe(false)
  })

  it('normalizes minus signs and formatting safely',()=>{
    expect(matchesAnswer(question('math2-6'),'−5')).toBe(true)
    expect(matchesAnswer(question('math1-20'),' 100 ')).toBe(true)
  })

  it('shows all accepted answers in review feedback',()=>{
    expect(answerLabel(question('math2-6'))).toBe('15 or -5')
  })
})
