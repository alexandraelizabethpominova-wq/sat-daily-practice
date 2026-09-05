import {useEffect,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'
import {Maximize2,Minus,Plus} from 'lucide-react'
import AlexIconButton from '../design-system/atoms/AlexIconButton'
import {getQuestionImage,saveQuestionImage} from '../lib/questionImageStore'
import {QUESTION_CROPS} from '../lib/questionCrops'
import type {ModuleKey} from '../types'

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

function moduleForPage(page:number):ModuleKey|null{
  if(page>=4&&page<=17)return'rw1'
  if(page>=18&&page<=30)return'rw2'
  if(page>=34&&page<=39)return'math1'
  if(page>=42&&page<=48)return'math2'
  return null
}

type Marker={n:number;x:number;y:number}
async function explanationBounds(page:PDFPageProxy,scale:number,questionNumber:number){
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
  if(!currentCandidates.length)return{left:0,right:viewport.width,top:0,bottom:viewport.height,viewport}

  const current=[...currentCandidates].sort((a,b)=>a.y-b.y||a.x-b.x)[0]
  const next=markers.filter(m=>m.n===questionNumber+1&&m.y>current.y+14*scale).sort((a,b)=>a.y-b.y)[0]
  const top=Math.max(0,current.y-28*scale)
  const bottom=Math.min(viewport.height,next?next.y-18*scale:viewport.height-12*scale)

  return{left:0,right:viewport.width,top,bottom,viewport}
}

function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob>{
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create image.')),'image/png'))
}

export default function SourceSlice({pdfKey,bytes,page,questionNumber,alt}:{pdfKey:string;bytes:ArrayBuffer;page:number;questionNumber:number;alt:string}){
  const[src,setSrc]=useState('')
  const[error,setError]=useState('')
  const[zoom,setZoom]=useState(1)
  const isQuestion=pdfKey==='questions'

  useEffect(()=>{setZoom(1)},[page,questionNumber,pdfKey])

  useEffect(()=>{
    let cancelled=false
    let objectUrl=''
    let renderTask:{cancel:()=>void;promise:Promise<void>}|null=null
    const imageKey=`v4:${pdfKey}:${bytes.byteLength}:${page}:${questionNumber}`

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
        const dpr=window.devicePixelRatio||1
        let scale=1.8
        let left=0,right=0,top=0,bottom=0,viewport

        if(isQuestion){
          scale=2.4
          viewport=pdfPage.getViewport({scale})
          const module=moduleForPage(page)
          if(!module)throw new Error(`Question ${questionNumber} has an unsupported source page.`)
          const crop=QUESTION_CROPS[module]?.[questionNumber]
          if(!crop)throw new Error(`Question ${questionNumber} crop is not configured.`)
          left=crop.x*scale
          right=(crop.x+crop.width)*scale
          top=crop.y*scale
          bottom=(crop.y+crop.height)*scale
        }else{
          const bounds=await explanationBounds(pdfPage,scale,questionNumber)
          viewport=bounds.viewport
          ;({left,right,top,bottom}=bounds)
        }

        const full=document.createElement('canvas')
        const fullCtx=full.getContext('2d')!
        full.width=Math.ceil(viewport.width*dpr)
        full.height=Math.ceil(viewport.height*dpr)
        renderTask=pdfPage.render({canvasContext:fullCtx,viewport,transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]}) as typeof renderTask
        await renderTask!.promise
        if(cancelled)return

        const srcX=Math.max(0,Math.floor(left*dpr))
        const srcY=Math.max(0,Math.floor(top*dpr))
        const srcRight=Math.min(full.width,Math.ceil(right*dpr))
        const srcBottom=Math.min(full.height,Math.ceil(bottom*dpr))
        const srcWidth=Math.max(1,srcRight-srcX)
        const srcHeight=Math.max(1,srcBottom-srcY)

        const out=document.createElement('canvas')
        out.width=srcWidth
        out.height=srcHeight
        const ctx=out.getContext('2d')!
        ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height)
        ctx.drawImage(full,srcX,srcY,srcWidth,srcHeight,0,0,out.width,out.height)

        const blob=await canvasToBlob(out)
        await saveQuestionImage(imageKey,blob)
        if(!cancelled)await showBlob(blob)
      }catch(e){
        if(!cancelled)setError(e instanceof Error?e.message:'Unable to render item.')
      }
    }
    render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{};if(objectUrl)URL.revokeObjectURL(objectUrl)}
  },[pdfKey,bytes,page,questionNumber,isQuestion])

  return <div className={`source-slice ${isQuestion?'question-source':''}`} role="img" aria-label={alt}>
    {isQuestion&&<div className="question-zoom-bar">
      <span>Question view</span>
      <div>
        <AlexIconButton label="Zoom out" onClick={()=>setZoom(z=>Math.max(.7,+(z-.1).toFixed(2)))} disabled={zoom<=.7}><Minus size={17}/></AlexIconButton>
        <span className="zoom-value">{Math.round(zoom*100)}%</span>
        <AlexIconButton label="Zoom in" onClick={()=>setZoom(z=>Math.min(1.8,+(z+.1).toFixed(2)))} disabled={zoom>=1.8}><Plus size={17}/></AlexIconButton>
        <AlexIconButton label="Fit question to screen" onClick={()=>setZoom(1)} disabled={zoom===1}><Maximize2 size={16}/></AlexIconButton>
      </div>
    </div>}
    <div className="source-slice-content">
      {error?<div className="source-error">{error}</div>:src?<img src={src} alt={alt} style={isQuestion?{transform:`scale(${zoom})`}:undefined}/>:<div className="source-loading">Preparing question…</div>}
    </div>
  </div>
}
