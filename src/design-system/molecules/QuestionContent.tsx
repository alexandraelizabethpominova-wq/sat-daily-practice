import {useEffect,useState} from 'react'
import '../../structured.css'
import QuestionVisualSlice from '../../components/QuestionVisualSlice'
import SourceSlice from '../../components/SourceSlice'
import StructuredQuestionLines from './StructuredQuestionLines'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {questionVisualSpec} from '../../lib/questionVisuals'
import type {StoredQuestionContent} from '../../lib/questionContentStore'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer;alt:string;showOriginalLayout?:boolean;reflowProse?:boolean}

function LinesWithSourceVisual({question,bytes,lines,alt,reflowProse=false}:{question:PracticeQuestion;bytes:ArrayBuffer;lines:string[];alt:string;reflowProse?:boolean}){
  const visual=questionVisualSpec(question.id)
  if(!visual)return <StructuredQuestionLines lines={lines} reflowProse={reflowProse}/>

  const split=Math.max(0,Math.min(lines.length,visual.afterLine+1))
  const before=lines.slice(0,split)
  const after=lines.slice(split)

  return <>
    {before.length>0&&<StructuredQuestionLines lines={before} reflowProse={reflowProse}/>} 
    <QuestionVisualSlice question={question} bytes={bytes} crop={visual.crop} alt={`${alt} figure from source PDF`}/>
    {after.length>0&&<StructuredQuestionLines lines={after} reflowProse={reflowProse}/>} 
  </>
}

export default function QuestionContent({question,bytes,alt,showOriginalLayout=true,reflowProse=false}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')
  const verified=question.subject==='math'?verifiedMathContent(question.id):undefined
  const visual=questionVisualSpec(question.id)

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
        {verified.needsVisual&&visual
          ?<LinesWithSourceVisual question={question} bytes={bytes} lines={verified.lines} alt={alt}/>
          :<StructuredQuestionLines lines={verified.lines}/>} 
      </div>
      {verified.needsVisual&&!visual&&<div className="visual-fallback">
        <div className="visual-fallback-label">Figure from the source material</div>
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
      {content.needsVisual&&visual
        ?<LinesWithSourceVisual question={question} bytes={bytes} lines={content.questionLines} alt={alt} reflowProse={reflowProse}/>
        :<StructuredQuestionLines lines={content.questionLines} reflowProse={reflowProse}/>} 
    </div>
    {content.needsVisual&&!visual?(
      <div className="visual-fallback">
        <div className="visual-fallback-label">Figure from the source material</div>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} figure`}/>
      </div>
    ):(showOriginalLayout&&!content.needsVisual&&
      <details className="source-layout-details">
        <summary>View original layout</summary>
        <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
      </details>
    )}
  </div>
}
