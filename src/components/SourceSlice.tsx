import {useEffect,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy,type PDFPageProxy} from 'pdfjs-dist'
import {getQuestionImage,saveQuestionImage} from '../lib/questionImageStore'
import {questionCropForParts} from '../lib/questionCrops'
import type {ModuleKey,PracticeTestId,SourceCrop} from '../types'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()
async function loadPdf(key:string,bytes:ArrayBuffer){
  const cacheKey=`${key}:${bytes.byteLength}`
  const cached=cache.get(cacheKey);if(cached)return cached
  const doc=await getDocument({data:new Uint8Array(bytes.slice(0))}).promise;cache.set(cacheKey,doc);return doc
}

type TextItemLike={str:string;transform:number[];width?:number}
function isTextItem(item:unknown):item is TextItemLike{return !!item&&typeof item==='object'&&'str' in item&&'transform' in item}
function isMarker(text:string,n:number){const s=text.trim().replace(/\s+/g,' ');return new RegExp(`^(?:Question\s*)?${n}(?:\s|[.)]|$)`,'i').test(s)}

function moduleForPage(page:number):ModuleKey|null{
  if(page>=4&&page<=17)return'rw1';if(page>=18&&page<=30)return'rw2';if(page>=34&&page<=41)return'math1';if(page>=42&&page<=50)return'math2';return null
}

type Marker={n:number;x:number;y:number}
async function pageTextItems(page:PDFPageProxy,scale:number){
  const viewport=page.getViewport({scale});const text=await page.getTextContent()
  const items=text.items.flatMap(raw=>{if(!isTextItem(raw))return[];const [x,y]=viewport.convertToViewportPoint(raw.transform[4],raw.transform[5]);const width=typeof raw.width==='number'?raw.width*scale:Math.max(raw.str.length*4.5*scale,8*scale);return[{text:raw.str.trim(),x,y,width}]})
  return{viewport,items}
}

async function explanationBounds(page:PDFPageProxy,scale:number,questionNumber:number){
  const {viewport,items}=await pageTextItems(page,scale)

  // PDF.js may return "QUESTION" and "14" as separate text items. Build visual
  // rows first so we can reliably identify the current and next question heading.
  const rowTolerance=4*scale
  const rows:{y:number;items:typeof items;text:string}[]=[]
  for(const item of [...items].filter(item=>item.text).sort((a,b)=>a.y-b.y||a.x-b.x)){
    const row=rows.find(candidate=>Math.abs(candidate.y-item.y)<=rowTolerance)
    if(row){
      row.items.push(item)
      row.items.sort((a,b)=>a.x-b.x)
      row.text=row.items.map(part=>part.text).join(' ').replace(/\s+/g,' ').trim()
    }else{
      rows.push({y:item.y,items:[item],text:item.text.replace(/\s+/g,' ').trim()})
    }
  }

  const headingFor=(n:number)=>rows.find(row=>new RegExp(`^QUESTION\\s*${n}(?:\\s|$)`,'i').test(row.text))
  const currentHeading=headingFor(questionNumber)
  const nextHeading=headingFor(questionNumber+1)

  let current:Marker|undefined
  let next:Marker|undefined

  if(currentHeading){
    current={
      n:questionNumber,
      x:Math.min(...currentHeading.items.map(item=>item.x)),
      y:currentHeading.y,
    }
    if(nextHeading&&nextHeading.y>current.y){
      next={
        n:questionNumber+1,
        x:Math.min(...nextHeading.items.map(item=>item.x)),
        y:nextHeading.y,
      }
    }
  }else{
    // Fallback for answer PDFs that do not use an explicit QUESTION heading.
    const markers:Marker[]=[]
    for(const item of items){
      for(let n=Math.max(1,questionNumber-2);n<=questionNumber+5;n++){
        if(isMarker(item.text,n)){markers.push({n,x:item.x,y:item.y});break}
      }
    }
    current=[...markers.filter(marker=>marker.n===questionNumber)].sort((a,b)=>a.y-b.y||a.x-b.x)[0]
    if(current){
      next=markers
        .filter(marker=>marker.n===questionNumber+1&&marker.y>current!.y+8*scale)
        .sort((a,b)=>a.y-b.y)[0]
    }
  }

  if(!current)return{left:0,right:viewport.width,top:0,bottom:viewport.height,viewport}

  // Start just above the current heading and stop just before the next heading.
  // This intentionally excludes adjacent question explanations on the same page.
  const top=Math.max(0,current.y-10*scale)
  const bottom=Math.min(viewport.height,next?next.y-10*scale:viewport.height-12*scale)
  const blockItems=items.filter(item=>item.text&&item.y>=top&&item.y<bottom)
  if(!blockItems.length)return{left:0,right:viewport.width,top,bottom,viewport}

  const horizontalItems=blockItems.filter(item=>item.y>=current!.y-2*scale)
  const measured=horizontalItems.length?horizontalItems:blockItems
  const padding=14*scale
  const left=Math.max(0,Math.min(...measured.map(item=>item.x))-padding)
  const right=Math.min(viewport.width,Math.max(...measured.map(item=>item.x+item.width))+padding)
  return{left,right,top,bottom,viewport}
}

