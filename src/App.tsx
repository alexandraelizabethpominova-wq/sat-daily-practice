import {useEffect,useState} from 'react'
import {BarChart3,BookOpen,ChevronLeft,ChevronRight,Clock3,Settings as SettingsIcon,Sparkles,Target,Upload} from 'lucide-react'
import SourceSlice from './components/SourceSlice'
import AlexButton from './design-system/atoms/AlexButton'
import AlexChoiceButton from './design-system/atoms/AlexChoiceButton'
import AlexDropdown from './design-system/atoms/AlexDropdown'
import AlexNumberField from './design-system/atoms/AlexNumberField'
import AlexTextField from './design-system/atoms/AlexTextField'
import {QUESTION_BANK,moduleLabel,questionsForMode} from './lib/questionBank'
import {addAttempt,clearHistory,getAttempts,getSessions,getSettings,saveSession,saveSettings} from './lib/storage'
import {clearPdfs,getPdf,savePdf} from './lib/pdfStore'
import {syncAttempt,syncSession} from './lib/supabase'
import type {Attempt,PracticeQuestion,SessionSummary,Settings} from './types'

const uid=()=>crypto.randomUUID()
const fmt=(ms:number)=>{const s=Math.round(ms/1000);return s<60?`${s}s`:`${Math.floor(s/60)}m ${s%60}s`}
const norm=(v:string)=>v.trim().toLowerCase().replace(/\s+/g,'').replace('−','-')
const matches=(q:PracticeQuestion,a:string)=>q.correctAnswer.includes(' or ')?q.correctAnswer.split(' or ').some(x=>norm(x)===norm(a)):norm(q.correctAnswer)===norm(a)
function choose(settings:Settings,attempts:Attempt[]){const pool=questionsForMode(settings.mode);const stats=new Map<string,{n:number;c:number;last:number}>();attempts.forEach((a,i)=>{const s=stats.get(a.questionId)??{n:0,c:0,last:-1};s.n++;if(a.correct)s.c++;s.last=i;stats.set(a.questionId,s)});return pool.map(q=>{const s=stats.get(q.id);return{q,score:(s?0:1000)+(s?(1-s.c/s.n)*400:0)+(s?Math.min(200,attempts.length-s.last):0)+Math.random()*60}}).sort((a,b)=>b.score-a.score).slice(0,settings.questionsPerSession).map(x=>x.q)}

