import {useEffect,useState} from 'react'
import '../../structured.css'
import QuestionVisualSlice from '../../components/QuestionVisualSlice'
import SourceViewer from './SourceViewer'
import StructuredQuestionLines from './StructuredQuestionLines'
import ReadingQuestionLines from './ReadingQuestionLines'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import {getQuestionContent,isCurrentQuestionContent,QUESTION_CONTENT_VERSION,type StoredQuestionContent} from '../../lib/questionContentStore'
import {loadSharedQuestionContent} from '../../lib/sharedQuestionBank'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {questionVisualSpec,type QuestionVisualSpec} from '../../lib/questionVisuals'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer|null;alt:string;showOriginalLayout?:boolean;reflowProse?:boolean}

function RenderQuestionLines({question,lines,reflowProse=false}:{question:PracticeQuestion;lines:string[];reflowProse?:boolean}){
  return question.subject==='english'?<ReadingQuestionLines lines={lines} questionId={question.id}/>:<StructuredQuestionLines lines={lines} reflowProse={reflowProse}/>
}

function LinesWithSourceVisual({question,bytes,lines,alt,visual,reflowProse=false}:{question:PracticeQuestion;bytes:ArrayBuffer|null;lines:string[];alt:string;visual:QuestionVisualSpec;reflowProse?:boolean}){
  if(!bytes)return <RenderQuestionLines question={question} lines={lines} reflowProse={reflowProse}/>
  const split=Math.max(0,Math.min(lines.length,visual.afterLine+1))
  const before=lines.slice(0,split)
  const after=lines.slice(split)
  return <>
    {before.length>0&&<RenderQuestionLines question={question} lines={before} reflowProse={reflowProse}/>} 
    <QuestionVisualSlice question={question} bytes={bytes} crop={visual.crop} alt={`${alt} figure from source PDF`} expand={!visual.exact}/>
    {after.length>0&&<RenderQuestionLines question={question} lines={after} reflowProse={reflowProse}/>} 
  </>
}

function storedFromShared(questionId:string,questionLines:string[],explanationLines:string[],needsVisual:boolean):StoredQuestionContent{
  return {
    questionId,questionLines,explanationLines,questionMode:'text',
    explanationMode:explanationLines.length?'text':'image-fallback',needsVisual,
    importedAt:new Date().toISOString(),contentVersion:QUESTION_CONTENT_VERSION,
  }
}

export default function QuestionContent({question,bytes,alt,showOriginalLayout=true,reflowProse=false}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[visual,setVisual]=useState<QuestionVisualSpec|null>(null)
  const[error,setError]=useState('')
  const[revision,setRevision]=useState(0)

  useEffect(()=>{
    const handler=(event:Event)=>{
      const detail=(event as CustomEvent<{questionId?:string}>).detail
      if(!detail?.questionId||detail.questionId===question.id)setRevision(value=>value+1)
    }
    window.addEventListener('sat-question-content-updated',handler)
    return()=>window.removeEventListener('sat-question-content-updated',handler)
  },[question.id])

  useEffect(()=>{
    let cancelled=false
    setContent(null)
    setError('')
    setVisual(null)

    void (async()=>{
      try{
        const shared=await loadSharedQuestionContent(question.id).catch(()=>null)
        if(cancelled)return

        const bundledVisual=questionVisualSpec(question.id)??null
        const sharedControlsVisual=Boolean(shared&&shared.contentStatus!=='metadata')
        const resolvedVisual=shared?.visualSpec??(sharedControlsVisual&&!shared?.needsVisual?null:bundledVisual)
        setVisual(resolvedVisual)

        if(shared?.questionLines.length){
          setContent(storedFromShared(question.id,shared.questionLines,shared.explanationLines,Boolean(resolvedVisual)))
          return
        }

        const verified=question.subject==='math'?verifiedMathContent(question.id):undefined
        if(verified){
          setContent(storedFromShared(question.id,verified.lines,shared?.explanationLines??[],Boolean(resolvedVisual??verified.needsVisual)))
          return
        }

        if(question.subject==='english'&&bytes){
          const extracted=await ensureQuestionText(question,bytes)
          if(cancelled)return
          if(extracted&&isCurrentQuestionContent(extracted))setContent({...extracted,needsVisual:Boolean(resolvedVisual)||extracted.needsVisual})
          else setError('Question text is not available in this browser yet.')
          return
        }

        const local=bytes?await ensureQuestionText(question,bytes):await getQuestionContent(question.id)
        if(cancelled)return
        if(local&&isCurrentQuestionContent(local))setContent({...local,needsVisual:Boolean(resolvedVisual)||local.needsVisual})
        else setError('Question text is not available in this browser yet.')
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to read this question as text.')
      }
    })()

    return()=>{cancelled=true}
  },[question,bytes,revision])

  if(error||content?.questionMode==='image-fallback'){
    if(bytes)return <SourceViewer pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
    return <div className="structured-loading">{error||'Question text is not available in this browser yet.'}</div>
  }
  if(!content)return <div className="structured-loading">Preparing text question…</div>

  return <div className={question.subject==='english'?'structured-question reading-structured-question':'structured-question'}>
    <div className="structured-lines">
      {visual&&bytes
        ?<LinesWithSourceVisual question={question} bytes={bytes} lines={content.questionLines} alt={alt} visual={visual} reflowProse={reflowProse}/>
        :<RenderQuestionLines question={question} lines={content.questionLines} reflowProse={reflowProse}/>} 
    </div>
    {(content.needsVisual||Boolean(visual))&&!bytes
      ?<div className="visual-fallback"><div className="visual-fallback-label">Source figure will appear when the source asset is available.</div></div>
      :content.needsVisual&&!visual&&bytes
        ?<div className="visual-fallback"><div className="visual-fallback-label">Figure from the source material</div><SourceViewer pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} figure`}/></div>
        :(showOriginalLayout&&!content.needsVisual&&!visual&&bytes&&<details className="source-layout-details"><summary>View original layout</summary><SourceViewer pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/></details>)}
  </div>
}
