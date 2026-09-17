import {useMemo,useState} from 'react'
import {Search} from 'lucide-react'
import AlexButtonBase from '../atoms/AlexButtonBase'
import AlexDropdown from '../atoms/AlexDropdown'
import AlexTextField from '../atoms/AlexTextField'
import AlexText from '../atoms/AlexText'
import QuestionContent from '../molecules/QuestionContent'
import SourceSlice from '../../components/SourceSlice'
import {QUESTION_BANK,moduleLabel} from '../../lib/questionBank'
import type {PracticeQuestion} from '../../types'

type Props={questionsPdf:ArrayBuffer|null}

type ModuleFilter='all'|'math1'|'math2'|'rw1'|'rw2'

function questionLabel(question:PracticeQuestion){
  return `${moduleLabel(question.module)} · Q${question.number}`
}

export default function QuestionBankReview({questionsPdf}:Props){
  const[moduleFilter,setModuleFilter]=useState<ModuleFilter>('all')
  const[search,setSearch]=useState('')
  const[selectedId,setSelectedId]=useState(()=>QUESTION_BANK.find(question=>question.subject==='math')?.id??QUESTION_BANK[0]?.id??'')

  const questions=useMemo(()=>{
    const needle=search.trim().toLowerCase()
    return QUESTION_BANK.filter(question=>{
      if(moduleFilter!=='all'&&question.module!==moduleFilter)return false
      if(!needle)return true
      return question.id.toLowerCase().includes(needle)||questionLabel(question).toLowerCase().includes(needle)||String(question.number)===needle
    })
  },[moduleFilter,search])

  const selected=QUESTION_BANK.find(question=>question.id===selectedId)??questions[0]

  return <main className="question-bank-page">
    <header className="question-bank-heading">
      <div>
        <p className="eyebrow">Question Bank</p>
        <h1>Review source questions</h1>
        <p>Compare the reconstructed text with the original PDF question side by side.</p>
      </div>
      <div className="question-bank-filters">
        <AlexDropdown
          id="question-bank-module"
          label="Module"
          value={moduleFilter}
          options={[
            {value:'all',label:'All modules'},
            {value:'math1',label:'Math · Module 1'},
            {value:'math2',label:'Math · Module 2'},
            {value:'rw1',label:'Reading & Writing · Module 1'},
            {value:'rw2',label:'Reading & Writing · Module 2'},
          ]}
          onChange={value=>setModuleFilter(value as ModuleFilter)}
        />
        <div className="question-bank-search">
          <Search size={17}/>
          <AlexTextField value={search} onChange={event=>setSearch(event.target.value)} placeholder="Find question"/>
        </div>
      </div>
    </header>

    {!questionsPdf?<section className="question-bank-empty">
      <h2>Add the practice-test PDF first</h2>
      <p>The Question Bank needs the question source in Resources so it can show the original PDF beside the text reconstruction.</p>
    </section>:<div className="question-bank-workspace">
      <aside className="question-bank-list" aria-label="Questions">
        <div className="question-bank-list-header"><b>{questions.length} questions</b><span>Choose one to review</span></div>
        <div className="question-bank-list-scroll">
          {questions.map(question=><AlexButtonBase
            key={question.id}
            className={question.id===selected?.id?'question-bank-row active':'question-bank-row'}
            onClick={()=>setSelectedId(question.id)}
            aria-pressed={question.id===selected?.id}
          >
            <span>{question.subject==='math'?'Math':'Reading & Writing'}</span>
            <b>Question {question.number}</b>
            <small>{moduleLabel(question.module)}</small>
          </AlexButtonBase>)}
          {!questions.length&&<p className="question-bank-no-results">No questions match this filter.</p>}
        </div>
      </aside>

      {selected&&<section className="question-bank-viewer">
        <div className="question-bank-viewer-header">
          <div><span>{selected.subject==='math'?'Math':'Reading & Writing'}</span><h2>{questionLabel(selected)}</h2></div>
          <AlexText component="span" sx={{fontSize:12,color:'#667085'}}>PDF page {selected.sourcePage}</AlexText>
        </div>
        <div className="question-bank-compare">
          <article className="question-bank-pane text-pane">
            <div className="question-bank-pane-label">Text reconstruction</div>
            <QuestionContent question={selected} bytes={questionsPdf} alt={`${questionLabel(selected)} text`} showOriginalLayout={false} reflowProse/>
          </article>
          <article className="question-bank-pane pdf-pane">
            <div className="question-bank-pane-label">Original PDF</div>
            <SourceSlice pdfKey="questions" bytes={questionsPdf} page={selected.sourcePage} questionNumber={selected.number} alt={`${questionLabel(selected)} original PDF`}/>
          </article>
        </div>
      </section>}
    </div>}
  </main>
}
