import {QUESTION_BANK} from './questionBank'
import {buildPerformanceAnalytics,type PerformanceAnalytics} from './performanceAnalytics'
import type {Attempt,PracticeQuestion,SessionSummary,Settings} from '../types'

export type PerformanceSummary=PerformanceAnalytics
export type SessionMetrics={accuracy:number;averageMs:number;correct:number;total:number}

export function formatDuration(ms:number){
  const seconds=Math.round(ms/1000)
  return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${seconds%60}s`
}

function latestAttemptByQuestion(attempts:Attempt[]){
  const latest=new Map<string,Attempt>()
  attempts.forEach(attempt=>latest.set(attempt.questionId,attempt))
  return latest
}

function eligibleQuestions(settings:Settings,questions:PracticeQuestion[]){
  return questions.filter(question=>
    (settings.mode==='both'||question.subject===settings.mode)&&
    ((settings.practiceTest??'all')==='all'||question.practiceTestId===settings.practiceTest)
  )
}

export function practiceQuestionPool(settings:Settings,attempts:Attempt[],questions:PracticeQuestion[]=QUESTION_BANK):PracticeQuestion[]{
  const pool=eligibleQuestions(settings,questions)
  if(!settings.failedOnly)return pool
  const latest=latestAttemptByQuestion(attempts)
  return pool.filter(question=>latest.get(question.id)?.correct===false)
}

export function countFailedPracticeQuestions(settings:Settings,attempts:Attempt[],questions:PracticeQuestion[]=QUESTION_BANK){
  const latest=latestAttemptByQuestion(attempts)
  return eligibleQuestions(settings,questions).filter(question=>latest.get(question.id)?.correct===false).length
}

export function choosePracticeQuestions(settings:Settings,attempts:Attempt[],random:()=>number=Math.random,questions:PracticeQuestion[]=QUESTION_BANK):PracticeQuestion[]{
  const pool=practiceQuestionPool(settings,attempts,questions)
  const limit=Math.min(settings.questionsPerSession,pool.length)
  if((settings.selectionMode??'adaptive')==='random'){
    return pool.map(question=>({question,score:random()})).sort((a,b)=>a.score-b.score).slice(0,limit).map(item=>item.question)
  }
  const stats=new Map<string,{attempts:number;correct:number;lastIndex:number}>()
  attempts.forEach((attempt,index)=>{
    const current=stats.get(attempt.questionId)??{attempts:0,correct:0,lastIndex:-1}
    current.attempts++;if(attempt.correct)current.correct++;current.lastIndex=index;stats.set(attempt.questionId,current)
  })
  return pool.map(question=>{
    const stat=stats.get(question.id)
    const unseenBonus=stat?0:1000
    const weaknessBonus=stat?(1-stat.correct/stat.attempts)*400:0
    const recencyBonus=stat?Math.min(200,attempts.length-stat.lastIndex):0
    return{question,score:unseenBonus+weaknessBonus+recencyBonus+random()*60}
  }).sort((a,b)=>b.score-a.score).slice(0,limit).map(item=>item.question)
}

export function summarizePerformance(attempts:Attempt[],sessions:SessionSummary[],totalQuestions:number):PerformanceSummary{return buildPerformanceAnalytics(attempts,sessions,totalQuestions)}
export function summarizeSession(attempts:Attempt[]):SessionMetrics{
  const correct=attempts.filter(attempt=>attempt.correct).length
  return{accuracy:attempts.length?Math.round(100*correct/attempts.length):0,averageMs:attempts.length?attempts.reduce((sum,attempt)=>sum+attempt.elapsedMs,0)/attempts.length:0,correct,total:attempts.length}
}
