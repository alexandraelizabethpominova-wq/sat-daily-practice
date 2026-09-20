import {useEffect,useMemo,useState} from 'react'
import {ArrowLeft,Search} from 'lucide-react'
import AlexButtonBase from '../atoms/AlexButtonBase'
import AlexStatusChip from '../atoms/AlexStatusChip'
import AlexTextField from '../atoms/AlexTextField'
import AlexText from '../atoms/AlexText'
import ParsingIssueReporter from '../molecules/ParsingIssueReporter'
import QuestionSourceReview from '../molecules/QuestionSourceReview'
import {availablePracticeTests,moduleLabel,practiceTestLabel,QUESTION_BANK} from '../../lib/questionBank'
import {groupQuestionsByPracticeTest} from '../../lib/questionBankGroups'
import {loadSharedQuestionBank,mergeQuestionBanks} from '../../lib/sharedQuestionBank'
import type {ModuleKey,PracticeQuestion,PracticeTestFilter,PracticeTestId} from '../../types'

type Props={questionsPdf:ArrayBuffer|null}

const MODULES:ModuleKey[]=['rw1','rw2','math1','math2']

function questionLabel(question:PracticeQuestion){return `${moduleLabel(question.module)} · Q${question.number}`}

export default function QuestionBankReview({questionsPdf}:Props){
  const[practiceTestFilter,setPracticeTestFilter]=useState<PracticeTestFilter>('practice-test-4')
  const[activeModule,setActiveModule]=useState<ModuleKey|null>(null)
  const[search,setSearch]=useState('')
  const[bank,setBank]=useState<PracticeQuestion[]>(()=>QUESTION_BANK)
  const[selectedId,setSelectedId]=useState('')
  const hasQuestionsPdf=Boolean(questionsPdf?.byteLength)
  const validQuestionsPdf=hasQuestionsPdf?questionsPdf:null

  useEffect(()=>{
    let cancelled=false
    void loadSharedQuestionBank().then(shared=>{
      if(!cancelled)setBank(mergeQuestionBanks(QUESTION_BANK,shared))
    }).catch(error=>console.warn('Shared Question Bank load failed; using bundled metadata.',error))
    return()=>{cancelled=true}
  },[])

  const practiceTests=useMemo(()=>availablePracticeTests(bank),[bank])
  useEffect(()=>{
    if(practiceTestFilter!=='all'&&!practiceTests.includes(practiceTestFilter)){
      setPracticeTestFilter(practiceTests[0]??'all')
      setActiveModule(null)
    }
  },[practiceTestFilter,practiceTests])

  const overviewQuestions=useMemo(
    ()=>bank.filter(question=>practiceTestFilter==='all'||question.practiceTestId===practiceTestFilter),
    [bank,practiceTestFilter],
  )

  const moduleSummaries=useMemo(()=>MODULES.map(module=>{
    const items=overviewQuestions.filter(question=>question.module===module)
    return {module,items,count:items.length}
  }),[overviewQuestions])

  const questions=useMemo(()=>{
    if(!activeModule)return[]
    const needle=search.trim().toLowerCase()
    return bank.filter(question=>{
      if(practiceTestFilter!=='all'&&question.practiceTestId!==practiceTestFilter)return false
      if(question.module!==activeModule)return false
      if(!needle)return true
      return question.id.toLowerCase().includes(needle)||questionLabel(question).toLowerCase().includes(needle)||String(question.number)===needle
    })
  },[activeModule,bank,practiceTestFilter,search])

  const groupedPracticeTests=useMemo(()=>groupQuestionsByPracticeTest(questions),[questions])

  useEffect(()=>{
    if(!activeModule)return
    if(questions.length&&!questions.some(question=>question.id===selectedId))setSelectedId(questions[0].id)
    if(!questions.length)setSelectedId('')
  },[activeModule,questions,selectedId])

  const selected=questions.find(question=>question.id===selectedId)??questions[0]

  function choosePracticeTest(value:PracticeTestFilter){
    setPracticeTestFilter(value)
    setActiveModule(null)
    setSearch('')
    setSelectedId('')
  }

  function browseModule(module:ModuleKey){
    const first=overviewQuestions.find(question=>question.module===module)
    if(!first)return
    setActiveModule(module)
    setSearch('')
    setSelectedId(first.id)
  }

  const testTabs:[PracticeTestFilter,string][]=[
    ...practiceTests.map(value=>[value,practiceTestLabel(value)] as [PracticeTestId,string]),
    ['all','All tests'],
  ]

  return <main className="question-bank-page question-bank-dashboard">
    <header className="question-bank-dashboard-heading">
      <h1>Question Bank</h1>
      <p>Review questions by practice test and module. Browse parsed questions and compare them with the original source when needed.</p>
    </header>

    <nav className="question-bank-test-tabs" aria-label="Practice tests">
      {testTabs.map(([value,label])=><AlexButtonBase
        key={value}
        className={practiceTestFilter===value?'question-bank-test-tab active':'question-bank-test-tab'}
        onClick={()=>choosePracticeTest(value)}
        aria-pressed={practiceTestFilter===value}
      >{label}</AlexButtonBase>)}
    </nav>

    {!activeModule?<section className="question-bank-module-grid" aria-label="Question modules">
      {moduleSummaries.map(({module,items,count})=>{
        const available=count>0
        const parsed=available&&items.every(question=>question.contentStatus!=='metadata')
        return <article className={available?'question-bank-module-card':'question-bank-module-card unavailable'} key={module}>
          <div className="question-bank-module-card-title">
            <h2>{moduleLabel(module)}</h2>
            <AlexStatusChip sx={available?undefined:{bgcolor:'#F2F4F7',color:'#667085'}}>{available?(parsed?'Parsed':'Available'):'Not added'}</AlexStatusChip>
          </div>
          <p>{count} {count===1?'question':'questions'}</p>
          <AlexButtonBase
            className="question-bank-browse-module"
            disabled={!available}
            onClick={()=>browseModule(module)}
          >Browse module</AlexButtonBase>
        </article>
      })}
    </section>:<>
      <section className="question-bank-browse-toolbar">
        <AlexButtonBase className="question-bank-overview-back" onClick={()=>{setActiveModule(null);setSearch('')}}>
          <ArrowLeft size={16}/> Module overview
        </AlexButtonBase>
        <div className="question-bank-browse-title">
          <span>{practiceTestFilter==='all'?'All practice tests':practiceTestLabel(practiceTestFilter)}</span>
          <h2>{moduleLabel(activeModule)}</h2>
        </div>
        <div className="question-bank-search"><Search size={17}/><AlexTextField value={search} onChange={event=>setSearch(event.target.value)} placeholder="Find question"/></div>
      </section>

      {!hasQuestionsPdf&&<section className="question-bank-empty">
        <h2>Shared Question Bank</h2>
        <p>The question list is available without a local PDF. Source comparison and visual-only figures appear when the source PDF is available.</p>
      </section>}

      <div className="question-bank-workspace">
        <aside className="question-bank-list" aria-label="Questions">
          <div className="question-bank-list-header"><b>{questions.length} questions</b><span>Select a question</span></div>
          <div className="question-bank-list-scroll">
            {groupedPracticeTests.map(testGroup=><section className="question-bank-test-group" key={testGroup.practiceTestId}>
              {practiceTestFilter==='all'&&<div className="question-bank-group-title"><span>{practiceTestLabel(testGroup.practiceTestId)}</span><small>{testGroup.items.length}</small></div>}
              {testGroup.modules.map(group=><section className="question-bank-group" key={`${testGroup.practiceTestId}-${group.module}`}>
                <div className="question-bank-group-items">{group.items.map(question=><AlexButtonBase
                  key={question.id}
                  className={question.id===selected?.id?'question-bank-row active':'question-bank-row'}
                  onClick={()=>setSelectedId(question.id)}
                  aria-pressed={question.id===selected?.id}
                  aria-label={`${practiceTestLabel(question.practiceTestId)} ${moduleLabel(question.module)} Question ${question.number}`}
                ><span>Question {question.number}</span></AlexButtonBase>)}</div>
              </section>)}
            </section>)}
            {!questions.length&&<p className="question-bank-no-results">No questions match this search.</p>}
          </div>
        </aside>

        {selected&&<section className="question-bank-viewer">
          <div className="question-bank-viewer-header">
            <div><span>{practiceTestLabel(selected.practiceTestId)} · {selected.subject==='math'?'Math':'Reading & Writing'}</span><h2>{questionLabel(selected)}</h2></div>
            <AlexText component="span" sx={{fontSize:12,color:'#667085'}}>{hasQuestionsPdf?`PDF page ${selected.sourcePage}`:'Shared bank'}</AlexText>
          </div>
          <ParsingIssueReporter question={selected} context="question-bank"/>
          <QuestionSourceReview question={selected} questionsPdf={validQuestionsPdf}/>
        </section>}
      </div>
    </>}
  </main>
}
