import {supabase} from './supabase'
import type {ModuleKey,PracticeQuestion,Subject} from '../types'

export type SharedQuestionContent={questionId:string;questionLines:string[];explanationLines:string[];needsVisual:boolean}

export async function loadSharedQuestionBank():Promise<PracticeQuestion[]|null>{
  if(!supabase)return null
  const {data,error}=await supabase
    .from('sat_question_bank')
    .select('id,subject,module,question_number,source_page,answer_page,correct_answer,accepted_answers,response_type')
    .order('module',{ascending:true})
    .order('question_number',{ascending:true})
  if(error)throw error
  return (data??[]).map(row=>({
    id:row.id,
    subject:row.subject as Subject,
    module:row.module as ModuleKey,
    number:row.question_number,
    sourcePage:row.source_page,
    answerPage:row.answer_page,
    correctAnswer:row.correct_answer,
    acceptedAnswers:Array.isArray(row.accepted_answers)?row.accepted_answers as string[]:[row.correct_answer],
    responseType:row.response_type as PracticeQuestion['responseType'],
  }))
}

export async function loadSharedQuestionContent(questionId:string):Promise<SharedQuestionContent|null>{
  if(!supabase)return null
  const {data,error}=await supabase
    .from('sat_question_bank')
    .select('id,question_lines,explanation_lines,needs_visual')
    .eq('id',questionId)
    .maybeSingle()
  if(error)throw error
  if(!data||!Array.isArray(data.question_lines)||!data.question_lines.length)return null
  return {
    questionId:data.id,
    questionLines:data.question_lines as string[],
    explanationLines:Array.isArray(data.explanation_lines)?data.explanation_lines as string[]:[],
    needsVisual:Boolean(data.needs_visual),
  }
}
