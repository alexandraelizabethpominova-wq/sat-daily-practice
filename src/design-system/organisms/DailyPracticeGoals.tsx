import {Check,Flame,Info,PenLine,Star} from 'lucide-react'
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
  recommendationLabel?:string
  recommendationReason?:string
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

export default function DailyPracticeGoals({attempts,sessions,dailyQuestions,dailyMinutes,failedQuestionCount,recommendationLabel='Keep practicing',recommendationReason}:Props){
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
    {label:'Practice questions',value:`${Math.min(questionsDone,questionTarget)}/${questionTarget}`},
    {label:'Practice time',value:`${Math.min(minutesDone,minuteTarget)}/${minuteTarget} min`},
    {label:'Review failed questions',value:failedQuestionCount?String(failedQuestionCount):'Clear'},
  ]
  const weeklyQuestions=attempts.filter(attempt=>new Date(attempt.createdAt)>=weekStart).length
  const weeklyMinutes=Math.round(attempts.filter(attempt=>new Date(attempt.createdAt)>=weekStart).reduce((total,attempt)=>total+attempt.elapsedMs,0)/60000)
  const daysToWeeklyStreak=Math.max(0,2-practicedDays)

  return <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'repeat(3,minmax(0,1fr))'},gap:1.5,minHeight:0,alignItems:'stretch'}}>
    <AlexSurface component="section" sx={{
      px:2.25,py:1.7,border:'none',borderRadius:'18px',bgcolor:'#fff',
      boxShadow:'none',minWidth:0,overflow:'hidden',
      fontFamily:'Arial, Helvetica, sans-serif',
    }}>
      <AlexText component="h2" sx={{fontFamily:'inherit',fontSize:16,fontWeight:700,lineHeight:1.25,color:'#111',mb:1.45}}>Today&apos;s goals</AlexText>
      <AlexBox sx={{display:'grid',gap:1.05}}>
        {goals.map(goal=><AlexBox key={goal.label} sx={{display:'grid',gridTemplateColumns:'30px minmax(0,1fr)',alignItems:'center',columnGap:1.15}}>
          <AlexBox aria-hidden="true" sx={{width:30,height:30,borderRadius:'50%',display:'grid',placeItems:'center',bgcolor:'#EEF2F7',color:'#C7D1DF'}}>
            <Star size={17} fill="currentColor" strokeWidth={1.4}/>
          </AlexBox>
          <AlexText sx={{fontFamily:'inherit',fontSize:15.5,fontWeight:400,lineHeight:1.3,color:'#111',whiteSpace:'nowrap'}}>
            <AlexBox component="span" sx={{textDecoration:'underline',textUnderlineOffset:'2px'}}>{goal.label}</AlexBox>
            <AlexBox component="span" sx={{textDecoration:'none'}}> · {goal.value}</AlexBox>
          </AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexSurface>

    <AlexSurface component="section" sx={{
      px:2.25,py:1.65,border:'none',borderRadius:'18px',bgcolor:'#fff',
      boxShadow:'none',minWidth:0,overflow:'hidden',
      fontFamily:'Arial, Helvetica, sans-serif',
    }}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,mb:1.05}}>
        <Flame size={17} color="#475467"/>
        <AlexText component="h2" sx={{fontFamily:'inherit',fontSize:15.5,fontWeight:700,lineHeight:1.2,color:'#475467'}}>{streak} week streak</AlexText>
        <Info size={15} fill="#475467" color="#fff"/>
      </AlexBox>
      <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1,mb:1.45}}>
        <AlexText sx={{fontFamily:'inherit',fontSize:15,lineHeight:1.25,fontWeight:400,color:'#111'}}>
          {daysToWeeklyStreak>0?`${daysToWeeklyStreak} days left to start your weekly streak!`:'Your weekly streak is underway!'}
        </AlexText>
        <PenLine size={19} color="#111"/>
      </AlexBox>
      <AlexBox sx={{display:'flex',gap:1,alignItems:'center',mb:1.05}}>
        {weekDays.map(day=><AlexBox key={day.key} sx={{
          width:40,height:40,flex:'0 0 40px',borderRadius:'5px',
          border:'1.5px solid',borderColor:day.practiced?'#B38CFF':day.isToday?'#111':'#C8D1DE',
          bgcolor:day.practiced?'#F7F2FF':'#fff',
          color:day.practiced?'#6F35E8':day.isToday?'#111':'#475467',
          display:'grid',placeItems:'center',
          fontFamily:'Arial, Helvetica, sans-serif',
        }}>
          {day.practiced?<Check size={20} strokeWidth={2.2}/>:<AlexText sx={{fontFamily:'inherit',fontSize:14.5,fontWeight:day.isToday?700:400,color:'inherit'}}>{day.label}</AlexText>}
        </AlexBox>)}
      </AlexBox>
      <AlexText sx={{fontFamily:'inherit',fontSize:14.5,fontWeight:400,lineHeight:1.25,color:'#667085'}}>
        {weeklyQuestions} items completed · {weeklyMinutes} minutes learned
      </AlexText>
    </AlexSurface>

    <AlexSurface component="section" title={recommendationReason} sx={{
      px:2.25,py:1.7,border:'none',borderRadius:'18px',bgcolor:'#F5EEFF',
      boxShadow:'none',minWidth:0,overflow:'hidden',
      fontFamily:'Arial, Helvetica, sans-serif',
    }}>
      <AlexText component="h2" sx={{fontFamily:'inherit',fontSize:16,fontWeight:700,lineHeight:1.25,color:'#111',mb:1.45}}>Recommended focus</AlexText>
      <AlexText sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:28,fontWeight:700,lineHeight:1.1,color:'#08275B'}}>{recommendationLabel}</AlexText>
    </AlexSurface>
  </AlexBox>
}
