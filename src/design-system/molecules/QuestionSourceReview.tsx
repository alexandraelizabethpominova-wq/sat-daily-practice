import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import QuestionContent from './QuestionContent'
import SourceViewer from './SourceViewer'
import {moduleLabel} from '../../lib/questionBank'
import usePracticeTestPdf from '../../hooks/usePracticeTestPdf'
import type {PracticeQuestion} from '../../types'

type Props={
  question:PracticeQuestion
  questionsPdf:ArrayBuffer|null
  answersPdf?:ArrayBuffer|null
  showExplanation?:boolean
  revision?:number
}

export default function QuestionSourceReview({question,questionsPdf,answersPdf=null,showExplanation=false,revision=0}:Props){
  const label=`${moduleLabel(question.module)} · Q${question.number}`
  const resolvedQuestionsPdf=usePracticeTestPdf(question,'questions',questionsPdf)
  const resolvedAnswersPdf=usePracticeTestPdf(question,'answers',answersPdf)
  const hasQuestionSource=Boolean(resolvedQuestionsPdf?.byteLength)

  return <AlexBox sx={{display:'grid',gap:2,width:'100%',maxWidth:'100%',minWidth:0,overflow:'hidden'}}> 
    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'minmax(0,1fr)',xl:'repeat(2,minmax(0,1fr))'},gap:2,width:'100%',maxWidth:'100%',minWidth:0}}> 
      <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:2.5,overflow:'hidden',minWidth:0,width:'100%',maxWidth:'100%'}}>
        <AlexBox sx={{px:2,py:1.25,borderBottom:'1px solid #E6E2DB',bgcolor:'#F7F6F2'}}>
          <AlexText sx={{fontSize:12,fontWeight:800,color:'#475467',textTransform:'uppercase',letterSpacing:'.07em'}}>Text reconstruction</AlexText>
        </AlexBox>
        <QuestionContent key={`question-${question.id}-${revision}`} question={question} bytes={resolvedQuestionsPdf} alt={`${label} text`} showOriginalLayout={false} reflowProse/>
      </AlexSurface>

      <AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:2.5,overflow:'hidden',minWidth:0,width:'100%',maxWidth:'100%'}}>
        <AlexBox sx={{px:2,py:1.25,borderBottom:'1px solid #E6E2DB',bgcolor:'#F7F6F2'}}>
          <AlexText sx={{fontSize:12,fontWeight:800,color:'#475467',textTransform:'uppercase',letterSpacing:'.07em'}}>Original source</AlexText>
        </AlexBox>
        {hasQuestionSource&&resolvedQuestionsPdf
          ?<SourceViewer pdfKey="questions" bytes={resolvedQuestionsPdf} page={question.sourcePage} questionNumber={question.number} alt={`${label} original PDF`} practiceTestId={question.practiceTestId} module={question.module} sourceCrop={question.sourceCrop}/>
          :<AlexBox sx={{p:3}}><AlexText sx={{fontSize:14,color:'#667085'}}>Source PDF is not available on this device. Add it in Resources to compare against the original layout.</AlexText></AlexBox>}
      </AlexSurface>
    </AlexBox>

    {showExplanation&&<AlexSurface sx={{border:'1px solid #E6E2DB',borderRadius:2.5,overflow:'hidden'}}>
      <AlexBox sx={{px:2,py:1.25,borderBottom:'1px solid #E6E2DB',bgcolor:'#F7F6F2'}}>
        <AlexText sx={{fontSize:12,fontWeight:800,color:'#475467',textTransform:'uppercase',letterSpacing:'.07em'}}>Explanation</AlexText>
      </AlexBox>
      {resolvedAnswersPdf
        ?<SourceViewer pdfKey="answers" bytes={resolvedAnswersPdf} page={question.answerPage} questionNumber={question.number} alt={`Original explanation for ${label}`} label="Original explanation" practiceTestId={question.practiceTestId} module={question.module} sourceCrop={question.sourceCrop}/>
        :<AlexBox sx={{p:3}}><AlexText sx={{fontSize:14,color:'#667085'}}>Answer-explanation PDF is not available on this device. Add it in Resources to view the original explanation.</AlexText></AlexBox>}
    </AlexSurface>}
  </AlexBox>
}
