const DB='sat-practice-pdfs', STORE='pdfs'
const OFFICIAL_QUESTION_SOURCE='https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf'
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

async function loadOfficialQuestionSource(){
  try{
    const response=await fetch(OFFICIAL_QUESTION_SOURCE,{cache:'force-cache'})
    if(!response.ok)return null
    const bytes=await response.arrayBuffer()
    if(!bytes.byteLength)return null
    await storeBytes('questions',bytes)
    return bytes
  }catch(error){
    console.warn('Official SAT question source could not be loaded automatically.',error)
    return null
  }
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
