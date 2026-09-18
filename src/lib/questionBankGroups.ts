import type {ModuleKey,PracticeQuestion,PracticeTestId} from '../types'

const MODULE_ORDER:ModuleKey[]=['rw1','rw2','math1','math2']

export function groupQuestionsByModule(questions:PracticeQuestion[]){
  return MODULE_ORDER.flatMap(module=>{
    const items=questions.filter(question=>question.module===module)
    return items.length?[{module,items}]:[]
  })
}

export function groupQuestionsByPracticeTest(questions:PracticeQuestion[]){
  const ids=[...new Set(questions.map(question=>question.practiceTestId))]
    .sort((a,b)=>Number(a.replace('practice-test-',''))-Number(b.replace('practice-test-',''))) as PracticeTestId[]
  return ids.map(practiceTestId=>{
    const items=questions.filter(question=>(question.practiceTestId)===practiceTestId)
    return {practiceTestId,items,modules:groupQuestionsByModule(items)}
  })
}
