import {useEffect,useRef,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()

async function loadPdf(key:string,bytes:ArrayBuffer){
  if(cache.has(key))return cache.get(key)!
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

type TextItemLike={str:string;transform:number[];width?:number;height?:number}

function isTextItem(item:unknown):item is TextItemLike{
  return !!item&&typeof item==='object'&&'str' in item&&'transform' in item
}

function startsWithQuestionNumber(text:string,n:number){
  const s=text.trim()
  // PDF text extraction may return "11", "11.", "11)" or "11  Question text...".
  return new RegExp(`^${n}(?:\\s|[.)])`).test(`${s} `)
}

async function questionBounds(pdfPage:PDFPageProxy,scale:number,questionNumber:number){
  const viewport=pdfPage.getViewport({scale})
  const text=await pdfPage.getTextContent()
  const items=text.items.filter(isTextItem).map(item=>{
    const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5])
    return{text:item.str.trim(),x,y}
  })

  // SAT question numbers are positioned near the left edge.  Use a generous left
  // threshold because PDF text coordinates vary between Reading/Writing and Math.
  const leftItems=items.filter(item=>item.x<viewport.width*.38)
  const currentCandidates=leftItems
    .filter(item=>startsWithQuestionNumber(item.text,questionNumber))
    .sort((a,b)=>a.y-b.y||a.x-b.x)

  if(!currentCandidates.length)return null

  // Prefer the left-most occurrence. This avoids matching numbers in the question body.
  const minX=Math.min(...currentCandidates.map(x=>x.x))
  const current=currentCandidates
    .filter(x=>x.x<=minX+32*scale)
    .sort((a,b)=>a.y-b.y)[0] ?? currentCandidates[0]

  const nextCandidates=leftItems
    .filter(item=>startsWithQuestionNumber(item.text,questionNumber+1)&&item.y>current.y+12*scale)
    .sort((a,b)=>a.y-b.y||a.x-b.x)

  const next=nextCandidates[0]
  const padTop=22*scale
  const padBottom=18*scale
  const top=Math.max(0,current.y-padTop)
  const bottom=Math.min(viewport.height,next?next.y-padBottom:viewport.height-18*scale)

  if(bottom-top<110*scale)return null
  return{top,bottom}
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
          if(!bounds)throw new Error(`Could not isolate Question ${questionNumber} on this PDF page.`)
          top=bounds.top
          bottom=bounds.bottom
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
