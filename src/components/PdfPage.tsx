import {useEffect,useRef,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy} from 'pdfjs-dist'
import QuestionText from './QuestionText'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()

async function loadPdf(key:string,bytes:ArrayBuffer){
  if(cache.has(key))return cache.get(key)!
  const doc=await getDocument({data:new Uint8Array(bytes.slice(0))}).promise
  cache.set(key,doc)
  return doc
}

type Props={
  pdfKey:string
  bytes:ArrayBuffer
  page:number
  label:string
  questionNumber?:number
  cropToQuestion?:boolean
}

export default function PdfPage({pdfKey,bytes,page,label,questionNumber,cropToQuestion=false}:Props){
  if(cropToQuestion&&questionNumber){
    return <QuestionText pdfKey={pdfKey} bytes={bytes} page={page} questionNumber={questionNumber}/>
  }

  const canvasRef=useRef<HTMLCanvasElement>(null)
  const[error,setError]=useState('')
  const[zoom,setZoom]=useState(1.15)

  useEffect(()=>{
    let cancelled=false
    let renderTask:{cancel:()=>void;promise:Promise<void>}|null=null
    async function render(){
      try{
        setError('')
        const doc=await loadPdf(pdfKey,bytes)
        const pdfPage=await doc.getPage(page)
        const viewport=pdfPage.getViewport({scale:zoom})
        const canvas=canvasRef.current
        if(!canvas||cancelled)return
        const ctx=canvas.getContext('2d')!
        const dpr=window.devicePixelRatio||1
        canvas.width=Math.floor(viewport.width*dpr)
        canvas.height=Math.floor(viewport.height*dpr)
        canvas.style.width=`${viewport.width}px`
        canvas.style.height=`${viewport.height}px`
        renderTask=pdfPage.render({canvasContext:ctx,viewport,transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]}) as typeof renderTask
        await renderTask!.promise
      }catch(e){
        if(!cancelled)setError(e instanceof Error?e.message:'Unable to render PDF content.')
      }
    }
    render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{}}
  },[pdfKey,bytes,page,zoom])

  return <div className="pdf-panel">
    <div className="pdf-toolbar">
      <span>{label}</span>
      <div className="zoom-group">
        <button aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(.75,z-.15))}>−</button>
        <span>{Math.round(zoom*100)}%</span>
        <button aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(2.2,z+.15))}>+</button>
      </div>
    </div>
    <div className="pdf-scroll">{error?<div className="error-box">{error}</div>:<canvas ref={canvasRef}/>}</div>
  </div>
}
