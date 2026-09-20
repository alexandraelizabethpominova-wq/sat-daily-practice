import katex from 'katex'
import 'katex/dist/katex.min.css'
import type {ReactNode} from 'react'

type Props={text:string;className?:string}

function renderMath(math:string,displayMode:boolean,key:string){
  return <span
    key={key}
    className={displayMode?'rich-math display':'rich-math inline'}
    dangerouslySetInnerHTML={{__html:katex.renderToString(math,{throwOnError:false,displayMode,strict:'ignore'})}}
  />
}

const NATURAL_LANGUAGE_WORD=/\b(?:a|an|and|at|by|each|for|from|in|is|of|on|or|per|purchase|than|that|the|to|was|were|with)\b/i

export function isLikelyMathToken(math:string,displayMode=false){
  if(displayMode)return true
  const value=math.trim()
  if(!value)return false
  if(/\\[A-Za-z]+|[=<>^_{}]|[+*/]|[≤≥≈≠±×÷√∞π]/.test(value))return true
  if(NATURAL_LANGUAGE_WORD.test(value))return false
  const plainWords=value.match(/[A-Za-z]{2,}/g)??[]
  if(plainWords.some(word=>word===word.toLowerCase()&&!/^(sin|cos|tan|log|ln|max|min)$/i.test(word)))return false
  return /^[A-Za-z0-9\s.,:;()\[\]|'′″%\-]+$/.test(value)
}

export default function AlexRichText({text,className}:Props){
  const nodes:ReactNode[]=[]
  const pattern=/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g
  let cursor=0
  let match:RegExpExecArray|null
  let index=0
  while((match=pattern.exec(text))){
    if(match.index>cursor)nodes.push(text.slice(cursor,match.index))
    const token=match[0]
    const displayMode=token.startsWith('$')
    const math=displayMode?token.slice(2,-2):token.slice(1,-1)
    if(isLikelyMathToken(math,displayMode))nodes.push(renderMath(math,displayMode,`math-${index++}`))
    else nodes.push(token)
    cursor=match.index+token.length
  }
  if(cursor<text.length)nodes.push(text.slice(cursor))
  return <span className={className}>{nodes.length?nodes:text}</span>
}
