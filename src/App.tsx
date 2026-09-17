import {useEffect,useState,type ReactNode} from 'react'
import {Upload} from 'lucide-react'
import AlexButton from './design-system/atoms/AlexButton'
import AlexDropdown from './design-system/atoms/AlexDropdown'
import AlexNumberField from './design-system/atoms/AlexNumberField'
import AlexStatusChip from './design-system/atoms/AlexStatusChip'
import ExplanationContent from './design-system/molecules/ExplanationContent'
import QuestionContent from './design-system/molecules/QuestionContent'
import AppSidebarLayout from './design-system/organisms/AppSidebarLayout'
import PerformanceDashboard from './design-system/organisms/PerformanceDashboard'
import PracticeAnswerPanel from './design-system/organisms/PracticeAnswerPanel'
import PracticeSessionHeader from './design-system/organisms/PracticeSessionHeader'
import PracticeTestsDashboard from './design-system/organisms/PracticeTestsDashboard'
import QuestionBankReview from './design-system/organisms/QuestionBankReview'
import {answerLabel,matchesAnswer} from './lib/answerCompare'
import {clearPdfs,getPdf,savePdf} from './lib/pdfStore'
import {clearQuestionContent,countQuestionContent} from './lib/questionContentStore'
import {QUESTION_BANK,moduleLabel} from './lib/questionBank'
import {importPracticeMaterials} from './lib/pdfStructuredImport'
import {choosePracticeQuestions,formatDuration,summarizePerformance,summarizeSession} from './lib/practiceGamification'
import {addAttempt,clearHistory,getAttempts,getSessions,getSettings,replaceHistory,saveSession,saveSettings} from './lib/storage'
import {clearCloudHistory,loadCloudHistory,syncSession} from './lib/supabase'
import type {Attempt,PracticeQuestion,SessionSummary,Settings,SubjectMode} from './types'

const uid=()=>crypto.randomUUID()

