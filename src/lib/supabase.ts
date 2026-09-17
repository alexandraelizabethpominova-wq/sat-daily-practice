import {createClient,type User} from '@supabase/supabase-js'
import type {Attempt,SessionSummary} from '../types'

const url=import.meta.env.VITE_SUPABASE_URL as string|undefined
const publishableKey=(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY??import.meta.env.VITE_SUPABASE_ANON_KEY) as string|undefined

export const supabase=url&&publishableKey?createClient(url,publishableKey):null
export const isSupabaseConfigured=Boolean(supabase)

export type AuthUser={id:string;email:string|null}

const toAuthUser=(user:User|null):AuthUser|null=>user?{id:user.id,email:user.email??null}:null

export async function getCurrentAuthUser():Promise<AuthUser|null>{
  if(!supabase)return null
  const {data,error}=await supabase.auth.getUser()
  if(error){
    if(error.name==='AuthSessionMissingError')return null
    throw error
  }
  return toAuthUser(data.user)
}

export function subscribeToAuth(callback:(user:AuthUser|null)=>void){
  if(!supabase)return()=>{}
  const {data}=supabase.auth.onAuthStateChange((_event,session)=>callback(toAuthUser(session?.user??null)))
  return()=>data.subscription.unsubscribe()
}

export async function signUpWithPassword(email:string,password:string){
  if(!supabase)throw new Error('Supabase is not configured.')
  const {data,error}=await supabase.auth.signUp({
    email:email.trim(),
    password,
    options:{emailRedirectTo:window.location.origin},
  })
  if(error)throw error
  return {user:toAuthUser(data.user),needsEmailConfirmation:!data.session}
}

export async function signInWithPassword(email:string,password:string){
  if(!supabase)throw new Error('Supabase is not configured.')
  const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password})
  if(error)throw error
  return toAuthUser(data.user)
}

export async function signOut(){
  if(!supabase)return
  const {error}=await supabase.auth.signOut()
  if(error)throw error
}

async function currentUserId(){
  const user=await getCurrentAuthUser()
  return user?.id??null
}

function attemptRow(a:Attempt,userId:string){
  return {
    id:a.id,
    user_id:userId,
    session_id:a.sessionId,
    question_id:a.questionId,
    subject:a.subject,
    module:a.module,
    question_number:a.questionNumber,
    selected_answer:a.selectedAnswer,
    correct_answer:a.correctAnswer,
    correct:a.correct,
    self_graded:a.selfGraded??false,
    elapsed_ms:a.elapsedMs,
    created_at:a.createdAt,
  }
}

function sessionRow(s:SessionSummary,userId:string){
  return {
    id:s.id,
    user_id:userId,
    started_at:s.startedAt,
    ended_at:s.endedAt,
    mode:s.mode,
    question_count:s.questionCount,
  }
}

export async function syncSession(s:SessionSummary){
  if(!supabase)return false
  const userId=await currentUserId()
  if(!userId)return false
  const {error:sessionError}=await supabase.from('sat_sessions').upsert(sessionRow(s,userId))
  if(sessionError)throw sessionError
  if(s.attempts.length){
    const {error:attemptError}=await supabase.from('sat_attempts').upsert(s.attempts.map(a=>attemptRow(a,userId)))
    if(attemptError)throw attemptError
  }
  return true
}

export async function loadCloudHistory():Promise<{attempts:Attempt[];sessions:SessionSummary[]}|null>{
  if(!supabase)return null
  const userId=await currentUserId()
  if(!userId)return null
  const [sessionResult,attemptResult]=await Promise.all([
    supabase.from('sat_sessions').select('id,started_at,ended_at,mode,question_count').eq('user_id',userId).not('ended_at','is',null).order('started_at',{ascending:true}),
    supabase.from('sat_attempts').select('id,session_id,question_id,subject,module,question_number,selected_answer,correct_answer,correct,self_graded,elapsed_ms,created_at').eq('user_id',userId).order('created_at',{ascending:true}),
  ])
  if(sessionResult.error)throw sessionResult.error
  if(attemptResult.error)throw attemptResult.error
  const attempts:Attempt[]=(attemptResult.data??[]).map(row=>({
    id:row.id,
    sessionId:row.session_id,
    questionId:row.question_id,
    subject:row.subject as Attempt['subject'],
    module:row.module as Attempt['module'],
    questionNumber:row.question_number,
    selectedAnswer:row.selected_answer,
    correctAnswer:row.correct_answer,
    correct:row.correct,
    selfGraded:row.self_graded,
    elapsedMs:row.elapsed_ms,
    createdAt:row.created_at,
  }))
  const bySession=new Map<string,Attempt[]>()
  attempts.forEach(attempt=>bySession.set(attempt.sessionId,[...(bySession.get(attempt.sessionId)??[]),attempt]))
  const sessions:SessionSummary[]=(sessionResult.data??[]).map(row=>({
    id:row.id,
    startedAt:row.started_at,
    endedAt:row.ended_at??row.started_at,
    mode:row.mode as SessionSummary['mode'],
    questionCount:row.question_count,
    attempts:bySession.get(row.id)??[],
  }))
  return {attempts,sessions}
}

export async function clearCloudHistory(){
  if(!supabase)return false
  const userId=await currentUserId()
  if(!userId)return false
  const {error}=await supabase.from('sat_sessions').delete().eq('user_id',userId)
  if(error)throw error
  return true
}
