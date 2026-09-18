import {useEffect,useState} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import VisualCropEditor from './VisualCropEditor'
import {ensureExplanationText,ensureQuestionText} from '../../lib/pdfStructuredImport'
import {getQuestionContent} from '../../lib/questionContentStore'
import {loadSharedQuestionContent,saveSharedQuestionRepair} from '../../lib/sharedQuestionBank'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {questionVisualSpec,type QuestionVisualSpec} from '../../lib/questionVisuals'
import type {PracticeQuestion} from '../../types'

type Props={
  question:PracticeQuestion
  questionsPdf:ArrayBuffer|null
  answersPdf:ArrayBuffer|null
  onSaved?:()=>void
}

const toLines=(value:string)=>value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean)

export default function QuestionRepairEditor({question,questionsPdf,answersPdf,onSaved}:Props){
  const[questionText,setQuestionText]=useState('')
  const[explanationText,setExplanationText]=useState('')
  const[visualSpec,setVisualSpec]=useState<QuestionVisualSpec|null>(null)
  const[loading,setLoading]=useState(true)
  const[saving,setSaving]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    setLoading(true);setError('');setMessage('')
    void (async()=>{
      try{
        const shared=await loadSharedQuestionContent(question.id).catch(()=>null)
        let local=await getQuestionContent(question.id).catch(()=>undefined)
        const verified=question.subject==='math'?verifiedMathContent(question.id):undefined

        if(!local?.questionLines.length&&questionsPdf){
          local=await ensureQuestionText(question,questionsPdf).catch(()=>local)
        }
        if(!local?.explanationLines.length&&answersPdf){
          local=await ensureExplanationText(question,answersPdf).catch(()=>local)
        }
        if(cancelled)return

        const questionLines=shared?.questionLines.length?shared.questionLines:verified?.lines.length?verified.lines:local?.questionLines??[]
        const explanationLines=shared?.explanationLines.length?shared.explanationLines:local?.explanationLines??[]
        const bundledVisual=questionVisualSpec(question.id)??null
        const sharedControlsVisual=Boolean(shared&&shared.contentStatus!=='metadata')
        const resolvedVisual=shared?.visualSpec??(sharedControlsVisual&&!shared?.needsVisual?null:bundledVisual)

        setQuestionText(questionLines.join('\n'))
        setExplanationText(explanationLines.join('\n'))
        setVisualSpec(resolvedVisual?{...resolvedVisual,exact:true}:null)
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to prepare this question for editing.')
      }finally{if(!cancelled)setLoading(false)}
    })()
    return()=>{cancelled=true}
  },[question,questionsPdf,answersPdf])

  async function save(){
    const questionLines=toLines(questionText)
    if(!questionLines.length){setError('Question text cannot be empty.');return}
    setSaving(true);setError('');setMessage('')
    try{
      await saveSharedQuestionRepair({
        questionId:question.id,
        questionLines,
        explanationLines:toLines(explanationText),
        visualSpec,
      })
      setMessage('Fix saved to the shared Question Bank.')
      onSaved?.()
    }catch(reason){
      setError(reason instanceof Error?reason.message:'Unable to save the shared question repair.')
    }finally{setSaving(false)}
  }

  return <AlexSurface sx={{p:{xs:2,md:2.5},border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#FCFBFF'}}>
    <AlexText component="h2" sx={{fontSize:19,fontWeight:850,color:'#08275B'}}>Fix parsed content</AlexText>
    <AlexText sx={{fontSize:13,color:'#667085',mt:.4,mb:1.75}}>Edits saved here become the shared version used throughout the app. Keep one structured question line per editor line.</AlexText>
    {loading?<AlexText sx={{color:'#667085'}}>Preparing editable content…</AlexText>:<AlexBox sx={{display:'grid',gap:1.5}}>
      <AlexTextField label="Question text" multiline minRows={8} value={questionText} onChange={event=>setQuestionText(event.target.value)}/>
      <AlexTextField label="Explanation text" multiline minRows={5} value={explanationText} onChange={event=>setExplanationText(event.target.value)}/>
      <VisualCropEditor question={question} bytes={questionsPdf} value={visualSpec} onChange={setVisualSpec} lineCount={toLines(questionText).length}/>
      {error&&<AlexText role="alert" sx={{fontSize:13,color:'#B42318'}}>{error}</AlexText>}
      {message&&<AlexText role="status" sx={{fontSize:13,color:'#067647'}}>{message}</AlexText>}
      <AlexButton disabled={saving} onClick={save} sx={{justifySelf:'start'}}>{saving?'Saving fix…':'Save shared fix'}</AlexButton>
    </AlexBox>}
  </AlexSurface>
}
