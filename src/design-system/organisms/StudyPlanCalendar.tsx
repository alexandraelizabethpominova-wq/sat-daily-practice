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
  ahead:{bg:'#E6F7DE',border:'#B9DDAA',color:'#315F25',label:'Ahead'},
  'on-track':{bg:'#E9F3FF',border:'#B8D8F4',color:'#245F9E',label:'On plan'},
  behind:{bg:'#FFF0E7',border:'#F1CDBA',color:'#914D2C',label:'Behind'},
  planned:{bg:'#F5EEFF',border:'#DED0F1',color:'#6B4A91',label:'Planned'},
  neutral:{bg:'#fff',border:'#E7E3DC',color:'#98A2B3',label:'Not tracked'},
}

const WEEKDAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function monthTitle(year:number,month:number){
  return new Intl.DateTimeFormat(undefined,{month:'long',year:'numeric'}).format(new Date(year,month,1))
}

export default function StudyPlanCalendar({sessions,settings,recommendation}:Props){
  const today=new Date()
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
  const pastTracked=days.filter(day=>day.status==='ahead'||day.status==='on-track'||day.status==='behind')
  const ahead=pastTracked.filter(day=>day.status==='ahead').length
  const onTrack=pastTracked.filter(day=>day.status==='on-track').length
  const behind=pastTracked.filter(day=>day.status==='behind').length
  const practiced=days.filter(day=>day.practiced).length

  function moveMonth(delta:number){
    const next=new Date(view.year,view.month+delta,1)
    setView({year:next.getFullYear(),month:next.getMonth()})
  }

  return <AlexSurface
    component="section"
    sx={{p:{xs:2.25,md:3},border:'1px solid #E4E7EC',borderRadius:3,bgcolor:'#fff'}}
  >
    <AlexBox sx={{display:'flex',alignItems:{xs:'flex-start',sm:'center'},justifyContent:'space-between',gap:2,mb:2.25}}>
      <AlexBox sx={{minWidth:0}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:1}}>
          <CalendarDays size={20} color="#6558F5"/>
          <AlexText component="h2" sx={{fontSize:22,fontWeight:800,color:'#08275B'}}>Practice calendar</AlexText>
        </AlexBox>
        <AlexText sx={{mt:.6,fontSize:13.5,lineHeight:1.5,color:'#667085'}}>
          See which days you practiced and whether that day was ahead of, on, or behind your current plan.
        </AlexText>
      </AlexBox>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.5,flexShrink:0}}>
        <AlexIconButton label="Previous month" onClick={()=>moveMonth(-1)}><ChevronLeft size={18}/></AlexIconButton>
        <AlexText sx={{minWidth:{xs:108,sm:132},textAlign:'center',fontSize:14,fontWeight:850,color:'#08275B'}}>{monthTitle(view.year,view.month)}</AlexText>
        <AlexIconButton label="Next month" onClick={()=>moveMonth(1)}><ChevronRight size={18}/></AlexIconButton>
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',lg:'minmax(0,1fr) 220px'},gap:2.25,alignItems:'start'}}>
      <AlexBox sx={{minWidth:0}}>
        <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:{xs:.45,sm:.75},mb:.65}}>
          {WEEKDAYS.map(day=><AlexText key={day} sx={{textAlign:'center',fontSize:11,fontWeight:800,color:'#667085'}}>{day}</AlexText>)}
        </AlexBox>

        <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:{xs:.45,sm:.75}}}>
          {Array.from({length:firstWeekday},(_,index)=><AlexBox key={`empty-${index}`} aria-hidden="true"/>)}
          {days.map(day=>{
            const style=STATUS_STYLE[day.status]
            const isToday=day.date===`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
            return <AlexBox
              key={day.date}
              aria-label={`${day.date}: ${style.label}${day.practiced?`, ${day.questionCount} questions practiced`:''}`}
              sx={{
                minHeight:{xs:54,sm:68},p:{xs:.65,sm:.9},borderRadius:2,
                border:'1px solid',borderColor:isToday?'#6558F5':style.border,
                bgcolor:style.bg,display:'flex',flexDirection:'column',justifyContent:'space-between',
                boxShadow:isToday?'0 0 0 1px #6558F5 inset':'none',
              }}
            >
              <AlexText sx={{fontSize:{xs:12,sm:13},fontWeight:isToday?900:750,color:'#08275B'}}>{day.day}</AlexText>
              {day.practiced&&<AlexBox sx={{display:'flex',alignItems:'center',gap:.45,minWidth:0}}>
                <AlexBox aria-hidden="true" sx={{width:6,height:6,borderRadius:'50%',bgcolor:style.color,flex:'0 0 auto'}}/>
                <AlexText sx={{fontSize:{xs:9.5,sm:10.5},fontWeight:800,color:style.color,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                  {day.questionCount} q
                </AlexText>
              </AlexBox>}
            </AlexBox>
          })}
        </AlexBox>
      </AlexBox>

      <AlexBox sx={{display:'grid',gap:1.25}}>
        <AlexSurface sx={{p:1.6,border:'1px solid #E7E3DC',borderRadius:2.5,bgcolor:'#FAFAF8'}}>
          <AlexText sx={{fontSize:11,fontWeight:850,textTransform:'uppercase',letterSpacing:'.07em',color:'#667085'}}>Current pace</AlexText>
          <AlexText sx={{fontSize:24,fontWeight:900,color:'#08275B',mt:.35}}>
            {targetQuestions>0?`${targetQuestions} q/day`:'Flexible'}
          </AlexText>
          <AlexText sx={{fontSize:12.25,lineHeight:1.45,color:'#667085',mt:.45}}>
            {targetQuestions>0
              ?`${recommendation.recommendedSessionsPerDay} session${recommendation.recommendedSessionsPerDay===1?'':'s'} × ${recommendation.questionsPerSession} questions`
              :'You are currently on pace; extra practice counts as ahead.'}
          </AlexText>
        </AlexSurface>

        <AlexBox sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:.8}}>
          <MiniStat label="Practiced" value={practiced} bg="#F7F7F5"/>
          <MiniStat label="Ahead" value={ahead} bg="#E6F7DE"/>
          <MiniStat label="On plan" value={onTrack} bg="#E9F3FF"/>
          <MiniStat label="Behind" value={behind} bg="#FFF0E7"/>
        </AlexBox>

        <AlexBox sx={{display:'flex',flexWrap:'wrap',gap:.8,pt:.25}}>
          {(['ahead','on-track','behind','planned'] as StudyPlanDayStatus[]).map(status=>{
            const style=STATUS_STYLE[status]
            return <AlexBox key={status} sx={{display:'flex',alignItems:'center',gap:.55}}>
              <AlexBox sx={{width:9,height:9,borderRadius:'50%',bgcolor:style.bg,border:`1px solid ${style.border}`}}/>
              <AlexText sx={{fontSize:11.5,color:'#667085'}}>{style.label}</AlexText>
            </AlexBox>
          })}
        </AlexBox>
      </AlexBox>
    </AlexBox>

    <AlexText sx={{mt:1.75,fontSize:11.5,lineHeight:1.45,color:'#98A2B3'}}>
      Pace status compares questions completed that day with your current daily recommendation. Tracking begins with your first recorded practice day.
    </AlexText>
  </AlexSurface>
}

function MiniStat({label,value,bg}:{label:string;value:number;bg:string}){
  return <AlexSurface sx={{p:1.15,border:'1px solid #E7E3DC',borderRadius:2,bgcolor:bg}}>
    <AlexText sx={{fontSize:10.5,fontWeight:800,color:'#667085'}}>{label}</AlexText>
    <AlexText sx={{fontSize:20,fontWeight:900,color:'#08275B',mt:.15}}>{value}</AlexText>
  </AlexSurface>
}
