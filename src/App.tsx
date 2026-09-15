import {useEffect,useState,type ReactNode} from 'react'
import {BarChart3,BookOpen,ChevronLeft,ChevronRight,Clock3,Sparkles,Target,Upload} from 'lucide-react'
import SourceSlice from './components/SourceSlice'
import AlexButton from './design-system/atoms/AlexButton'
import AlexChoiceButton from './design-system/atoms/AlexChoiceButton'
import AlexDropdown from './design-system/atoms/AlexDropdown'
import AlexNumberField from './design-system/atoms/AlexNumberField'
import AlexStatusChip from './design-system/atoms/AlexStatusChip'
import AlexTextField from './design-system/atoms/AlexTextField'
import AppSidebarLayout from './design-system/organisms/AppSidebarLayout'
import PracticeTestsDashboard from './design-system/organisms/PracticeTestsDashboard'
import {QUESTION_BANK,moduleLabel,questionsForMode} from './lib/questionBank'
import {addAttempt,clearHistory,getAttempts,getSessions,getSettings,saveSession,saveSettings} from './lib/storage'
import {clearPdfs,getPdf,savePdf} from './lib/pdfStore'
import {syncAttempt,syncSession} from './lib/supabase'
import type {Attempt,PracticeQuestion,SessionSummary,Settings,SubjectMode} from './types'

const uid=()=>crypto.randomUUID()
const fmt=(ms:number)=>{const s=Math.round(ms/1000);return s<60?`${s}s`:`${Math.floor(s/60)}m ${s%60}s`}
const norm=(v:string)=>v.trim().toLowerCase().replace(/\s+/g,'').replace('−','-')
const matches=(q:PracticeQuestion,a:string)=>q.correctAnswer.includes(' or ')?q.correctAnswer.split(' or ').some(x=>norm(x)===norm(a)):norm(q.correctAnswer)===norm(a)

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
  return pool
    .map(q=>{
      const stat=stats.get(q.id)
      const score=(stat?0:1000)+(stat?(1-stat.c/stat.n)*400:0)+(stat?Math.min(200,attempts.length-stat.last):0)+Math.random()*60
      return {q,score}
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,settings.questionsPerSession)
    .map(item=>item.q)
}

