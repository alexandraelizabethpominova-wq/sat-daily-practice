const DB='sat-practice-pdfs', STORE='pdfs'
const OFFICIAL_QUESTION_SOURCE='https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf'
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL as string|undefined
export type PdfKind='questions'|'answers'

function openDb():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}

async function storeBytes(kind:PdfKind,bytes:ArrayBuffer){
  const db=await openDb()
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(bytes,kind);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})
}

async function readStored(kind:PdfKind):Promise<ArrayBuffer|null>{
  const db=await openDb()
  return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(kind);req.onsuccess=()=>{const stored=req.result as ArrayBuffer|undefined;resolve(stored?.byteLength?stored:null)};req.onerror=()=>reject(req.error)})
}

async function fetchPdf(url:string){
  const response=await fetch(url,{cache:'force-cache'})
  if(!response.ok)throw new Error(`PDF source returned ${response.status}.`)
  const contentType=response.headers.get('content-type')??''
  if(contentType&&!contentType.includes('pdf')&&!contentType.includes('octet-stream'))throw new Error(`Unexpected PDF content type: ${contentType}`)
  const bytes=await response.arrayBuffer()
  if(!bytes.byteLength)throw new Error('PDF source returned an empty file.')
  return bytes
}

async function loadOfficialQuestionSource(){
  const candidates=[
    supabaseUrl?`${supabaseUrl.replace(/\/$/,'')}/functions/v1/sat-question-source`:null,
    OFFICIAL_QUESTION_SOURCE,
  ].filter((value):value is string=>Boolean(value))

  for(const url of candidates){
    try{
      const bytes=await fetchPdf(url)
      await storeBytes('questions',bytes)
      return bytes
    }catch(error){
      console.warn(`SAT question source failed: ${url}`,error)
    }
  }
  return null
}

export async function savePdf(kind:PdfKind,file:File){
  const bytes=await file.arrayBuffer()
  if(!bytes.byteLength)throw new Error('The selected PDF is empty.')
  await storeBytes(kind,bytes)
}

export async function getPdf(kind:PdfKind):Promise<ArrayBuffer|null>{
  const stored=await readStored(kind)
  if(stored)return stored
  if(kind==='questions')return loadOfficialQuestionSource()
  return null
}

export async function clearPdfs(){const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
