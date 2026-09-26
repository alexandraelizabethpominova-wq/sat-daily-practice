export type ContentMode='text'|'image-fallback'

export const QUESTION_CONTENT_VERSION=8

export interface StoredQuestionContent{
  questionId:string
  questionLines:string[]
  explanationLines:string[]
  questionMode:ContentMode
  explanationMode:ContentMode
  needsVisual:boolean
  importedAt:string
  contentVersion?:number
}

const memory=new Map<string,StoredQuestionContent>()

export async function getQuestionContent(questionId:string){
  return memory.get(questionId)
}

export async function saveQuestionContent(content:StoredQuestionContent){
  memory.set(content.questionId,content)
}

export async function countQuestionContent(){
  return memory.size
}

export async function clearQuestionContent(){
  memory.clear()
}

export function isCurrentQuestionContent(content:StoredQuestionContent|undefined){
  return Boolean(content&&content.contentVersion===QUESTION_CONTENT_VERSION)
}
