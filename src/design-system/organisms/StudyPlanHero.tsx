import {BookOpenCheck,CalendarDays,Sparkles,Target} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexInfoTooltipButton from '../atoms/AlexInfoTooltipButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import {dashboardTypography} from '../theme'

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
      p:0,display:'grid',gridTemplateColumns:{xs:'1fr',xl:'var(--dashboard-columns)'},
      gap:{xs:1.25,sm:1.5,xl:'var(--dashboard-column-gap)'},alignItems:'stretch',height:{xs:'auto',xl:'100%'},minHeight:0,
    }}
  >
    <AlexBox sx={{position:'relative',zIndex:1,p:{xs:1.1,sm:1.3,md:1.45,lg:1.6},display:'flex',flexDirection:'column',justifyContent:'center',minWidth:0}}>
      <AlexText sx={{fontSize:dashboardTypography.eyebrow,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:850,color:'#245F9E'}}>Study plan</AlexText>
      <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:dashboardTypography.heroTitle,lineHeight:1.04,letterSpacing:'-.035em',mt:1,mb:1.5,color:'#08275B'}}>
        Your SAT practice plan
      </AlexText>
      <AlexText sx={{color:'#3F5E86',fontSize:dashboardTypography.heroBody,lineHeight:1.6,maxWidth:650}}>
        Keep your goal in view, focus on the questions that need attention, and make steady progress without overloading each day.
      </AlexText>

      <AlexBox sx={{display:'flex',gap:1,flexWrap:'wrap',mt:{xs:.55,sm:.7,lg:.8},flexDirection:{xs:'column',sm:'row'}}}>
        <AlexButton fullWidth onClick={onChoosePracticeTest} sx={{width:{xs:'100%',sm:'auto'}}}>Choose a practice test</AlexButton>
        <AlexButton fullWidth tone="secondary" onClick={onStartPractice} sx={{width:{xs:'100%',sm:'auto'}}}>Start {questionsPerSession} questions</AlexButton>
      </AlexBox>

    </AlexBox>

    <AlexBox sx={{
      display:'grid',
      gridTemplateRows:{xs:'auto auto',xl:'minmax(0,1fr) minmax(0,.78fr)'},
      gap:{xs:.75,sm:1},
      position:'relative',zIndex:1,minHeight:0,
      height:{xs:'auto',xl:'100%'},
      py:{xs:0,sm:.5,xl:1},
      pr:0,pl:0,
    }}>
      <AlexSurface sx={{position:'relative',minHeight:0,height:{xs:'auto',xl:'100%'},border:0,bgcolor:'#FFF9DD',overflow:'hidden',p:{xs:1.1,sm:1.2,xl:1.05}}}>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.25,color:'#6B5A12'}}>
          <AlexText sx={{fontSize:dashboardTypography.cardTitle,fontWeight:850,textTransform:'uppercase',letterSpacing:'.1em',color:'inherit'}}>Current estimate</AlexText>
          <AlexInfoTooltipButton
            label="PSAT scholarship score information"
            title={<>
              <b>PSAT/NMSQT scholarship context</b><br/>
              This is a rough Massachusetts National Merit qualifying outlook, not a scholarship guarantee. National Merit uses Selection Index = (2 × Reading & Writing + Math) ÷ 10, on a 48–228 scale. The current Class of 2028 Massachusetts estimated Semifinalist range is about 220–225, while the actual cutoff can change. A Merit Scholarship still requires advancing beyond Semifinalist status and is not determined by score alone.
            </>}
          />
        </AlexBox>
        <AlexText sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:dashboardTypography.heroScore,fontWeight:700,color:'#08275B',mt:.45}}>
          {estimatedScore??'—'}
        </AlexText>
        <AlexBox sx={{display:'flex',alignItems:'center',gap:.35,mt:.2,color:'#667085',minWidth:0}}>
          <AlexText sx={{fontSize:11.5,color:'inherit',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            {nationalMeritChance!==null
              ?`${nationalMeritChance}% National Merit outlook${projectedSelectionIndex!==null?` · SI ~${projectedSelectionIndex}`:''}`
              :accuracy!==null?'Calibrating National Merit outlook':'Complete a few questions to calibrate'}
          </AlexText>
          <AlexInfoTooltipButton
            label="Score estimate details"
            title={<>
              <b>National Merit outlook</b><br/>
              {nationalMeritChance!==null
                ?`${nationalMeritChance}% estimated qualifying outlook${projectedSelectionIndex!==null?` · projected Selection Index ~${projectedSelectionIndex}`:''}.`
                :'The National Merit outlook is still calibrating.'}
              <br/><br/>
              {estimateConfidence&&<>
                <b>Estimate confidence</b><br/>
                {estimateConfidence.label} estimate confidence · {estimateConfidence.within80}% within ±80 points. This combines recent question-pool uncertainty, score stability, and SAT measurement error. It is a model estimate, not a guarantee.
              </>}
            </>}
          />
        </AlexBox>
        <AlexBox sx={{
          position:'absolute',
          right:{xs:10,sm:14},
          top:'50%',
          bottom:'auto',
          width:{xs:64,sm:76},
          height:{xs:64,sm:76},
          borderRadius:'50%',
          bgcolor:'#D9ECFF',
          display:'grid',
          placeItems:'center',
          transform:'translateY(-50%) rotate(-6deg)',
        }}>
          <BookOpenCheck size={34} strokeWidth={1.6}/>
        </AlexBox>
        <Sparkles size={20} style={{position:'absolute',right:112,top:24}}/>
      </AlexSurface>

      <AlexBox sx={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:{xs:.75,sm:1},minHeight:0,height:{xl:'100%'}}}>
        <AlexSurface sx={{p:{xs:1,sm:1.05,xl:.9},border:0,bgcolor:'#DFFFD3',minHeight:0,display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <Target size={18}/>
          <AlexText sx={{fontSize:dashboardTypography.cardTitle,fontWeight:850,textTransform:'uppercase',letterSpacing:'.08em',mt:.45,color:'#385B2E'}}>Goal score</AlexText>
          <AlexText sx={{fontSize:dashboardTypography.supportTitle,fontWeight:850,color:'#08275B',mt:.2}}>{targetScore??'—'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:{xs:1,sm:1.05,xl:.9},border:0,bgcolor:'#F2E7FF',minHeight:0,display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <CalendarDays size={18}/>
          <AlexText sx={{fontSize:dashboardTypography.cardTitle,fontWeight:850,textTransform:'uppercase',letterSpacing:'.08em',mt:.45,color:'#66428A'}}>Days until exam</AlexText>
          <AlexText sx={{fontSize:dashboardTypography.supportTitle,fontWeight:850,color:'#08275B',mt:.2}}>{daysRemaining}</AlexText>
        </AlexSurface>
      </AlexBox>
    </AlexBox>

    <AlexBox sx={{position:'absolute',width:180,height:180,borderRadius:'50%',bgcolor:'rgba(255,255,255,.34)',right:-70,top:-70}}/>
    <AlexBox sx={{position:'absolute',width:90,height:90,borderRadius:'50%',bgcolor:'rgba(178,219,255,.32)',left:'54%',bottom:-38}}/>
  </AlexSurface>
}
