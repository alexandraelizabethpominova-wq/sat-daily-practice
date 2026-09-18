import {supabase} from './supabase'
import type {QuestionVisualSpec} from './questionVisuals'
import type {ModuleKey,PracticeQuestion,Subject} from '../types'
import {QUESTION_BANK} from './questionBank'

export type SharedQuestionContent={
  questionId:string
  practiceTestId:string
  questionLines:string[]
  explanationLines:string[]
  needsVisual:boolean
  contentStatus:'metadata'|'verified'|'imported'
  visualSpec:QuestionVisualSpec|null
}

function parseVisualSpec(crop:unknown,afterLine:unknown):QuestionVisualSpec|null{
  if(!crop||typeof crop!=='object')return null
  const value=crop as Record<string,unknown>
  const x=Number(value.x),y=Number(value.y),width=Number(value.width),height=Number(value.height)
  const line=Number(afterLine)
  if([x,y,width,height,line].some(number=>Number.isNaN(number)))return null
  if(x<0||y<0||width<=0||height<=0||x+width>1||y+height>1||line<-1)return null
  return {afterLine:line,crop:{x,y,width,height},exact:true}
}

function idMatchesPracticeTest(id:string,practiceTestId:string){
  if(practiceTestId==='practice-test-4')return !id.startsWith('practice-test-')
  return id.startsWith(`${practiceTestId}:`)
}

export async function loadSharedQuestionBank():Promise<PracticeQuestion[]|null>{
  if(!supabase)return null
  const {data,error}=await supabase
    .from('sat_question_bank')
    .select('id,practice_test_id,subject,module,question_number,source_page,answer_page,correct_answer,accepted_answers,response_type')
    .order('module',{ascending:true})
    .order('question_number',{ascending:true})
  if(error)throw error
  const remote=(data??[]).filter(row=>idMatchesPracticeTest(row.id,row.practice_test_id)).map(row=>({
    id:row.id,
    practiceTestId:row.practice_test_id,
    subject:row.subject as Subject,
    module:row.module as ModuleKey,
    number:row.question_number,
    sourcePage:row.source_page,
    answerPage:row.answer_page,
    correctAnswer:row.correct_answer,
    acceptedAnswers:Array.isArray(row.accepted_answers)?row.accepted_answers as string[]:[row.correct_answer],
    responseType:row.response_type as PracticeQuestion['responseType'],
  }))
  const merged=new Map<string,PracticeQuestion>()
  QUESTION_BANK.forEach(question=>merged.set(question.id,question))
  remote.forEach(question=>merged.set(question.id,question))
  return [...merged.values()]
}

export async function loadSharedQuestionContent(questionId:string,expectedPracticeTestId?:string):Promise<SharedQuestionContent|null>{
  if(!supabase)return null
  const {data,error}=await supabase
    .from('sat_question_bank')
    .select('id,practice_test_id,question_lines,explanation_lines,needs_visual,content_status,visual_crop,visual_after_line')
    .eq('id',questionId)
    .maybeSingle()
  if(error)throw error
  if(!data)return null
  if(expectedPracticeTestId&&data.practice_test_id!==expectedPracticeTestId)return null
  if(!idMatchesPracticeTest(data.id,data.practice_test_id))return null
  return {
    questionId:data.id,
    practiceTestId:data.practice_test_id,
    questionLines:Array.isArray(data.question_lines)?data.question_lines as string[]:[],
    explanationLines:Array.isArray(data.explanation_lines)?data.explanation_lines as string[]:[],
    needsVisual:Boolean(data.needs_visual),
    contentStatus:data.content_status as SharedQuestionContent['contentStatus'],
    visualSpec:parseVisualSpec(data.visual_crop,data.visual_after_line),
  }
}

export async function saveSharedQuestionRepair(input:{
  questionId:string
  questionLines:string[]
  visualSpec:QuestionVisualSpec|null
}){
  if(!supabase)throw new Error('Supabase is not configured for shared question repairs.')
  const visual=input.visualSpec
  const {error}=await supabase.from('sat_question_bank').update({
    question_lines:input.questionLines,
    needs_visual:Boolean(visual),
    visual_crop:visual?visual.crop:null,
    visual_after_line:visual?visual.afterLine:null,
    content_status:'verified',
    updated_at:new Date().toISOString(),
  }).eq('id',input.questionId)
  if(error)throw error
  window.dispatchEvent(new CustomEvent('sat-question-content-updated',{detail:{questionId:input.questionId}}))
}
