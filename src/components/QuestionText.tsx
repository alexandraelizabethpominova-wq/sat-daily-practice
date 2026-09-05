import {useEffect,useState} from 'react'
import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const cache=new Map<string,PDFDocumentProxy>()

async function loadPdf(key:string,bytes:ArrayBuffer){
  if(cache.has(key))return cache.get(key)!
  const doc=await getDocument({data:new Uint8Array(bytes.slice(0))}).promise
  cache.set(key,doc)
  return doc
}

type Item={str:string;x:number;y:number}

type Props={
  pdfKey:string
  bytes:ArrayBuffer
  page:number
  questionNumber:number
}

function normalizeSpace(s:string){return s.replace(/\s+/g,' ').trim()}

function groupLines(items:Item[]){
  const rows:Item[][]=[]
  for(const item of [...items].sort((a,b)=>a.y-b.y||a.x-b.x)){
    const row=rows.find(r=>Math.abs(r[0].y-item.y)<3)
    if(row)row.push(item)
    else rows.push([item])
  }
  return rows.map(row=>normalizeSpace(row.sort((a,b)=>a.x-b.x).map(i=>i.str).join(' '))).filter(Boolean)
}

function isMarker(text:string,n:number){
  const clean=text.replace(/[.)]/g,'').trim()
  return clean===String(n)
}

async function extractQuestion(bytes:ArrayBuffer,pdfKey:string,pageNumber:number,questionNumber:number){
  const doc=await loadPdf(pdfKey,bytes)
  const page=await doc.getPage(pageNumber)
  const viewport=page.getViewport({scale:1})
  const text=await page.getTextContent()
  const items:Item[]=text.items.flatMap(raw=>{
    if(!raw||typeof raw!=='object'||!('str' in raw)||!('transform' in raw))return[]
    const str=String((raw as {str:string}).str||'').trim()
    const transform=(raw as {transform:number[]}).transform
    if(!str||!Array.isArray(transform))return[]
    const [x,y]=viewport.convertToViewportPoint(transform[4],transform[5])
    return[{str,x,y}]
  })

  const left=items.filter(i=>i.x<viewport.width*.25)
  const current=left.filter(i=>isMarker(i.str,questionNumber)).sort((a,b)=>a.y-b.y)[0]
  if(!current)throw new Error(`Could not find Question ${questionNumber} in the imported PDF.`)

  const next=left.filter(i=>isMarker(i.str,questionNumber+1)&&i.y>current.y+6).sort((a,b)=>a.y-b.y)[0]
  const top=current.y-5
  const bottom=next?next.y-5:viewport.height-18
  const questionItems=items.filter(i=>i.y>=top&&i.y<bottom)
  const lines=groupLines(questionItems)

  while(lines.length&&/^(section|module|reading and writing|math)$/i.test(lines[0]))lines.shift()
  if(!lines.length)throw new Error(`Question ${questionNumber} was found, but its text could not be extracted.`)
  return lines
}

export default function QuestionText({pdfKey,bytes,page,questionNumber}:Props){
  const[lines,setLines]=useState<string[]>([])
  const[error,setError]=useState('')
  const[loading,setLoading]=useState(true)

  useEffect(()=>{
    let cancelled=false
    setLoading(true)
    setError('')
    extractQuestion(bytes,pdfKey,page,questionNumber).then(result=>{
      if(!cancelled)setLines(result)
    }).catch(e=>{
      if(!cancelled)setError(e instanceof Error?e.message:'Unable to extract this question.')
    }).finally(()=>{if(!cancelled)setLoading(false)})
    return()=>{cancelled=true}
  },[pdfKey,bytes,page,questionNumber])

  if(loading)return <div className="question-text loading">Loading question…</div>
  if(error)return <div className="question-text error-box">{error}</div>
  return <div className="question-text">{lines.map((line,i)=><p key={`${i}-${line}`}>{line}</p>)}</div>
}
