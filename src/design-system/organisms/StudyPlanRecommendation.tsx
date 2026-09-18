import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import type {PracticePlanRecommendation} from '../../lib/practicePlan'

type Props={recommendation:PracticePlanRecommendation;compact?:boolean}

export default function StudyPlanRecommendation({recommendation,compact=false}:Props){
  const scoreGoalMet=recommendation.targetScore===null||(recommendation.estimatedScore!==null&&recommendation.scoreGap!==null&&recommendation.scoreGap<=0)
  const complete=recommendation.remainingQuestions===0&&scoreGoalMet
  const dailyMinutes=complete?0:recommendation.estimatedDailyMinutes
  const sessionLabel=recommendation.recommendedSessionsPerDay===1?'1 session':`${recommendation.recommendedSessionsPerDay} sessions`

  return <AlexSurface sx={{
    p:compact?0:{xs:2.25,md:3},
    border:compact?'none':'1px solid #D8D2FF',
    borderRadius:compact?0:3,
    bgcolor:compact?'transparent':'#FCFBFF',
  }}>
    {!compact&&<>
      <AlexText component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:24,fontWeight:500,color:'#08275B'}}>
        Recommended daily practice
      </AlexText>
      <AlexText sx={{fontSize:13.5,color:'#667085',mt:.5}}>
        Based on your exam date, current practice pace, question coverage, and score goal.
      </AlexText>
    </>}

    <AlexBox sx={{mt:compact?0:2,display:'flex',alignItems:'baseline',gap:1.1,flexWrap:'wrap'}}>
      <AlexText sx={{fontSize:compact?28:38,fontWeight:900,lineHeight:1,color:'#08275B'}}>
        {complete?'On track':`${dailyMinutes} min/day`}
      </AlexText>
      {!complete&&<AlexText sx={{fontSize:13.5,color:'#667085'}}>
        {sessionLabel} · {recommendation.questionsPerSession} questions/session
      </AlexText>}
    </AlexBox>

    {!complete&&recommendation.focusLabel&&recommendation.focusSharePercent&&
      <AlexText sx={{mt:1.25,fontSize:13.5,lineHeight:1.5,color:'#344054'}}>
        Focus about {recommendation.focusSharePercent}% of targeted work on <b>{recommendation.focusLabel}</b>, and use the rest for mixed practice.
      </AlexText>}

    {!compact&&
      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'repeat(3,minmax(0,1fr))'},gap:1,mt:2}}>
        <AlexSurface sx={{p:1.4,border:'1px solid #E4E7EC',borderRadius:2,bgcolor:'#fff'}}>
          <AlexText sx={{fontSize:11,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.05em'}}>Practice estimate</AlexText>
          <AlexText sx={{fontSize:18,fontWeight:850,color:'#08275B',mt:.3}}>{recommendation.estimatedScore??'Need baseline'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:1.4,border:'1px solid #E4E7EC',borderRadius:2,bgcolor:'#fff'}}>
          <AlexText sx={{fontSize:11,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.05em'}}>Target</AlexText>
          <AlexText sx={{fontSize:18,fontWeight:850,color:'#08275B',mt:.3}}>{recommendation.targetScore??'Not set'}</AlexText>
        </AlexSurface>
        <AlexSurface sx={{p:1.4,border:'1px solid #E4E7EC',borderRadius:2,bgcolor:'#fff'}}>
          <AlexText sx={{fontSize:11,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.05em'}}>Days left</AlexText>
          <AlexText sx={{fontSize:18,fontWeight:850,color:'#08275B',mt:.3}}>{recommendation.daysRemaining}</AlexText>
        </AlexSurface>
      </AlexBox>}

    {!compact&&recommendation.estimatedScore===null&&recommendation.targetScore!==null&&
      <AlexText sx={{mt:1.5,fontSize:12.75,lineHeight:1.5,color:'#667085'}}>
        Complete practice in both sections to establish a score estimate and refine this recommendation.
      </AlexText>}
    {!compact&&scoreGoalMet&&recommendation.estimatedScore!==null&&
      <AlexText sx={{mt:1.5,fontSize:12.75,lineHeight:1.5,color:'#667085'}}>
        Keep sessions mixed and review missed questions to maintain consistency.
      </AlexText>}
  </AlexSurface>
}
