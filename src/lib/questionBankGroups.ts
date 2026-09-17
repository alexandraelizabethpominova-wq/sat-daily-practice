import type {ModuleKey,PracticeQuestion} from '../types'

const MODULE_ORDER:ModuleKey[]=['rw1','rw2','math1','math2']

export function groupQuestionsByModule(questions:PracticeQuestion[]){
  return MODULE_ORDER.flatMap(module=>{
    const items=questions.filter(question=>question.module===module)
    return items.length?[{module,items}]:[]
  })
}
