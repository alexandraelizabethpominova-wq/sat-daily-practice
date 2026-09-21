import {useMemo,useState} from 'react'
import {CalendarDays,ChevronLeft,ChevronRight} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexIconButton from '../atoms/AlexIconButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
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
  'on-track':{bg:'#E5F1FF',border:'#A9CEF0',color:'#245F9E',label:'On plan'},
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
      p:{xs:2,sm:2.25},
      border:'1px solid #E4E7EC',
      borderRadius:3,
      bgcolor:'#fff',
      minWidth:0,
      height:'100%',
    }}
  >
    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1.5,mb:1.5}}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,minWidth:0}}>
        <CalendarDays size={18} color="#6558F5"/>
        <AlexText sx={{fontSize:13,fontWeight:850,color:'#08275B'}}>Practice calendar</AlexText>
      </AlexBox>
      <AlexText sx={{fontSize:11.5,fontWeight:800,color:'#667085',whiteSpace:'nowrap'}}>
        {targetQuestions>0?`${targetQuestions} q/day`:'Flexible pace'}
      </AlexText>
    </AlexBox>

    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1.25}}>
      <AlexIconButton label="Previous month" onClick={()=>moveMonth(-1)}><ChevronLeft size={16}/></AlexIconButton>
      <AlexText sx={{fontSize:13,fontWeight:900,letterSpacing:'.04em',color:'#08275B',textTransform:'uppercase'}}>
        {monthTitle(view.year,view.month)}
      </AlexText>
      <AlexIconButton label="Next month" onClick={()=>moveMonth(1)}><ChevronRight size={16}/></AlexIconButton>
    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:.5,mb:.55}}>
      {WEEKDAYS.map((day,index)=><AlexText key={`${day}-${index}`} sx={{textAlign:'center',fontSize:10,fontWeight:850,color:'#667085'}}>{day}</AlexText>)}
    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:.5}}>
      {Array.from({length:firstWeekday},(_,index)=><AlexBox key={`empty-${index}`} aria-hidden="true"/>)}
      {days.map(day=>{
        const style=STATUS_STYLE[day.status]
        const isToday=day.date===todayKey
        return <AlexBox
          key={day.date}
          title={`${style.label}${day.practiced?` · ${day.questionCount} questions practiced`:''}`}
          aria-label={`${day.date}: ${style.label}${day.practiced?`, ${day.questionCount} questions practiced`:''}`}
          sx={{
            width:'100%',
            aspectRatio:'1 / 1',
            maxWidth:36,
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
          }}
        >
          <AlexText sx={{fontSize:{xs:10.5,sm:11.5},fontWeight:isToday?900:700,lineHeight:1}}>{day.day}</AlexText>
          {day.practiced&&<AlexBox
            aria-hidden="true"
            sx={{position:'absolute',bottom:3,width:4,height:4,borderRadius:'50%',bgcolor:style.color}}
          />}
        </AlexBox>
      })}
    </AlexBox>

    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1,flexWrap:'wrap',mt:1.5,pt:1.25,borderTop:'1px solid #F0EDE7'}}>
      <AlexBox sx={{display:'flex',gap:1.1,flexWrap:'wrap'}}>
        {(['ahead','on-track','behind'] as StudyPlanDayStatus[]).map(status=>{
          const style=STATUS_STYLE[status]
          return <AlexBox key={status} sx={{display:'flex',alignItems:'center',gap:.45}}>
            <AlexBox sx={{width:8,height:8,borderRadius:'50%',bgcolor:style.bg,border:`1px solid ${style.border}`}}/>
            <AlexText sx={{fontSize:10.5,color:'#667085'}}>{style.label}</AlexText>
          </AlexBox>
        })}
      </AlexBox>
      <AlexText sx={{fontSize:10.5,color:'#98A2B3'}}>
        {ahead} ahead · {onTrack} on plan · {behind} behind
      </AlexText>
    </AlexBox>
  </AlexSurface>
}
