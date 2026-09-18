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
}

const keyFor=(owner:string)=>`sat-parsing-issues-v1:${owner}`

function readLocal(owner:string):ParsingIssueReport[]{
  try{return JSON.parse(localStorage.getItem(keyFor(owner))??'[]') as ParsingIssueReport[]}
  catch{return []}
}

function saveLocal(owner:string,reports:ParsingIssueReport[]){
  localStorage.setItem(keyFor(owner),JSON.stringify(reports))
}

async function ownerId(){
  const user=await getCurrentAuthUser().catch(()=>null)
  return user?.id??'guest'
}

function mergeReports(local:ParsingIssueReport[],remote:ParsingIssueReport[]){
  const merged=new Map<string,ParsingIssueReport>()
  remote.forEach(report=>merged.set(report.id,report))
  local.forEach(report=>{
    const current=merged.get(report.id)
    if(!current||report.updatedAt>=current.updatedAt)merged.set(report.id,report)
  })
  return [...merged.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
}

function rowToReport(row:any):ParsingIssueReport{
  return {
    id:row.id,questionId:row.question_id,practiceTestId:row.practice_test_id,
    subject:row.subject,module:row.module,questionNumber:row.question_number,context:row.context,
    message:row.message??'',status:row.status,createdAt:row.created_at,updatedAt:row.updated_at,
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
  const owner=await ownerId()
  const local=readLocal(owner)
  if(!supabase||owner==='guest')return local.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
  const {data,error}=await supabase.from('sat_parsing_issue_reports')
    .select('id,question_id,practice_test_id,subject,module,question_number,context,message,status,created_at,updated_at')
    .eq('user_id',owner)
    .order('created_at',{ascending:false})
  if(error)throw error
  const merged=mergeReports(local,(data??[]).map(rowToReport))
  saveLocal(owner,merged)
  return merged
}

export async function createParsingIssueReport(question:PracticeQuestion,context:ParsingIssueContext,message=''){
  const owner=await ownerId()
  const now=new Date().toISOString()
  const report:ParsingIssueReport={
    id:crypto.randomUUID(),
    questionId:question.id,
    practiceTestId:question.practiceTestId??'practice-test-4',
    subject:question.subject,module:question.module,questionNumber:question.number,context,
    message:message.trim(),status:'open',createdAt:now,updatedAt:now,
  }
  saveLocal(owner,[report,...readLocal(owner)])
  if(supabase&&owner!=='guest'){
    const {error}=await supabase.from('sat_parsing_issue_reports').insert(reportRow(report,owner))
    if(error)throw error
  }
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
  return report
}

export async function setParsingIssueStatus(id:string,status:ParsingIssueStatus){
  const owner=await ownerId()
  const updatedAt=new Date().toISOString()
  saveLocal(owner,readLocal(owner).map(report=>report.id===id?{...report,status,updatedAt}:report))
  if(supabase&&owner!=='guest'){
    const {error}=await supabase.from('sat_parsing_issue_reports').update({status,updated_at:updatedAt}).eq('id',id).eq('user_id',owner)
    if(error)throw error
  }
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
}

export async function deleteParsingIssueReport(id:string){
  const owner=await ownerId()
  saveLocal(owner,readLocal(owner).filter(report=>report.id!==id))
  if(supabase&&owner!=='guest'){
    const {error}=await supabase.from('sat_parsing_issue_reports').delete().eq('id',id).eq('user_id',owner)
    if(error)throw error
  }
  window.dispatchEvent(new Event('sat-parsing-issues-updated'))
}
