import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import type {PracticePlanRecommendation} from '../../lib/practicePlan'

type Props={recommendation:PracticePlanRecommendation}

export default function StudyPlanRecommendation({recommendation}:Props){
  const complete=recommendation.remainingQuestions===0
  return <AlexSurface sx={{p:{xs:2.25,md:3},border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#FCFBFF'}}>
    <AlexText component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:24,fontWeight:500,color:'#08275B'}}>Recommended pace</AlexText>
    <AlexText sx={{fontSize:13.5,color:'#667085',mt:.5}}>Calculated from the live question bank, your exam date, coverage goal, session size, and {recommendation.paceSource==='history'?'your measured question pace':'your configured fallback pace'}.</AlexText>
    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(4,1fr)'},gap:1.25,mt:2}}>
      {[
        ['Available bank',`${recommendation.bankQuestionCount} questions`],
        ['Available sets',`${recommendation.availablePracticeSetCount} of ${recommendation.targetPracticeSets} goal`],
        ['Time remaining',`${recommendation.daysRemaining} day${recommendation.daysRemaining===1?'':'s'}`],
        ['Remaining coverage',`${recommendation.remainingQuestions} questions`],
      ].map(([label,value])=><AlexSurface key={label} sx={{p:1.5,border:'1px solid #E6E2DB',borderRadius:2,bgcolor:'#fff'}}><AlexText sx={{fontSize:11.5,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</AlexText><AlexText sx={{fontSize:18,fontWeight:850,color:'#08275B',mt:.4}}>{value}</AlexText></AlexSurface>)}
    </AlexBox>
    <AlexSurface sx={{mt:1.5,p:2,borderRadius:2.5,bgcolor:'#F3F0FF',border:'1px solid #D8D2FF'}}>
      <AlexText sx={{fontSize:15,fontWeight:850,color:'#08275B'}}>{complete?'Current question-bank coverage goal complete':`${recommendation.recommendedSessionsPerDay} session${recommendation.recommendedSessionsPerDay===1?'':'s'} per day · about ${recommendation.estimatedSessionMinutes} minutes each`}</AlexText>
      {!complete&&<AlexText sx={{fontSize:13,color:'#475467',mt:.5}}>That is about {recommendation.estimatedDailyMinutes} minutes per day at {recommendation.questionsPerSession} questions per session, with {recommendation.remainingSessions} sessions remaining for the current bank.</AlexText>}
    </AlexSurface>
  </AlexSurface>
}
