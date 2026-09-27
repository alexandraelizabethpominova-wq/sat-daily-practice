import {useMemo,useState} from 'react'
import {CalendarDays,ChevronLeft,ChevronRight,Star} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexIconButton from '../atoms/AlexIconButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTooltip from '../atoms/AlexTooltip'
import AlexCalendarStatusIcon from '../atoms/AlexCalendarStatusIcon'
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
  behind:{bg:'#FFF0E7',border:'#F0C5AD',color:'#914D2C',label:'Below target'},
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
  const targetSessions=Math.max(0,recommendation.recommendedSessionsPerDay)
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
      minHeight:{xs:340,md:360,lg:370},
      display:'flex',
      flexDirection:'column',
    }}
  >
    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1.25,mb:1.15}}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,minWidth:0}}>
        <CalendarDays size={16} color="#6558F5"/>
        <AlexText sx={{fontSize:12,fontWeight:850,color:'#08275B'}}>Practice calendar</AlexText>
      </AlexBox>
      <AlexText sx={{fontSize:10.5,fontWeight:800,color:'#667085',whiteSpace:'nowrap'}}>
        {targetSessions>0?`${targetSessions} session${targetSessions===1?'':'s'}/day`:'Flexible pace'}
      </AlexText>
    </AlexBox>

    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
      <AlexIconButton label="Previous month" onClick={()=>moveMonth(-1)}><ChevronLeft size={16}/></AlexIconButton>
      <AlexText sx={{fontSize:11.5,fontWeight:900,letterSpacing:'.045em',color:'#08275B',textTransform:'uppercase'}}>
        {monthTitle(view.year,view.month)}
      </AlexText>
      <AlexIconButton label="Next month" onClick={()=>moveMonth(1)}><ChevronRight size={16}/></AlexIconButton>
    </AlexBox>

    <AlexBox sx={{
      display:'grid',
      gridTemplateColumns:'repeat(7,minmax(0,1fr))',
      columnGap:.2,
      width:'92%',
      mx:'auto',
      mb:.7,
    }}>
      {WEEKDAYS.map((day,index)=><AlexText key={`${day}-${index}`} sx={{textAlign:'center',fontSize:9,fontWeight:850,color:'#667085'}}>{day}</AlexText>)}
    </AlexBox>

    <AlexBox sx={{
      display:'grid',
      gridTemplateColumns:'repeat(7,minmax(0,1fr))',
      gridAutoRows:'42px',
      columnGap:.2,
      rowGap:.35,
      width:'92%',
      mx:'auto',
      flex:'0 0 auto',
      minHeight:0,
      alignItems:'center',
      alignContent:'stretch',
    }}>
      {Array.from({length:firstWeekday},(_,index)=><AlexBox key={`empty-${index}`} aria-hidden="true"/>)}
      {days.map(day=>{
        const style=STATUS_STYLE[day.status]
        const isToday=day.date===todayKey
        const isExamDate=Boolean(settings.targetExamDate&&day.date===settings.targetExamDate)
        const hasTrackedGoal=targetSessions>0&&(day.status==='ahead'||day.status==='on-track'||day.status==='behind')
        const title=[
          style.label,
          isExamDate?'Exam date':'',
          day.practiced
            ?`${targetSessions>0?`${day.sessionCount} of ${targetSessions}`:day.sessionCount} session${targetSessions===1&&day.sessionCount===1?'':'s'} · ${day.questionCount} questions`
            :hasTrackedGoal?'No practice recorded':'',
        ].filter(Boolean).join(' · ')
        return <AlexTooltip
          key={day.date}
          title={title}
          arrow
          placement="top"
          enterDelay={100}
          enterNextDelay={50}
          leaveDelay={80}
          describeChild
          slotProps={{popper:{sx:{zIndex:1600}}}}
        >
          <AlexBox
            component="span"
            tabIndex={0}
            title={title}
            aria-label={`${day.date}: ${title}`}
            sx={{
              width:'100%',
              aspectRatio:'1 / 1',
              maxWidth:38,
              justifySelf:'center',
              borderRadius:isExamDate?0:'50%',
              border:isExamDate?'none':'1px solid',
              borderColor:isToday?'#6558F5':style.border,
              bgcolor:isExamDate?'transparent':style.bg,
              color:day.status==='neutral'?'#7A8495':'#08275B',
              display:'grid',
              placeItems:'center',
              position:'relative',
              boxShadow:!isExamDate&&isToday?'0 0 0 1px #6558F5 inset':'none',
              cursor:'help',
              outline:'none',
              '&:focus-visible':{boxShadow:'0 0 0 2px #6558F5'},
            }}
          >
            {isExamDate&&<AlexBox
              aria-hidden="true"
              sx={{
                position:'absolute',
                inset:-4,
                display:'grid',
                placeItems:'center',
                zIndex:0,
              }}
            >
              <Star
                size={44}
                strokeWidth={1.7}
                fill="#F5C451"
                color={isToday?'#6558F5':'#9B6A00'}
              />
            </AlexBox>}
            <AlexText sx={{
              position:'relative',
              zIndex:2,
              fontSize:{xs:10,sm:11.5},
              fontWeight:isExamDate||isToday?900:700,
              lineHeight:1,
              color:isExamDate?'#08275B':'inherit',
              transform:isExamDate?'translateY(-.5px)':'none',
            }}>{day.day}</AlexText>
            {day.practiced&&<AlexBox
              aria-hidden="true"
              sx={{
                position:'absolute',
                zIndex:3,
                top:-2.5,
                right:-2.5,
                width:14,
                height:14,
                borderRadius:'50%',
                bgcolor:'#fff',
                border:'1px solid #A6D8BE',
                boxShadow:'0 1px 3px rgba(16,24,40,.14)',
                display:'grid',
                placeItems:'center',
              }}
            >
              <AlexCalendarStatusIcon kind="check" sx={{width:10,height:10,color:'#027A48'}}/>
            </AlexBox>}
            {!day.practiced&&hasTrackedGoal&&day.status==='behind'&&<AlexBox
              aria-hidden="true"
              sx={{
                position:'absolute',
                zIndex:3,
                top:-2.5,
                right:-2.5,
                width:13,
                height:13,
                borderRadius:'50%',
                bgcolor:'#fff',
                border:'1px solid #F1B5B0',
                boxShadow:'0 1px 3px rgba(16,24,40,.14)',
                display:'grid',
                placeItems:'center',
              }}
            >
              <AlexCalendarStatusIcon kind="close" sx={{width:9.5,height:9.5,color:'#B42318'}}/>
            </AlexBox>}
          </AlexBox>
        </AlexTooltip>
      })}
    </AlexBox>

  </AlexSurface>
}
