const DB='sat-practice-pdfs', STORE='pdfs'
const OFFICIAL_SOURCES={
  questions:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-digital.pdf',
  answers:'https://satsuite.collegeboard.org/media/pdf/sat-practice-test-4-answers-digital.pdf',
} as const
const supabaseUrl=import.meta.env.VITE_SUPABASE_URL as string|undefined
export type PdfKind=keyof typeof OFFICIAL_SOURCES

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

async function loadOfficialSource(kind:PdfKind){
  const candidates=[
    supabaseUrl?`${supabaseUrl.replace(/\/$/,'')}/functions/v1/sat-question-source?kind=${kind}`:null,
    OFFICIAL_SOURCES[kind],
  ].filter((value):value is string=>Boolean(value))

  for(const url of candidates){
    try{
      const bytes=await fetchPdf(url)
      await storeBytes(kind,bytes)
      return bytes
    }catch(error){
      console.warn(`SAT ${kind} source failed: ${url}`,error)
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
  return loadOfficialSource(kind)
}

export async function clearPdfs(){const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
