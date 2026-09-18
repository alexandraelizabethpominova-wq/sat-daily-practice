import type {PracticeTestId} from '../types'

const DB='sat-practice-pdfs', STORE='pdfs'
const OFFICIAL_SOURCES:Record<PracticeTestId,{questions:string;answers:string}>={
  'practice-test-4':{
    questions:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf',
    answers:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf',
  },
  'practice-test-5':{
    questions:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-digital.pdf',
    answers:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-5-answers-digital.pdf',
  },
}
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL as string|undefined
export type PdfKind='questions'|'answers'

function openDb():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function storageKey(testId:PracticeTestId,kind:PdfKind){return `${testId}:${kind}`}

async function storeBytes(testId:PracticeTestId,kind:PdfKind,bytes:ArrayBuffer){
  const db=await openDb();const key=storageKey(testId,kind)
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(bytes,key);if(testId==='practice-test-4')tx.objectStore(STORE).put(bytes,kind);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})
}

async function readStored(testId:PracticeTestId,kind:PdfKind):Promise<ArrayBuffer|null>{
  const db=await openDb();const keys=[storageKey(testId,kind),...(testId==='practice-test-4'?[kind]:[])]
  for(const key of keys){
    const stored=await new Promise<ArrayBuffer|undefined>((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(key);req.onsuccess=()=>resolve(req.result as ArrayBuffer|undefined);req.onerror=()=>reject(req.error)})
    if(stored?.byteLength)return stored
  }
  return null
}

async function fetchPdf(url:string){
  const response=await fetch(url,{cache:'force-cache'})
  if(!response.ok)throw new Error(`PDF source returned ${response.status}.`)
  const contentType=response.headers.get('content-type')??''
  if(contentType&&!contentType.includes('pdf')&&!contentType.includes('octet-stream'))throw new Error(`Unexpected PDF content type: ${contentType}`)
  const bytes=await response.arrayBuffer();if(!bytes.byteLength)throw new Error('PDF source returned an empty file.');return bytes
}

async function loadOfficialSource(testId:PracticeTestId,kind:PdfKind){
  const source=OFFICIAL_SOURCES[testId]?.[kind]
  const candidates=[
    supabaseUrl?`${supabaseUrl.replace(/\/$/,'')}/functions/v1/sat-question-source?kind=${kind}&practiceTestId=${encodeURIComponent(testId)}`:null,
    source??null,
  ].filter((value):value is string=>Boolean(value))
  for(const url of candidates){
    try{const bytes=await fetchPdf(url);await storeBytes(testId,kind,bytes);return bytes}
    catch(error){console.warn(`SAT ${testId} ${kind} source failed: ${url}`,error)}
  }
  return null
}

export async function savePracticeTestPdf(testId:PracticeTestId,kind:PdfKind,file:File){
  const bytes=await file.arrayBuffer();if(!bytes.byteLength)throw new Error('The selected PDF is empty.');await storeBytes(testId,kind,bytes)
}
export async function getPracticeTestPdf(testId:PracticeTestId,kind:PdfKind):Promise<ArrayBuffer|null>{
  const stored=await readStored(testId,kind);return stored??loadOfficialSource(testId,kind)
}
export async function savePdf(kind:PdfKind,file:File){return savePracticeTestPdf('practice-test-4',kind,file)}
export async function getPdf(kind:PdfKind){return getPracticeTestPdf('practice-test-4',kind)}
export async function clearPdfs(){const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
