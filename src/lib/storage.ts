import type {Attempt,SessionSummary,Settings} from '../types'
const ATTEMPTS_KEY='sat-practice-attempts-v1',SESSIONS_KEY='sat-practice-sessions-v1',SETTINGS_KEY='sat-practice-settings-v1',HISTORY_OWNER_KEY='sat-practice-history-owner-v1'
export const DEFAULT_SETTINGS:Settings={mode:'both',questionsPerSession:10,showExplanations:true,shuffle:true,practiceTest:'all',selectionMode:'adaptive',failedOnly:false}
function read<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??'') as T}catch{return fallback}}
export function getAttempts():Attempt[]{return read<Attempt[]>(ATTEMPTS_KEY,[])}
export function saveAttempts(items:Attempt[]){localStorage.setItem(ATTEMPTS_KEY,JSON.stringify(items))}
export function addAttempt(item:Attempt){saveAttempts([...getAttempts(),item])}
export function getSessions():SessionSummary[]{return read<SessionSummary[]>(SESSIONS_KEY,[])}
export function saveSessions(items:SessionSummary[]){localStorage.setItem(SESSIONS_KEY,JSON.stringify(items))}
export function saveSession(item:SessionSummary){saveSessions([...getSessions(),item])}
export function replaceHistory(attempts:Attempt[],sessions:SessionSummary[]){saveAttempts(attempts);saveSessions(sessions)}
export function prepareHistoryForUser(userId:string){
  const owner=localStorage.getItem(HISTORY_OWNER_KEY)
  if(owner&&owner!==userId)replaceHistory([],[])
  localStorage.setItem(HISTORY_OWNER_KEY,userId)
}
export function getSettings():Settings{return {...DEFAULT_SETTINGS,...read<Partial<Settings>>(SETTINGS_KEY,{})}}
export function saveSettings(s:Settings){localStorage.setItem(SETTINGS_KEY,JSON.stringify(s))}
export function clearHistory(){localStorage.removeItem(ATTEMPTS_KEY);localStorage.removeItem(SESSIONS_KEY)}
