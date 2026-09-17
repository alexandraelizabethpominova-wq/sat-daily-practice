import {describe,expect,it} from 'vitest'
import {buildPerformanceAnalytics,estimateSectionPracticeScore} from './performanceAnalytics'
import type {Attempt,SessionSummary} from '../types'

const makeAttempt=(id:string,sessionId:string,questionId:string,subject:Attempt['subject'],module:Attempt['module'],questionNumber:number,correct:boolean,elapsedMs:number,createdAt:string):Attempt=>({
  id,sessionId,questionId,subject,module,questionNumber,selectedAnswer:correct?'A':'B',correctAnswer:'A',correct,elapsedMs,createdAt,
})

const attempts:Attempt[]=[
  makeAttempt('a1','s1','rw1-1','english','rw1',1,true,10000,'2026-09-17T12:00:01.000Z'),
  makeAttempt('a2','s1','rw1-2','english','rw1',2,true,20000,'2026-09-17T12:00:02.000Z'),
  makeAttempt('a3','s1','rw1-3','english','rw1',3,false,30000,'2026-09-17T12:00:03.000Z'),
  makeAttempt('a4','s1','math1-1','math','math1',1,false,40000,'2026-09-17T12:00:04.000Z'),
  makeAttempt('a5','s1','math1-2','math','math1',2,false,50000,'2026-09-17T12:00:05.000Z'),
  makeAttempt('a6','s1','math1-3','math','math1',3,true,60000,'2026-09-17T12:00:06.000Z'),
  makeAttempt('a7','s2','rw1-1','english','rw1',1,true,12000,'2026-09-18T12:00:01.000Z'),
  makeAttempt('a8','s2','rw1-2','english','rw1',2,true,14000,'2026-09-18T12:00:02.000Z'),
  makeAttempt('a9','s2','rw1-3','english','rw1',3,true,16000,'2026-09-18T12:00:03.000Z'),
  makeAttempt('a10','s2','math1-1','math','math1',1,true,20000,'2026-09-18T12:00:04.000Z'),
  makeAttempt('a11','s2','math1-2','math','math1',2,true,22000,'2026-09-18T12:00:05.000Z'),
  makeAttempt('a12','s2','math1-3','math','math1',3,true,24000,'2026-09-18T12:00:06.000Z'),
]

const sessions:SessionSummary[]=[
  {id:'s1',startedAt:'2026-09-17T12:00:00.000Z',endedAt:'2026-09-17T12:05:00.000Z',mode:'both',questionCount:6,attempts:attempts.slice(0,6)},
  {id:'s2',startedAt:'2026-09-18T12:00:00.000Z',endedAt:'2026-09-18T12:05:00.000Z',mode:'both',questionCount:6,attempts:attempts.slice(6)},
]

describe('performance analytics',()=>{
  it('aggregates attempts per question with success rate and response time',()=>{
    const analytics=buildPerformanceAnalytics(attempts,sessions,98)
    const rw1=analytics.questions.find(question=>question.questionId==='rw1-1')
    expect(rw1).toMatchObject({attempts:2,correct:2,successRate:100,averageMs:11000})
  })

  it('summarizes each section and recommends the weaker section',()=>{
    const analytics=buildPerformanceAnalytics(attempts,sessions,98)
    const english=analytics.sections.find(section=>section.subject==='english')
    const math=analytics.sections.find(section=>section.subject==='math')
    expect(english).toMatchObject({attempts:6,correct:5,successRate:83})
    expect(math).toMatchObject({attempts:6,correct:4,successRate:67})
    expect(analytics.recommendation?.subject).toBe('math')
  })

  it('tracks per-session accuracy and cumulative practice score changes',()=>{
    const analytics=buildPerformanceAnalytics(attempts,sessions,98)
    expect(analytics.sessionMetrics.map(session=>session.accuracy)).toEqual([50,100])
    expect(analytics.scoreTrend).toHaveLength(2)
    expect(analytics.scoreTrend[1].score).toBeGreaterThan(analytics.scoreTrend[0].score)
    expect(analytics.scoreTrend[1].delta).toBe(analytics.scoreTrend[1].score-analytics.scoreTrend[0].score)
    expect(analytics.latestScoreEstimate).toBe(analytics.scoreTrend[1].score)
  })

  it('does not produce an overall score estimate without enough data in both sections',()=>{
    const mathOnly=attempts.filter(attempt=>attempt.subject==='math').slice(0,2)
    const analytics=buildPerformanceAnalytics(mathOnly,[],98)
    expect(analytics.latestScoreEstimate).toBeNull()
  })

  it('keeps the section estimate within the SAT section score range',()=>{
    expect(estimateSectionPracticeScore(0)).toBe(200)
    expect(estimateSectionPracticeScore(100)).toBe(800)
  })
})
