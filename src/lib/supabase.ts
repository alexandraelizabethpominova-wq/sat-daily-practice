import {createClient,type User} from '@supabase/supabase-js'
import type {Attempt,SessionSummary,SubjectMode} from '../types'

const url=import.meta.env.VITE_SUPABASE_URL as string|undefined
const publishableKey=(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY??import.meta.env.VITE_SUPABASE_ANON_KEY) as string|undefined

export const supabase=url&&publishableKey?createClient(url,publishableKey,{auth:{persistSession:true}}):null

export type CloudResult={status:'ok'|'skipped'|'failed';message?:string}
export type CloudHistory={attempts:Attempt[];sessions:SessionSummary[]}

type SessionRow={id:string;started_at:string;ended_at:string|null;mode:SubjectMode;question_count:number}
type AttemptRow={id:string;session_id:string;question_id:string;subject:'english'|'math';module:Attempt['module'];question_number:number;selected_answer:string;correct_answer:string;correct:boolean;self_graded:boolean;elapsed_ms:number;created_at:string}

async function currentUser():Promise<User|null>{
  if(!supabase)return null
  const {data,error}=await supabase.auth.getUser()
  if(error){console.warn('Supabase auth lookup failed',error);return null}
  return data.user
}

function failed(message:string,error:unknown):CloudResult{
  console.error(message,error)
  return {status:'failed',message}
}

export async function getCloudUser(){return currentUser()}

export function subscribeToCloudAuth(onChange:(user:User|null)=>void){
  if(!supabase)return ()=>{}
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>onChange(session?.user??null))
  return ()=>subscription.unsubscribe()
}

export async function requestCloudSignIn(email:string):Promise<CloudResult>{
  if(!supabase)return {status:'skipped',message:'Supabase is not configured.'}
  const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}})
  return error?failed('Could not send the Supabase sign-in link.',error):{status:'ok'}
}

export async function signOutCloud():Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const {error}=await supabase.auth.signOut()
  return error?failed('Could not sign out of Supabase.',error):{status:'ok'}
}

export async function syncSessionStart(input:{id:string;startedAt:string;mode:SubjectMode;questionCount:number}):Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const user=await currentUser()
  if(!user)return {status:'skipped',message:'Sign in to enable cloud sync.'}
  const {error}=await supabase.from('sat_sessions').upsert({
    id:input.id,user_id:user.id,started_at:input.startedAt,ended_at:null,mode:input.mode,question_count:input.questionCount,
  })
  return error?failed('Could not create the cloud practice session.',error):{status:'ok'}
}

export async function syncAttempt(attempt:Attempt):Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const user=await currentUser()
  if(!user)return {status:'skipped',message:'Sign in to enable cloud sync.'}
  const {error}=await supabase.from('sat_attempts').upsert({
    id:attempt.id,user_id:user.id,session_id:attempt.sessionId,question_id:attempt.questionId,subject:attempt.subject,
    module:attempt.module,question_number:attempt.questionNumber,selected_answer:attempt.selectedAnswer,
    correct_answer:attempt.correctAnswer,correct:attempt.correct,self_graded:attempt.selfGraded??false,
    elapsed_ms:attempt.elapsedMs,created_at:attempt.createdAt,
  })
  return error?failed('Could not sync this answer to Supabase.',error):{status:'ok'}
}

export async function syncSession(session:SessionSummary):Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const user=await currentUser()
  if(!user)return {status:'skipped',message:'Sign in to enable cloud sync.'}
  const {error}=await supabase.from('sat_sessions').upsert({
    id:session.id,user_id:user.id,started_at:session.startedAt,ended_at:session.endedAt,mode:session.mode,question_count:session.questionCount,
  })
  return error?failed('Could not finalize the cloud practice session.',error):{status:'ok'}
}

export async function loadCloudHistory():Promise<CloudHistory|null>{
  if(!supabase)return null
  const user=await currentUser()
  if(!user)return null
  const [{data:sessionRows,error:sessionError},{data:attemptRows,error:attemptError}]=await Promise.all([
    supabase.from('sat_sessions').select('id,started_at,ended_at,mode,question_count').eq('user_id',user.id).order('started_at',{ascending:true}),
    supabase.from('sat_attempts').select('id,session_id,question_id,subject,module,question_number,selected_answer,correct_answer,correct,self_graded,elapsed_ms,created_at').eq('user_id',user.id).order('created_at',{ascending:true}),
  ])
  if(sessionError||attemptError){
    console.error('Could not load Supabase practice history',sessionError??attemptError)
    return null
  }
  const attempts=(attemptRows as AttemptRow[]).map(row=>({
    id:row.id,sessionId:row.session_id,questionId:row.question_id,subject:row.subject,module:row.module,
    questionNumber:row.question_number,selectedAnswer:row.selected_answer,correctAnswer:row.correct_answer,
    correct:row.correct,selfGraded:row.self_graded,elapsedMs:row.elapsed_ms,createdAt:row.created_at,
  }))
  const bySession=new Map<string,Attempt[]>()
  for(const attempt of attempts)bySession.set(attempt.sessionId,[...(bySession.get(attempt.sessionId)??[]),attempt])
  const sessions=(sessionRows as SessionRow[]).filter(row=>Boolean(row.ended_at)).map(row=>({
    id:row.id,startedAt:row.started_at,endedAt:row.ended_at!,mode:row.mode,questionCount:row.question_count,attempts:bySession.get(row.id)??[],
  }))
  return {attempts,sessions}
}

export async function syncLocalHistory(sessions:SessionSummary[],attempts:Attempt[]):Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const user=await currentUser()
  if(!user)return {status:'skipped',message:'Sign in to enable cloud sync.'}
  if(sessions.length){
    const {error}=await supabase.from('sat_sessions').upsert(sessions.map(session=>({
      id:session.id,user_id:user.id,started_at:session.startedAt,ended_at:session.endedAt,mode:session.mode,question_count:session.questionCount,
    })))
    if(error)return failed('Could not back up local sessions to Supabase.',error)
  }
  if(attempts.length){
    const {error}=await supabase.from('sat_attempts').upsert(attempts.map(attempt=>({
      id:attempt.id,user_id:user.id,session_id:attempt.sessionId,question_id:attempt.questionId,subject:attempt.subject,module:attempt.module,
      question_number:attempt.questionNumber,selected_answer:attempt.selectedAnswer,correct_answer:attempt.correctAnswer,
      correct:attempt.correct,self_graded:attempt.selfGraded??false,elapsed_ms:attempt.elapsedMs,created_at:attempt.createdAt,
    })))
    if(error)return failed('Could not back up local attempts to Supabase.',error)
  }
  return {status:'ok'}
}

export async function clearCloudHistory():Promise<CloudResult>{
  if(!supabase)return {status:'skipped'}
  const user=await currentUser()
  if(!user)return {status:'skipped'}
  const {error}=await supabase.from('sat_sessions').delete().eq('user_id',user.id)
  return error?failed('Could not clear cloud practice history.',error):{status:'ok'}
}