type View='study'|'home'|'practice'|'results'|'stats'|'settings'|'sources'|'question-bank'
type SidebarKey='study'|'practice-tests'|'practice-setup'|'question-bank'|'performance'|'resources'

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
      setQpdf(questionsPdf)
      setApdf(answersPdf)
      setContentCount(count)
    })
  },[])
  useEffect(()=>{
    let cancelled=false
    void (async()=>{
      try{
        const cloud=await loadCloudHistory()
        if(!cloud||cancelled)return
        const mergeById=<T extends {id:string},>(local:T[],remote:T[])=>{
          const merged=new Map<string,T>()
          remote.forEach(item=>merged.set(item.id,item))
          local.forEach(item=>merged.set(item.id,item))
          return [...merged.values()]
        }
        const mergedAttempts=mergeById(getAttempts(),cloud.attempts).sort((a,b)=>a.createdAt.localeCompare(b.createdAt))
        const mergedSessions=mergeById(getSessions(),cloud.sessions)
          .map(session=>({...session,attempts:mergedAttempts.filter(attempt=>attempt.sessionId===session.id)}))
          .sort((a,b)=>a.startedAt.localeCompare(b.startedAt))
        replaceHistory(mergedAttempts,mergedSessions)
        setAttempts(mergedAttempts)
        setSessions(mergedSessions)
        await Promise.allSettled(mergedSessions.map(syncSession))
      }catch(error){
        console.warn('Supabase history sync failed',error)
      }
    })()
    return()=>{cancelled=true}
  },[])
  useEffect(()=>saveSettings(settings),[settings])

  const current=qs[i]
  const currentRec=current?currentAttempts.find(attempt=>attempt.questionId===current.id):undefined
  const performance=summarizePerformance(attempts,sessions,QUESTION_BANK.length)

  async function upload(kind:'questions'|'answers',file?:File){
    if(!file)return
    await savePdf(kind,file)
    await clearQuestionContent()
    setContentCount(0)
    const bytes=await getPdf(kind)
    if(kind==='questions')setQpdf(bytes)
    else setApdf(bytes)
  }

  function beginPractice(nextMode:SubjectMode=settings.mode){
    if(!qpdf){setView('sources');return}
    const nextSettings={...settings,mode:nextMode}
    setSettings(nextSettings)
    setQs(choosePracticeQuestions(nextSettings,attempts))
    setSid(uid())
    setStarted(new Date().toISOString())
    setCurrentAttempts([])
    setI(0)
    setSelected('')
    setSubmitted(false)
    setQStart(Date.now())
    setView('practice')
  }

  function start(){beginPractice(settings.mode)}

  async function record(correct:boolean,selfGraded=false){
    if(!current)return
    const attempt:Attempt={
      id:uid(),sessionId:sid,questionId:current.id,subject:current.subject,module:current.module,
      questionNumber:current.number,selectedAnswer:selected,correctAnswer:answerLabel(current),correct,selfGraded,
      elapsedMs:Date.now()-qStart,createdAt:new Date().toISOString(),
    }
    addAttempt(attempt)
    setAttempts(previous=>[...previous,attempt])
    setCurrentAttempts(previous=>[...previous,attempt])
  }

  async function submit(){
    if(!current||!selected.trim()||currentRec)return
    setSubmitted(true)
    await record(matchesAnswer(current,selected))
  }

  function goTo(index:number){
    if(index<0||index>=qs.length)return
    const question=qs[index]
    const attempt=currentAttempts.find(item=>item.questionId===question.id)
    setI(index)
    setSelected(attempt?.selectedAnswer??'')
    setSubmitted(Boolean(attempt))
    if(!attempt)setQStart(Date.now())
  }

  async function finish(){
    const session:SessionSummary={id:sid,startedAt:started,endedAt:new Date().toISOString(),mode:settings.mode,questionCount:qs.length,attempts:currentAttempts}
    saveSession(session)
    setSessions(previous=>[...previous,session])
    void syncSession(session).catch(error=>console.warn('Supabase session backup failed',error))
    setView('results')
  }

  async function next(){
    if(!currentRec)return
    if(i+1>=qs.length){await finish();return}
    goTo(i+1)
  }

  async function resetHistory(){
    if(!window.confirm('Delete all practice history and statistics? Your settings and uploaded question sources will be kept.'))return
    try{
      await clearCloudHistory()
    }catch(error){
      console.error('Supabase history deletion failed',error)
      window.alert('Cloud history could not be cleared. Your local history was kept so the old data does not reappear later.')
      return
    }
    clearHistory()
    setAttempts([])
    setSessions([])
    setCurrentAttempts([])
    setQs([])
    setSid('')
    setStarted('')
    setI(0)
    setSelected('')
    setSubmitted(false)
    setView('home')
  }

  async function buildTextDatabase(){
    if(!qpdf||!apdf)return
    setImportProgress(`0/${QUESTION_BANK.length}`)
    try{
      await importPracticeMaterials(qpdf,apdf,(done,total)=>setImportProgress(`${done}/${total}`))
      setContentCount(await countQuestionContent())
    }finally{
      setImportProgress('')
    }
  }

  function withSidebar(active:SidebarKey,content:ReactNode,background='#fff'){
    return <AppSidebarLayout
      active={active}
      collapsed={sidebarCollapsed}
      onToggleCollapsed={()=>setSidebarCollapsed(value=>!value)}
      onStudyPlan={()=>setView('study')}
      onPracticeTests={()=>setView('home')}
      onPracticeSetup={()=>setView('settings')}
      onQuestionBank={()=>setView('question-bank')}
      onPerformance={()=>setView('stats')}
      onResources={()=>setView('sources')}
      onSettings={()=>setView('settings')}
      contentBackground={background}
    >{content}</AppSidebarLayout>
  }

  if(view==='practice'&&current&&qpdf){
    return withSidebar('practice-tests',<main className="practice">
      <PracticeSessionHeader
        moduleLabel={moduleLabel(current.module)}
        subjectLabel={current.subject==='math'?'Math':'Reading & Writing'}
        current={i+1}
        total={qs.length}
        canGoPrevious={i>0}
        canGoNext={Boolean(currentRec)}
        isLast={i+1===qs.length}
        onPrevious={()=>goTo(i-1)}
        onNext={next}
      />
      <div className="practice-workspace">
        <section className="question-panel">
          <div className="question-heading"><div><span>QUESTION {current.number}</span><b>{current.subject==='math'?'Math':'Reading & Writing'}</b></div><AlexStatusChip>READY</AlexStatusChip></div>
          <QuestionContent question={current} bytes={qpdf} alt={`${moduleLabel(current.module)} question ${current.number}`}/>
        </section>
        <PracticeAnswerPanel
          question={current}
          selected={selected}
          submitted={submitted}
          attempt={currentRec}
          explanationBytes={apdf}
          onSelect={setSelected}
          onSubmit={submit}
        />
      </div>
    </main>,'#F7F6F2')
  }

  if(view==='results'){
    const session=summarizeSession(currentAttempts)
    return withSidebar('practice-tests',<main className="shell">
      <section className="card results">
        <p className="eyebrow">Session complete</p>
        <h1>{session.accuracy}% accuracy</h1>
        <p>{session.correct} of {session.total} correct · {formatDuration(session.averageMs)} average</p>
        <div className="review-list">
          <h2>Session review</h2>
          {currentAttempts.map((attempt,index)=>{
            const question=QUESTION_BANK.find(item=>item.id===attempt.questionId)
            if(!question)return null
            return <article className="review-item" key={attempt.id}>
              <div className="review-head"><div><b>{index+1}. {moduleLabel(attempt.module)} · Q{attempt.questionNumber}</b><span>{attempt.correct?'Correct':'Review'} · {formatDuration(attempt.elapsedMs)}</span></div><div><span>Your answer: <b>{attempt.selectedAnswer||'—'}</b></span><span>Accepted: <b>{answerLabel(question)}</b></span></div></div>
              {qpdf&&<details><summary>Review question</summary><QuestionContent question={question} bytes={qpdf} alt={`${moduleLabel(question.module)} question ${question.number}`}/></details>}
              {apdf?<details><summary>Show walkthrough and explanation</summary><ExplanationContent question={question} bytes={apdf}/></details>:<p className="muted">Add the answer-explanations source in Resources to review explanations here.</p>}
            </article>
          })}
        </div>
        <div className="hero-actions"><AlexButton onClick={start}>Start another session</AlexButton><AlexButton tone="secondary" onClick={()=>setView('home')}>Back to practice tests</AlexButton></div>
      </section>
    </main>)
  }

  if(view==='stats')return withSidebar('performance',<main className="shell"><PerformanceDashboard summary={performance} hasHistory={attempts.length>0} onClearHistory={resetHistory}/></main>)

  if(view==='question-bank')return withSidebar('question-bank',<QuestionBankReview questionsPdf={qpdf}/>,'#F7F6F2')

  if(view==='settings')return withSidebar('practice-setup',<main className="shell">
    <div className="page-heading"><div><p className="eyebrow">Practice Setup</p><h1>Practice setup</h1></div></div>
    <section className="card settings settings-grid">
      <div className="settings-field"><AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'English + Math'},{value:'english',label:'English only'},{value:'math',label:'Math only'}]} onChange={mode=>setSettings({...settings,mode})}/></div>
      <div className="settings-field"><AlexNumberField label="Questions per session" value={settings.questionsPerSession} min={3} max={30} onChange={questionsPerSession=>setSettings({...settings,questionsPerSession})}/></div>
      <div className="settings-actions"><AlexButton onClick={()=>beginPractice(settings.mode)}>Start with these settings</AlexButton><AlexButton tone="secondary" onClick={resetHistory}>Clear history & start fresh</AlexButton></div>
      <p className="muted">Questions are selected adaptively from your uploaded SAT source. History is used to prioritize unseen and weaker questions.</p>
    </section>
  </main>)

  if(view==='sources')return withSidebar('resources',<main className="shell">
    <div className="page-heading"><div><p className="eyebrow">Resources</p><h1>Manage sources</h1></div></div>
    <section className="card sources">
      <p>Question and explanation text is extracted from the PDFs you add here and stored in a local browser database. Practice uses verified text for Math, with source images reserved for graphs, diagrams, and other visual-only material.</p>
      <div className="uploads">
        <label><Upload/><b>{qpdf?'Replace question source':'Add question source'}</b><span>{qpdf?'Ready for practice':'Required for practice questions'}</span><input type="file" accept="application/pdf" onChange={event=>upload('questions',event.target.files?.[0])}/></label>
        <label><Upload/><b>{apdf?'Replace explanation source':'Add explanation source'}</b><span>{apdf?'Ready for text import':'Add for walkthroughs and review'}</span><input type="file" accept="application/pdf" onChange={event=>upload('answers',event.target.files?.[0])}/></label>
      </div>
      <div className="structured-db-card"><div><b>Local question database</b><span>{contentCount}/{QUESTION_BANK.length} questions imported</span><small>Text stays in this browser. Formulas can be stored as LaTeX and rendered with KaTeX; verified source layouts remain the accuracy fallback.</small></div><div className="structured-db-actions"><AlexButton disabled={!qpdf||!apdf||Boolean(importProgress)} onClick={buildTextDatabase}>{importProgress?`Importing ${importProgress}`:'Build text database'}</AlexButton>{contentCount>0&&<AlexButton tone="secondary" onClick={async()=>{await clearQuestionContent();setContentCount(0)}}>Clear text database</AlexButton>}</div></div>
      {(qpdf||apdf)&&<AlexButton tone="secondary" onClick={async()=>{await clearPdfs();await clearQuestionContent();setQpdf(null);setApdf(null);setContentCount(0)}}>Clear sources</AlexButton>}
    </section>
  </main>)

  if(view==='study')return withSidebar('study',<main className="shell">
    <section className="hero card">
      <div><p className="eyebrow">Study Plan</p><h1>Your SAT practice plan</h1><p>Use short adaptive sessions to build consistency. Questions you have not seen and topics you miss more often are prioritized automatically.</p><div className="hero-actions"><AlexButton onClick={()=>setView('home')}>Choose a practice test</AlexButton><AlexButton tone="secondary" onClick={()=>beginPractice(settings.mode)}>Start {settings.questionsPerSession} questions</AlexButton></div></div>
      <div className="score">{attempts.length?`${performance.accuracy}%`:'—'}<small>overall accuracy</small></div>
    </section>
    <PerformanceDashboard summary={performance} hasHistory={attempts.length>0} compact/>
  </main>,'#F7F6F2')

  return withSidebar('practice-tests',<PracticeTestsDashboard
    questionCount={settings.questionsPerSession}
    mixedAction={<AlexButton onClick={()=>beginPractice('both')}>Start</AlexButton>}
    readingAction={<AlexButton tone="secondary" onClick={()=>beginPractice('english')}>Start</AlexButton>}
    mathAction={<AlexButton tone="secondary" onClick={()=>beginPractice('math')}>Start</AlexButton>}
  />)
}
