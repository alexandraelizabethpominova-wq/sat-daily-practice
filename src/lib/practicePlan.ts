import type {Attempt,PracticeQuestion,Settings} from '../types'

export type PracticePlanRecommendation={
  bankQuestionCount:number
  availablePracticeSetCount:number
  targetPracticeSets:number
  daysRemaining:number
  uniqueQuestionsCompleted:number
  targetQuestions:number
  remainingQuestions:number
  questionsPerSession:number
  remainingSessions:number
  recommendedSessionsPerDay:number
  estimatedSessionMinutes:number
  estimatedDailyMinutes:number
  paceSource:'history'|'configured fallback'
}

function daysUntil(dateValue:string){
  const target=new Date(`${dateValue}T12:00:00`)
  if(Number.isNaN(target.getTime()))return 1
  const today=new Date();today.setHours(12,0,0,0)
  return Math.max(1,Math.ceil((target.getTime()-today.getTime())/86400000))
}

export function buildPracticePlanRecommendation(settings:Settings,questions:PracticeQuestion[],attempts:Attempt[]):PracticePlanRecommendation{
  const bankQuestionCount=questions.length
  const availablePracticeSetCount=new Set(questions.map(question=>question.practiceTestId).filter(Boolean)).size
  const targetPracticeSets=Math.max(1,Math.round(settings.targetPracticeSets??(availablePracticeSetCount||1)))
  const coverage=Math.max(1,Math.min(100,settings.targetCoveragePercent??100))/100
  const targetQuestions=Math.ceil(bankQuestionCount*coverage)
  const questionIds=new Set(questions.map(question=>question.id))
  const uniqueQuestionsCompleted=new Set(attempts.filter(attempt=>questionIds.has(attempt.questionId)).map(attempt=>attempt.questionId)).size
  const remainingQuestions=Math.max(0,targetQuestions-uniqueQuestionsCompleted)
  const questionsPerSession=Math.max(1,settings.questionsPerSession)
  const remainingSessions=Math.ceil(remainingQuestions/questionsPerSession)
  const daysRemaining=daysUntil(settings.targetExamDate??new Date().toISOString().slice(0,10))
  const recommendedSessionsPerDay=remainingSessions?Math.max(1,Math.ceil(remainingSessions/daysRemaining)):0

  const timed=attempts.filter(attempt=>attempt.elapsedMs>0&&attempt.elapsedMs<20*60*1000)
  const historyMinutes=timed.length>=5?timed.reduce((sum,attempt)=>sum+attempt.elapsedMs,0)/timed.length/60000:null
  const minutesPerQuestion=historyMinutes??Math.max(.25,settings.fallbackMinutesPerQuestion??2)
  const estimatedSessionMinutes=Math.max(1,Math.ceil(questionsPerSession*minutesPerQuestion))

  return{
    bankQuestionCount,availablePracticeSetCount,targetPracticeSets,daysRemaining,uniqueQuestionsCompleted,targetQuestions,remainingQuestions,
    questionsPerSession,remainingSessions,recommendedSessionsPerDay,estimatedSessionMinutes,
    estimatedDailyMinutes:estimatedSessionMinutes*recommendedSessionsPerDay,
    paceSource:historyMinutes===null?'configured fallback':'history',
  }
}
