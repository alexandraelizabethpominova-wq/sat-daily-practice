import {buildQuestionMastery} from './questionMastery'
import type {Attempt,ModuleKey,PracticeTestId,SessionSummary,Subject} from '../types'

export type SectionPerformance={
  subject:Subject
  label:string
  attempts:number
  correct:number
  successRate:number
  averageMs:number
}

export type QuestionPerformance={
  questionId:string
  practiceTestId:PracticeTestId
  subject:Subject
  module:ModuleKey
  questionNumber:number
  attempts:number
  correct:number
  successRate:number
  averageMs:number
  lastAttemptAt:string
}

export type SessionPerformance={
  sessionId:string
  startedAt:string
  endedAt:string
  mode:SessionSummary['mode']
  attempts:number
  correct:number
  accuracy:number
  averageMs:number
}

export type ScoreTrendPoint={
  sessionId:string
  startedAt:string
  score:number
  delta:number
}

export type PracticeRecommendation={
  subject:Subject
  label:string
  reason:string
}

export type PerformanceAnalytics={
  accuracy:number
  averageMs:number
  sessions:number
  questionsSeen:number
  totalQuestions:number
  sections:SectionPerformance[]
  questions:QuestionPerformance[]
  sessionMetrics:SessionPerformance[]
  scoreTrend:ScoreTrendPoint[]
  latestScoreEstimate:number|null
  recommendation:PracticeRecommendation|null
}

const SECTION_LABELS:Record<Subject,string>={english:'Reading & Writing',math:'Math'}
const SCORE_BASE=200
const SCORE_RANGE=600
const MIN_SECTION_QUESTIONS_FOR_SCORE=3
export const SCORE_SESSION_WINDOW=10

const percent=(correct:number,total:number)=>total?Math.round(100*correct/total):0
const average=(values:number[])=>values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0

export function estimateSectionPracticeScore(successRate:number){
  const raw=SCORE_BASE+(Math.max(0,Math.min(100,successRate))/100)*SCORE_RANGE
  return Math.max(200,Math.min(800,Math.round(raw/10)*10))
}

function buildSections(attempts:Attempt[]):SectionPerformance[]{
  return (['english','math'] as Subject[]).map(subject=>{
    const rows=attempts.filter(attempt=>attempt.subject===subject)
    const correct=rows.filter(attempt=>attempt.correct).length
    return {
      subject,
      label:SECTION_LABELS[subject],
      attempts:rows.length,
      correct,
      successRate:percent(correct,rows.length),
      averageMs:average(rows.map(attempt=>attempt.elapsedMs)),
    }
  })
}

function estimateOverallScore(sections:SectionPerformance[]){
  const english=sections.find(section=>section.subject==='english')
  const math=sections.find(section=>section.subject==='math')
  if(!english||!math||english.attempts<MIN_SECTION_QUESTIONS_FOR_SCORE||math.attempts<MIN_SECTION_QUESTIONS_FOR_SCORE)return null
  return estimateSectionPracticeScore(english.successRate)+estimateSectionPracticeScore(math.successRate)
}

function buildScoreSections(attempts:Attempt[]):SectionPerformance[]{
  const mastery=buildQuestionMastery(attempts)
  return (['english','math'] as Subject[]).map(subject=>{
    const questions=[...mastery.values()].filter(state=>state.latestAttempt.subject===subject)
    const correct=questions.filter(state=>state.mastered).length
    const subjectAttempts=attempts.filter(attempt=>attempt.subject===subject)
    return {
      subject,
      label:SECTION_LABELS[subject],
      attempts:questions.length,
      correct,
      successRate:percent(correct,questions.length),
      averageMs:average(subjectAttempts.map(attempt=>attempt.elapsedMs)),
    }
  })
}

function attemptsForSessionWindow(attempts:Attempt[],sessions:SessionSummary[],endIndex:number){
  const first=Math.max(0,endIndex-SCORE_SESSION_WINDOW+1)
  const ids=new Set(sessions.slice(first,endIndex+1).map(session=>session.id))
  return attempts.filter(attempt=>ids.has(attempt.sessionId))
}

