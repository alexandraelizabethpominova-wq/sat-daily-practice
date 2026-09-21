import {useMemo,useState} from 'react'
import {CalendarDays,ChevronLeft,ChevronRight,Star} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexIconButton from '../atoms/AlexIconButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTooltip from '../atoms/AlexTooltip'
import {buildStudyPlanCalendarDays,type StudyPlanDayStatus} from '../../lib/studyPlanCalendar'
import type {PracticePlanRecommendation} from '../../lib/practicePlan'
import type {SessionSummary,Settings} from '../../types'

type Props={
  sessions:SessionSummary[]
  settings:Settings
  recommendation:PracticePlanRecommendation
}

const STATUS_STYLE:Record<StudyPlanDayStatus,{bg:string;border:string;color:string;label:string}>={
  ahead:{bg:'#E5F7DC',border:'#AAD99A',color:'#315F25',label:'Ahead'},
  'on-track':{bg:'#E5F1FF',border:'#A9CEF0',color:'#245F9E',label:'On schedule'},
  behind:{bg:'#FFF0E7',border:'#F0C5AD',color:'#914D2C',label:'Behind'},
  planned:{bg:'#F2E9FF',border:'#DACAF0',color:'#6B4A91',label:'Planned'},
  neutral:{bg:'#FAFAF8',border:'#E8E4DD',color:'#98A2B3',label:'Not tracked'},
}

const WEEKDAYS=['S','M','T','W','T','F','S']

function monthTitle(year:number,month:number){
  return new Intl.DateTimeFormat(undefined,{month:'long',year:'numeric'}).format(new Date(year,month,1))
}

export default function StudyPlanCalendar({sessions,settings,recommendation}:Props){
  const today=new Date()
  const todayKey=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const [view,setView]=useState(()=>({year:today.getFullYear(),month:today.getMonth()}))
  const days=useMemo(()=>buildStudyPlanCalendarDays({
    year:view.year,
    month:view.month,
    sessions,
    recommendedSessionsPerDay:recommendation.recommendedSessionsPerDay,
    questionsPerSession:recommendation.questionsPerSession,
    today,
    examDate:settings.targetExamDate,
  }),[view.year,view.month,sessions,recommendation.recommendedSessionsPerDay,recommendation.questionsPerSession,settings.targetExamDate])

  const firstWeekday=new Date(view.year,view.month,1).getDay()
  const targetQuestions=recommendation.recommendedSessionsPerDay*recommendation.questionsPerSession
  const tracked=days.filter(day=>day.status==='ahead'||day.status==='on-track'||day.status==='behind')
  const ahead=tracked.filter(day=>day.status==='ahead').length
  const onTrack=tracked.filter(day=>day.status==='on-track').length
  const behind=tracked.filter(day=>day.status==='behind').length

  function moveMonth(delta:number){
    const next=new Date(view.year,view.month+delta,1)
    setView({year:next.getFullYear(),month:next.getMonth()})
  }

  return <AlexSurface
    component="section"
    sx={{
      p:{xs:1.6,sm:1.75},
      border:'1px solid #E4E7EC',
      borderRadius:3,
      bgcolor:'#fff',
      minWidth:0,
      height:'100%',
    }}
  >
    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1.25,mb:1.15}}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,minWidth:0}}>
        <CalendarDays size={16} color="#6558F5"/>
        <AlexText sx={{fontSize:12,fontWeight:850,color:'#08275B'}}>Practice calendar</AlexText>
      </AlexBox>
      <AlexText sx={{fontSize:10.5,fontWeight:800,color:'#667085',whiteSpace:'nowrap'}}>
        {targetQuestions>0?`${targetQuestions} q/day`:'Flexible pace'}
      </AlexText>
    </AlexBox>

    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
      <AlexIconButton label="Previous month" onClick={()=>moveMonth(-1)}><ChevronLeft size={16}/></AlexIconButton>
      <AlexText sx={{fontSize:11.5,fontWeight:900,letterSpacing:'.045em',color:'#08275B',textTransform:'uppercase'}}>
        {monthTitle(view.year,view.month)}
      </AlexText>
      <AlexIconButton label="Next month" onClick={()=>moveMonth(1)}><ChevronRight size={16}/></AlexIconButton>
    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:.35,mb:.45}}>
      {WEEKDAYS.map((day,index)=><AlexText key={`${day}-${index}`} sx={{textAlign:'center',fontSize:9,fontWeight:850,color:'#667085'}}>{day}</AlexText>)}
    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:.35}}>
      {Array.from({length:firstWeekday},(_,index)=><AlexBox key={`empty-${index}`} aria-hidden="true"/>)}
      {days.map(day=>{
        const style=STATUS_STYLE[day.status]
        const isToday=day.date===todayKey
        const isExamDate=Boolean(settings.targetExamDate&&day.date===settings.targetExamDate)
        const title=[style.label,isExamDate?'Exam date':'',day.practiced?`${day.questionCount} questions practiced`:''].filter(Boolean).join(' · ')
        return <AlexTooltip key={day.date} title={title} arrow placement="top">
          <AlexBox
            component="span"
            aria-label={`${day.date}: ${title}`}
            sx={{
              width:'100%',
              aspectRatio:'1 / 1',
              maxWidth:30,
              justifySelf:'center',
              borderRadius:'50%',
              border:'1px solid',
              borderColor:isToday?'#6558F5':style.border,
              bgcolor:style.bg,
              color:day.status==='neutral'?'#7A8495':'#08275B',
              display:'grid',
              placeItems:'center',
              position:'relative',
              boxShadow:isToday?'0 0 0 1px #6558F5 inset':'none',
              cursor:'default',
            }}
          >
            <AlexText sx={{fontSize:{xs:9.5,sm:10.5},fontWeight:isToday?900:700,lineHeight:1}}>{day.day}</AlexText>
            {isExamDate&&<Star
              aria-hidden="true"
              size={8}
              strokeWidth={1.8}
              fill="#F5C451"
              color="#9B6A00"
              style={{position:'absolute',right:-1,top:-2}}
            />}
            {day.practiced&&<AlexBox
              aria-hidden="true"
              sx={{position:'absolute',bottom:2.5,width:3.5,height:3.5,borderRadius:'50%',bgcolor:style.color}}
            />}
          </AlexBox>
        </AlexTooltip>
      })}
    </AlexBox>

    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:.8,flexWrap:'wrap',mt:1.15,pt:1,borderTop:'1px solid #F0EDE7'}}>
      <AlexBox sx={{display:'flex',gap:.8,flexWrap:'wrap'}}>
        {(['ahead','on-track','behind'] as StudyPlanDayStatus[]).map(status=>{
          const style=STATUS_STYLE[status]
          return <AlexBox key={status} sx={{display:'flex',alignItems:'center',gap:.45}}>
            <AlexBox sx={{width:8,height:8,borderRadius:'50%',bgcolor:style.bg,border:`1px solid ${style.border}`}}/>
            <AlexText sx={{fontSize:9.5,color:'#667085'}}>{style.label}</AlexText>
          </AlexBox>
        })}
      </AlexBox>
      <AlexText sx={{fontSize:9.5,color:'#98A2B3'}}>
        {ahead} ahead · {onTrack} on plan · {behind} behind
      </AlexText>
    </AlexBox>
  </AlexSurface>
}
