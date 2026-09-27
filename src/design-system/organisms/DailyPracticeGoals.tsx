import {Check,Flame} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import type {Attempt,SessionSummary} from '../../types'

type Props={
  attempts:Attempt[]
  sessions:SessionSummary[]
  dailyQuestions:number
  dailyMinutes:number
  failedQuestionCount:number
  onStartPractice:()=>void
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

export default function DailyPracticeGoals({attempts,sessions,dailyQuestions,dailyMinutes,failedQuestionCount,onStartPractice}:Props){
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
    return{label,key,practiced,isToday:key===todayKey,isFuture:date.getTime()>today.getTime()}
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

  return <AlexBox sx={{display:'grid',gap:{xs:1.25,sm:1.5}}}>
    <AlexSurface component="section" sx={{p:{xs:1.75,sm:2},border:'1px solid #E4E7EC',borderRadius:3,bgcolor:'#fff'}}>
      <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,mb:1.35}}>
        <AlexText component="h2" sx={{fontSize:15,fontWeight:850,color:'#08275B'}}>Today’s goals</AlexText>
        <AlexButton tone="quiet" onClick={onStartPractice}>Continue practice</AlexButton>
      </AlexBox>
      <AlexBox sx={{display:'grid',gap:.75}}>
        {goals.map(goal=><AlexBox key={goal.label} sx={{display:'grid',gridTemplateColumns:'28px minmax(0,1fr) auto',alignItems:'center',gap:1}}>
          <AlexBox aria-hidden="true" sx={{
            width:26,height:26,borderRadius:'50%',display:'grid',placeItems:'center',
            bgcolor:goal.done?'#EAF7EF':'#F2F4F7',color:goal.done?'#027A48':'#98A2B3',
          }}>{goal.done?<Check size={15} strokeWidth={2.5}/>:<AlexBox sx={{width:7,height:7,borderRadius:'50%',bgcolor:'#C8CED8'}}/>}</AlexBox>
          <AlexText sx={{fontSize:13,fontWeight:700,color:'#344054'}}>{goal.label}</AlexText>
          <AlexText sx={{fontSize:12,fontWeight:850,color:goal.done?'#027A48':'#667085',whiteSpace:'nowrap'}}>{goal.value}</AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexSurface>

    <AlexSurface component="section" sx={{p:{xs:1.75,sm:2},border:'1px solid #E4E7EC',borderRadius:3,bgcolor:'#fff'}}>
      <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1,mb:1.35}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.7}}>
          <Flame size={17} color="#6558F5"/>
          <AlexText component="h2" sx={{fontSize:15,fontWeight:850,color:'#08275B'}}>{streak} day streak</AlexText>
        </AlexBox>
        <AlexText sx={{fontSize:11.5,fontWeight:750,color:'#667085'}}>{practicedDays} practice day{practicedDays===1?'':'s'} this week</AlexText>
      </AlexBox>
      <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:{xs:.4,sm:.65}}}>
        {weekDays.map(day=><AlexBox key={day.key} sx={{display:'grid',gap:.55,justifyItems:'center'}}>
          <AlexBox sx={{
            width:'100%',maxWidth:38,aspectRatio:'1',borderRadius:2,
            border:'1px solid',borderColor:day.practiced?'#C9BFFF':day.isToday?'#6558F5':'#D0D5DD',
            bgcolor:day.practiced?'#F2EFFF':'#fff',color:day.practiced?'#6558F5':'#667085',
            display:'grid',placeItems:'center',opacity:day.isFuture?0.72:1,
          }}>{day.practiced?<Check size={17} strokeWidth={2.5}/>:<AlexText sx={{fontSize:11,fontWeight:800}}>{day.label}</AlexText>}</AlexBox>
          <AlexText sx={{fontSize:9.5,fontWeight:day.isToday?900:700,color:day.isToday?'#6558F5':'#98A2B3'}}>{day.label}</AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexSurface>
  </AlexBox>
}
