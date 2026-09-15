import type {ReactNode} from 'react'
import AlexRichText from '../atoms/AlexRichText'

const SUPERSCRIPTS:Record<string,string>={'2':'²','3':'³'}

function cleanPdfMathArtifacts(value:string){
  let text=value
    .replace(/\b([A-Za-z])\s+x\s*\(\s*\)/g,'$1(x)')
    .replace(/\b([A-Za-z])\s*\(\s*x\s*\)/g,'$1(x)')
    .replace(/\(\s*([A-Za-z])\s*\)/g,'($1)')

  if(/[=<>]/.test(text)||/^\s*[A-Za-z]\(x\)/.test(text)){
    text=text.replace(/\b([A-Za-z])([23])\b/g,(_,letter:string,power:string)=>`${letter}${SUPERSCRIPTS[power]??power}`)
  }
  return text
}

function choiceLabel(value:string){
  return value.match(/^([A-D])[.)]\s*$/i)?.[1]?.toUpperCase()??null
}

function tableCells(value:string){
  const text=cleanPdfMathArtifacts(value).trim()
  if(!text||/[.!?]$/.test(text))return null
  const cells=text.split(/\s+/).filter(Boolean)
  if(cells.length<3||cells.length>6)return null
  if(cells.some(cell=>cell.length>16))return null
  return cells
}

function ChoiceTable({label,rows}:{label:string;rows:string[][]}){
  return <div className="structured-choice-table">
    <div className="structured-choice-label">{label})</div>
    <table aria-label={`Choice ${label}`}>
      <tbody>
        {rows.map((row,rowIndex)=><tr key={`${label}-${rowIndex}`}>
          {row.map((cell,columnIndex)=>{
            const Tag=rowIndex===0||columnIndex===0?'th':'td'
            return <Tag key={`${label}-${rowIndex}-${columnIndex}`} scope={Tag==='th'?(rowIndex===0?'col':'row'):undefined}>
              <AlexRichText text={cell}/>
            </Tag>
          })}
        </tr>)}
      </tbody>
    </table>
  </div>
}

export default function StructuredQuestionLines({lines}:{lines:string[]}){
  const output:ReactNode[]=[]
  let index=0

  while(index<lines.length){
    const line=cleanPdfMathArtifacts(lines[index])
    const label=choiceLabel(line)
    if(label&&index+2<lines.length){
      const first=tableCells(lines[index+1])
      const second=tableCells(lines[index+2])
      if(first&&second&&first.length===second.length){
        output.push(<ChoiceTable key={`choice-table-${index}`} label={label} rows={[first,second]}/>)
        index+=3
        continue
      }
    }

    output.push(<p key={`line-${index}`}><AlexRichText text={line}/></p>)
    index++
  }

  return <>{output}</>
}
