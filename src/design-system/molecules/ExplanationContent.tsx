import {useEffect,useState} from 'react'
import SourceSlice from '../../components/SourceSlice'
import AlexRichText from '../atoms/AlexRichText'
import {ensureExplanationText} from '../../lib/pdfStructuredImport'
import {getQuestionContent,type StoredQuestionContent} from '../../lib/questionContentStore'
import {loadSharedQuestionContent} from '../../lib/sharedQuestionBank'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer|null}

export default function ExplanationContent({question,bytes}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    setContent(null)
    setError('')
    void (async()=>{
      try{
        const shared=await loadSharedQuestionContent(question.id)
        if(shared?.explanationLines.length){
          if(!cancelled)setContent({questionId:shared.questionId,questionLines:shared.questionLines,explanationLines:shared.explanationLines,questionMode:'text',explanationMode:'text',needsVisual:shared.needsVisual,importedAt:new Date().toISOString()})
          return
        }
        const local=await getQuestionContent(question.id)
        if(local?.explanationLines.length){if(!cancelled)setContent(local);return}
        if(!bytes){if(!cancelled)setError('Explanation text is not available on this device yet.');return}
        const imported=await ensureExplanationText(question,bytes)
        if(!cancelled)setContent(imported)
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to read this explanation as text.')
      }
    })()
    return()=>{cancelled=true}
  },[question,bytes])

  if(error||content?.explanationMode==='image-fallback'){
    if(bytes)return <SourceSlice pdfKey="answers" bytes={bytes} page={question.answerPage} questionNumber={question.number} alt={`Explanation for question ${question.number}`}/>
    return <div className="structured-loading">{error||'Explanation text is not available on this device yet.'}</div>
  }
  if(!content)return <div className="structured-loading">Preparing walkthrough…</div>

  return <div className="structured-explanation">
    <div className="structured-lines">{content.explanationLines.map((line,index)=><p key={`${question.id}-explanation-${index}`}><AlexRichText text={line}/></p>)}</div>
    {bytes&&<details className="source-layout-details"><summary>View original explanation layout</summary><SourceSlice pdfKey="answers" bytes={bytes} page={question.answerPage} questionNumber={question.number} alt={`Original explanation for question ${question.number}`}/></details>}
  </div>
}
