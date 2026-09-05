import { createClient } from '@supabase/supabase-js'
import type { Attempt, SessionSummary } from '../types'
const url=import.meta.env.VITE_SUPABASE_URL as string|undefined
const key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined
export const supabase=url&&key?createClient(url,key):null
export async function syncAttempt(a:Attempt){if(!supabase)return;await supabase.from('sat_attempts').upsert({id:a.id,session_id:a.sessionId,question_id:a.questionId,subject:a.subject,module:a.module,question_number:a.questionNumber,selected_answer:a.selectedAnswer,correct_answer:a.correctAnswer,correct:a.correct,self_graded:a.selfGraded??false,elapsed_ms:a.elapsedMs,created_at:a.createdAt})}
export async function syncSession(s:SessionSummary){if(!supabase)return;await supabase.from('sat_sessions').upsert({id:s.id,started_at:s.startedAt,ended_at:s.endedAt,mode:s.mode,question_count:s.questionCount})}
