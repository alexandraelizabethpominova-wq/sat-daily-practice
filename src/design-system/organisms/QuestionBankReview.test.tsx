import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import QuestionBankReview from './QuestionBankReview'

describe('QuestionBankReview',()=>{
  it('shows the shared question list even without a local PDF',()=>{
    render(<QuestionBankReview questionsPdf={null}/>)
    expect(screen.getByText('120 questions')).toBeInTheDocument()
    expect(screen.getByRole('button',{name:/Math · Module 1 Question 1/i})).toBeInTheDocument()
  })
})