type View='home'|'practice'|'results'|'stats'|'settings'|'sources'

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

  useEffect(()=>{Promise.all([getPdf('questions'),getPdf('answers')]).then(([q,a])=>{setQpdf(q);setApdf(a)})},[])
  useEffect(()=>saveSettings(settings),[settings])

  const current=qs[i]
  const accuracy=attempts.length?Math.round(100*attempts.filter(a=>a.correct).length/attempts.length):0
  const avg=attempts.length?attempts.reduce((s,a)=>s+a.elapsedMs,0)/attempts.length:0
  const currentRec=current?currentAttempts.find(a=>a.questionId===current.id):undefined

  async function upload(kind:'questions'|'answers',f?:File){if(!f)return;await savePdf(kind,f);const b=await getPdf(kind);kind==='questions'?setQpdf(b):setApdf(b)}
  function start(){if(!qpdf){setView('sources');return}const set=choose(settings,attempts);setQs(set);setSid(uid());setStarted(new Date().toISOString());setCurrentAttempts([]);setI(0);setSelected('');setSubmitted(false);setQStart(Date.now());setView('practice')}
  async function record(correct:boolean,selfGraded=false){if(!current)return;const a:Attempt={id:uid(),sessionId:sid,questionId:current.id,subject:current.subject,module:current.module,questionNumber:current.number,selectedAnswer:selected,correctAnswer:current.correctAnswer,correct,selfGraded,elapsedMs:Date.now()-qStart,createdAt:new Date().toISOString()};addAttempt(a);setAttempts(p=>[...p,a]);setCurrentAttempts(p=>[...p,a]);void syncAttempt(a)}
  async function submit(){if(!current||!selected.trim()||currentRec)return;setSubmitted(true);if(current.responseType==='multiple-choice')await record(matches(current,selected))}
  function goTo(index:number){if(index<0||index>=qs.length)return;const q=qs[index];const rec=currentAttempts.find(a=>a.questionId===q.id);setI(index);setSelected(rec?.selectedAnswer??'');setSubmitted(!!rec);if(!rec)setQStart(Date.now())}
  async function finish(){const s:SessionSummary={id:sid,startedAt:started,endedAt:new Date().toISOString(),mode:settings.mode,questionCount:qs.length,attempts:currentAttempts};saveSession(s);setSessions(p=>[...p,s]);void syncSession(s);setView('results')}
  async function next(){if(!currentRec)return;if(i+1>=qs.length){await finish();return}goTo(i+1)}

  if(view==='practice'&&current&&qpdf)return <main className="practice">
    <header className="practice-topbar">
      <button className="logo" onClick={()=>setView('home')}><Sparkles/> SAT Daily</button>
      <div className="progress-block"><b>Question {i+1} of {qs.length}</b><progress value={i+1} max={qs.length}/></div>
      <div className="question-nav">
        <AlexButton tone="secondary" startIcon={<ChevronLeft size={18}/>} onClick={()=>goTo(i-1)} disabled={i===0}>Previous</AlexButton>
        <span>{moduleLabel(current.module)} · Q{current.number}</span>
        <AlexButton endIcon={<ChevronRight size={18}/>} onClick={next} disabled={!currentRec}>{i+1===qs.length?'Finish':'Next'}</AlexButton>
      </div>
    </header>
    <div className="practice-grid">
      <section className="question-card"><div className="focus"><b>Question {current.number}</b></div><SourceSlice pdfKey="questions" bytes={qpdf} page={current.sourcePage} questionNumber={current.number} alt={`${moduleLabel(current.module)} question ${current.number}`}/></section>
      <aside className="answer">
        <h2>Your answer</h2>
        {current.responseType==='multiple-choice'?<div className="choices">{['A','B','C','D'].map(c=><AlexChoiceButton disabled={!!currentRec} selected={selected===c} onClick={()=>setSelected(c)} key={c} label={c}/>)}</div>:<AlexTextField disabled={!!currentRec||submitted} value={selected} onChange={e=>setSelected(e.target.value)} placeholder="Type your answer"/>}
        {!currentRec&&!submitted&&<AlexButton fullWidth disabled={!selected.trim()} onClick={submit} sx={{mt:1.5}}>Submit answer</AlexButton>}
        {submitted&&current.responseType==='student-produced'&&!currentRec&&<div className="feedback">Official answer: <b>{current.correctAnswer}</b><div><AlexButton tone="secondary" onClick={()=>record(true,true)}>I got it right</AlexButton><AlexButton tone="secondary" onClick={()=>record(false,true)}>I got it wrong</AlexButton></div></div>}
        {currentRec&&<div className={currentRec.correct?'feedback good':'feedback bad'}><b>{currentRec.correct?'Correct':'Not quite'}</b><span>Correct answer: {current.correctAnswer}</span><span>Time: {fmt(currentRec.elapsedMs)}</span></div>}
        <p className="review-note">Explanations are available after you finish the session.</p>
      </aside>
    </div>
  </main>

  if(view==='results'){
    const a=currentAttempts.length?Math.round(100*currentAttempts.filter(x=>x.correct).length/currentAttempts.length):0
    const t=currentAttempts.length?currentAttempts.reduce((s,x)=>s+x.elapsedMs,0)/currentAttempts.length:0
    return <main className="shell"><Nav current="" setView={setView}/><section className="card results"><p className="eyebrow">Session complete</p><h1>{a}% accuracy</h1><p>{currentAttempts.filter(x=>x.correct).length} of {currentAttempts.length} correct · {fmt(t)} average</p><div className="review-list"><h2>Session review</h2>{currentAttempts.map((att,index)=>{const q=QUESTION_BANK.find(x=>x.id===att.questionId);if(!q)return null;return <article className="review-item" key={att.id}><div className="review-head"><div><b>{index+1}. {moduleLabel(att.module)} · Q{att.questionNumber}</b><span>{att.correct?'Correct':'Review'} · {fmt(att.elapsedMs)}</span></div><div><span>Your answer: <b>{att.selectedAnswer||'—'}</b></span><span>Correct: <b>{att.correctAnswer}</b></span></div></div>{apdf?<details><summary>Show official explanation</summary><SourceSlice pdfKey="answers" bytes={apdf} page={q.answerPage} questionNumber={q.number} alt={`Official explanation for question ${q.number}`}/></details>:<p className="muted">Add the answer-explanations source in Manage Sources to review explanations here.</p>}</article>})}</div><AlexButton onClick={start}>Start another session</AlexButton></section></main>
  }

  if(view==='stats')return <main className="shell"><Nav current="stats" setView={setView}/><h1>Your practice trends</h1><div className="stats"><Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/><Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/><Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/><Stat icon={<BarChart3/>} label="Questions seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/></div></main>

  if(view==='settings')return <main className="shell"><Nav current="settings" setView={setView}/><h1>Practice setup</h1><section className="card settings settings-grid">
    <div className="settings-field"><AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'English + Math'},{value:'english',label:'English only'},{value:'math',label:'Math only'}]} onChange={mode=>setSettings({...settings,mode})}/></div>
    <div className="settings-field"><AlexNumberField label="Questions per session" value={settings.questionsPerSession} min={3} max={30} onChange={questionsPerSession=>setSettings({...settings,questionsPerSession})}/></div>
    <div className="settings-actions"><AlexButton tone="secondary" onClick={()=>{clearHistory();setAttempts([]);setSessions([])}}>Clear statistics</AlexButton></div>
  </section></main>

  if(view==='sources')return <main className="shell"><Nav current="sources" setView={setView}/><h1>Manage sources</h1><section className="card sources"><p>Sources are used only to render each question or explanation as a clean image. There is no PDF viewer in practice mode.</p><div className="uploads"><label><Upload/><b>{qpdf?'Replace question source':'Add question source'}</b><span>{qpdf?'Ready for practice':'Required for exact question formatting'}</span><input type="file" accept="application/pdf" onChange={e=>upload('questions',e.target.files?.[0])}/></label><label><Upload/><b>{apdf?'Replace explanation source':'Add explanation source'}</b><span>{apdf?'Ready for session review':'Optional'}</span><input type="file" accept="application/pdf" onChange={e=>upload('answers',e.target.files?.[0])}/></label></div>{(qpdf||apdf)&&<AlexButton tone="secondary" onClick={async()=>{await clearPdfs();setQpdf(null);setApdf(null)}}>Clear sources</AlexButton>}</section></main>

  return <main className="shell"><Nav current="home" setView={setView}/><section className="hero card"><div><p className="eyebrow">Daily SAT practice</p><h1>10 questions. One at a time.</h1><p>Questions keep their original visual formatting, including graphs, diagrams, and formulas. Explanations are saved for the session review.</p><div className="hero-actions"><AlexButton onClick={start}>{qpdf?`Start ${settings.questionsPerSession}-question session`:'Add question source'}</AlexButton><AlexButton tone="secondary" onClick={()=>setView('sources')}>Manage sources</AlexButton></div></div><div className="score">{attempts.length?`${accuracy}%`:'—'}<small>overall accuracy</small></div></section><div className="stats"><Stat icon={<Target/>} label="Accuracy" value={attempts.length?`${accuracy}%`:'—'}/><Stat icon={<Clock3/>} label="Avg. time" value={attempts.length?fmt(avg):'—'}/><Stat icon={<BookOpen/>} label="Sessions" value={String(sessions.length)}/><Stat icon={<Sparkles/>} label="Seen" value={`${new Set(attempts.map(a=>a.questionId)).size}/${QUESTION_BANK.length}`}/></div></main>
}

function Nav({current,setView}:{current:string;setView:(v:View)=>void}){return <nav><button className="logo" onClick={()=>setView('home')}><Sparkles/> SAT Daily</button><div><AlexButton tone={current==='home'?'secondary':'quiet'} onClick={()=>setView('home')}>Dashboard</AlexButton><AlexButton tone={current==='stats'?'secondary':'quiet'} onClick={()=>setView('stats')}>Stats</AlexButton><AlexButton tone={current==='settings'?'secondary':'quiet'} startIcon={<SettingsIcon size={16}/>} onClick={()=>setView('settings')}>Settings</AlexButton><AlexButton tone={current==='sources'?'secondary':'quiet'} startIcon={<Upload size={16}/>} onClick={()=>setView('sources')}>Manage Sources</AlexButton></div></nav>}
function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="stat">{icon}<span>{label}</span><b>{value}</b></div>}
