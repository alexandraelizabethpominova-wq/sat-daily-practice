import {useEffect,useState} from 'react'
import SourceSlice from '../../components/SourceSlice'
import AlexRichText from '../atoms/AlexRichText'
import {ensureExplanationText} from '../../lib/pdfStructuredImport'
import type {StoredQuestionContent} from '../../lib/questionContentStore'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer}

export default function ExplanationContent({question,bytes}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    setContent(null)
    setError('')
    ensureExplanationText(question,bytes).then(result=>{
      if(!cancelled)setContent(result)
    }).catch(reason=>{
      if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to read this explanation as text.')
    })
    return()=>{cancelled=true}
  },[question,bytes])

  if(error||content?.explanationMode==='image-fallback'){
    return <SourceSlice pdfKey="answers" bytes={bytes} page={question.answerPage} questionNumber={question.number} alt={`Explanation for question ${question.number}`}/>
  }
  if(!content)return <div className="structured-loading">Preparing walkthrough…</div>

  return <div className="structured-explanation">
    <div className="structured-lines">
      {content.explanationLines.map((line,index)=><p key={`${question.id}-explanation-${index}`}><AlexRichText text={line}/></p>)}
    </div>
    <details className="source-layout-details">
      <summary>View original explanation layout</summary>
      <SourceSlice pdfKey="answers" bytes={bytes} page={question.answerPage} questionNumber={question.number} alt={`Original explanation for question ${question.number}`}/>
    </details>
  </div>
}
