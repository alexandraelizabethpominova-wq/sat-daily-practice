import {BookOpenCheck,CalendarDays,Sparkles,Target} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={
  accuracy:number|null
  estimatedScore:number|null
  targetScore:number|null
  daysRemaining:number
  dailyMinutes:number
  questionsPerSession:number
  focusLabel:string|null
  onChoosePracticeTest:()=>void
  onStartPractice:()=>void
}

export default function StudyPlanHero({
  accuracy,estimatedScore,targetScore,daysRemaining,dailyMinutes,questionsPerSession,focusLabel,
  onChoosePracticeTest,onStartPractice,
}:Props){
  const todayLabel=dailyMinutes>0?`${dailyMinutes} min today`:`${questionsPerSession} questions`

  return <AlexSurface
    sx={{
      position:'relative',overflow:'hidden',borderRadius:3.5,border:'1px solid #D9E7F8',
      bgcolor:'#EAF3FF',boxShadow:'0 10px 30px rgba(9,35,79,.055)',
      p:{xs:2.5,md:4},display:'grid',gridTemplateColumns:{xs:'1fr',lg:'minmax(0,1.35fr) minmax(300px,.65fr)'},
      gap:{xs:3,lg:4},alignItems:'center',
    }}
  >
    <AlexBox sx={{position:'relative',zIndex:1}}>
      <AlexText sx={{fontSize:12,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:850,color:'#245F9E'}}>Study plan</AlexText>
      <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:36,md:50},lineHeight:1.04,letterSpacing:'-.035em',mt:1,mb:1.5,color:'#08275B'}}>
        Your SAT practice plan
      </AlexText>
      <AlexText sx={{color:'#3F5E86',fontSize:16,lineHeight:1.65,maxWidth:650}}>
        Keep your goal in view, focus on the questions that need attention, and make steady progress without overloading each day.
      </AlexText>

      <AlexBox sx={{display:'flex',gap:1.25,flexWrap:'wrap',mt:2.5}}>
        <AlexButton onClick={onChoosePracticeTest}>Choose a practice test</AlexButton>
        <AlexButton tone="secondary" onClick={onStartPractice}>Start {questionsPerSession} questions</AlexButton>
      </AlexBox>

      <AlexBox sx={{display:'flex',gap:1.25,flexWrap:'wrap',mt:2.5}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,bgcolor:'rgba(255,255,255,.68)',border:'1px solid rgba(36,95,158,.16)',borderRadius:999,px:1.4,py:.75}}>
          <Sparkles size={16}/>
          <AlexText sx={{fontSize:13,fontWeight:800,color:'#214E80'}}>{todayLabel}</AlexText>
        </AlexBox>
        {focusLabel&&<AlexBox sx={{display:'flex',alignItems:'center',gap:.75,bgcolor:'rgba(255,255,255,.68)',border:'1px solid rgba(36,95,158,.16)',borderRadius:999,px:1.4,py:.75}}>
          <Target size={16}/>
          <AlexText sx={{fontSize:13,fontWeight:800,color:'#214E80'}}>Focus: {focusLabel}</AlexText>
        </AlexBox>}
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{display:'grid',gap:1.4,position:'relative',zIndex:1}}>
      <AlexSurface sx={{position:'relative',minHeight:150,border:0,borderRadius:3,bgcolor:'#FFF9DD',overflow:'hidden',p:2.25}}>
        <AlexText sx={{fontSize:11,fontWeight:850,textTransform:'uppercase',letterSpacing:'.1em',color:'#6B5A12'}}>Current estimate</AlexText>
        <AlexText sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:34,fontWeight:700,color:'#08275B',mt:.45}}>
          {estimatedScore??'—'}
        </AlexText>
        <AlexText sx={{fontSize:12.5,color:'#667085',mt:.3}}>
          {accuracy!==null?`${accuracy}% overall accuracy`:'Complete a few questions to calibrate'}
        </AlexText>
        <AlexBox sx={{position:'absolute',right:18,bottom:10,width:96,height:96,borderRadius:'50%',bgcolor:'#D9ECFF',display:'grid',placeItems:'center',transform:'rotate(-6deg)'}}>
          <BookOpenCheck size={48} strokeWidth={1.6}/>
        </AlexBox>
        <Sparkles size={20} style={{position:'absolute',right:112,top:24}}/>
      </AlexSurface>

      <AlexBox sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1.4}}>
        <AlexSurface sx={{p:1.8,border:0,borderRadius:2.5,bgcolor:'#DFFFD3'}}>
          <Target size={18}/>
          <AlexText sx={{fontSize:10.5,fontWeight:850,textTransform:'uppercase',letterSpacing:'.08em',mt:.8,color:'#385B2E'}}>Goal score</AlexText>
          <AlexText sx={{fontSize:26,fontWeight:850,color:'#08275B',mt:.2}}>{targetScore??'—'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:1.8,border:0,borderRadius:2.5,bgcolor:'#F2E7FF'}}>
          <CalendarDays size={18}/>
          <AlexText sx={{fontSize:10.5,fontWeight:850,textTransform:'uppercase',letterSpacing:'.08em',mt:.8,color:'#66428A'}}>Days until exam</AlexText>
          <AlexText sx={{fontSize:26,fontWeight:850,color:'#08275B',mt:.2}}>{daysRemaining}</AlexText>
        </AlexSurface>
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{position:'absolute',width:180,height:180,borderRadius:'50%',bgcolor:'rgba(255,255,255,.34)',right:-70,top:-70}}/>
    <AlexBox sx={{position:'absolute',width:90,height:90,borderRadius:'50%',bgcolor:'rgba(178,219,255,.32)',left:'54%',bottom:-38}}/>
  </AlexSurface>
}
