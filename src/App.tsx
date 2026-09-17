import {useEffect,useState,type ReactNode} from 'react'
import {BarChart3,BookOpen,ChevronLeft,ChevronRight,Clock3,Sparkles,Target,Upload} from 'lucide-react'
import QuestionContent from './design-system/molecules/QuestionContent'
import ExplanationContent from './design-system/molecules/ExplanationContent'
import AlexButton from './design-system/atoms/AlexButton'
import AlexChoiceButton from './design-system/atoms/AlexChoiceButton'
import AlexDropdown from './design-system/atoms/AlexDropdown'
import AlexNumberField from './design-system/atoms/AlexNumberField'
import AlexStatusChip from './design-system/atoms/AlexStatusChip'
import AlexTextField from './design-system/atoms/AlexTextField'
import AppSidebarLayout from './design-system/organisms/AppSidebarLayout'
import PracticeTestsDashboard from './design-system/organisms/PracticeTestsDashboard'
import QuestionBankReview from './design-system/organisms/QuestionBankReview'
import {answerLabel,matchesAnswer} from './lib/answerCompare'
import {QUESTION_BANK,moduleLabel,questionsForMode} from './lib/questionBank'
import {clearQuestionContent,countQuestionContent} from './lib/questionContentStore'
import {importPracticeMaterials} from './lib/pdfStructuredImport'
import {addAttempt,clearHistory,getAttempts,getSessions,getSettings,saveSession,saveSettings} from './lib/storage'
import {clearPdfs,getPdf,savePdf} from './lib/pdfStore'
import {syncAttempt,syncSession} from './lib/supabase'
import type {Attempt,PracticeQuestion,SessionSummary,Settings,SubjectMode} from './types'

const uid=()=>crypto.randomUUID()
const fmt=(ms:number)=>{const s=Math.round(ms/1000);return s<60?`${s}s`:`${Math.floor(s/60)}m ${s%60}s`}

function choose(settings:Settings,attempts:Attempt[]){
  const pool=questionsForMode(settings.mode)
  const stats=new Map<string,{n:number;c:number;last:number}>()
  attempts.forEach((attempt,index)=>{
    const stat=stats.get(attempt.questionId)??{n:0,c:0,last:-1}
    stat.n++
    if(attempt.correct)stat.c++
    stat.last=index
    stats.set(attempt.questionId,stat)
  })
  return pool.map(q=>{
    const stat=stats.get(q.id)
    const score=(stat?0:1000)+(stat?(1-stat.c/stat.n)*400:0)+(stat?Math.min(200,attempts.length-stat.last):0)+Math.random()*60
    return {q,score}
  }).sort((a,b)=>b.score-a.score).slice(0,settings.questionsPerSession).map(item=>item.q)
}

type View='study'|'home'|'practice'|'results'|'stats'|'settings'|'sources'|'question-bank'
type SidebarKey='study'|'practice-tests'|'question-bank'|'performance'|'resources'