type View='study'|'home'|'practice'|'results'|'stats'|'settings'|'sources'
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

  useEffect(()=>{
    Promise.all([getPdf('questions'),getPdf('answers')]).then(([questionsPdf,answersPdf])=>{
      setQpdf(questionsPdf)
      setApdf(answersPdf)
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
    const bytes=await getPdf(kind)
    if(kind==='questions')setQpdf(bytes)
    else setApdf(bytes)
  }

  function beginPractice(nextMode:SubjectMode=settings.mode){
    if(!qpdf){
      setView('sources')
      return
    }
    const nextSettings={...settings,mode:nextMode}
    setSettings(nextSettings)
    setQs(choose(nextSettings,attempts))
    setSid(uid())
    setStarted(new Date().toISOString())
    setCurrentAttempts([])
    setI(0)
    setSelected('')
    setSubmitted(false)
    setQStart(Date.now())
    setView('practice')
  }

  function start(){
    beginPractice(settings.mode)
  }

  async function record(correct:boolean,selfGraded=false){
    if(!current)return
    const attempt:Attempt={
      id:uid(),
      sessionId:sid,
      questionId:current.id,
      subject:current.subject,
      module:current.module,
      questionNumber:current.number,
      selectedAnswer:selected,
      correctAnswer:current.correctAnswer,
      correct,
      selfGraded,
      elapsedMs:Date.now()-qStart,
      createdAt:new Date().toISOString(),
    }
    addAttempt(attempt)
    setAttempts(previous=>[...previous,attempt])
    setCurrentAttempts(previous=>[...previous,attempt])
    void syncAttempt(attempt)
  }

  async function submit(){
    if(!current||!selected.trim()||currentRec)return
    setSubmitted(true)
    if(current.responseType==='multiple-choice')await record(matches(current,selected))
  }

  function goTo(index:number){
    if(index<0||index>=qs.length)return
    const question=qs[index]
    const record=currentAttempts.find(a=>a.questionId===question.id)
    setI(index)
    setSelected(record?.selectedAnswer??'')
    setSubmitted(Boolean(record))
    if(!record)setQStart(Date.now())
  }

  async function finish(){
    const session:SessionSummary={
      id:sid,
      startedAt:started,
      endedAt:new Date().toISOString(),
      mode:settings.mode,
      questionCount:qs.length,
      attempts:currentAttempts,
    }
    saveSession(session)
    setSessions(previous=>[...previous,session])
    void syncSession(session)
    setView('results')
  }

  async function next(){
    if(!currentRec)return
    if(i+1>=qs.length){
      await finish()
      return
    }
    goTo(i+1)
  }

  function resetHistory(){
    if(!window.confirm('Delete all practice history and statistics? Your settings and uploaded question sources will be kept.'))return
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

  function withSidebar(active:SidebarKey,content:ReactNode,background='#fff'){
    return <AppSidebarLayout
      active={active}
      collapsed={sidebarCollapsed}
      onToggleCollapsed={()=>setSidebarCollapsed(value=>!value)}
      onStudyPlan={()=>setView('study')}
      onPracticeTests={()=>setView('home')}
      onQuestionBank={()=>setView('settings')}
      onPerformance={()=>setView('stats')}
      onResources={()=>setView('sources')}
      onSettings={()=>setView('settings')}
      contentBackground={background}
    >
      {content}
    </AppSidebarLayout>
  }

  if(view==='practice'&&current&&qpdf){
    return withSidebar('practice-tests',(
      <main className="practice">
        <header className="practice-topbar">
          <div className="practice-title"><span>SAT PRACTICE</span><b>{moduleLabel(current.module)}</b></div>
          <div className="progress-block">
            <div><b>{current.subject==='math'?'Math':'Reading & Writing'}</b><span>Question {i+1} of {qs.length}</span></div>
            <progress value={i+1} max={qs.length}/>
          </div>
          <div className="question-nav">
            <AlexButton tone="secondary" startIcon={<ChevronLeft size={18}/>} onClick={()=>goTo(i-1)} disabled={i===0}>Previous</AlexButton>
            <AlexButton endIcon={<ChevronRight size={18}/>} onClick={next} disabled={!currentRec}>{i+1===qs.length?'Finish':'Next'}</AlexButton>
          </div>
        </header>
        <div className="practice-workspace">
          <section className="question-panel">
            <div className="question-heading">
              <div><span>QUESTION {current.number}</span><b>{current.subject==='math'?'Math':'Reading & Writing'}</b></div>
              <AlexStatusChip>READY</AlexStatusChip>
            </div>
            <SourceSlice pdfKey="questions" bytes={qpdf} page={current.sourcePage} questionNumber={current.number} alt={`${moduleLabel(current.module)} question ${current.number}`}/>
          </section>
          <aside className="answer-panel">
            <div>
              <p className="answer-kicker">Your answer</p>
              <h2>Choose the best answer.</h2>
              <p className="answer-helper">Answer this question, then use Next to continue.</p>
            </div>
            {current.responseType==='multiple-choice'?(
              <div className="choices">
                {['A','B','C','D'].map(choice=><AlexChoiceButton disabled={Boolean(currentRec)} selected={selected===choice} onClick={()=>setSelected(choice)} key={choice} label={choice}/>) }
              </div>
            ):(
              <AlexTextField disabled={Boolean(currentRec)||submitted} value={selected} onChange={event=>setSelected(event.target.value)} placeholder="Type your answer"/>
            )}
            {!currentRec&&!submitted&&<AlexButton fullWidth disabled={!selected.trim()} onClick={submit}>Submit answer</AlexButton>}
            {submitted&&current.responseType==='student-produced'&&!currentRec&&(
              <div className="feedback">
                Official answer: <b>{current.correctAnswer}</b>
                <div>
                  <AlexButton tone="secondary" onClick={()=>record(true,true)}>I got it right</AlexButton>
                  <AlexButton tone="secondary" onClick={()=>record(false,true)}>I got it wrong</AlexButton>
                </div>
              </div>
            )}
            {currentRec&&(
              <div className={currentRec.correct?'feedback good':'feedback bad'}>
                <b>{currentRec.correct?'Correct':'Not quite'}</b>
                <span>Correct answer: {current.correctAnswer}</span>
                <span>Time: {fmt(currentRec.elapsedMs)}</span>
              </div>
            )}
            <p className="review-note">Explanation will be available in your session review.</p>
          </aside>
        </div>
      </main>
    ),'#F7F6F2')
  }

  if(view==='results'){
    const sessionAccuracy=currentAttempts.length?Math.round(100*currentAttempts.filter(a=>a.correct).length/currentAttempts.length):0
    const sessionAverage=currentAttempts.length?currentAttempts.reduce((sum,a)=>sum+a.elapsedMs,0)/currentAttempts.length:0
    return withSidebar('practice-tests',(
      <main className="shell">
        <section className="card results">
          <p className="eyebrow">Session complete</p>
          <h1>{sessionAccuracy}% accuracy</h1>
          <p>{currentAttempts.filter(a=>a.correct).length} of {currentAttempts.length} correct · {fmt(sessionAverage)} average</p>
          <div className="review-list">
            <h2>Session review</h2>
            {currentAttempts.map((attempt,index)=>{
              const question=QUESTION_BANK.find(q=>q.id===attempt.questionId)
              if(!question)return null
              return <article className="review-item" key={attempt.id}>
                <div className="review-head">
                  <div><b>{index+1}. {moduleLabel(attempt.module)} · Q{attempt.questionNumber}</b><span>{attempt.correct?'Correct':'Review'} · {fmt(attempt.elapsedMs)}</span></div>
                  <div><span>Your answer: <b>{attempt.selectedAnswer||'—'}</b></span><span>Correct: <b>{attempt.correctAnswer}</b></span></div>
                </div>
                {apdf?(
                  <details>
                    <summary>Show official explanation</summary>
                    <SourceSlice pdfKey="answers" bytes={apdf} page={question.answerPage} questionNumber={question.number} alt={`Official explanation for question ${question.number}`}/>
                  </details>
                ):(
                  <p className="muted">Add the answer-explanations source in Resources to review explanations here.</p>
                )}
              </article>
            })}
          </div>
          <div className="hero-actions">
            <AlexButton onClick={start}>Start another session</AlexButton>
            <AlexButton tone="secondary" onClick={()=>setView('home')}>Back to practice tests</AlexButton>
          </div>
        </section>
      </main>
    ))
  }

  if(view==='stats'){
    return withSidebar('performance',(
      <main className="shell">
        <div className="page-heading">
          <div><p className="eyebrow">Performance</p><h1>Your practice trends</h1></div>
          {attempts.length>0&&<AlexButton tone="secondary" onClick={resetHistory}>Clear history & start fresh</AlexButton>}
        </div>
        <div className="stats">
          <Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/>
          <Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/>
          <Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/>
          <Stat icon={<BarChart3/>} label="Questions seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/>
        </div>
        {attempts.length===0&&<section className="card empty-history"><h2>Fresh start</h2><p>No practice history is stored yet. Your next session will begin building new statistics.</p></section>}
      </main>
    ))
  }

  if(view==='settings'){
    return withSidebar('question-bank',(
      <main className="shell">
        <div className="page-heading"><div><p className="eyebrow">Question Bank</p><h1>Practice setup</h1></div></div>
        <section className="card settings settings-grid">
          <div className="settings-field">
            <AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'English + Math'},{value:'english',label:'English only'},{value:'math',label:'Math only'}]} onChange={mode=>setSettings({...settings,mode})}/>
          </div>
          <div className="settings-field">
            <AlexNumberField label="Questions per session" value={settings.questionsPerSession} min={3} max={30} onChange={questionsPerSession=>setSettings({...settings,questionsPerSession})}/>
          </div>
          <div className="settings-actions">
            <AlexButton onClick={()=>beginPractice(settings.mode)}>Start with these settings</AlexButton>
            <AlexButton tone="secondary" onClick={resetHistory}>Clear history & start fresh</AlexButton>
          </div>
          <p className="muted">Questions are selected adaptively from your uploaded SAT source. History is used to prioritize unseen and weaker questions.</p>
        </section>
      </main>
    ))
  }

  if(view==='sources'){
    return withSidebar('resources',(
      <main className="shell">
        <div className="page-heading"><div><p className="eyebrow">Resources</p><h1>Manage sources</h1></div></div>
        <section className="card sources">
          <p>Sources are used to render each question or explanation as a clean image. There is no PDF viewer in practice mode.</p>
          <div className="uploads">
            <label>
              <Upload/><b>{qpdf?'Replace question source':'Add question source'}</b><span>{qpdf?'Ready for practice':'Required for exact question formatting'}</span>
              <input type="file" accept="application/pdf" onChange={event=>upload('questions',event.target.files?.[0])}/>
            </label>
            <label>
              <Upload/><b>{apdf?'Replace explanation source':'Add explanation source'}</b><span>{apdf?'Ready for session review':'Optional'}</span>
              <input type="file" accept="application/pdf" onChange={event=>upload('answers',event.target.files?.[0])}/>
            </label>
          </div>
          {(qpdf||apdf)&&<AlexButton tone="secondary" onClick={async()=>{await clearPdfs();setQpdf(null);setApdf(null)}}>Clear sources</AlexButton>}
        </section>
      </main>
    ))
  }

  if(view==='study'){
    return withSidebar('study',(
      <main className="shell">
        <section className="hero card">
          <div>
            <p className="eyebrow">Study Plan</p>
            <h1>Your SAT practice plan</h1>
            <p>Use short adaptive sessions to build consistency. Questions you have not seen and topics you miss more often are prioritized automatically.</p>
            <div className="hero-actions">
              <AlexButton onClick={()=>setView('home')}>Choose a practice test</AlexButton>
              <AlexButton tone="secondary" onClick={()=>beginPractice(settings.mode)}>Start {settings.questionsPerSession} questions</AlexButton>
            </div>
          </div>
          <div className="score">{attempts.length?`${accuracy}%`:'—'}<small>overall accuracy</small></div>
        </section>
        <div className="stats">
          <Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/>
          <Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/>
          <Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/>
          <Stat icon={<Sparkles/>} label="Seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/>
        </div>
      </main>
    ),'#F7F6F2')
  }

  return withSidebar('practice-tests',(
    <PracticeTestsDashboard
      questionCount={settings.questionsPerSession}
      mixedAction={<AlexButton onClick={()=>beginPractice('both')}>Start</AlexButton>}
      readingAction={<AlexButton tone="secondary" onClick={()=>beginPractice('english')}>Start</AlexButton>}
      mathAction={<AlexButton tone="secondary" onClick={()=>beginPractice('math')}>Start</AlexButton>}
    />
  ))
}

function Stat({icon,label,value}:{icon:ReactNode;label:string;value:string}){
  return <div className="stat">{icon}<span>{label}</span><b>{value}</b></div>
}
