import type {SessionSummary} from '../types'

export type StudyPlanDayStatus='ahead'|'on-track'|'behind'|'planned'|'neutral'

export type StudyPlanCalendarDay={
  date:string
  day:number
  sessionCount:number
  questionCount:number
  practiced:boolean
  status:StudyPlanDayStatus
  targetQuestionCount:number
}

function pad(value:number){return String(value).padStart(2,'0')}

export function localDateKey(value:string|Date){
  const date=typeof value==='string'?new Date(value):value
  if(Number.isNaN(date.getTime()))return ''
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
}

export function monthKey(year:number,month:number,day:number){
  return `${year}-${pad(month+1)}-${pad(day)}`
}

export function buildStudyPlanCalendarDays({
  year,
  month,
  sessions,
  recommendedSessionsPerDay,
  questionsPerSession,
  today=new Date(),
  examDate,
}:{
  year:number
  month:number
  sessions:SessionSummary[]
  recommendedSessionsPerDay:number
  questionsPerSession:number
  today?:Date
  examDate?:string
}):StudyPlanCalendarDay[]{
  const todayKey=localDateKey(today)
  const sessionKeys=sessions.map(session=>localDateKey(session.startedAt)).filter(Boolean).sort()
  const trackingStart=sessionKeys[0]??todayKey
  const targetQuestions=Math.max(0,recommendedSessionsPerDay*questionsPerSession)
  const totals=new Map<string,{sessions:number;questions:number;targetQuestions?:number}>()

  sessions.forEach(session=>{
    const key=localDateKey(session.startedAt)
    if(!key)return
    const current=totals.get(key)??{sessions:0,questions:0,targetQuestions:undefined}
    current.sessions+=1
    current.questions+=Math.max(0,session.questionCount)
    if(current.targetQuestions===undefined&&typeof session.dailyQuestionGoal==='number'&&session.dailyQuestionGoal>0)current.targetQuestions=session.dailyQuestionGoal
    totals.set(key,current)
  })

  const count=new Date(year,month+1,0).getDate()
  return Array.from({length:count},(_,index)=>{
    const day=index+1
    const date=monthKey(year,month,day)
    const total=totals.get(date)??{sessions:0,questions:0,targetQuestions:undefined}
    const practiced=total.sessions>0||total.questions>0
    const dayTargetQuestions=date<todayKey&&total.targetQuestions?total.targetQuestions:targetQuestions

    let status:StudyPlanDayStatus='neutral'
    if(date>=trackingStart&&(!examDate||date<=examDate)){
      if(date>todayKey){
        status=dayTargetQuestions>0?'planned':'neutral'
      }else if(dayTargetQuestions===0){
        status=practiced?'ahead':'on-track'
      }else if(total.questions>dayTargetQuestions){
        status='ahead'
      }else if(total.questions>=dayTargetQuestions){
        status='on-track'
      }else{
        status='behind'
      }
    }

    return {date,day,sessionCount:total.sessions,questionCount:total.questions,practiced,status,targetQuestionCount:dayTargetQuestions}
  })
}
