import {fireEvent,render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import QuestionStatsTable from './QuestionStatsTable'
import type {QuestionPerformance} from '../../lib/performanceAnalytics'

vi.mock('./QuestionContent',()=>({default:({question}:{question:{id:string}})=><div>Rendered question {question.id}</div>}))
vi.mock('./ExplanationContent',()=>({default:({question}:{question:{id:string}})=><div>Rendered explanation {question.id}</div>}))

describe('QuestionStatsTable review drawer',()=>{
  it('opens a drawer with the question and explanation from a stat row',()=>{
    const question:QuestionPerformance={
      questionId:'rw2-8',subject:'english',module:'rw2',questionNumber:8,attempts:2,correct:1,successRate:50,averageMs:42000,lastAttemptAt:'2026-09-18T12:00:00.000Z',
    }
    render(<QuestionStatsTable questions={[question]}/>)
    fireEvent.click(screen.getByRole('button',{name:'Review Reading and Writing question 8'}))
    expect(screen.getByText('Question review')).toBeInTheDocument()
    expect(screen.getByText('Rendered question rw2-8')).toBeInTheDocument()
    expect(screen.getByText('Rendered explanation rw2-8')).toBeInTheDocument()
  })
})
