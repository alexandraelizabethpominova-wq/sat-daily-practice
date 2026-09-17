import type {ReactNode} from 'react'
import AlexRichText from '../atoms/AlexRichText'

const SUPERSCRIPTS:Record<string,string>={'2':'²','3':'³'}
const FULL_CHOICE=/^[A-D][.)]\s+\S/i
const QUESTION_STEM=/^(Which|What|How|Why|According to|Based on|As used in|The student wants|To which|Which finding|Which quotation|Which choice|Which statement|Which response)\b/i

function cleanPdfMathArtifacts(value:string){
  let text=value
    .replace(/^(?:[-–—]\s*){2,}(?=\S)/,'')
    .replace(/\b([A-Za-z])\s+x\s*\(\s*\)/g,'$1(x)')
    .replace(/\b([A-Za-z])\s*\(\s*x\s*\)/g,'$1(x)')
    .replace(/\(\s*([A-Za-z])\s*\)/g,'($1)')
    .trim()

  if(/[=<>]/.test(text)||/^\s*[A-Za-z]\(x\)/.test(text)){
    text=text.replace(/\b([A-Za-z])([23])\b/g,(_,letter:string,power:string)=>`${letter}${SUPERSCRIPTS[power]??power}`)
  }
  return text
}

function isPdfDecoration(value:string){
  const compact=value.replace(/\s+/g,'')
  return compact.length>=4&&/^[I|l1\-–—_]+$/.test(compact)
}

function choiceLabel(value:string){
  return value.match(/^([A-D])[.)]\s*$/i)?.[1]?.toUpperCase()??null
}

function isChoiceStart(value:string){
  return Boolean(choiceLabel(value)||FULL_CHOICE.test(value))
}

function tableCells(value:string){
  const text=cleanPdfMathArtifacts(value).trim()
  if(!text||/[.!?]$/.test(text))return null
  const cells=text.split(/\s+/).filter(Boolean)
  if(cells.length<3||cells.length>7)return null
  if(cells.some(cell=>cell.length>18))return null
  return cells
}

function isNumericCell(value:string){
  return /^[-−+]?\d+(?:[.,]\d+)?%?$/.test(value)||/^[-−+]?\d+\/\d+$/.test(value)
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

function DataTable({headers,rows}:{headers:string[];rows:string[][]}){
  return <div className="structured-data-table-wrap">
    <table className="structured-data-table">
      <thead>
        <tr>{headers.map((header,index)=><th key={`header-${index}`} scope="col"><AlexRichText text={header}/></th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row,rowIndex)=><tr key={`row-${rowIndex}`}>
          {row.map((cell,columnIndex)=>columnIndex===0
            ?<th key={`cell-${rowIndex}-${columnIndex}`} scope="row"><AlexRichText text={cell}/></th>
            :<td key={`cell-${rowIndex}-${columnIndex}`}><AlexRichText text={cell}/></td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
}

function dataTableAt(lines:string[],start:number){
  const header=tableCells(lines[start])
  if(!header||header.some(isNumericCell))return null

  const rows:string[][]=[]
  let index=start+1
  while(index<lines.length&&rows.length<8){
    const row=tableCells(lines[index])
    if(!row)break
    const numericCount=row.filter(isNumericCell).length
    if(numericCount<2)break
    if(row.length!==header.length&&row.length!==header.length+1)break
    rows.push(row)
    index++
  }

  if(rows.length<2)return null
  const rowLength=rows[0].length
  if(rows.some(row=>row.length!==rowLength))return null
  const headers=rowLength===header.length+1?['',...header]:header
  if(headers.length!==rowLength)return null
  return {headers,rows,nextIndex:index}
}

function consumeChoice(lines:string[],start:number){
  const first=cleanPdfMathArtifacts(lines[start])
  const standalone=choiceLabel(first)
  const full=first.match(/^([A-D][.)])\s+(.+)$/i)
  if(!standalone&&!full)return null

  const label=standalone?`${standalone})`:full![1]
  const parts:string[]=[]
  if(full)parts.push(full[2])

  let index=start+1
  while(index<lines.length){
    const next=cleanPdfMathArtifacts(lines[index])
    if(!next||isPdfDecoration(next)||isChoiceStart(next)||/^\$\$/.test(next))break
    parts.push(next)
    index++
  }

  return {line:`${label}${parts.length?` ${parts.join(' ').replace(/\s+/g,' ').trim()}`:''}`,nextIndex:index}
}

export function reflowProseLines(lines:string[]){
  const result:string[]=[]
  let index=0
  let paragraph:string[]=[]
  const flush=()=>{
    if(paragraph.length){
      result.push(paragraph.join(' ').replace(/\s+/g,' ').trim())
      paragraph=[]
    }
  }

  while(index<lines.length){
    const line=cleanPdfMathArtifacts(lines[index])
    if(!line||isPdfDecoration(line)){
      flush()
      index++
      continue
    }

    const table=dataTableAt(lines,index)
    if(table){
      flush()
      for(let row=index;row<table.nextIndex;row++)result.push(cleanPdfMathArtifacts(lines[row]))
      index=table.nextIndex
      continue
    }

    const choice=consumeChoice(lines,index)
    if(choice){
      flush()
      result.push(choice.line)
      index=choice.nextIndex
      continue
    }

    if(/^\$\$/.test(line)){
      flush()
      result.push(line)
      index++
      continue
    }

    if(QUESTION_STEM.test(line)&&paragraph.length)flush()
    paragraph.push(line)
    if(/[?]$/.test(line))flush()
    index++
  }

  flush()
  return result
}

export default function StructuredQuestionLines({lines,reflowProse=false}:{lines:string[];reflowProse?:boolean}){
  const sourceLines=reflowProse?reflowProseLines(lines):lines
  const output:ReactNode[]=[]
  let index=0

  while(index<sourceLines.length){
    const line=cleanPdfMathArtifacts(sourceLines[index])
    if(!line||isPdfDecoration(line)){
      index++
      continue
    }

    const dataTable=dataTableAt(sourceLines,index)
    if(dataTable){
      output.push(<DataTable key={`data-table-${index}`} headers={dataTable.headers} rows={dataTable.rows}/>)
      index=dataTable.nextIndex
      continue
    }

    const label=choiceLabel(line)
    if(label&&index+2<sourceLines.length){
      const first=tableCells(sourceLines[index+1])
      const second=tableCells(sourceLines[index+2])
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
