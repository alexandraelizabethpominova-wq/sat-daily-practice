import {useEffect,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'
import {getQuestionImage,saveQuestionImage} from '../lib/questionImageStore'

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

type Marker={n:number;x:number;y:number}
async function sliceBounds(page:PDFPageProxy,scale:number,questionNumber:number){
  const viewport=page.getViewport({scale})
  const text=await page.getTextContent()
  const items=text.items.filter(isTextItem).map(item=>{
    const [x,y]=viewport.convertToViewportPoint(item.transform[4],item.transform[5])
    return{text:item.str.trim(),x,y}
  })

  const markers:Marker[]=[]
  for(const item of items){
    for(let n=Math.max(1,questionNumber-2);n<=questionNumber+5;n++){
      if(isMarker(item.text,n)){markers.push({n,x:item.x,y:item.y});break}
    }
  }
  const currentCandidates=markers.filter(m=>m.n===questionNumber)
  if(!currentCandidates.length)return null

  // Prefer markers nearest a column edge. SAT pages commonly use two columns.
  const current=[...currentCandidates].sort((a,b)=>a.x-b.x||a.y-b.y)[0]
  const isRightColumn=current.x>viewport.width*.48
  const gutter=viewport.width*.5
  const left=isRightColumn?gutter+18*scale:Math.max(0,viewport.width*.055)
  const right=isRightColumn?viewport.width-viewport.width*.055:gutter-18*scale

  const sameColumn=(m:Marker)=>isRightColumn?m.x>viewport.width*.48:m.x<viewport.width*.48
  const next=markers
    .filter(m=>m.n>questionNumber&&sameColumn(m)&&m.y>current.y+14*scale)
    .sort((a,b)=>a.y-b.y)[0]

  const top=Math.max(0,current.y-24*scale)
  const bottom=Math.min(viewport.height,next?next.y-18*scale:viewport.height-24*scale)
  if(bottom-top<100*scale)return null
  return{left,right,top,bottom,viewport}
}

function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob>{
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create question image.')),'image/png'))
}

export default function SourceSlice({pdfKey,bytes,page,questionNumber,alt}:{pdfKey:string;bytes:ArrayBuffer;page:number;questionNumber:number;alt:string}){
  const[src,setSrc]=useState('')
  const[error,setError]=useState('')

  useEffect(()=>{
    let cancelled=false
    let objectUrl=''
    let renderTask:{cancel:()=>void;promise:Promise<void>}|null=null
    const imageKey=`v2:${pdfKey}:${bytes.byteLength}:${page}:${questionNumber}`

    async function showBlob(blob:Blob){
      objectUrl=URL.createObjectURL(blob)
      if(!cancelled)setSrc(objectUrl)
    }

    async function render(){
      try{
        setError('');setSrc('')
        const existing=await getQuestionImage(imageKey)
        if(existing){await showBlob(existing);return}

        const doc=await loadPdf(pdfKey,bytes)
        const pdfPage=await doc.getPage(page)
        const scale=1.8
        const bounds=await sliceBounds(pdfPage,scale,questionNumber)
        if(!bounds)throw new Error(`Could not isolate Question ${questionNumber}.`)
        const {left,right,top,bottom,viewport}=bounds
        const dpr=window.devicePixelRatio||1

        const full=document.createElement('canvas')
        const fullCtx=full.getContext('2d')!
        full.width=Math.floor(viewport.width*dpr)
        full.height=Math.floor(viewport.height*dpr)
        renderTask=pdfPage.render({canvasContext:fullCtx,viewport,transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]}) as typeof renderTask
        await renderTask!.promise
        if(cancelled)return

        const cssWidth=right-left
        const cssHeight=bottom-top
        const out=document.createElement('canvas')
        out.width=Math.floor(cssWidth*dpr)
        out.height=Math.floor(cssHeight*dpr)
        const ctx=out.getContext('2d')!
        ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height)
        ctx.drawImage(full,Math.floor(left*dpr),Math.floor(top*dpr),Math.floor(cssWidth*dpr),Math.floor(cssHeight*dpr),0,0,out.width,out.height)
        const blob=await canvasToBlob(out)
        await saveQuestionImage(imageKey,blob)
        if(!cancelled)await showBlob(blob)
      }catch(e){if(!cancelled)setError(e instanceof Error?e.message:'Unable to render question.')}
    }
    render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{};if(objectUrl)URL.revokeObjectURL(objectUrl)}
  },[pdfKey,bytes,page,questionNumber])

  return <div className="source-slice" role="img" aria-label={alt}>{error?<div className="source-error">{error}</div>:src?<img src={src} alt={alt}/>:<div className="source-loading">Preparing question…</div>}</div>
}
