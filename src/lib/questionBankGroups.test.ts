import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {groupQuestionsByModule} from './questionBankGroups'

describe('groupQuestionsByModule',()=>{
  it('groups questions once by module in SAT module order',()=>{
    const sample=QUESTION_BANK.filter(question=>
      (question.module==='rw1'&&question.number<=2)||
      (question.module==='math1'&&question.number<=2)||
      (question.module==='math2'&&question.number===1)
    )

    const groups=groupQuestionsByModule(sample)

    expect(groups.map(group=>group.module)).toEqual(['rw1','math1','math2'])
    expect(groups.map(group=>group.items.map(question=>question.id))).toEqual([
      ['rw1-1','rw1-2'],
      ['math1-1','math1-2'],
      ['math2-1'],
    ])
  })
})
