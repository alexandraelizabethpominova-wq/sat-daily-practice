import {useEffect,useRef,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()

async function loadPdf(key:string,bytes:ArrayBuffer){
  const cached=cache.get(key)
  if(cached)return cached
  const doc=await getDocument({data:new Uint8Array(bytes.slice(0))}).promise
  cache.set(key,doc)
  return doc
}

type TextItemLike={str:string;transform:number[]}
function isTextItem(item:unknown):item is TextItemLike{
  return !!item&&typeof item==='object'&&'str' in item&&'transform' in item
}

function isMarker(text:string,n:number){
  const s=text.trim().replace(/\s+/g,' ')
  return new RegExp(`^(?:Question\\s*)?${n}(?:\\s|[.)]|$)`,'i').test(s)
}

async function sliceBounds(page:PDFPageProxy,scale:number,questionNumber:number){
  const viewport=page.getViewport({scale})
  const text=await page.getTextContent()
  const items=text.items.filter(isTextItem).map(item=>{
    const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5])
    return{text:item.str.trim(),x,y}
  })
  const left=items.filter(i=>i.x<viewport.width*.42)
  const currentCandidates=left.filter(i=>isMarker(i.text,questionNumber)).sort((a,b)=>a.y-b.y||a.x-b.x)
  if(!currentCandidates.length)return null
  const leftMost=Math.min(...currentCandidates.map(i=>i.x))
  const current=currentCandidates.find(i=>i.x<=leftMost+36*scale)??currentCandidates[0]
  const futureMarkers=left.filter(i=>i.y>current.y+18*scale).filter(i=>{
    for(let n=questionNumber+1;n<=questionNumber+4;n++)if(isMarker(i.text,n))return true
    return false
  }).sort((a,b)=>a.y-b.y)
  const next=futureMarkers[0]
  const top=Math.max(0,current.y-26*scale)
  const bottom=Math.min(viewport.height,next?next.y-20*scale:viewport.height-20*scale)
  return bottom-top>90*scale?{top,bottom,viewport}:null
}

export default function SourceSlice({pdfKey,bytes,page,questionNumber,alt}:{pdfKey:string;bytes:ArrayBuffer;page:number;questionNumber:number;alt:string}){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    let renderTask:{cancel:()=>void;promise:Promise<void>}|null=null
    async function render(){
      try{
        setError('')
        const doc=await loadPdf(pdfKey,bytes)
        const pdfPage=await doc.getPage(page)
        const scale=1.55
        const bounds=await sliceBounds(pdfPage,scale,questionNumber)
        if(!bounds)throw new Error(`Could not isolate Question ${questionNumber}.`)
        const {top,bottom,viewport}=bounds
        const dpr=window.devicePixelRatio||1
        const full=document.createElement('canvas')
        const fullCtx=full.getContext('2d')!
        full.width=Math.floor(viewport.width*dpr)
        full.height=Math.floor(viewport.height*dpr)
        renderTask=pdfPage.render({canvasContext:fullCtx,viewport,transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]}) as typeof renderTask
        await renderTask!.promise
        if(cancelled)return
        const canvas=canvasRef.current
        if(!canvas)return
        const cssHeight=bottom-top
        canvas.width=full.width
        canvas.height=Math.floor(cssHeight*dpr)
        canvas.style.width='100%'
        canvas.style.height='auto'
        const ctx=canvas.getContext('2d')!
        ctx.drawImage(full,0,Math.floor(top*dpr),full.width,Math.floor(cssHeight*dpr),0,0,canvas.width,canvas.height)
      }catch(e){if(!cancelled)setError(e instanceof Error?e.message:'Unable to render question.')}
    }
    render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{}}
  },[pdfKey,bytes,page,questionNumber])

  return <div className="source-slice" role="img" aria-label={alt}>{error?<div className="source-error">{error}</div>:<canvas ref={canvasRef}/>}</div>
}
