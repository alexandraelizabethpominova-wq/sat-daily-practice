const memory=new Map<string,Blob>()

export async function getQuestionImage(key:string):Promise<Blob|null>{
  return memory.get(key)??null
}

export async function saveQuestionImage(key:string,blob:Blob){
  memory.set(key,blob)
}
