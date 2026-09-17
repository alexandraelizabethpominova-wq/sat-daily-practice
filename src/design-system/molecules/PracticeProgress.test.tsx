import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import PracticeProgress from './PracticeProgress'

describe('PracticeProgress',()=>{
  it('shows the current question and an accessible progress indicator',()=>{
    render(<PracticeProgress label="Math" current={2} total={10}/>)
    expect(screen.getByText('Math')).toBeInTheDocument()
    expect(screen.getByText('Question 2 of 10')).toBeInTheDocument()
    expect(screen.getByRole('progressbar',{name:'Math progress'})).toHaveAttribute('aria-valuenow','20')
  })
})
