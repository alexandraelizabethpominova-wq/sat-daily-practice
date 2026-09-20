import {render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import QuestionBankReview from './QuestionBankReview'

vi.mock('../../lib/sharedQuestionBank',()=>({
  loadSharedQuestionBank:vi.fn().mockResolvedValue(null),
  mergeQuestionBanks:(bundled:unknown[])=>bundled,
}))

vi.mock('../molecules/QuestionSourceReview',()=>({
  default:()=> <div data-testid="question-source-review"/>,
}))

vi.mock('../molecules/ParsingIssueReporter',()=>({
  default:()=> <div data-testid="parsing-issue-reporter"/>,
}))

describe('QuestionBankReview layout',()=>{
  it('keeps practice-test and module dropdown filters instead of overview tabs',()=>{
    render(<QuestionBankReview questionsPdf={null}/>)

    expect(screen.getByLabelText('Practice test')).toBeInTheDocument()
    expect(screen.getByLabelText('Module')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Find question')).toBeInTheDocument()

    expect(screen.queryByText('Module overview')).not.toBeInTheDocument()
    expect(screen.queryByRole('button',{name:'All tests'})).not.toBeInTheDocument()
    expect(screen.queryByText('Shared Question Bank')).not.toBeInTheDocument()
  })
})
