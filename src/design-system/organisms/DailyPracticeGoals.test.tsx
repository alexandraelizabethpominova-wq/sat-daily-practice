import {render,screen} from '@testing-library/react'
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest'
import DailyPracticeGoals from './DailyPracticeGoals'
import type {Attempt,SessionSummary} from '../../types'

function attempt(id:string,questionId:string,createdAt:string):Attempt{
  return {
    id,
    sessionId:`s-${id}`,
    questionId,
    practiceTestId:'practice-test-4',
    subject:'math',
    module:'math1',
    questionNumber:1,
    selectedAnswer:'A',
    correctAnswer:'A',
    correct:true,
    elapsedMs:60_000,
    createdAt,
  }
}

function session(id:string,startedAt:string,endedAt:string):SessionSummary{
  return {id,startedAt,endedAt,mode:'math',questionCount:1,attempts:[]}
}

describe('DailyPracticeGoals weekly streak',()=>{
  beforeEach(()=>{
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026,8,29,12,0,0))
  })

  afterEach(()=>vi.useRealTimers())

  it('counts practice from Monday and does not carry Sunday into the new week',()=>{
    const attempts=[
      attempt('sun','q-sun','2026-09-27T16:00:00.000Z'),
      attempt('mon','q-mon','2026-09-28T16:00:00.000Z'),
      attempt('tue','q-tue','2026-09-29T16:00:00.000Z'),
    ]
    const sessions=[
      session('s-sun','2026-09-27T16:00:00.000Z','2026-09-27T16:05:00.000Z'),
      session('s-mon','2026-09-28T16:00:00.000Z','2026-09-28T16:05:00.000Z'),
      session('s-tue','2026-09-29T16:00:00.000Z','2026-09-29T16:05:00.000Z'),
    ]

    render(
      <DailyPracticeGoals
        attempts={attempts}
        sessions={sessions}
        dailyQuestions={20}
        dailyMinutes={20}
        failedQuestionCount={0}
      />,
    )

    expect(screen.getByRole('heading',{name:'2 day streak'})).toBeInTheDocument()
    expect(screen.getByText('2 items completed · 2 minutes learned')).toBeInTheDocument()
  })
})
