import {useEffect,useState} from 'react'
import '../../structured.css'
import SourceSlice from '../../components/SourceSlice'
import StructuredQuestionLines from './StructuredQuestionLines'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import type {StoredQuestionContent} from '../../lib/questionContentStore'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer;alt:string}

export default function QuestionContent({question,bytes,alt}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')

  // Math notation, tables, graphs, diagrams, fractions, radicals, and superscripts
  // are not reliably preserved by PDF text extraction. Until each math question
  // has a verified semantic/KaTeX representation, render the exact source crop.
  // This keeps the question faithful to the supplied practice material while the
  // answer controls and scoring remain fully interactive HTML controls.
  const useExactMathSource=question.subject==='math'

  useEffect(()=>{
    if(useExactMathSource){
      setContent(null)
      setError('')
      return
    }

    let cancelled=false
    setContent(null)
    setError('')
    ensureQuestionText(question,bytes).then(result=>{
      if(!cancelled)setContent(result)
    }).catch(reason=>{
      if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to read this question as text.')
    })
    return()=>{cancelled=true}
  },[question,bytes,useExactMathSource])

  if(useExactMathSource){
    return <div className="verified-math-source">
      <SourceSlice
        pdfKey="questions"
        bytes={bytes}
        page={question.sourcePage}
        questionNumber={question.number}
        alt={alt}
      />
    </div>
  }

  if(error||content?.questionMode==='image-fallback'){
    return <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
  }
  if(!content)return <div className="structured-loading">Preparing text question…</div>

  return <div className="structured-question">
    <div className="structured-lines">
      <StructuredQuestionLines lines={content.questionLines}/>
    </div>
    {content.needsVisual?(
      <div className="visual-fallback">
        <div className="visual-fallback-label">Figure from the source material</div>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} figure`}/>
      </div>
    ):(
      <details className="source-layout-details">
        <summary>View original layout</summary>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
      </details>
    )}
  </div>
}
