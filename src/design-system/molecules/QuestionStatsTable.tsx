import {useMemo,useState} from 'react'
import {ChevronRight} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButtonBase from '../atoms/AlexButtonBase'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import QuestionReviewDrawer from './QuestionReviewDrawer'
import {formatDuration} from '../../lib/practiceGamification'
import {QUESTION_BANK} from '../../lib/questionBank'
import type {QuestionPerformance} from '../../lib/performanceAnalytics'

type Props={questions:QuestionPerformance[];questionsPdf?:ArrayBuffer|null;answersPdf?:ArrayBuffer|null}

export default function QuestionStatsTable({questions,questionsPdf=null,answersPdf=null}:Props){
  const[selectedId,setSelectedId]=useState<string|null>(null)
  const selectedPerformance=questions.find(question=>question.questionId===selectedId)??null
  const selectedQuestion=useMemo(()=>QUESTION_BANK.find(question=>question.id===selectedId)??null,[selectedId])

  return <>
    <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:3,overflow:'hidden'}}>
      <AlexBox sx={{p:{xs:2,md:2.5},borderBottom:'1px solid #E6E2DB'}}>
        <AlexText component="h2" sx={{fontSize:18,fontWeight:800,color:'#08275B'}}>Question details</AlexText>
        <AlexText sx={{fontSize:13,color:'#667085',mt:.5}}>Sorted from lowest success rate upward. Select any question to review the question and explanation.</AlexText>
      </AlexBox>
      <AlexBox sx={{overflowX:'auto',maxHeight:520,overflowY:'auto'}}>
        <AlexBox sx={{minWidth:790}}>
          <AlexBox sx={{display:'grid',gridTemplateColumns:'1.8fr .9fr .8fr .8fr .9fr .55fr',gap:1,p:'10px 16px',position:'sticky',top:0,bgcolor:'#F7F6F2',borderBottom:'1px solid #E6E2DB',zIndex:1}}>
            {['Question','Attempts','Correct','Success','Avg. time','Review'].map(label=><AlexText key={label} sx={{fontSize:12,fontWeight:800,color:'#475467'}}>{label}</AlexText>)}
          </AlexBox>
          {questions.map(question=><AlexButtonBase
            key={question.questionId}
            onClick={()=>setSelectedId(question.questionId)}
            aria-label={`Review ${question.subject==='math'?'Math':'Reading and Writing'} question ${question.questionNumber}`}
            sx={{display:'grid',gridTemplateColumns:'1.8fr .9fr .8fr .8fr .9fr .55fr',gap:1,p:'12px 16px',alignItems:'center',width:'100%',textAlign:'left',borderBottom:'1px solid #F0EDE7','&:hover':{bgcolor:'#F8FAFC'},'&:focus-visible':{outline:'2px solid #6558F5',outlineOffset:-2}}}
          >
            <AlexBox>
              <AlexText sx={{fontSize:14,fontWeight:750,color:'#08275B'}}>{question.subject==='math'?'Math':'Reading & Writing'} · Q{question.questionNumber}</AlexText>
              <AlexText sx={{fontSize:12,color:'#667085'}}>{question.module.toUpperCase()}</AlexText>
            </AlexBox>
            <AlexText sx={{fontSize:14}}>{question.attempts}</AlexText>
            <AlexText sx={{fontSize:14}}>{question.correct}</AlexText>
            <AlexText sx={{fontSize:14,fontWeight:800,color:question.successRate<60?'#B42318':'#067647'}}>{question.successRate}%</AlexText>
            <AlexText sx={{fontSize:14}}>{formatDuration(question.averageMs)}</AlexText>
            <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:.5,color:'#6558F5'}}><AlexText sx={{fontSize:12,fontWeight:800,color:'inherit'}}>Open</AlexText><ChevronRight size={15}/></AlexBox>
          </AlexButtonBase>)}
        </AlexBox>
      </AlexBox>
    </AlexSurface>
    <QuestionReviewDrawer open={Boolean(selectedId)} onClose={()=>setSelectedId(null)} question={selectedQuestion} performance={selectedPerformance} questionsPdf={questionsPdf} answersPdf={answersPdf}/>
  </>
}
