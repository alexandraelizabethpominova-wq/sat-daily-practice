import {describe,expect,it} from 'vitest'
import {QUESTION_BANK} from './questionBank'
import {choosePracticeQuestions,formatDuration,summarizePerformance,summarizeSession} from './practiceGamification'
import type {Attempt,SessionSummary,Settings} from '../types'

const settings:Settings={mode:'math',questionsPerSession:3,showExplanations:true,shuffle:true}

function attempt(questionId:string,correct:boolean,index=0):Attempt{
  const question=QUESTION_BANK.find(item=>item.id===questionId)!
  return {id:`a-${questionId}-${index}`,sessionId:'session',questionId,subject:question.subject,module:question.module,questionNumber:question.number,selectedAnswer:correct?question.correctAnswer:'wrong',correctAnswer:question.correctAnswer,correct,elapsedMs:1000*(index+1),createdAt:new Date(2026,0,index+1).toISOString()}
}

describe('choosePracticeQuestions',()=>{
  it('respects subject mode and configured question count',()=>{
    const chosen=choosePracticeQuestions(settings,[],()=>0)
    expect(chosen).toHaveLength(3)
    expect(chosen.every(question=>question.subject==='math')).toBe(true)
  })

  it('prioritizes unseen questions over already attempted questions',()=>{
    const chosen=choosePracticeQuestions(settings,[attempt('math1-1',false)],()=>0)
    expect(chosen.map(question=>question.id)).not.toContain('math1-1')
  })

  it('prioritizes a weaker question when the pool has been seen',()=>{
    const math=QUESTION_BANK.filter(question=>question.subject==='math')
    const attempts=math.map((question,index)=>attempt(question.id,question.id!=='math1-1',index))
    const chosen=choosePracticeQuestions({...settings,questionsPerSession:1},attempts,()=>0)
    expect(chosen[0].id).toBe('math1-1')
  })

  it('uses recency as a tiebreaker for equally performing questions',()=>{
    const math=QUESTION_BANK.filter(question=>question.subject==='math')
    const attempts=math.map((question,index)=>attempt(question.id,true,index))
    const chosen=choosePracticeQuestions({...settings,questionsPerSession:1},attempts,()=>0)
    expect(chosen[0].id).toBe(math[0].id)
  })
})

describe('practice summaries',()=>{
  const attempts=[attempt('math1-1',true,0),attempt('math1-2',false,1),attempt('math1-1',true,2)]
  const sessions:SessionSummary[]=[{id:'s1',startedAt:'2026-01-01T00:00:00.000Z',endedAt:'2026-01-01T00:01:00.000Z',mode:'math',questionCount:3,attempts}]

  it('preserves main performance metrics while allowing analytics detail',()=>{
    expect(summarizePerformance(attempts,sessions,120)).toMatchObject({accuracy:67,averageMs:2000,sessions:1,questionsSeen:2,totalQuestions:120})
  })

  it('summarizes the current session',()=>{
    expect(summarizeSession(attempts)).toEqual({accuracy:67,averageMs:2000,correct:2,total:3})
  })

  it('formats timing the same way as the original practice UI',()=>{
    expect(formatDuration(42_000)).toBe('42s')
    expect(formatDuration(125_000)).toBe('2m 5s')
  })
})
