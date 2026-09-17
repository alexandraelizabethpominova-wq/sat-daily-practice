import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import AnswerFeedback from './AnswerFeedback'

describe('AnswerFeedback',()=>{
  it('renders correct feedback with answer and timing',()=>{
    render(<AnswerFeedback correct acceptedAnswer="3/10 or .3" elapsedLabel="18s"/>)
    expect(screen.getByRole('status')).toHaveTextContent('Correct')
    expect(screen.getByRole('status')).toHaveTextContent('3/10 or .3')
    expect(screen.getByRole('status')).toHaveTextContent('18s')
  })

  it('renders review feedback for an incorrect response',()=>{
    render(<AnswerFeedback correct={false} acceptedAnswer="B" elapsedLabel="1m 2s"/>)
    expect(screen.getByRole('status')).toHaveTextContent('Not quite')
    expect(screen.getByRole('status')).toHaveTextContent('B')
  })
})
