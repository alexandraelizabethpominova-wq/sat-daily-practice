import {useEffect,useState} from 'react'
import '../../structured.css'
import QuestionVisualSlice from '../../components/QuestionVisualSlice'
import SourceSlice from '../../components/SourceSlice'
import StructuredQuestionLines from './StructuredQuestionLines'
import ReadingQuestionLines from './ReadingQuestionLines'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import {getQuestionContent,isCurrentQuestionContent,QUESTION_CONTENT_VERSION,type StoredQuestionContent} from '../../lib/questionContentStore'
import {loadSharedQuestionContent} from '../../lib/sharedQuestionBank'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {questionVisualSpec} from '../../lib/questionVisuals'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;bytes:ArrayBuffer|null;alt:string;showOriginalLayout?:boolean;reflowProse?:boolean}

function RenderQuestionLines({question,lines,reflowProse=false}:{question:PracticeQuestion;lines:string[];reflowProse?:boolean}){
  return question.subject==='english'?<ReadingQuestionLines lines={lines}/>:<StructuredQuestionLines lines={lines} reflowProse={reflowProse}/>
}

function LinesWithSourceVisual({question,bytes,lines,alt,reflowProse=false}:{question:PracticeQuestion;bytes:ArrayBuffer|null;lines:string[];alt:string;reflowProse?:boolean}){
  const visual=questionVisualSpec(question.id)
  if(!visual||!bytes)return <RenderQuestionLines question={question} lines={lines} reflowProse={reflowProse}/>
  const split=Math.max(0,Math.min(lines.length,visual.afterLine+1))
  const before=lines.slice(0,split)
  const after=lines.slice(split)
  return <>
    {before.length>0&&<RenderQuestionLines question={question} lines={before} reflowProse={reflowProse}/>} 
    <QuestionVisualSlice question={question} bytes={bytes} crop={visual.crop} alt={`${alt} figure from source PDF`}/>
    {after.length>0&&<RenderQuestionLines question={question} lines={after} reflowProse={reflowProse}/>} 
  </>
}

export default function QuestionContent({question,bytes,alt,showOriginalLayout=true,reflowProse=false}:Props){
  const[content,setContent]=useState<StoredQuestionContent|null>(null)
  const[error,setError]=useState('')
  const verified=question.subject==='math'?verifiedMathContent(question.id):undefined
  const visual=questionVisualSpec(question.id)

  useEffect(()=>{
    if(verified){setContent(null);setError('');return}
    let cancelled=false
    setContent(null)
    setError('')
    void (async()=>{
      try{
        const shared=await loadSharedQuestionContent(question.id)
        if(shared){
          if(!cancelled)setContent({
            questionId:shared.questionId,
            questionLines:shared.questionLines,
            explanationLines:shared.explanationLines,
            questionMode:'text',
            explanationMode:shared.explanationLines.length?'text':'image-fallback',
            needsVisual:shared.needsVisual,
            importedAt:new Date().toISOString(),
            contentVersion:QUESTION_CONTENT_VERSION,
          })
          return
        }
        const local=bytes?await ensureQuestionText(question,bytes):await getQuestionContent(question.id)
        if(cancelled)return
        if(local&&isCurrentQuestionContent(local))setContent(local)
        else setError('Question text is not available in this browser yet.')
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to read this question as text.')
      }
    })()
    return()=>{cancelled=true}
  },[question,bytes,verified])

  if(verified){
    return <div className="structured-question verified-math-question">
      <div className="structured-lines verified-math-lines">
        {verified.needsVisual&&visual?<LinesWithSourceVisual question={question} bytes={bytes} lines={verified.lines} alt={alt}/>:<StructuredQuestionLines lines={verified.lines}/>} 
      </div>
      {verified.needsVisual&&!bytes&&<div className="visual-fallback"><div className="visual-fallback-label">Source figure will appear when the source asset is available.</div></div>}
      {verified.needsVisual&&bytes&&!visual&&<div className="visual-fallback"><div className="visual-fallback-label">Figure from the source material</div><SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} visual`}/></div>}
      {!verified.needsVisual&&showOriginalLayout&&bytes&&<details className="source-layout-details"><summary>View original layout</summary><SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/></details>}
    </div>
  }

  if(error||content?.questionMode==='image-fallback'){
    if(bytes)return <SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/>
    return <div className="structured-loading">{error||'Question text is not available in this browser yet.'}</div>
  }
  if(!content)return <div className="structured-loading">Preparing text question…</div>

  return <div className={question.subject==='english'?'structured-question reading-structured-question':'structured-question'}>
    <div className="structured-lines">
      {content.needsVisual&&visual?<LinesWithSourceVisual question={question} bytes={bytes} lines={content.questionLines} alt={alt} reflowProse={reflowProse}/>:<RenderQuestionLines question={question} lines={content.questionLines} reflowProse={reflowProse}/>} 
    </div>
    {content.needsVisual&&!bytes?<div className="visual-fallback"><div className="visual-fallback-label">Source figure will appear when the source asset is available.</div></div>:content.needsVisual&&!visual&&bytes?<div className="visual-fallback"><div className="visual-fallback-label">Figure from the source material</div><SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={`${alt} figure`}/></div>:(showOriginalLayout&&!content.needsVisual&&bytes&&<details className="source-layout-details"><summary>View original layout</summary><SourceSlice pdfKey="questions" bytes={bytes} page={question.sourcePage} questionNumber={question.number} alt={alt}/></details>)}
  </div>
}
