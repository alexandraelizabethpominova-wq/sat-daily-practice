import {GlobalWorkerOptions,getDocument,type PDFDocumentProxy} from 'pdfjs-dist'
import {QUESTION_BANK} from './questionBank'
import {QUESTION_CROPS} from './questionCrops'
import {getQuestionContent,saveQuestionContent,type StoredQuestionContent} from './questionContentStore'
import type {PracticeQuestion} from '../types'

GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString()

const pdfCache=new Map<string,PDFDocumentProxy>()

type TextItem={text:string;x:number;y:number}

async function loadPdf(key:string,bytes:ArrayBuffer){
  const cacheKey=`${key}:${bytes.byteLength}`
  const cached=pdfCache.get(cacheKey)
  if(cached)return cached
  const doc=await getDocument({data:new Uint8Array(bytes.slice(0))}).promise
  pdfCache.set(cacheKey,doc)
  return doc
}

function normalizeSpace(value:string){return value.replace(/\s+/g,' ').trim()}

function groupLines(items:TextItem[]){
  const rows:TextItem[][]=[]
  for(const item of [...items].sort((a,b)=>a.y-b.y||a.x-b.x)){
    const row=rows.find(candidate=>Math.abs(candidate[0].y-item.y)<3)
    if(row)row.push(item)
    else rows.push([item])
  }
  return rows
    .map(row=>normalizeSpace(row.sort((a,b)=>a.x-b.x).map(item=>item.text).join(' ')))
    .filter(Boolean)
}

async function pageItems(doc:PDFDocumentProxy,pageNumber:number){
  const page=await doc.getPage(pageNumber)
  const viewport=page.getViewport({scale:1})
  const content=await page.getTextContent()
  const items:TextItem[]=content.items.flatMap(raw=>{
    if(!raw||typeof raw!=='object'||!('str' in raw)||!('transform' in raw))return[]
    const text=String((raw as {str:string}).str??'').trim()
    const transform=(raw as {transform:number[]}).transform
    if(!text||!Array.isArray(transform))return[]
    const [x,y]=viewport.convertToViewportPoint(transform[4],transform[5])
    return[{text,x,y}]
  })
  return {items,viewport}
}

function cleanQuestionLines(lines:string[],questionNumber:number){
  return lines.filter(line=>{
    const normalized=line.trim()
    if(!normalized)return false
    if(normalized===String(questionNumber))return false
    if(/^Module\s+\d+$/i.test(normalized))return false
    if(/Unauthorized copying or reuse/i.test(normalized))return false
    if(/^CONTINUE$/i.test(normalized)||/^STOP$/i.test(normalized))return false
    return true
  })
}

function cleanExplanationLines(lines:string[],questionNumber:number){
  return lines.filter(line=>{
    const normalized=line.trim()
    if(!normalized)return false
    if(new RegExp(`^QUESTION\\s+${questionNumber}$`,'i').test(normalized))return false
    if(/^SAT ANSWER EXPLANATIONS/i.test(normalized))return false
    if(/^\d+ SAT PRACTICE TEST/i.test(normalized))return false
    if(/READING AND WRITING: MODULE/i.test(normalized)||/MATH: MODULE/i.test(normalized))return false
    return true
  })
}

function hasVisualReference(lines:string[]){
  const text=lines.join(' ').toLowerCase()
  return /\b(graph|scatterplot|diagram|figure|line graph|bar graph)\b/.test(text)
}

export async function extractQuestionLines(question:PracticeQuestion,questionPdf:ArrayBuffer){
  const doc=await loadPdf('questions',questionPdf)
  const {items}=await pageItems(doc,question.sourcePage)
  const crop=QUESTION_CROPS[question.module][question.number]
  const margin=4
  const selected=items.filter(item=>
    item.x>=crop.x-margin&&item.x<=crop.x+crop.width+margin&&
    item.y>=crop.y-margin&&item.y<=crop.y+crop.height+margin
  )
  return cleanQuestionLines(groupLines(selected),question.number)
}

export async function extractExplanationLines(question:PracticeQuestion,answerPdf:ArrayBuffer){
  const doc=await loadPdf('answers',answerPdf)
  const {items,viewport}=await pageItems(doc,question.answerPage)
  const markers=items
    .filter(item=>/^QUESTION\s+\d+$/i.test(item.text))
    .map(item=>({number:Number(item.text.match(/\d+/)?.[0]??0),y:item.y}))
    .sort((a,b)=>a.y-b.y)
  const current=markers.find(marker=>marker.number===question.number)
  if(!current)return[]
  const next=markers.find(marker=>marker.y>current.y+6)
  const selected=items.filter(item=>item.y>=current.y-3&&item.y<(next?.y??viewport.height-8))
  return cleanExplanationLines(groupLines(selected),question.number)
}

export async function ensureQuestionText(question:PracticeQuestion,questionPdf:ArrayBuffer){
  const existing=await getQuestionContent(question.id)
  if(existing?.questionLines.length)return existing
  const questionLines=await extractQuestionLines(question,questionPdf)
  const record:StoredQuestionContent={
    questionId:question.id,
    questionLines,
    explanationLines:existing?.explanationLines??[],
    questionMode:questionLines.length?'text':'image-fallback',
    explanationMode:existing?.explanationMode??'text',
    needsVisual:hasVisualReference(questionLines),
    importedAt:new Date().toISOString(),
  }
  await saveQuestionContent(record)
  return record
}

export async function ensureExplanationText(question:PracticeQuestion,answerPdf:ArrayBuffer){
  const existing=await getQuestionContent(question.id)
  if(existing?.explanationLines.length)return existing
  const explanationLines=await extractExplanationLines(question,answerPdf)
  const record:StoredQuestionContent={
    questionId:question.id,
    questionLines:existing?.questionLines??[],
    explanationLines,
    questionMode:existing?.questionMode??'text',
    explanationMode:explanationLines.length?'text':'image-fallback',
    needsVisual:existing?.needsVisual??false,
    importedAt:new Date().toISOString(),
  }
  await saveQuestionContent(record)
  return record
}

export async function importPracticeMaterials(questionPdf:ArrayBuffer,answerPdf:ArrayBuffer,onProgress?:(done:number,total:number)=>void){
  let done=0
  const total=QUESTION_BANK.length
  for(const question of QUESTION_BANK){
    let existing=await getQuestionContent(question.id)
    try{
      const questionLines=existing?.questionLines.length?existing.questionLines:await extractQuestionLines(question,questionPdf)
      const explanationLines=existing?.explanationLines.length?existing.explanationLines:await extractExplanationLines(question,answerPdf)
      const record:StoredQuestionContent={
        questionId:question.id,
        questionLines,
        explanationLines,
        questionMode:questionLines.length?'text':'image-fallback',
        explanationMode:explanationLines.length?'text':'image-fallback',
        needsVisual:hasVisualReference(questionLines),
        importedAt:new Date().toISOString(),
      }
      await saveQuestionContent(record)
      existing=record
    }catch{
      await saveQuestionContent({
        questionId:question.id,
        questionLines:existing?.questionLines??[],
        explanationLines:existing?.explanationLines??[],
        questionMode:existing?.questionLines.length?'text':'image-fallback',
        explanationMode:existing?.explanationLines.length?'text':'image-fallback',
        needsVisual:existing?.needsVisual??false,
        importedAt:new Date().toISOString(),
      })
    }
    done++
    onProgress?.(done,total)
  }
  return total
}
