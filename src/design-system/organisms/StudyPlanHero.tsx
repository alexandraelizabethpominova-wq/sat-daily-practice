import {CalendarDays,Gamepad2,Sparkles,Target,Trophy} from 'lucide-react'
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
      position:'relative',overflow:'hidden',
      borderRadius:5,border:'2px solid #D9D1FF',
      bgcolor:'#EEE9FF',
      boxShadow:'0 7px 0 #D7CFFF, 0 16px 36px rgba(54,39,115,.10)',
      p:{xs:2.5,md:4},
      display:'grid',
      gridTemplateColumns:{xs:'1fr',lg:'minmax(0,1.3fr) minmax(300px,.7fr)'},
      gap:{xs:3,lg:4},alignItems:'center',
    }}
  >
    <AlexBox sx={{position:'relative',zIndex:1}}>
      <AlexBox sx={{display:'inline-flex',alignItems:'center',gap:.7,bgcolor:'#251B4B',color:'#fff',px:1.35,py:.7,borderRadius:999}}>
        <Gamepad2 size={16}/>
        <AlexText sx={{fontSize:11,fontWeight:900,letterSpacing:'.1em',textTransform:'uppercase'}}>Alexified · Your next move</AlexText>
      </AlexBox>

      <AlexText component="h1" sx={{
        fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',
        fontSize:{xs:38,md:52},fontWeight:900,lineHeight:1.02,letterSpacing:'-.045em',
        mt:1.4,mb:1.5,color:'#251B4B',maxWidth:690
      }}>
        Ready to get Alexified?
      </AlexText>
      <AlexText sx={{color:'#5B5278',fontSize:16,lineHeight:1.65,maxWidth:650}}>
        Small sessions, smart focus, no giant cram quest. Lock in for today, keep the streak moving, and let the stats tell you what to hit next.
      </AlexText>

      <AlexBox sx={{display:'flex',gap:1.25,flexWrap:'wrap',mt:2.6}}>
        <AlexButton onClick={onStartPractice} startIcon={<Sparkles size={18}/>}>Activate Alex Mode</AlexButton>
        <AlexButton tone="secondary" onClick={onChoosePracticeTest}>Pick a test</AlexButton>
      </AlexBox>

      <AlexBox sx={{display:'flex',gap:1.1,flexWrap:'wrap',mt:2.5}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.75,bgcolor:'#FFF7D9',border:'2px solid #F1D97D',borderRadius:999,px:1.35,py:.72}}>
          <Sparkles size={16}/>
          <AlexText sx={{fontSize:13,fontWeight:900,color:'#5C4811'}}>Lock in · {todayLabel}</AlexText>
        </AlexBox>
        {focusLabel&&<AlexBox sx={{display:'flex',alignItems:'center',gap:.75,bgcolor:'#DFF8ED',border:'2px solid #A7E6C9',borderRadius:999,px:1.35,py:.72}}>
          <Target size={16}/>
          <AlexText sx={{fontSize:13,fontWeight:900,color:'#235D48'}}>Next up · {focusLabel}</AlexText>
        </AlexBox>}
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{display:'grid',gap:1.4,position:'relative',zIndex:1}}>
      <AlexSurface sx={{position:'relative',minHeight:158,border:'2px solid #F0D878',borderRadius:4,bgcolor:'#FFF7D9',overflow:'hidden',p:2.25,boxShadow:'0 5px 0 #E5D08B'}}>
        <AlexText sx={{fontSize:11,fontWeight:900,textTransform:'uppercase',letterSpacing:'.11em',color:'#7A5E10'}}>Leveling up</AlexText>
        <AlexText sx={{fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',fontSize:38,fontWeight:900,color:'#251B4B',mt:.35}}>
          {estimatedScore??'—'}
        </AlexText>
        <AlexText sx={{fontSize:12.5,color:'#6D6785',mt:.3}}>
          {accuracy!==null?`${accuracy}% overall accuracy`:'Do a few questions to unlock your estimate'}
        </AlexText>
        <AlexBox sx={{position:'absolute',right:18,bottom:12,width:92,height:92,borderRadius:'32% 68% 58% 42% / 45% 38% 62% 55%',bgcolor:'#FFB8A8',display:'grid',placeItems:'center',transform:'rotate(-7deg)'}}>
          <Trophy size={44} strokeWidth={1.8}/>
        </AlexBox>
      </AlexSurface>

      <AlexBox sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1.4}}>
        <AlexSurface sx={{p:1.8,border:'2px solid #A7E6C9',borderRadius:3.5,bgcolor:'#DFF8ED',boxShadow:'0 4px 0 #B9E4D1'}}>
          <Target size={18}/>
          <AlexText sx={{fontSize:10.5,fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em',mt:.8,color:'#235D48'}}>Goal score</AlexText>
          <AlexText sx={{fontSize:28,fontWeight:900,color:'#251B4B',mt:.2}}>{targetScore??'—'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:1.8,border:'2px solid #D7CFFF',borderRadius:3.5,bgcolor:'#F4F0FF',boxShadow:'0 4px 0 #DED7F3'}}>
          <CalendarDays size={18}/>
          <AlexText sx={{fontSize:10.5,fontWeight:900,textTransform:'uppercase',letterSpacing:'.08em',mt:.8,color:'#5B46B0'}}>Days to go</AlexText>
          <AlexText sx={{fontSize:28,fontWeight:900,color:'#251B4B',mt:.2}}>{daysRemaining}</AlexText>
        </AlexSurface>
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{position:'absolute',width:190,height:190,borderRadius:'50%',bgcolor:'rgba(255,255,255,.34)',right:-72,top:-74}}/>
    <AlexBox sx={{position:'absolute',width:110,height:110,borderRadius:'32%',bgcolor:'rgba(255,107,107,.10)',left:'52%',bottom:-54,transform:'rotate(18deg)'}}/>
  </AlexSurface>
}
