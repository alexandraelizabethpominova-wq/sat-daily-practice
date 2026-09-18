import {useEffect,useState} from 'react'
import {getPracticeTestPdf,type PdfKind} from '../lib/pdfStore'
import type {PracticeQuestion} from '../types'

export default function usePracticeTestPdf(question:PracticeQuestion,kind:PdfKind,override:ArrayBuffer|null=null){
  const[source,setSource]=useState<ArrayBuffer|null>(override)
  useEffect(()=>{
    let cancelled=false
    const testId=question.practiceTestId??'practice-test-4'
    if(testId==='practice-test-4'&&override){setSource(override);return()=>{cancelled=true}}
    setSource(null)
    void getPracticeTestPdf(testId,kind).then(bytes=>{if(!cancelled)setSource(bytes)}).catch(()=>{if(!cancelled)setSource(null)})
    return()=>{cancelled=true}
  },[question.practiceTestId,kind,override])
  return source
}
