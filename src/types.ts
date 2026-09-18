export type Subject = 'english' | 'math'
export type SubjectMode = Subject | 'both'
export type ModuleKey = 'rw1' | 'rw2' | 'math1' | 'math2'
export type PracticeTestId = `practice-test-${number}`
export type PracticeTestFilter = 'all' | PracticeTestId
export type PracticeSelectionMode = 'adaptive' | 'random'
export interface PracticeQuestion { id:string; practiceTestId?:PracticeTestId; subject:Subject; module:ModuleKey; number:number; sourcePage:number; answerPage:number; correctAnswer:string; acceptedAnswers?:string[]; responseType:'multiple-choice'|'student-produced' }
export interface Attempt { id:string; sessionId:string; questionId:string; practiceTestId?:PracticeTestId; subject:Subject; module:ModuleKey; questionNumber:number; selectedAnswer:string; correctAnswer:string; correct:boolean; selfGraded?:boolean; elapsedMs:number; createdAt:string }
export interface SessionSummary { id:string; startedAt:string; endedAt:string; mode:SubjectMode; questionCount:number; attempts:Attempt[] }
export interface Settings { mode:SubjectMode; questionsPerSession:number; showExplanations:boolean; shuffle:boolean; practiceTest?:PracticeTestFilter; selectionMode?:PracticeSelectionMode; failedOnly?:boolean; targetExamDate?:string; targetPracticeSets?:number; targetCoveragePercent?:number; fallbackMinutesPerQuestion?:number }
