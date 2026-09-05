export type Subject = 'english' | 'math'
export type SubjectMode = Subject | 'both'
export type ModuleKey = 'rw1' | 'rw2' | 'math1' | 'math2'
export interface PracticeQuestion { id:string; subject:Subject; module:ModuleKey; number:number; sourcePage:number; answerPage:number; correctAnswer:string; responseType:'multiple-choice'|'student-produced' }
export interface Attempt { id:string; sessionId:string; questionId:string; subject:Subject; module:ModuleKey; questionNumber:number; selectedAnswer:string; correctAnswer:string; correct:boolean; selfGraded?:boolean; elapsedMs:number; createdAt:string }
export interface SessionSummary { id:string; startedAt:string; endedAt:string; mode:SubjectMode; questionCount:number; attempts:Attempt[] }
export interface Settings { mode:SubjectMode; questionsPerSession:number; showExplanations:boolean; shuffle:boolean }
