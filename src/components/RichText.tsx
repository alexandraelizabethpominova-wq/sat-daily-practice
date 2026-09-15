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

export default function RichText({text,className}:Props){
  const nodes:ReactNode[]=[]
  const pattern=/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g
  let cursor=0
  let match:RegExpExecArray|null
  let index=0
  while((match=pattern.exec(text))){
    if(match.index>cursor)nodes.push(text.slice(cursor,match.index))
    const token=match[0]
    const displayMode=token.startsWith('$$')
    const math=displayMode?token.slice(2,-2):token.slice(1,-1)
    nodes.push(renderMath(math,displayMode,`math-${index++}`))
    cursor=match.index+token.length
  }
  if(cursor<text.length)nodes.push(text.slice(cursor))
  return <span className={className}>{nodes.length?nodes:text}</span>
}