async function dynamicQuestionBounds(page:PDFPageProxy,scale:number,questionNumber:number){
  const {viewport,items}=await pageTextItems(page,scale)
  const marginCandidates=items.filter(item=>isMarker(item.text,questionNumber)&&(item.x<viewport.width*.22||item.x>viewport.width*.50))
  const current=marginCandidates.sort((a,b)=>a.y-b.y||a.x-b.x)[0]
  if(!current)return{left:28*scale,right:569*scale,top:107*scale,bottom:735*scale,viewport}
  const leftColumn=current.x<viewport.width*.5
  const left=(leftColumn?28:306)*scale;const right=(leftColumn?291:569)*scale
  const nextMarkers=items.filter(item=>{
    const raw=item.text.trim();if(!/^\d{1,2}$/.test(raw))return false
    const sameColumn=leftColumn?item.x<viewport.width*.5:item.x>=viewport.width*.5
    return sameColumn&&item.y>current.y+8*scale
  }).sort((a,b)=>a.y-b.y)
  const top=Math.max(0,current.y-12*scale);const bottom=Math.min(viewport.height,nextMarkers.length?nextMarkers[0].y-10*scale:735*scale)
  return{left,right,top,bottom,viewport}
}

function canvasToBlob(canvas:HTMLCanvasElement):Promise<Blob>{return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create image.')),'image/png'))}

type Props={pdfKey:string;bytes:ArrayBuffer;page:number;questionNumber:number;alt:string;zoom?:number;practiceTestId:PracticeTestId;module?:ModuleKey;sourceCrop?:SourceCrop|null}

export default function SourceSlice({pdfKey,bytes,page,questionNumber,alt,zoom=1,practiceTestId,module,sourceCrop}:Props){
  const[src,setSrc]=useState('');const[error,setError]=useState('');const isQuestion=pdfKey==='questions'
  useEffect(()=>{
    let cancelled=false;let objectUrl='';let renderTask:{cancel:()=>void;promise:Promise<void>}|null=null
    const cropKey=sourceCrop?`${sourceCrop.x},${sourceCrop.y},${sourceCrop.width},${sourceCrop.height}`:'auto'
    const imageKey=`v12:${practiceTestId}:${pdfKey}:${bytes.byteLength}:${page}:${questionNumber}:${cropKey}`
    async function showBlob(blob:Blob){objectUrl=URL.createObjectURL(blob);if(!cancelled)setSrc(objectUrl)}
    async function render(){
      try{
        setError('');setSrc('');const existing=await getQuestionImage(imageKey);if(existing){await showBlob(existing);return}
        const doc=await loadPdf(`${practiceTestId}:${pdfKey}`,bytes);const pdfPage=await doc.getPage(page);const dpr=window.devicePixelRatio||1
        let scale=1.8,left=0,right=0,top=0,bottom=0,viewport
        if(isQuestion){
          scale=2.4
          const resolvedModule=module??moduleForPage(page)
          if(!resolvedModule)throw new Error(`Question ${questionNumber} has an unsupported source page.`)
          const crop=sourceCrop??questionCropForParts(practiceTestId,resolvedModule,questionNumber)
          if(crop){
            viewport=pdfPage.getViewport({scale})
            left=crop.x*scale;right=(crop.x+crop.width)*scale;top=crop.y*scale;bottom=(crop.y+crop.height)*scale
          }else if(practiceTestId==='practice-test-4'){
            const bounds=await dynamicQuestionBounds(pdfPage,scale,questionNumber);viewport=bounds.viewport;({left,right,top,bottom}=bounds)
          }else{
            throw new Error(`No verified source crop exists for ${practiceTestId} ${resolvedModule} question ${questionNumber}.`)
          }
        }else{const bounds=await explanationBounds(pdfPage,scale,questionNumber);viewport=bounds.viewport;({left,right,top,bottom}=bounds)}
        const full=document.createElement('canvas');const fullCtx=full.getContext('2d')!;full.width=Math.ceil(viewport.width*dpr);full.height=Math.ceil(viewport.height*dpr)
        renderTask=pdfPage.render({canvasContext:fullCtx,viewport,transform:dpr===1?undefined:[dpr,0,0,dpr,0,0]}) as typeof renderTask;await renderTask!.promise;if(cancelled)return
        const srcX=Math.max(0,Math.floor(left*dpr)),srcY=Math.max(0,Math.floor(top*dpr)),srcRight=Math.min(full.width,Math.ceil(right*dpr)),srcBottom=Math.min(full.height,Math.ceil(bottom*dpr))
        const srcWidth=Math.max(1,srcRight-srcX),srcHeight=Math.max(1,srcBottom-srcY);const out=document.createElement('canvas');out.width=srcWidth;out.height=srcHeight
        const ctx=out.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(full,srcX,srcY,srcWidth,srcHeight,0,0,out.width,out.height)
        const blob=await canvasToBlob(out);await saveQuestionImage(imageKey,blob);if(!cancelled)await showBlob(blob)
      }catch(reason){if(!cancelled)setError(reason instanceof Error?reason.message:'Unable to render item.')}
    }
    void render()
    return()=>{cancelled=true;try{renderTask?.cancel()}catch{};if(objectUrl)URL.revokeObjectURL(objectUrl)}
  },[pdfKey,bytes,page,questionNumber,isQuestion,practiceTestId,module,sourceCrop])
  const zoomWidth=`${Math.round(zoom*10000)/100}%`
  return <div className={`source-slice ${isQuestion?'question-source':''}`} role="img" aria-label={alt}>
    <div className="source-slice-content" style={{overflow:'auto',justifyContent:'flex-start'}}>
      {error?<div className="source-error">{error}</div>:src?
        <div className="source-slice-zoom" style={{width:zoomWidth,margin:zoom<=1?'0 auto':'0',flex:'0 0 auto',minWidth:0}}>
          <img src={src} alt={alt} style={{display:'block',width:'100%',maxWidth:'none',height:'auto',transform:'none'}}/>
        </div>
        :<div className="source-loading">{isQuestion?'Preparing question…':'Preparing explanation…'}</div>}
    </div>
  </div>
}
