import {useEffect,useRef,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()

async function loadPdf(key:string,bytes:ArrayBuffer){
  if(cache.has(key))return cache.get(key)!
  // pdf.js transfers the typed array to its worker, so always give it a copy.
  const copy=bytes.slice(0)
  const doc=await getDocument({data:new Uint8Array(copy)}).promise
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

type TextItemLike={str:string;transform:number[]}

function isTextItem(item:unknown):item is TextItemLike{
  return !!item&&typeof item==='object'&&'str' in item&&'transform' in item
}

async function questionBounds(pdfPage:PDFPageProxy,scale:number,questionNumber:number){
  const viewport=pdfPage.getViewport({scale})
  const text=await pdfPage.getTextContent()
  const items=text.items.filter(isTextItem)

  const markers=items.map(item=>{
    const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5])
    return{value:item.str.trim(),x,y}
  }).filter(item=>item.x<viewport.width*.24)

  const current=markers
    .filter(item=>item.value===String(questionNumber))
    .sort((a,b)=>a.y-b.y)[0]

  if(!current)return null

  const next=markers
    .filter(item=>item.value===String(questionNumber+1)&&item.y>current.y+8)
    .sort((a,b)=>a.y-b.y)[0]

  const padding=Math.max(16,18*scale)
  const top=Math.max(0,current.y-padding)
  const bottom=Math.min(viewport.height,next?next.y-padding:viewport.height-Math.max(16,24*scale))
  if(bottom-top<80)return null
  return{top,bottom,viewport}
}

export default function PdfPage({pdfKey,bytes,page,label,questionNumber,cropToQuestion=false}:Props){
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
        const dpr=window.devicePixelRatio||1

        const full=document.createElement('canvas')
        const fullCtx=full.getContext('2d')!
        full.width=Math.floor(viewport.width*dpr)
        full.height=Math.floor(viewport.height*dpr)
        renderTask=pdfPage.render({
          canvasContext:fullCtx,
          viewport,
          transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]
        }) as typeof renderTask
        await renderTask!.promise
        if(cancelled)return

        let top=0
        let bottom=viewport.height
        if(cropToQuestion&&questionNumber){
          const bounds=await questionBounds(pdfPage,zoom,questionNumber)
          if(bounds){top=bounds.top;bottom=bounds.bottom}
        }

        const canvas=canvasRef.current
        if(!canvas||cancelled)return
        const ctx=canvas.getContext('2d')!
        const cssHeight=Math.max(1,bottom-top)
        canvas.width=full.width
        canvas.height=Math.floor(cssHeight*dpr)
        canvas.style.width=`${viewport.width}px`
        canvas.style.height=`${cssHeight}px`
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.drawImage(
          full,
          0,Math.floor(top*dpr),full.width,Math.floor(cssHeight*dpr),
          0,0,canvas.width,canvas.height
        )
      }catch(e){
        if(!cancelled)setError(e instanceof Error?e.message:'Unable to render PDF content.')
      }
    }

    render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{}}
  },[pdfKey,bytes,page,zoom,questionNumber,cropToQuestion])

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
