import {fireEvent,render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import QuestionStatsTable from './QuestionStatsTable'
import type {QuestionPerformance} from '../../lib/performanceAnalytics'

vi.mock('./QuestionContent',()=>({default:({question}:{question:{id:string}})=><div>Rendered question {question.id}</div>}))
vi.mock('../../components/SourceSlice',()=>({default:({pdfKey,questionNumber,showZoomControls}:{pdfKey:string;questionNumber:number;showZoomControls?:boolean})=><div>Source {pdfKey} Q{questionNumber} zoom {String(Boolean(showZoomControls))}</div>}))

describe('QuestionStatsTable review drawer',()=>{
  it('opens a drawer with the question and original explanation source',()=>{
    const question:QuestionPerformance={
      questionId:'rw2-8',subject:'english',module:'rw2',questionNumber:8,attempts:2,correct:1,successRate:50,averageMs:42000,lastAttemptAt:'2026-09-18T12:00:00.000Z',
    }
    render(<QuestionStatsTable questions={[question]} answersPdf={new ArrayBuffer(8)}/>)
    fireEvent.click(screen.getByRole('button',{name:'Review Reading and Writing question 8'}))
    expect(screen.getByText('Question review')).toBeInTheDocument()
    expect(screen.getByText('Rendered question rw2-8')).toBeInTheDocument()
    expect(screen.getByText('Original explanation')).toBeInTheDocument()
    expect(screen.getByText('Source answers Q8 zoom true')).toBeInTheDocument()
    expect(screen.queryByText(/Rendered explanation/)).not.toBeInTheDocument()
  })
})
