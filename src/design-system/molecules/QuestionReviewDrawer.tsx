import {X} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexDrawer from '../atoms/AlexDrawer'
import AlexIconButton from '../atoms/AlexIconButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import ExplanationContent from './ExplanationContent'
import QuestionContent from './QuestionContent'
import {formatDuration} from '../../lib/practiceGamification'
import {moduleLabel} from '../../lib/questionBank'
import type {QuestionPerformance} from '../../lib/performanceAnalytics'
import type {PracticeQuestion} from '../../types'

type Props={open:boolean;onClose:()=>void;question:PracticeQuestion|null;performance:QuestionPerformance|null;questionsPdf:ArrayBuffer|null;answersPdf:ArrayBuffer|null}

export default function QuestionReviewDrawer({open,onClose,question,performance,questionsPdf,answersPdf}:Props){
  return <AlexDrawer anchor="right" open={open} onClose={onClose} sx={{'& .MuiDrawer-paper':{width:{xs:'100%',sm:600},maxWidth:'100vw',boxSizing:'border-box'}}}>
    <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,p:2.25,borderBottom:'1px solid #E6E2DB',position:'sticky',top:0,bgcolor:'#fff',zIndex:2}}>
      <AlexBox>
        <AlexText sx={{fontSize:12,fontWeight:850,textTransform:'uppercase',letterSpacing:'.09em',color:'#6558F5'}}>Question review</AlexText>
        <AlexText component="h2" sx={{fontSize:20,fontWeight:800,color:'#08275B',mt:.35}}>{question?`${moduleLabel(question.module)} · Q${question.number}`:'Question details'}</AlexText>
      </AlexBox>
      <AlexIconButton label="Close question review" onClick={onClose}><X size={20}/></AlexIconButton>
    </AlexBox>
    {question&&<AlexBox sx={{p:{xs:2,sm:2.5},display:'grid',gap:2.25}}>
      {performance&&<AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:1}}>
        <ReviewMetric label="Attempts" value={String(performance.attempts)}/>
        <ReviewMetric label="Success" value={`${performance.successRate}%`}/>
        <ReviewMetric label="Avg. time" value={formatDuration(performance.averageMs)}/>
      </AlexBox>}
      <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:2.5,overflow:'hidden'}}>
        <AlexBox sx={{px:2,py:1.25,borderBottom:'1px solid #E6E2DB',bgcolor:'#F7F6F2'}}><AlexText sx={{fontSize:12,fontWeight:800,color:'#475467',textTransform:'uppercase',letterSpacing:'.07em'}}>Question</AlexText></AlexBox>
        <QuestionContent question={question} bytes={questionsPdf} alt={`${moduleLabel(question.module)} question ${question.number}`} showOriginalLayout={false}/>
      </AlexSurface>
      <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:2.5,overflow:'hidden'}}>
        <AlexBox sx={{px:2,py:1.25,borderBottom:'1px solid #E6E2DB',bgcolor:'#F7F6F2'}}><AlexText sx={{fontSize:12,fontWeight:800,color:'#475467',textTransform:'uppercase',letterSpacing:'.07em'}}>Explanation</AlexText></AlexBox>
        <AlexBox sx={{p:2}}><ExplanationContent question={question} bytes={answersPdf}/></AlexBox>
      </AlexSurface>
    </AlexBox>}
  </AlexDrawer>
}

function ReviewMetric({label,value}:{label:string;value:string}){
  return <AlexSurface sx={{p:1.4,border:'1px solid #E6E2DB',borderRadius:2,bgcolor:'#FBFAF8'}}>
    <AlexText sx={{fontSize:11,fontWeight:800,color:'#667085',textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</AlexText>
    <AlexText sx={{fontSize:17,fontWeight:800,color:'#08275B',mt:.25}}>{value}</AlexText>
  </AlexSurface>
}
