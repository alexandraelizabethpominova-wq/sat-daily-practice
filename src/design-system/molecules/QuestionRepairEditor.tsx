import {useEffect,useRef,useState} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import VisualCropEditor from './VisualCropEditor'
import {ensureQuestionText,extractQuestionLines} from '../../lib/pdfStructuredImport'
import {getQuestionContent} from '../../lib/questionContentStore'
import {hasUnderlineMarkup,refersToUnderlinedText,underlineSelection} from '../../lib/questionTextMarkup'
import {readingTableSpec,stripEmbeddedReadingTableLines} from '../../lib/readingTables'
import {loadSharedQuestionContent,saveSharedQuestionRepair} from '../../lib/sharedQuestionBank'
import {verifiedMathContent} from '../../lib/verifiedMathQuestions'
import {verifiedPracticeTest5Math1Content} from '../../lib/verifiedPracticeTest5Math1'
import {verifiedPracticeTest6Reading1Content} from '../../lib/verifiedPracticeTest6Reading1'
import {verifiedPracticeTest6Reading2Content} from '../../lib/verifiedPracticeTest6Reading2'
import {verifiedPracticeTest6Math1Content} from '../../lib/verifiedPracticeTest6Math1'
import {verifiedPracticeTest6Math2Content} from '../../lib/verifiedPracticeTest6Math2'
import {questionVisualSpecs,type QuestionVisualSpec} from '../../lib/questionVisuals'
import usePracticeTestPdf from '../../hooks/usePracticeTestPdf'
import type {PracticeQuestion} from '../../types'

type Props={
  question:PracticeQuestion
  questionsPdf:ArrayBuffer|null
  onSaved?:()=>void
}

const toLines=(value:string)=>value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean)
type TextOrigin='shared'|'verified'|'browser'|'source'|'empty'

