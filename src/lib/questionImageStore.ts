const DB_NAME='sat-daily-question-images'
const STORE='images'

function openDb():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1)
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)}
    req.onsuccess=()=>resolve(req.result)
    req.onerror=()=>reject(req.error)
  })
}

export async function getQuestionImage(key:string):Promise<Blob|null>{
  const db=await openDb()
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly')
    const req=tx.objectStore(STORE).get(key)
    req.onsuccess=()=>resolve((req.result as Blob|undefined)??null)
    req.onerror=()=>reject(req.error)
  })
}

export async function saveQuestionImage(key:string,blob:Blob){
  const db=await openDb()
  return new Promise<void>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite')
    tx.objectStore(STORE).put(blob,key)
    tx.oncomplete=()=>resolve()
    tx.onerror=()=>reject(tx.error)
  })
}
