import type {Attempt,SessionSummary,Settings} from '../types'

function dateInDays(days:number){
  const date=new Date()
  date.setHours(12,0,0,0)
  date.setDate(date.getDate()+days)
  return date.toISOString().slice(0,10)
}

export const DEFAULT_SETTINGS:Settings={
  mode:'both',
  questionsPerSession:10,
  showExplanations:true,
  shuffle:true,
  practiceTest:'all',
  selectionMode:'adaptive',
  failedOnly:false,
  failedEverOnly:false,
  targetExamDate:dateInDays(30),
  targetPracticeSets:8,
  targetCoveragePercent:100,
  fallbackMinutesPerQuestion:2,
}

// Compatibility helpers are intentionally memory-only. Persistent signed-in data
// belongs in Supabase so browsers/devices cannot diverge.
let memoryAttempts:Attempt[]=[]
let memorySessions:SessionSummary[]=[]
let memorySettings:Settings={...DEFAULT_SETTINGS}

export function getAttempts(){return [...memoryAttempts]}
export function saveAttempts(items:Attempt[]){memoryAttempts=[...items]}
export function addAttempt(item:Attempt){memoryAttempts=[...memoryAttempts,item]}
export function getSessions(){return [...memorySessions]}
export function saveSessions(items:SessionSummary[]){memorySessions=[...items]}
export function saveSession(item:SessionSummary){memorySessions=[...memorySessions,item]}
export function replaceHistory(attempts:Attempt[],sessions:SessionSummary[]){memoryAttempts=[...attempts];memorySessions=[...sessions]}
export function prepareHistoryForUser(_userId:string){memoryAttempts=[];memorySessions=[]}
export function getSettings(){return {...memorySettings}}
export function saveSettings(settings:Settings){memorySettings={...settings}}
export function prepareSettingsForUser(_userId:string){memorySettings={...DEFAULT_SETTINGS};return getSettings()}
export function clearHistory(){memoryAttempts=[];memorySessions=[]}
