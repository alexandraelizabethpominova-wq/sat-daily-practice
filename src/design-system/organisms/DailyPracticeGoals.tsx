import {Check,Flame,Star} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import type {Attempt,SessionSummary} from '../../types'

type Props={
  attempts:Attempt[]
  sessions:SessionSummary[]
  dailyQuestions:number
  dailyMinutes:number
  failedQuestionCount:number
}

const DAY_LABELS=['Mo','Tu','We','Th','Fr','Sa','Su']

function localDayKey(value:string|Date){
  const date=value instanceof Date?value:new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function startOfWeek(today:Date){
  const date=new Date(today.getFullYear(),today.getMonth(),today.getDate())
  const day=date.getDay()
  date.setDate(date.getDate()-(day===0?6:day-1))
  return date
}

export default function DailyPracticeGoals({attempts,sessions,dailyQuestions,dailyMinutes,failedQuestionCount}:Props){
  const today=new Date()
  const todayKey=localDayKey(today)
  const todayAttempts=attempts.filter(attempt=>localDayKey(attempt.createdAt)===todayKey)
  const questionsDone=todayAttempts.length
  const minutesDone=Math.round(todayAttempts.reduce((total,attempt)=>total+attempt.elapsedMs,0)/60000)
  const questionTarget=Math.max(1,dailyQuestions)
  const minuteTarget=Math.max(1,dailyMinutes)
  const weekStart=startOfWeek(today)
  const weekDays=DAY_LABELS.map((label,index)=>{
    const date=new Date(weekStart)
    date.setDate(weekStart.getDate()+index)
    const key=localDayKey(date)
    const practiced=sessions.some(session=>localDayKey(session.endedAt||session.startedAt)===key)
      ||attempts.some(attempt=>localDayKey(attempt.createdAt)===key)
    return{label,key,practiced,isToday:key===todayKey}
  })
  const practicedDays=weekDays.filter(day=>day.practiced).length
  const practicedKeys=new Set([
    ...sessions.map(session=>localDayKey(session.endedAt||session.startedAt)),
    ...attempts.map(attempt=>localDayKey(attempt.createdAt)),
  ])
  let streak=0
  const cursor=new Date(today.getFullYear(),today.getMonth(),today.getDate())
  if(!practicedKeys.has(localDayKey(cursor)))cursor.setDate(cursor.getDate()-1)
  while(practicedKeys.has(localDayKey(cursor))){
    streak+=1
    cursor.setDate(cursor.getDate()-1)
  }
  const goals=[
    {label:'Practice questions',value:`${Math.min(questionsDone,questionTarget)}/${questionTarget}`,done:questionsDone>=questionTarget},
    {label:'Practice time',value:`${Math.min(minutesDone,minuteTarget)}/${minuteTarget} min`,done:minutesDone>=minuteTarget},
    {label:'Review failed questions',value:failedQuestionCount?String(failedQuestionCount):'Clear',done:failedQuestionCount===0},
  ]

  return <AlexBox sx={{display:'grid',gap:.7,height:'100%',minHeight:0,gridTemplateRows:'1fr 1fr'}}>
    <AlexSurface component="section" sx={{p:{xs:1,sm:1.1},border:'1px solid #E4E7EC',borderRadius:3,bgcolor:'#fff',minWidth:0}}>
      <AlexText component="h2" sx={{fontSize:13,fontWeight:850,color:'#08275B',mb:.5}}>Today’s goals</AlexText>
      <AlexBox sx={{display:'grid',gap:.3}}>
        {goals.map(goal=><AlexBox key={goal.label} sx={{display:'grid',gridTemplateColumns:'24px minmax(0,1fr) auto',alignItems:'center',gap:.65}}>
          <AlexBox aria-hidden="true" sx={{width:19,height:19,borderRadius:'50%',display:'grid',placeItems:'center',bgcolor:goal.done?'#EAF7EF':'#EEF1F5',color:goal.done?'#027A48':'#B8C0CC'}}>
            <Star size={11} fill="currentColor" strokeWidth={1.6}/>
          </AlexBox>
          <AlexText sx={{fontSize:10.5,fontWeight:650,color:'#344054',textDecoration:'underline',textUnderlineOffset:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{goal.label}</AlexText>
          <AlexText sx={{fontSize:10,fontWeight:800,color:goal.done?'#027A48':'#475467',whiteSpace:'nowrap'}}>{goal.value}</AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexSurface>

    <AlexSurface component="section" sx={{p:{xs:1,sm:1.1},border:'1px solid #E4E7EC',borderRadius:3,bgcolor:'#fff',minWidth:0}}>
      <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:.7,mb:.35}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.5,minWidth:0}}>
          <Flame size={14} color="#6558F5"/>
          <AlexText component="h2" sx={{fontSize:12.5,fontWeight:850,color:'#08275B',whiteSpace:'nowrap'}}>{streak} day streak</AlexText>
        </AlexBox>
        <AlexText sx={{fontSize:9.5,fontWeight:700,color:'#667085',whiteSpace:'nowrap'}}>{practicedDays} days this week</AlexText>
      </AlexBox>
      <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:.45}}>
        {weekDays.map(day=><AlexBox key={day.key} sx={{display:'grid',justifyItems:'center',gap:.25,minWidth:0}}>
          <AlexBox sx={{
            width:{xs:23,sm:25},height:{xs:23,sm:25},borderRadius:1,
            border:'1px solid',borderColor:day.practiced?'#BBA8FF':day.isToday?'#6558F5':'#CBD3DF',
            bgcolor:day.practiced?'#F3EFFF':'#fff',color:day.practiced?'#6558F5':'#667085',
            display:'grid',placeItems:'center',
          }}>{day.practiced?<Check size={12} strokeWidth={2.3}/>:<AlexText sx={{fontSize:8.5,fontWeight:750}}>{day.label}</AlexText>}</AlexBox>
          <AlexText sx={{fontSize:7.5,fontWeight:day.isToday?850:650,color:day.isToday?'#6558F5':'#98A2B3'}}>{day.label}</AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexSurface>
  </AlexBox>
}
