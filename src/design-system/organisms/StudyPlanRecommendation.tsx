import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import type {PracticePlanRecommendation} from '../../lib/practicePlan'

type Props={recommendation:PracticePlanRecommendation}

export default function StudyPlanRecommendation({recommendation}:Props){
  const scoreGoalMet=recommendation.targetScore===null||(recommendation.estimatedScore!==null&&recommendation.scoreGap!==null&&recommendation.scoreGap<=0)
  const complete=recommendation.remainingQuestions===0&&scoreGoalMet
  const estimateLabel=recommendation.estimatedScore===null?'Need baseline':String(recommendation.estimatedScore)
  const targetLabel=recommendation.targetScore===null?'Not set':String(recommendation.targetScore)

  return <AlexSurface sx={{p:{xs:2.25,md:3},border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#FCFBFF'}}>
    <AlexText component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:24,fontWeight:500,color:'#08275B'}}>Recommended pace</AlexText>
    <AlexText sx={{fontSize:13.5,color:'#667085',mt:.5}}>Calculated from the live question bank, exam date, coverage goal, target score, session size, and {recommendation.paceSource==='history'?'your measured pace':'your configured fallback pace'}.</AlexText>

    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(3,1fr)'},gap:1.25,mt:2}}>
      {[
        ['Practice estimate',estimateLabel],
        ['Target score',targetLabel],
        ['Score gap',recommendation.scoreGap===null?'—':recommendation.scoreGap<=0?'Goal met':`${recommendation.scoreGap} points`],
        ['Available bank',`${recommendation.bankQuestionCount} questions`],
        ['Available sets',`${recommendation.availablePracticeSetCount} of ${recommendation.targetPracticeSets} goal`],
        ['Time remaining',`${recommendation.daysRemaining} day${recommendation.daysRemaining===1?'':'s'}`],
      ].map(([label,value])=><AlexSurface key={label} sx={{p:1.5,border:'1px solid #E6E2DB',borderRadius:2,bgcolor:'#fff'}}><AlexText sx={{fontSize:11.5,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</AlexText><AlexText sx={{fontSize:18,fontWeight:850,color:'#08275B',mt:.4}}>{value}</AlexText></AlexSurface>)}
    </AlexBox>

    <AlexSurface sx={{mt:1.5,p:2,borderRadius:2.5,bgcolor:'#F3F0FF',border:'1px solid #D8D2FF'}}>
      <AlexText sx={{fontSize:15,fontWeight:850,color:'#08275B'}}>{complete?'Current practice goals are on track':`${recommendation.recommendedSessionsPerDay} session${recommendation.recommendedSessionsPerDay===1?'':'s'} per day · about ${recommendation.estimatedSessionMinutes} minutes each`}</AlexText>
      {!complete&&<AlexText sx={{fontSize:13,color:'#475467',mt:.5}}>About {recommendation.estimatedDailyMinutes} minutes per day at {recommendation.questionsPerSession} questions per session. {recommendation.remainingQuestions>0?`${recommendation.remainingQuestions} unique questions remain for the current coverage goal.`:'Coverage goal is complete; continue targeted review toward the score goal.'}</AlexText>}
    </AlexSurface>

    <AlexSurface sx={{mt:1.5,p:2,borderRadius:2.5,bgcolor:'#fff',border:'1px solid #E6E2DB'}}>
      <AlexText sx={{fontSize:12,fontWeight:850,textTransform:'uppercase',letterSpacing:'.07em',color:'#6558F5'}}>Score-improvement focus</AlexText>
      <AlexText sx={{fontSize:13.5,color:'#344054',mt:.65,lineHeight:1.55}}>{recommendation.scoreGuidance}</AlexText>
      {recommendation.focusLabel&&recommendation.focusSharePercent&&<AlexText sx={{fontSize:12.5,color:'#667085',mt:.65}}>Recommended split: about {recommendation.focusSharePercent}% of focused work on {recommendation.focusLabel}, with the remainder kept mixed. Revisit missed questions after reviewing the source/explanation instead of immediately repeating them from memory.</AlexText>}
      <AlexText sx={{fontSize:11.5,color:'#98A2B3',mt:.9}}>The score estimate is a practice trend derived from your question history, not an official College Board score.</AlexText>
    </AlexSurface>
  </AlexSurface>
}
