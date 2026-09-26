import {getCurrentAuthUser,supabase} from './supabase'
import type {ModuleKey,PracticeQuestion,PracticeTestId,Subject} from '../types'

export type ParsingIssueContext='practice'|'session-review'|'question-bank'|'performance'
export type ParsingIssueStatus='open'|'resolved'

export type ParsingIssueReport={
  id:string
  questionId:string
  practiceTestId:PracticeTestId
  subject:Subject
  module:ModuleKey
  questionNumber:number
  context:ParsingIssueContext
  message:string
  status:ParsingIssueStatus
  createdAt:string
  updatedAt:string
  reporterId?:string
  isOwnReport:boolean
}

async function currentOwner(){
  return await getCurrentAuthUser()
}

function rowToReport(row:any,ownerId:string):ParsingIssueReport{
  return {
    id:row.id,questionId:row.question_id,practiceTestId:row.practice_test_id,
    subject:row.subject,module:row.module,questionNumber:row.question_number,context:row.context,
    message:row.message??'',status:row.status,createdAt:row.created_at,updatedAt:row.updated_at,
    reporterId:row.user_id,isOwnReport:row.user_id===ownerId,
  }
}

function reportRow(report:ParsingIssueReport,userId:string){
  return {
    id:report.id,user_id:userId,question_id:report.questionId,practice_test_id:report.practiceTestId,
    subject:report.subject,module:report.module,question_number:report.questionNumber,context:report.context,
    message:report.message.trim()||null,status:report.status,created_at:report.createdAt,updated_at:report.updatedAt,
  }
}

export async function loadParsingIssueReports():Promise<ParsingIssueReport[]>{
  const user=await currentOwner()
  if(!user)return []
  const {data,error}=await supabase.from('sat_parsing_issue_reports')
    .select('id,user_id,question_id,practice_test_id,subject,module,question_number,context,message,status,created_at,updated_at')
    .order('created_at',{ascending:false})
  if(error)throw error
  return (data??[]).map(row=>rowToReport(row,user.id))
}

export async function hasOpenParsingIssue(questionId:string){
  const {count,error}=await supabase.from('sat_parsing_issue_reports')
    .select('id',{count:'exact',head:true})
    .eq('question_id',questionId)
    .eq('status','open')
  if(error)throw error
  return (count??0)>0
}

export async function createParsingIssueReport(question:PracticeQuestion,context:ParsingIssueContext,message=''){
  const user=await currentOwner()
  if(!user)throw new Error('Sign in before reporting a parsing issue so the shared queue stays consistent across devices.')
  const now=new Date().toISOString()
  const report:ParsingIssueReport={
    id:crypto.randomUUID(),
    questionId:question.id,
    practiceTestId:question.practiceTestId,
    subject:question.subject,module:question.module,questionNumber:question.number,context,
    message:message.trim(),status:'open',createdAt:now,updatedAt:now,
    reporterId:user.id,isOwnReport:true,
  }
  const {error}=await supabase.from('sat_parsing_issue_reports').insert(reportRow(report,user.id))
  if(error)throw error
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
  return {report,syncedToAdmin:true}
}

export async function setParsingIssueStatus(id:string,status:ParsingIssueStatus){
  const user=await currentOwner()
  if(!user)throw new Error('Sign in before updating a parsing issue.')
  const updatedAt=new Date().toISOString()
  const {error}=await supabase.from('sat_parsing_issue_reports').update({status,updated_at:updatedAt}).eq('id',id)
  if(error)throw error
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
}

export async function deleteParsingIssueReport(id:string){
  const user=await currentOwner()
  if(!user)throw new Error('Sign in before deleting a parsing issue.')
  const {error}=await supabase.from('sat_parsing_issue_reports').delete().eq('id',id)
  if(error)throw error
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
}
