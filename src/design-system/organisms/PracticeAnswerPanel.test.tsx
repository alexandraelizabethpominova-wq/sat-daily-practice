import {fireEvent,render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import PracticeAnswerPanel from './PracticeAnswerPanel'
import {QUESTION_BANK} from '../../lib/questionBank'

const openResponseQuestion=QUESTION_BANK.find(question=>question.responseType!=='multiple-choice')
if(!openResponseQuestion)throw new Error('Expected an open-response question fixture.')

describe('PracticeAnswerPanel open response keyboard submit',()=>{
  it('submits a non-empty open response when Enter is pressed',()=>{
    const onSubmit=vi.fn()
    render(<PracticeAnswerPanel
      question={openResponseQuestion}
      selected="31"
      submitted={false}
      explanationBytes={null}
      onSelect={()=>undefined}
      onSubmit={onSubmit}
    />)

    fireEvent.keyDown(screen.getByPlaceholderText('Type a number, decimal, or fraction'),{key:'Enter'})
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('does not submit an empty open response when Enter is pressed',()=>{
    const onSubmit=vi.fn()
    render(<PracticeAnswerPanel
      question={openResponseQuestion}
      selected="   "
      submitted={false}
      explanationBytes={null}
      onSelect={()=>undefined}
      onSubmit={onSubmit}
    />)

    fireEvent.keyDown(screen.getByPlaceholderText('Type a number, decimal, or fraction'),{key:'Enter'})
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