function buildQuestions(attempts:Attempt[]):QuestionPerformance[]{
  const grouped=new Map<string,Attempt[]>()
  attempts.forEach(attempt=>grouped.set(attempt.questionId,[...(grouped.get(attempt.questionId)??[]),attempt]))

  return [...grouped.entries()].map(([questionId,rows])=>{
    const latest=[...rows].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))[0]
    const correct=rows.filter(attempt=>attempt.correct).length
    return {
      questionId,
      practiceTestId:latest.practiceTestId??'practice-test-4',
      subject:latest.subject,
      module:latest.module,
      questionNumber:latest.questionNumber,
      attempts:rows.length,
      correct,
      successRate:percent(correct,rows.length),
      averageMs:average(rows.map(attempt=>attempt.elapsedMs)),
      lastAttemptAt:latest.createdAt,
    }
  }).sort((a,b)=>a.successRate-b.successRate||b.attempts-a.attempts||b.averageMs-a.averageMs||a.questionNumber-b.questionNumber)
}

function buildSessions(attempts:Attempt[],sessions:SessionSummary[]){
  const bySession=new Map<string,Attempt[]>()
  attempts.forEach(attempt=>bySession.set(attempt.sessionId,[...(bySession.get(attempt.sessionId)??[]),attempt]))
  const ordered=[...sessions].sort((a,b)=>a.startedAt.localeCompare(b.startedAt))
  const sessionMetrics:SessionPerformance[]=ordered.map(session=>{
    const rows=bySession.get(session.id)??[]
    const correct=rows.filter(attempt=>attempt.correct).length
    return {
      sessionId:session.id,
      startedAt:session.startedAt,
      endedAt:session.endedAt,
      mode:session.mode,
      attempts:rows.length,
      correct,
      accuracy:percent(correct,rows.length),
      averageMs:average(rows.map(attempt=>attempt.elapsedMs)),
    }
  })

  const scoreTrend:ScoreTrendPoint[]=[]
  let previousScore:number|null=null
  let latestScoreEstimate:number|null=null
  ordered.forEach((session,index)=>{
    const recentAttempts=attemptsForSessionWindow(attempts,ordered,index)
    const score=estimateOverallScore(buildScoreSections(recentAttempts))
    latestScoreEstimate=score
    if(score===null)return
    scoreTrend.push({
      sessionId:session.id,
      startedAt:session.startedAt,
      score,
      delta:previousScore===null?0:score-previousScore,
    })
    previousScore=score
  })

  return {sessionMetrics,scoreTrend,latestScoreEstimate}
}

function buildRecommendation(sections:SectionPerformance[]):PracticeRecommendation|null{
  const english=sections.find(section=>section.subject==='english')!
  const math=sections.find(section=>section.subject==='math')!
  if(!english.attempts&&!math.attempts)return null
  if(!english.attempts)return {subject:'english',label:english.label,reason:`You have ${math.attempts} Math attempts but no Reading & Writing baseline yet. Practice a few Reading & Writing questions next so the recommendation can compare both sections.`}
  if(!math.attempts)return {subject:'math',label:math.label,reason:`You have ${english.attempts} Reading & Writing attempts but no Math baseline yet. Practice a few Math questions next so the recommendation can compare both sections.`}

  let focus=english.successRate<math.successRate?english:math
  let other=focus.subject==='english'?math:english
  if(english.successRate===math.successRate){
    focus=english.averageMs>=math.averageMs?english:math
    other=focus.subject==='english'?math:english
  }

  const gap=Math.max(0,other.successRate-focus.successRate)
  const focusSeconds=Math.round(focus.averageMs/1000)
  const otherSeconds=Math.round(other.averageMs/1000)
  const reason=gap>=3
    ?`${focus.label} is ${gap} percentage points lower in success rate (${focus.successRate}% vs. ${other.successRate}%). Average time is ${focusSeconds}s per question.`
    :focusSeconds>otherSeconds
      ?`${focus.label} accuracy is close to ${other.label}, but it is currently slower (${focusSeconds}s vs. ${otherSeconds}s per question).`
      :`${focus.label} is currently the slightly weaker section when accuracy and response time are considered together.`

  return {subject:focus.subject,label:focus.label,reason}
}

export function buildPerformanceAnalytics(attempts:Attempt[],sessions:SessionSummary[],totalQuestions:number):PerformanceAnalytics{
  const correct=attempts.filter(attempt=>attempt.correct).length
  const sections=buildSections(attempts)
  const {sessionMetrics,scoreTrend,latestScoreEstimate}=buildSessions(attempts,sessions)
  return {
    accuracy:percent(correct,attempts.length),
    averageMs:average(attempts.map(attempt=>attempt.elapsedMs)),
    sessions:sessions.length,
    questionsSeen:new Set(attempts.map(attempt=>attempt.questionId)).size,
    totalQuestions,
    sections,
    questions:buildQuestions(attempts),
    sessionMetrics,
    scoreTrend,
    latestScoreEstimate,
    recommendation:buildRecommendation(sections),
  }
}
