import {useEffect,useState} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import VisualCropEditor from './VisualCropEditor'
import {ensureQuestionText} from '../../lib/pdfStructuredImport'
import {getQuestionContent} from '../../lib/questionContentStore'
import {loadSharedQuestionContent,saveSharedQuestionRepair} from '../../lib/sharedQuestionBank'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {verifiedPracticeTest5Math1Content} from '../../lib/verifiedPracticeTest5Math1'
import {verifiedPracticeTest6Reading1Content} from '../../lib/verifiedPracticeTest6Reading1'
import {verifiedPracticeTest6Reading2Content} from '../../lib/verifiedPracticeTest6Reading2'
import {verifiedPracticeTest6Math1Content} from '../../lib/verifiedPracticeTest6Math1'
import {questionVisualSpec,type QuestionVisualSpec} from '../../lib/questionVisuals'
import usePracticeTestPdf from '../../hooks/usePracticeTestPdf'
import type {PracticeQuestion} from '../../types'

type Props={
  question:PracticeQuestion
  questionsPdf:ArrayBuffer|null
  onSaved?:()=>void
}

const toLines=(value:string)=>value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean)

export default function QuestionRepairEditor({question,questionsPdf,onSaved}:Props){
  const resolvedQuestionsPdf=usePracticeTestPdf(question,'questions',questionsPdf)
  const[questionText,setQuestionText]=useState('')
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
        const shared=await loadSharedQuestionContent(question.id,question.practiceTestId).catch(()=>null)
        let local=await getQuestionContent(question.id).catch(()=>undefined)
        const verified=question.practiceTestId==='practice-test-6'&&(question.module==='rw1'||question.module==='rw2'||question.module==='math1')
          ?question.module==='rw1'
            ?verifiedPracticeTest6Reading1Content(question.number)
            :question.module==='rw2'
              ?verifiedPracticeTest6Reading2Content(question.number)
              :verifiedPracticeTest6Math1Content(question.number)
          :question.practiceTestId==='practice-test-5'&&question.module==='math1'
            ?verifiedPracticeTest5Math1Content(question.number)
            :question.practiceTestId==='practice-test-4'&&question.subject==='math'?verifiedMathContent(question.id):undefined

        if(!local?.questionLines.length&&resolvedQuestionsPdf&&!verified){
          local=await ensureQuestionText(question,resolvedQuestionsPdf).catch(()=>local)
        }
        if(cancelled)return

        const questionLines=shared?.questionLines.length?shared.questionLines:verified?.lines?.length?verified.lines:local?.questionLines??[]
        const bundledVisual=questionVisualSpec(question.id)??null
        const sharedHasText=Boolean(shared?.questionLines.length)
        const sharedControlsVisual=Boolean(shared&&shared.contentStatus!=='metadata'&&!(verified&&!sharedHasText))
        const resolvedVisual=shared?.visualSpec??(sharedControlsVisual&&!shared?.needsVisual?null:bundledVisual)

        setQuestionText(questionLines.join('\n'))
        setVisualSpec(resolvedVisual?{...resolvedVisual,exact:true}:null)
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to prepare this question for editing.')
      }finally{if(!cancelled)setLoading(false)}
    })()
    return()=>{cancelled=true}
  },[question,resolvedQuestionsPdf])

  async function save(){
    const questionLines=toLines(questionText)
    if(!questionLines.length){setError('Question text cannot be empty.');return}
    setSaving(true);setError('');setMessage('')
    try{
      await saveSharedQuestionRepair({questionId:question.id,questionLines,visualSpec})
      setMessage('Fix saved to the shared Question Bank.')
      onSaved?.()
    }catch(reason){
      setError(reason instanceof Error?reason.message:'Unable to save the shared question repair.')
    }finally{setSaving(false)}
  }

  return <AlexSurface sx={{p:{xs:2,md:2.5},border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#FCFBFF'}}>
    <AlexText component="h2" sx={{fontSize:19,fontWeight:850,color:'#08275B'}}>Fix parsed question</AlexText>
    <AlexText sx={{fontSize:13,color:'#667085',mt:.4,mb:1.75}}>Edit only the reconstructed question text and source visual. The explanation always stays in its original PDF format.</AlexText>
    {loading?<AlexText sx={{color:'#667085'}}>Preparing editable content…</AlexText>:<AlexBox sx={{display:'grid',gap:1.5}}>
      <AlexTextField label="Question text" multiline minRows={8} value={questionText} onChange={event=>setQuestionText(event.target.value)}/>
      <VisualCropEditor question={question} bytes={resolvedQuestionsPdf} value={visualSpec} onChange={setVisualSpec} lineCount={toLines(questionText).length}/>
      {error&&<AlexText role="alert" sx={{fontSize:13,color:'#B42318'}}>{error}</AlexText>}
      {message&&<AlexText role="status" sx={{fontSize:13,color:'#067647'}}>{message}</AlexText>}
      <AlexButton disabled={saving} onClick={save} sx={{justifySelf:'start'}}>{saving?'Saving fix…':'Save shared fix'}</AlexButton>
    </AlexBox>}
  </AlexSurface>
}