export default function QuestionRepairEditor({question,questionsPdf,onSaved}:Props){
  const resolvedQuestionsPdf=usePracticeTestPdf(question,'questions',questionsPdf)
  const[questionText,setQuestionText]=useState('')
  const[textOrigin,setTextOrigin]=useState<TextOrigin>('empty')
  const questionTextRef=useRef<HTMLInputElement|HTMLTextAreaElement|null>(null)
  const[visualSpec,setVisualSpec]=useState<QuestionVisualSpec|null>(null)
  const[visualSpecs,setVisualSpecs]=useState<QuestionVisualSpec[]>([])
  const[loading,setLoading]=useState(true)
  const[saving,setSaving]=useState(false)
  const[extracting,setExtracting]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    setLoading(true);setError('');setMessage('')
    void (async()=>{
      try{
        const shared=await loadSharedQuestionContent(question.id,question.practiceTestId).catch(()=>null)
        let local=await getQuestionContent(question.id).catch(()=>undefined)
        const verified=question.practiceTestId==='practice-test-6'&&(question.module==='rw1'||question.module==='rw2'||question.module==='math1'||question.module==='math2')
          ?question.module==='rw1'
            ?verifiedPracticeTest6Reading1Content(question.number)
            :question.module==='rw2'
              ?verifiedPracticeTest6Reading2Content(question.number)
              :question.module==='math1'
                ?verifiedPracticeTest6Math1Content(question.number)
                :verifiedPracticeTest6Math2Content(question.number)
          :question.practiceTestId==='practice-test-5'&&question.module==='math1'
            ?verifiedPracticeTest5Math1Content(question.number)
            :question.practiceTestId==='practice-test-4'&&question.subject==='math'?verifiedMathContent(question.id):undefined

        if(!local?.questionLines.length&&resolvedQuestionsPdf&&!verified){
          local=await ensureQuestionText(question,resolvedQuestionsPdf).catch(()=>local)
        }
        if(cancelled)return

        const sharedHasText=Boolean(shared?.questionLines.length)
        const verifiedHasText=Boolean(verified?.lines?.length)
        const localHasText=Boolean(local?.questionLines.length)
        const questionLines=sharedHasText?shared!.questionLines:verifiedHasText?verified!.lines:local?.questionLines??[]
        const origin:TextOrigin=sharedHasText?'shared':verifiedHasText?'verified':localHasText?'browser':'empty'
        const bundledVisuals=questionVisualSpecs(question.id)
        const sharedControlsVisual=Boolean(shared&&shared.contentStatus!=='metadata'&&!(verified&&!sharedHasText))
        const resolvedVisuals=shared?.visualSpecs?.length
          ?shared.visualSpecs
          :sharedControlsVisual&&!shared?.needsVisual?[]:bundledVisuals

        setQuestionText(stripEmbeddedReadingTableLines(question.id,questionLines).join('\n'))
        setTextOrigin(origin)
        setVisualSpecs(resolvedVisuals)
        setVisualSpec(resolvedVisuals[0]?{...resolvedVisuals[0],exact:true}:null)
      }catch(reason){
        if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to prepare this question for editing.')
      }finally{if(!cancelled)setLoading(false)}
    })()
    return()=>{cancelled=true}
  },[question,resolvedQuestionsPdf])

  async function reloadFromSource(){
    if(!resolvedQuestionsPdf){
      setError('The question source PDF is not available yet.')
      return
    }
    setExtracting(true);setError('');setMessage('')
    try{
      const lines=await extractQuestionLines(question,resolvedQuestionsPdf)
      if(!lines.length)throw new Error('No text could be extracted from this question’s verified source crop.')
      setQuestionText(lines.join('\n'))
      setTextOrigin('source')
      setMessage('Loaded fresh text from the source PDF. Review formatting, then save it to the shared Question Bank.')
    }catch(reason){
      setError(reason instanceof Error?reason.message:'Unable to extract text from the source PDF.')
    }finally{setExtracting(false)}
  }

  function underlineSelectedText(){
    const input=questionTextRef.current
    if(!input)return
    const result=underlineSelection(questionText,input.selectionStart??0,input.selectionEnd??0)
    if(!result){
      setError('Select the exact text that should be underlined, then choose Underline selected text.')
      input.focus()
      return
    }
    setError('')
    setMessage('')
    setQuestionText(result.value)
    requestAnimationFrame(()=>{
      input.focus()
      input.setSelectionRange(result.start,result.end)
    })
  }

  async function save(){
    const questionLines=stripEmbeddedReadingTableLines(question.id,toLines(questionText))
    if(!questionLines.length){setError('Question text cannot be empty.');return}
    setSaving(true);setError('');setMessage('')
    try{
      const nextVisuals=visualSpec?[visualSpec,...visualSpecs.slice(1)]:visualSpecs.slice(1)
      await saveSharedQuestionRepair({questionId:question.id,questionLines,visualSpecs:nextVisuals})
      setVisualSpecs(nextVisuals)
      setTextOrigin('shared')
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
      {readingTableSpec(question.id)&&<AlexSurface sx={{p:1.4,border:'1px solid #B2CCFF',borderRadius:2,bgcolor:'#F5F8FF'}}>
        <AlexText sx={{fontSize:12.5,fontWeight:800,color:'#1849A9'}}>Structured table preserved separately</AlexText>
        <AlexText sx={{fontSize:12,color:'#475467',mt:.2}}>The table is not part of the editable prose. Editing and saving this text will preserve the structured table without duplicating it into the question body.</AlexText>
      </AlexSurface>}
      {textOrigin!=='shared'&&<AlexSurface sx={{p:1.4,border:'1px solid #B2CCFF',borderRadius:2,bgcolor:'#F5F8FF'}}>
        <AlexBox sx={{display:'flex',alignItems:{xs:'flex-start',sm:'center'},justifyContent:'space-between',gap:1,flexWrap:'wrap'}}>
          <AlexBox>
            <AlexText sx={{fontSize:12.5,fontWeight:800,color:'#1849A9'}}>Not stored as shared parsed text yet</AlexText>
            <AlexText sx={{fontSize:12,color:'#475467',mt:.2}}>{textOrigin==='source'?'Freshly extracted from the source PDF.':textOrigin==='verified'?'Loaded from bundled verified text.':textOrigin==='browser'?'Loaded from this browser’s extracted cache.':'No parsed text is available yet.'} Saving a repair will persist the edited text to the shared Question Bank.</AlexText>
          </AlexBox>
          {resolvedQuestionsPdf&&<AlexButton size="small" tone="secondary" disabled={extracting} onClick={reloadFromSource}>{extracting?'Extracting…':'Re-extract from source'}</AlexButton>}
        </AlexBox>
      </AlexSurface>}
      <AlexBox sx={{display:'flex',alignItems:{xs:'flex-start',sm:'center'},justifyContent:'space-between',gap:1,flexWrap:'wrap'}}>
        <AlexBox>
          <AlexText sx={{fontSize:13,fontWeight:800,color:'#344054'}}>Text formatting</AlexText>
          <AlexText sx={{fontSize:12,color:'#667085',mt:.2}}>Select the exact words in the question text, then apply underline. The formatting is saved with the shared repair.</AlexText>
        </AlexBox>
        <AlexButton size="small" tone="secondary" onClick={underlineSelectedText}>Underline selected text</AlexButton>
      </AlexBox>
      {refersToUnderlinedText(questionText)&&!hasUnderlineMarkup(questionText)&&<AlexSurface sx={{p:1.25,border:'1px solid #FEC84B',borderRadius:2,bgcolor:'#FFFAEB'}}>
        <AlexText sx={{fontSize:12.5,color:'#93370D'}}>This question refers to underlined text, but no underlined span is currently defined. Select the matching source text and apply underline before saving.</AlexText>
      </AlexSurface>}
      <AlexTextField
        label="Question text"
        multiline
        minRows={8}
        value={questionText}
        inputRef={questionTextRef}
        onChange={event=>setQuestionText(event.target.value)}
        helperText="Underline formatting is stored as <u>…</u> in the editable text and renders as an underline in the question."
      />
      {visualSpecs.length>1&&<AlexText sx={{fontSize:12,color:'#667085'}}>This question has {visualSpecs.length} source visual regions. The editor below adjusts the first region; the remaining regions are preserved when saving.</AlexText>}
      <VisualCropEditor question={question} bytes={resolvedQuestionsPdf} value={visualSpec} onChange={setVisualSpec} lineCount={toLines(questionText).length}/>
      {error&&<AlexText role="alert" sx={{fontSize:13,color:'#B42318'}}>{error}</AlexText>}
      {message&&<AlexText role="status" sx={{fontSize:13,color:'#067647'}}>{message}</AlexText>}
      <AlexButton disabled={saving} onClick={save} sx={{justifySelf:'start'}}>{saving?'Saving fix…':'Save shared fix'}</AlexButton>
    </AlexBox>}
  </AlexSurface>
}
