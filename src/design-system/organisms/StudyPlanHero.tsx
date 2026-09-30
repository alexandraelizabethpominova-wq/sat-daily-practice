import {BookOpenCheck,CalendarDays,Sparkles,Target} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexInfoTooltipButton from '../atoms/AlexInfoTooltipButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={
  accuracy:number|null
  estimatedScore:number|null
  nationalMeritChance:number|null
  projectedSelectionIndex:number|null
  estimateConfidence:{label:string;within80:number;sigmaPoints:number}|null
  targetScore:number|null
  daysRemaining:number
  questionsPerSession:number
  onChoosePracticeTest:()=>void
  onStartPractice:()=>void
}

export default function StudyPlanHero({
  accuracy,estimatedScore,nationalMeritChance,projectedSelectionIndex,estimateConfidence,targetScore,daysRemaining,questionsPerSession,
  onChoosePracticeTest,onStartPractice,
}:Props){
  return <AlexSurface
    sx={{
      position:'relative',overflow:'hidden',border:'1px solid #D9E7F8',
      bgcolor:'#EAF3FF',boxShadow:'0 10px 30px rgba(9,35,79,.055)',
      p:{xs:1.5,sm:2,md:2.25,lg:2.5},display:'grid',gridTemplateColumns:{xs:'1fr',xl:'minmax(0,1.45fr) minmax(300px,.55fr)'},
      gap:{xs:1.5,sm:2,lg:2.5},alignItems:'center',height:'100%',minHeight:0,
    }}
  >
    <AlexBox sx={{position:'relative',zIndex:1}}>
      <AlexText sx={{fontSize:12,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:850,color:'#245F9E'}}>Study plan</AlexText>
      <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:30,sm:34,md:38,lg:42,xl:'clamp(34px,2.6vw,46px)'},lineHeight:1.04,letterSpacing:'-.035em',mt:1,mb:1.5,color:'#08275B'}}>
        Your SAT practice plan
      </AlexText>
      <AlexText sx={{color:'#3F5E86',fontSize:{xs:13,sm:14,lg:15},lineHeight:1.6,maxWidth:650}}>
        Keep your goal in view, focus on the questions that need attention, and make steady progress without overloading each day.
      </AlexText>

      <AlexBox sx={{display:'flex',gap:1,flexWrap:'wrap',mt:{xs:1.25,sm:1.5,lg:1.75},flexDirection:{xs:'column',sm:'row'}}}>
        <AlexButton fullWidth onClick={onChoosePracticeTest} sx={{width:{xs:'100%',sm:'auto'}}}>Choose a practice test</AlexButton>
        <AlexButton fullWidth tone="secondary" onClick={onStartPractice} sx={{width:{xs:'100%',sm:'auto'}}}>Start {questionsPerSession} questions</AlexButton>
      </AlexBox>

    </AlexBox>

    <AlexBox sx={{display:'grid',gridTemplateRows:'minmax(0,1.15fr) minmax(0,.85fr)',gap:{xs:.75,sm:1},position:'relative',zIndex:1,minHeight:0,height:'100%'}}>
      <AlexSurface sx={{position:'relative',minHeight:0,height:'100%',border:0,bgcolor:'#FFF9DD',overflow:'hidden',p:{xs:1.25,sm:1.5}}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.25,color:'#6B5A12'}}>
          <AlexText sx={{fontSize:11,fontWeight:850,textTransform:'uppercase',letterSpacing:'.1em',color:'inherit'}}>Current estimate</AlexText>
          <AlexInfoTooltipButton
            label="PSAT scholarship score information"
            title={<>
              <b>PSAT/NMSQT scholarship context</b><br/>
              This is a rough Massachusetts National Merit qualifying outlook, not a scholarship guarantee. National Merit uses Selection Index = (2 × Reading & Writing + Math) ÷ 10, on a 48–228 scale. The current Class of 2028 Massachusetts estimated Semifinalist range is about 220–225, while the actual cutoff can change. A Merit Scholarship still requires advancing beyond Semifinalist status and is not determined by score alone.
            </>}
          />
        </AlexBox>
        <AlexText sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:24,sm:26,lg:28},fontWeight:700,color:'#08275B',mt:.45}}>
          {estimatedScore??'—'}
        </AlexText>
        <AlexText sx={{fontSize:12.5,color:'#667085',mt:.3}}>
          {nationalMeritChance!==null
            ?`${nationalMeritChance}% National Merit qualifying outlook${projectedSelectionIndex!==null?` · SI ~${projectedSelectionIndex}`:''}`
            :accuracy!==null?'Calibrating National Merit outlook':'Complete a few questions to calibrate'}
        </AlexText>
        {estimateConfidence&&<AlexBox sx={{display:'flex',alignItems:'center',gap:.25,mt:.25,color:'#667085'}}>
          <AlexText sx={{fontSize:11.5,fontWeight:750,color:'inherit'}}>
            {estimateConfidence.label} estimate confidence · {estimateConfidence.within80}% within ±80
          </AlexText>
          <AlexInfoTooltipButton
            label="Score estimate confidence information"
            title={<>
              <b>Estimate confidence</b><br/>
              This estimates how likely an actual SAT score is to fall within ±80 points of the practice estimate. It combines recent question-pool uncertainty, recent score stability, and the SAT's published ±40-point total-score measurement error. It is a model estimate, not a guarantee.
            </>}
          />
        </AlexBox>}
        <AlexBox sx={{position:'absolute',right:{xs:10,sm:14},bottom:6,width:{xs:54,sm:62},height:{xs:54,sm:62},borderRadius:'50%',bgcolor:'#D9ECFF',display:'grid',placeItems:'center',transform:'rotate(-6deg)'}}>
          <BookOpenCheck size={28} strokeWidth={1.6}/>
        </AlexBox>
        <Sparkles size={20} style={{position:'absolute',right:112,top:24}}/>
      </AlexSurface>

      <AlexBox sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:{xs:.75,sm:1},minHeight:0}}>
        <AlexSurface sx={{p:{xs:1,sm:1.2},border:0,bgcolor:'#DFFFD3',minHeight:0}}>
          <Target size={18}/>
          <AlexText sx={{fontSize:10.5,fontWeight:850,textTransform:'uppercase',letterSpacing:'.08em',mt:.8,color:'#385B2E'}}>Goal score</AlexText>
          <AlexText sx={{fontSize:{xs:21,sm:23},fontWeight:850,color:'#08275B',mt:.2}}>{targetScore??'—'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:{xs:1,sm:1.2},border:0,bgcolor:'#F2E7FF',minHeight:0}}>
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
