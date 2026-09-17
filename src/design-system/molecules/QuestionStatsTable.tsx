import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import {formatDuration} from '../../lib/practiceGamification'
import type {QuestionPerformance} from '../../lib/performanceAnalytics'

type Props={questions:QuestionPerformance[]}

export default function QuestionStatsTable({questions}:Props){
  return <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:3,overflow:'hidden'}}>
    <AlexBox sx={{p:{xs:2,md:2.5},borderBottom:'1px solid #E6E2DB'}}>
      <AlexText component="h2" sx={{fontSize:18,fontWeight:800,color:'#08275B'}}>Question details</AlexText>
      <AlexText sx={{fontSize:13,color:'#667085',mt:.5}}>Sorted from lowest success rate upward so weak questions are easy to find.</AlexText>
    </AlexBox>
    <AlexBox sx={{overflowX:'auto',maxHeight:520,overflowY:'auto'}}>
      <AlexBox sx={{minWidth:720}}>
        <AlexBox sx={{display:'grid',gridTemplateColumns:'1.8fr .9fr .8fr .8fr .9fr',gap:1,p:'10px 16px',position:'sticky',top:0,bgcolor:'#F7F6F2',borderBottom:'1px solid #E6E2DB',zIndex:1}}>
          {['Question','Attempts','Correct','Success','Avg. time'].map(label=><AlexText key={label} sx={{fontSize:12,fontWeight:800,color:'#475467'}}>{label}</AlexText>)}
        </AlexBox>
        {questions.map(question=><AlexBox key={question.questionId} sx={{display:'grid',gridTemplateColumns:'1.8fr .9fr .8fr .8fr .9fr',gap:1,p:'12px 16px',alignItems:'center',borderBottom:'1px solid #F0EDE7'}}>
          <AlexBox>
            <AlexText sx={{fontSize:14,fontWeight:750,color:'#08275B'}}>{question.subject==='math'?'Math':'Reading & Writing'} · Q{question.questionNumber}</AlexText>
            <AlexText sx={{fontSize:12,color:'#667085'}}>{question.module.toUpperCase()}</AlexText>
          </AlexBox>
          <AlexText sx={{fontSize:14}}>{question.attempts}</AlexText>
          <AlexText sx={{fontSize:14}}>{question.correct}</AlexText>
          <AlexText sx={{fontSize:14,fontWeight:800,color:question.successRate<60?'#B42318':'#067647'}}>{question.successRate}%</AlexText>
          <AlexText sx={{fontSize:14}}>{formatDuration(question.averageMs)}</AlexText>
        </AlexBox>)}
      </AlexBox>
    </AlexBox>
  </AlexSurface>
}
