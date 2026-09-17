import {useEffect,useState} from 'react'
import '../../structured.css'
import SourceSlice from '../../components/SourceSlice'
import StructuredQuestionLines from './StructuredQuestionLines'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import type {StoredQuestionContent} from '../../lib/questionContentStore'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer;alt:string;showOriginalLayout?:boolean;reflowProse?:boolean}

export default function QuestionContent({question,bytes,alt,showOriginalLayout=true,reflowProse=false}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')
  const verified=question.subject==='math'?verifiedMathContent(question.id):undefined

  useEffect(()=>{
    if(verified){
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
  },[question,bytes,verified])

  if(verified){
    return <div className="structured-question verified-math-question">
      <div className="structured-lines verified-math-lines">
        <StructuredQuestionLines lines={verified.lines}/>
      </div>
      {verified.needsVisual&&<div className="visual-fallback">
        <div className="visual-fallback-label">Graph or diagram from the source material</div>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} visual`}/>
      </div>}
      {!verified.needsVisual&&showOriginalLayout&&<details className="source-layout-details">
        <summary>View original layout</summary>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
      </details>}
    </div>
  }

  if(error||content?.questionMode==='image-fallback'){
    return <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
  }
  if(!content)return <div className="structured-loading">Preparing text question…</div>

  return <div className="structured-question">
    <div className="structured-lines">
      <StructuredQuestionLines lines={content.questionLines} reflowProse={reflowProse}/>
    </div>
    {content.needsVisual?(
      <div className="visual-fallback">
        <div className="visual-fallback-label">Figure from the source material</div>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} figure`}/>
      </div>
    ):(showOriginalLayout&&
      <details className="source-layout-details">
        <summary>View original layout</summary>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
      </details>
    )}
  </div>
}
