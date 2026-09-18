export type ContentMode='text'|'image-fallback'

export const QUESTION_CONTENT_VERSION=2

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

const DB_NAME='sat-practice-content'
const DB_VERSION=1
const STORE='questions'

function openDb():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION)
    request.onupgradeneeded=()=>{
      const db=request.result
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'questionId'})
    }
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error??new Error('Unable to open question database.'))
  })
}

async function run<T>(mode:IDBTransactionMode,action:(store:IDBObjectStore,resolve:(value:T)=>void,reject:(reason?:unknown)=>void)=>void){
  const db=await openDb()
  return new Promise<T>((resolve,reject)=>{
    const tx=db.transaction(STORE,mode)
    const store=tx.objectStore(STORE)
    action(store,resolve,reject)
    tx.oncomplete=()=>db.close()
    tx.onerror=()=>{db.close();reject(tx.error??new Error('Question database transaction failed.'))}
  })
}

export async function getQuestionContent(questionId:string){
  return run<StoredQuestionContent|undefined>('readonly',(store,resolve,reject)=>{
    const request=store.get(questionId)
    request.onsuccess=()=>resolve(request.result as StoredQuestionContent|undefined)
    request.onerror=()=>reject(request.error)
  })
}

export async function saveQuestionContent(content:StoredQuestionContent){
  return run<void>('readwrite',(store,resolve,reject)=>{
    const request=store.put(content)
    request.onsuccess=()=>resolve()
    request.onerror=()=>reject(request.error)
  })
}

export async function countQuestionContent(){
  return run<number>('readonly',(store,resolve,reject)=>{
    const request=store.count()
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error)
  })
}

export async function clearQuestionContent(){
  return run<void>('readwrite',(store,resolve,reject)=>{
    const request=store.clear()
    request.onsuccess=()=>resolve()
    request.onerror=()=>reject(request.error)
  })
}

export function isCurrentQuestionContent(content:StoredQuestionContent|undefined){
  return Boolean(content&&content.contentVersion===QUESTION_CONTENT_VERSION)
}