export default function App(){
  const[settings,setSettings]=useState<Settings>(()=>getSettings())
  const[qpdf,setQpdf]=useState<ArrayBuffer|null>(null)
  const[apdf,setApdf]=useState<ArrayBuffer|null>(null)
  const[attempts,setAttempts]=useState<Attempt[]>(()=>getAttempts())
  const[sessions,setSessions]=useState<SessionSummary[]>(()=>getSessions())
  const[qs,setQs]=useState<PracticeQuestion[]>([])
  const[sid,setSid]=useState('')
  const[started,setStarted]=useState('')
  const[i,setI]=useState(0)
  const[qStart,setQStart]=useState(0)
  const[selected,setSelected]=useState('')
  const[submitted,setSubmitted]=useState(false)
  const[currentAttempts,setCurrentAttempts]=useState<Attempt[]>([])
  const[view,setView]=useState<View>('home')
  const[sidebarCollapsed,setSidebarCollapsed]=useState(false)
  const[contentCount,setContentCount]=useState(0)
  const[importProgress,setImportProgress]=useState('')

  useEffect(()=>{
    Promise.all([getPdf('questions'),getPdf('answers'),countQuestionContent()]).then(([questionsPdf,answersPdf,count])=>{
      setQpdf(questionsPdf);setApdf(answersPdf);setContentCount(count)
    })
  },[])
  useEffect(()=>saveSettings(settings),[settings])

  const current=qs[i]
  const accuracy=attempts.length?Math.round(100*attempts.filter(a=>a.correct).length/attempts.length):0
  const avg=attempts.length?attempts.reduce((sum,a)=>sum+a.elapsedMs,0)/attempts.length:0
  const currentRec=current?currentAttempts.find(a=>a.questionId===current.id):undefined

  async function upload(kind:'questions'|'answers',file?:File){
    if(!file)return
    await savePdf(kind,file)
    await clearQuestionContent()
    setContentCount(0)
    const bytes=await getPdf(kind)
    if(kind==='questions')setQpdf(bytes);else setApdf(bytes)
  }

  function beginPractice(nextMode:SubjectMode=settings.mode){
    if(!qpdf){setView('sources');return}
    const nextSettings={...settings,mode:nextMode}
    setSettings(nextSettings)
    setQs(choose(nextSettings,attempts))
    setSid(uid());setStarted(new Date().toISOString());setCurrentAttempts([]);setI(0);setSelected('');setSubmitted(false);setQStart(Date.now());setView('practice')
  }

  function start(){beginPractice(settings.mode)}

  async function record(correct:boolean,selfGraded=false){
    if(!current)return
    const attempt:Attempt={id:uid(),sessionId:sid,questionId:current.id,subject:current.subject,module:current.module,questionNumber:current.number,selectedAnswer:selected,correctAnswer:answerLabel(current),correct,selfGraded,elapsedMs:Date.now()-qStart,createdAt:new Date().toISOString()}
    addAttempt(attempt)
    setAttempts(previous=>[...previous,attempt])
    setCurrentAttempts(previous=>[...previous,attempt])
    void syncAttempt(attempt)
  }

  async function submit(){
    if(!current||!selected.trim()||currentRec)return
    setSubmitted(true)
    await record(matchesAnswer(current,selected))
  }

  function goTo(index:number){
    if(index<0||index>=qs.length)return
    const question=qs[index]
    const record=currentAttempts.find(a=>a.questionId===question.id)
    setI(index);setSelected(record?.selectedAnswer??'');setSubmitted(Boolean(record));if(!record)setQStart(Date.now())
  }

  async function finish(){
    const session:SessionSummary={id:sid,startedAt:started,endedAt:new Date().toISOString(),mode:settings.mode,questionCount:qs.length,attempts:currentAttempts}
    saveSession(session);setSessions(previous=>[...previous,session]);void syncSession(session);setView('results')
  }

  async function next(){if(!currentRec)return;if(i+1>=qs.length){await finish();return}goTo(i+1)}

  function resetHistory(){
    if(!window.confirm('Delete all practice history and statistics? Your settings and uploaded question sources will be kept.'))return
    clearHistory();setAttempts([]);setSessions([]);setCurrentAttempts([]);setQs([]);setSid('');setStarted('');setI(0);setSelected('');setSubmitted(false);setView('home')
  }

  async function buildTextDatabase(){
    if(!qpdf||!apdf)return
    setImportProgress(`0/${QUESTION_BANK.length}`)
    try{
      await importPracticeMaterials(qpdf,apdf,(done,total)=>setImportProgress(`${done}/${total}`))
      setContentCount(await countQuestionContent())
    }finally{setImportProgress('')}
  }

  function withSidebar(active:SidebarKey,content:ReactNode,background='#fff'){
    return <AppSidebarLayout active={active} collapsed={sidebarCollapsed} onToggleCollapsed={()=>setSidebarCollapsed(value=>!value)} onStudyPlan={()=>setView('study')} onPracticeTests={()=>setView('home')} onQuestionBank={()=>setView('question-bank')} onPerformance={()=>setView('stats')} onResources={()=>setView('sources')} onSettings={()=>setView('settings')} contentBackground={background}>{content}</AppSidebarLayout>
  }

  if(view==='practice'&&current&&qpdf){
    return withSidebar('practice-tests',<main className="practice">
      <header className="practice-topbar"><div className="practice-title"><span>SAT PRACTICE</span><b>{moduleLabel(current.module)}</b></div><div className="progress-block"><div><b>{current.subject==='math'?'Math':'Reading & Writing'}</b><span>Question {i+1} of {qs.length}</span></div><progress value={i+1} max={qs.length}/></div><div className="question-nav"><AlexButton tone="secondary" startIcon={<ChevronLeft size={18}/>} onClick={()=>goTo(i-1)} disabled={i===0}>Previous</AlexButton><AlexButton endIcon={<ChevronRight size={18}/>} onClick={next} disabled={!currentRec}>{i+1===qs.length?'Finish':'Next'}</AlexButton></div></header>
      <div className="practice-workspace"><section className="question-panel"><div className="question-heading"><div><span>QUESTION {current.number}</span><b>{current.subject==='math'?'Math':'Reading & Writing'}</b></div><AlexStatusChip>READY</AlexStatusChip></div><QuestionContent question={current} bytes={qpdf} alt={`${moduleLabel(current.module)} question ${current.number}`}/></section>
      <aside className="answer-panel"><div><p className="answer-kicker">Your answer</p><h2>{current.responseType==='multiple-choice'?'Choose the best answer.':'Enter your answer.'}</h2><p className="answer-helper">Your response is checked against the answer key when you submit.</p></div>{current.responseType==='multiple-choice'?<div className="choices">{['A','B','C','D'].map(choice=><AlexChoiceButton disabled={Boolean(currentRec)} selected={selected===choice} onClick={()=>setSelected(choice)} key={choice} label={choice}/>)}</div>:<AlexTextField disabled={Boolean(currentRec)||submitted} value={selected} onChange={event=>setSelected(event.target.value)} placeholder="Type a number, decimal, or fraction"/>}{!currentRec&&!submitted&&<AlexButton fullWidth disabled={!selected.trim()} onClick={submit}>Submit answer</AlexButton>}{currentRec&&<div className={currentRec.correct?'feedback good':'feedback bad'}><b>{currentRec.correct?'Correct':'Not quite'}</b><span>Accepted answer: {answerLabel(current)}</span><span>Time: {fmt(currentRec.elapsedMs)}</span></div>}{currentRec&&apdf&&<details className="inline-review"><summary>Review walkthrough</summary><ExplanationContent question={current} bytes={apdf}/></details>}<p className="review-note">Walkthroughs are optional and remain available in your session review.</p></aside></div>
    </main>,'#F7F6F2')
  }

  if(view==='results'){
    const sessionAccuracy=currentAttempts.length?Math.round(100*currentAttempts.filter(a=>a.correct).length/currentAttempts.length):0
    const sessionAverage=currentAttempts.length?currentAttempts.reduce((sum,a)=>sum+a.elapsedMs,0)/currentAttempts.length:0
    return withSidebar('practice-tests',<main className="shell"><section className="card results"><p className="eyebrow">Session complete</p><h1>{sessionAccuracy}% accuracy</h1><p>{currentAttempts.filter(a=>a.correct).length} of {currentAttempts.length} correct · {fmt(sessionAverage)} average</p><div className="review-list"><h2>Session review</h2>{currentAttempts.map((attempt,index)=>{const question=QUESTION_BANK.find(q=>q.id===attempt.questionId);if(!question)return null;return <article className="review-item" key={attempt.id}><div className="review-head"><div><b>{index+1}. {moduleLabel(attempt.module)} · Q{attempt.questionNumber}</b><span>{attempt.correct?'Correct':'Review'} · {fmt(attempt.elapsedMs)}</span></div><div><span>Your answer: <b>{attempt.selectedAnswer||'—'}</b></span><span>Accepted: <b>{answerLabel(question)}</b></span></div></div>{qpdf&&<details><summary>Review question</summary><QuestionContent question={question} bytes={qpdf} alt={`${moduleLabel(question.module)} question ${question.number}`}/></details>}{apdf?<details><summary>Show walkthrough and explanation</summary><ExplanationContent question={question} bytes={apdf}/></details>:<p className="muted">Add the answer-explanations source in Resources to review explanations here.</p>}</article>})}</div><div className="hero-actions"><AlexButton onClick={start}>Start another session</AlexButton><AlexButton tone="secondary" onClick={()=>setView('home')}>Back to practice tests</AlexButton></div></section></main>)
  }

  if(view==='stats')return withSidebar('performance',<main className="shell"><div className="page-heading"><div><p className="eyebrow">Performance</p><h1>Your practice trends</h1></div>{attempts.length>0&&<AlexButton tone="secondary" onClick={resetHistory}>Clear history & start fresh</AlexButton>}</div><div className="stats"><Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/><Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/><Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/><Stat icon={<BarChart3/>} label="Questions seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/></div>{attempts.length===0&&<section className="card empty-history"><h2>Fresh start</h2><p>No practice history is stored yet. Your next session will begin building new statistics.</p></section>}</main>)

  if(view==='question-bank')return withSidebar('question-bank',<QuestionBankReview questionsPdf={qpdf}/>,'#F7F6F2')

  if(view==='settings')return withSidebar('question-bank',<main className="shell"><div className="page-heading"><div><p className="eyebrow">Settings</p><h1>Practice setup</h1></div></div><section className="card settings settings-grid"><div className="settings-field"><AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'English + Math'},{value:'english',label:'English only'},{value:'math',label:'Math only'}]} onChange={mode=>setSettings({...settings,mode})}/></div><div className="settings-field"><AlexNumberField label="Questions per session" value={settings.questionsPerSession} min={3} max={30} onChange={questionsPerSession=>setSettings({...settings,questionsPerSession})}/></div><div className="settings-actions"><AlexButton onClick={()=>beginPractice(settings.mode)}>Start with these settings</AlexButton><AlexButton tone="secondary" onClick={resetHistory}>Clear history & start fresh</AlexButton></div><p className="muted">Questions are selected adaptively from your uploaded SAT source. History is used to prioritize unseen and weaker questions.</p></section></main>)

  if(view==='sources')return withSidebar('resources',<main className="shell"><div className="page-heading"><div><p className="eyebrow">Resources</p><h1>Manage sources</h1></div></div><section className="card sources"><p>Question and explanation text is extracted from the PDFs you add here and stored in a local browser database. Practice uses text first; the original PDF crop is only used when a figure or extraction fallback is needed.</p><div className="uploads"><label><Upload/><b>{qpdf?'Replace question source':'Add question source'}</b><span>{qpdf?'Ready for text import':'Required for practice questions'}</span><input type="file" accept="application/pdf" onChange={event=>upload('questions',event.target.files?.[0])}/></label><label><Upload/><b>{apdf?'Replace explanation source':'Add explanation source'}</b><span>{apdf?'Ready for text import':'Add for walkthroughs and review'}</span><input type="file" accept="application/pdf" onChange={event=>upload('answers',event.target.files?.[0])}/></label></div><div className="structured-db-card"><div><b>Local question database</b><span>{contentCount}/{QUESTION_BANK.length} questions imported</span><small>Text stays in this browser. Formulas can be stored as LaTeX and are rendered with KaTeX; source images remain a fallback for visual-only material.</small></div><div className="structured-db-actions"><AlexButton disabled={!qpdf||!apdf||Boolean(importProgress)} onClick={buildTextDatabase}>{importProgress?`Importing ${importProgress}`:'Build text database'}</AlexButton>{contentCount>0&&<AlexButton tone="secondary" onClick={async()=>{await clearQuestionContent();setContentCount(0)}}>Clear text database</AlexButton>}</div></div>{(qpdf||apdf)&&<AlexButton tone="secondary" onClick={async()=>{await clearPdfs();await clearQuestionContent();setQpdf(null);setApdf(null);setContentCount(0)}}>Clear sources</AlexButton>}</section></main>)

  if(view==='study')return withSidebar('study',<main className="shell"><section className="hero card"><div><p className="eyebrow">Study Plan</p><h1>Your SAT practice plan</h1><p>Use short adaptive sessions to build consistency. Questions you have not seen and topics you miss more often are prioritized automatically.</p><div className="hero-actions"><AlexButton onClick={()=>setView('home')}>Choose a practice test</AlexButton><AlexButton tone="secondary" onClick={()=>beginPractice(settings.mode)}>Start {settings.questionsPerSession} questions</AlexButton></div></div><div className="score">{attempts.length?`${accuracy}%`:'—'}<small>overall accuracy</small></div></section><div className="stats"><Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/><Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/><Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/><Stat icon={<Sparkles/>} label="Seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/></div></main>,'#F7F6F2')

  return withSidebar('practice-tests',<PracticeTestsDashboard questionCount={settings.questionsPerSession} mixedAction={<AlexButton onClick={()=>beginPractice('both')}>Start</AlexButton>} readingAction={<AlexButton tone="secondary" onClick={()=>beginPractice('english')}>Start</AlexButton>} mathAction={<AlexButton tone="secondary" onClick={()=>beginPractice('math')}>Start</AlexButton>}/>)
}

function Stat({icon,label,value}:{icon:ReactNode;label:string;value:string}){return <div className="stat">{icon}<span>{label}</span><b>{value}</b></div>}
