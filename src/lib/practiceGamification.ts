import {questionsForMode} from './questionBank'
import type {Attempt,PracticeQuestion,SessionSummary,Settings} from '../types'

export type PerformanceSummary={
  accuracy:number
  averageMs:number
  sessions:number
  questionsSeen:number
  totalQuestions:number
}

export type SessionMetrics={
  accuracy:number
  averageMs:number
  correct:number
  total:number
}

export function formatDuration(ms:number){
  const seconds=Math.round(ms/1000)
  return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${seconds%60}s`
}

export function choosePracticeQuestions(settings:Settings,attempts:Attempt[],random:()=>number=Math.random):PracticeQuestion[]{
  const pool=questionsForMode(settings.mode)
  const stats=new Map<string,{attempts:number;correct:number;lastIndex:number}>()

  attempts.forEach((attempt,index)=>{
    const current=stats.get(attempt.questionId)??{attempts:0,correct:0,lastIndex:-1}
    current.attempts++
    if(attempt.correct)current.correct++
    current.lastIndex=index
    stats.set(attempt.questionId,current)
  })

  return pool
    .map(question=>{
      const stat=stats.get(question.id)
      const unseenBonus=stat?0:1000
      const weaknessBonus=stat?(1-stat.correct/stat.attempts)*400:0
      const recencyBonus=stat?Math.min(200,attempts.length-stat.lastIndex):0
      return {question,score:unseenBonus+weaknessBonus+recencyBonus+random()*60}
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,settings.questionsPerSession)
    .map(item=>item.question)
}

export function summarizePerformance(attempts:Attempt[],sessions:SessionSummary[],totalQuestions:number):PerformanceSummary{
  const correct=attempts.filter(attempt=>attempt.correct).length
  return {
    accuracy:attempts.length?Math.round(100*correct/attempts.length):0,
    averageMs:attempts.length?attempts.reduce((sum,attempt)=>sum+attempt.elapsedMs,0)/attempts.length:0,
    sessions:sessions.length,
    questionsSeen:new Set(attempts.map(attempt=>attempt.questionId)).size,
    totalQuestions,
  }
}

export function summarizeSession(attempts:Attempt[]):SessionMetrics{
  const correct=attempts.filter(attempt=>attempt.correct).length
  return {
    accuracy:attempts.length?Math.round(100*correct/attempts.length):0,
    averageMs:attempts.length?attempts.reduce((sum,attempt)=>sum+attempt.elapsedMs,0)/attempts.length:0,
    correct,
    total:attempts.length,
  }
}
