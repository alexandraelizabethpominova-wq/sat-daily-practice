import {useEffect,useState} from 'react'
import {getPracticeTestPdf,type PdfKind} from '../lib/pdfStore'
import type {PracticeQuestion} from '../types'

export type PracticeTestPdfState={
  source:ArrayBuffer|null
  loading:boolean
  error:string
  usingFallback:boolean
}

export function usePracticeTestPdfState(question:PracticeQuestion,kind:PdfKind,fallback:ArrayBuffer|null=null,enabled=true):PracticeTestPdfState{
  const testId=question.practiceTestId
  const[source,setSource]=useState<ArrayBuffer|null>(fallback)
  const[loading,setLoading]=useState(enabled)
  const[error,setError]=useState('')
  const[usingFallback,setUsingFallback]=useState(Boolean(fallback))

  useEffect(()=>{
    let cancelled=false
    setSource(fallback)
    setUsingFallback(Boolean(fallback))
    setError('')
    if(!enabled){
      setLoading(false)
      return
    }
    setLoading(true)

    void getPracticeTestPdf(testId,kind)
      .then(bytes=>{
        if(cancelled)return
        if(bytes){
          setSource(bytes)
          setUsingFallback(false)
        }else if(!fallback){
          setSource(null)
          setError('The shared source PDF is temporarily unavailable.')
        }
      })
      .catch(reason=>{
        if(cancelled)return
        if(!fallback)setSource(null)
        setError(reason instanceof Error?reason.message:'Unable to load the shared source PDF.')
      })
      .finally(()=>{if(!cancelled)setLoading(false)})

    return()=>{cancelled=true}
  },[testId,kind,fallback,enabled])

  return {source,loading,error,usingFallback}
}

export default function usePracticeTestPdf(question:PracticeQuestion,kind:PdfKind,fallback:ArrayBuffer|null=null){
  return usePracticeTestPdfState(question,kind,fallback).source
}
