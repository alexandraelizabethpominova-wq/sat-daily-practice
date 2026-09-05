import {useEffect,useRef,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy} from 'pdfjs-dist'
import {QUESTION_CROPS} from '../lib/questionCrops'
import type {ModuleKey} from '../types'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const pdfCache=new Map<string,PDFDocumentProxy>()
const pageCache=new Map<string,HTMLCanvasElement>()
const RENDER_SCALE=2.4

async function loadPdf(key:string,bytes:ArrayBuffer){
  if(pdfCache.has(key))return pdfCache.get(key)!
  const copy=bytes.slice(0)
  const doc=await getDocument({data:new Uint8Array(copy)}).promise
  pdfCache.set(key,doc)
  return doc
}

async function renderPage(key:string,bytes:ArrayBuffer,pageNumber:number){
  const cacheKey=`${key}:${pageNumber}`
  const cached=pageCache.get(cacheKey)
  if(cached)return cached

  const doc=await loadPdf(key,bytes)
  const page=await doc.getPage(pageNumber)
  const viewport=page.getViewport({scale:RENDER_SCALE})
  const canvas=document.createElement('canvas')
  const ctx=canvas.getContext('2d')!
  canvas.width=Math.ceil(viewport.width)
  canvas.height=Math.ceil(viewport.height)
  await page.render({canvasContext:ctx,viewport}).promise
  pageCache.set(cacheKey,canvas)
  return canvas
}

type Props={
  bytes:ArrayBuffer
  page:number
  module:ModuleKey
  questionNumber:number
}

export default function QuestionImage({bytes,page,module,questionNumber}:Props){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    async function render(){
      try{
        setError('')
        const crop=QUESTION_CROPS[module][questionNumber]
        if(!crop)throw new Error('Question image crop is not configured.')
        const full=await renderPage('questions',bytes,page)
        if(cancelled)return

        const canvas=canvasRef.current
        if(!canvas)return
        const sx=Math.round(crop.x*RENDER_SCALE)
        const sy=Math.round(crop.y*RENDER_SCALE)
        const sw=Math.round(crop.width*RENDER_SCALE)
        const sh=Math.round(crop.height*RENDER_SCALE)
        canvas.width=sw
        canvas.height=sh
        const ctx=canvas.getContext('2d')!
        ctx.fillStyle='white'
        ctx.fillRect(0,0,sw,sh)
        ctx.drawImage(full,sx,sy,sw,sh,0,0,sw,sh)
      }catch(e){
        if(!cancelled)setError(e instanceof Error?e.message:'Unable to render this question.')
      }
    }
    render()
    return()=>{cancelled=true}
  },[bytes,page,module,questionNumber])

  if(error)return <div className="question-image-error">{error}</div>
  return <canvas className="question-image" ref={canvasRef}/>
}
