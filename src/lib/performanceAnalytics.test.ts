import {describe,expect,it} from 'vitest'
import {buildPerformanceAnalytics,estimateSectionPracticeScore,SCORE_SESSION_WINDOW} from './performanceAnalytics'
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

  it('tracks session accuracy separately from the question-mastery score estimate',()=>{
    const analytics=buildPerformanceAnalytics(attempts,sessions,98)
    expect(analytics.sessionMetrics.map(session=>session.accuracy)).toEqual([50,100])
    expect(analytics.scoreTrend).toHaveLength(2)
    expect(analytics.scoreTrend[1].score).toBe(analytics.scoreTrend[0].score)
    expect(analytics.scoreTrend[1].delta).toBe(0)
    expect(analytics.latestScoreEstimate).toBe(analytics.scoreTrend[1].score)
  })

  it('counts a failed question as correct for prediction after two correct answers after the latest failure',()=>{
    const retryAttempts:Attempt[]=[
      makeAttempt('e1','s1','e-1','english','rw1',1,false,1000,'2026-09-01T12:00:01.000Z'),
      makeAttempt('e2','s1','e-2','english','rw1',2,false,1000,'2026-09-01T12:00:02.000Z'),
      makeAttempt('e3','s1','e-3','english','rw1',3,false,1000,'2026-09-01T12:00:03.000Z'),
      makeAttempt('m1','s1','m-1','math','math1',1,false,1000,'2026-09-01T12:00:04.000Z'),
      makeAttempt('m2','s1','m-2','math','math1',2,false,1000,'2026-09-01T12:00:05.000Z'),
      makeAttempt('m3','s1','m-3','math','math1',3,false,1000,'2026-09-01T12:00:06.000Z'),
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`e-r1-${index}`,'s2',id,'english','rw1',index+1,true,1000,`2026-09-02T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`m-r1-${index}`,'s2',id,'math','math1',index+1,true,1000,`2026-09-02T12:00:1${index+1}.000Z`)),
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`e-r2-${index}`,'s3',id,'english','rw1',index+1,true,1000,`2026-09-03T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`m-r2-${index}`,'s3',id,'math','math1',index+1,true,1000,`2026-09-03T12:00:1${index+1}.000Z`)),
    ]
    const retrySessions:SessionSummary[]=['s1','s2','s3'].map((id,index)=>({
      id,
      startedAt:`2026-09-0${index+1}T12:00:00.000Z`,
      endedAt:`2026-09-0${index+1}T12:05:00.000Z`,
      mode:'both',
      questionCount:6,
      attempts:retryAttempts.filter(attempt=>attempt.sessionId===id),
    }))
    const analytics=buildPerformanceAnalytics(retryAttempts,retrySessions,98)
    expect(analytics.scoreTrend.map(point=>point.score)).toEqual([400,400,1600])
    expect(analytics.latestScoreEstimate).toBe(1600)
  })

  it('uses the latest ten completed sessions as the question pool but full completed history for mastery',()=>{
    expect(SCORE_SESSION_WINDOW).toBe(10)
    const oldFailures:Attempt[]=[
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`old-e-${index}`,'s1',id,'english','rw1',index+1,false,1000,`2026-08-01T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`old-m-${index}`,'s1',id,'math','math1',index+1,false,1000,`2026-08-01T12:00:1${index+1}.000Z`)),
    ]
    const firstRecovery:Attempt[]=[
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`r1-e-${index}`,'s10',id,'english','rw1',index+1,true,1000,`2026-08-10T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`r1-m-${index}`,'s10',id,'math','math1',index+1,true,1000,`2026-08-10T12:00:1${index+1}.000Z`)),
    ]
    const secondRecovery:Attempt[]=[
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`r2-e-${index}`,'s11',id,'english','rw1',index+1,true,1000,`2026-08-11T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`r2-m-${index}`,'s11',id,'math','math1',index+1,true,1000,`2026-08-11T12:00:1${index+1}.000Z`)),
    ]
    const all=[...oldFailures,...firstRecovery,...secondRecovery]
    const windowSessions:SessionSummary[]=Array.from({length:11},(_,index)=>{
      const number=index+1
      const id=`s${number}`
      const day=String(number).padStart(2,'0')
      const rows=all.filter(attempt=>attempt.sessionId===id)
      return {id,startedAt:`2026-08-${day}T12:00:00.000Z`,endedAt:`2026-08-${day}T12:05:00.000Z`,mode:'both',questionCount:6,attempts:rows}
    })
    const analytics=buildPerformanceAnalytics(all,windowSessions,98)
    expect(analytics.latestScoreEstimate).toBe(1600)
    expect(analytics.scorePredictionBasis).toMatchObject({
      sessionCount:10,
      questionCount:6,
      masteredCount:6,
    })
  })

  it('does not forget a failure just because it happened before the ten-session score window',()=>{
    const oldFailures:Attempt[]=[
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`old-e-${index}`,'s1',id,'english','rw1',index+1,false,1000,`2026-08-01T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`old-m-${index}`,'s1',id,'math','math1',index+1,false,1000,`2026-08-01T12:00:1${index+1}.000Z`)),
    ]
    const oneRecovery:Attempt[]=[
      ...['e-1','e-2','e-3'].map((id,index)=>makeAttempt(`r1-e-${index}`,'s11',id,'english','rw1',index+1,true,1000,`2026-08-11T12:00:0${index+1}.000Z`)),
      ...['m-1','m-2','m-3'].map((id,index)=>makeAttempt(`r1-m-${index}`,'s11',id,'math','math1',index+1,true,1000,`2026-08-11T12:00:1${index+1}.000Z`)),
    ]
    const all=[...oldFailures,...oneRecovery]
    const windowSessions:SessionSummary[]=Array.from({length:11},(_,index)=>{
      const number=index+1
      const id=`s${number}`
      const day=String(number).padStart(2,'0')
      const rows=all.filter(attempt=>attempt.sessionId===id)
      return {id,startedAt:`2026-08-${day}T12:00:00.000Z`,endedAt:`2026-08-${day}T12:05:00.000Z`,mode:'both',questionCount:6,attempts:rows}
    })
    const analytics=buildPerformanceAnalytics(all,windowSessions,98)
    expect(analytics.latestScoreEstimate).toBe(400)
    expect(analytics.scorePredictionBasis?.masteredCount).toBe(0)
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
