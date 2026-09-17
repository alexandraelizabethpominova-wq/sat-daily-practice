import type {PracticeQuestion} from '../types'

function normalize(value:string){
  return value
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g,'-')
    .replace(/,/g,'')
    .replace(/\s+/g,'')
}

function numericValue(value:string):number|null{
  const normalized=normalize(value)
  const fraction=normalized.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\/([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/)
  if(fraction){
    const numerator=Number(fraction[1])
    const denominator=Number(fraction[2])
    if(Number.isFinite(numerator)&&Number.isFinite(denominator)&&denominator!==0)return numerator/denominator
    return null
  }
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized))return null
  const number=Number(normalized)
  return Number.isFinite(number)?number:null
}

export function acceptedAnswers(question:PracticeQuestion){
  if(question.acceptedAnswers?.length)return question.acceptedAnswers
  return question.correctAnswer.split(/\s+or\s+|\s*;\s*/i).filter(Boolean)
}

export function answerLabel(question:PracticeQuestion){
  return acceptedAnswers(question).join(' or ')
}

export function matchesAnswer(question:PracticeQuestion,response:string){
  const responseNormalized=normalize(response)
  if(!responseNormalized)return false
  const candidates=acceptedAnswers(question)
  if(candidates.some(candidate=>normalize(candidate)===responseNormalized))return true

  const responseNumber=numericValue(response)
  if(responseNumber===null)return false
  return candidates.some(candidate=>{
    const candidateNumber=numericValue(candidate)
    return candidateNumber!==null&&Math.abs(candidateNumber-responseNumber)<=1e-9
  })
}
