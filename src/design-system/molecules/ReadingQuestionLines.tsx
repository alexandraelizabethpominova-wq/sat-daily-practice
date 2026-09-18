import AlexRichText from '../atoms/AlexRichText'

const LABELED_CHOICE=/^([A-D])(?:[.)]\s*|\s+)(.+)$/i
const QUESTION_STEM=/^(Which|What|How|Why|According to|Based on|As used in|The student wants|To which|Which finding|Which quotation|Which choice|Which statement|Which response|The passage|The text|The main purpose|The author|The speaker)\b/i

export type ReadingChoice={label:string;text:string}
export type ParsedReadingQuestion={stimulus:string[];stem:string;choices:ReadingChoice[];isQuote:boolean;isVerse:boolean}

function clean(value:string){return value.replace(/\s+/g,' ').trim()}

function stemStart(source:string[]){
  const direct=source.findIndex(line=>QUESTION_STEM.test(clean(line)))
  if(direct>=0)return direct
  for(let index=source.length-1;index>=0;index--){if(/[?]$/.test(clean(source[index])))return index}
  return Math.max(0,source.length-1)
}

function stemEnd(source:string[],start:number){
  for(let index=start;index<source.length;index++){if(/[?]$/.test(clean(source[index])))return index}
  return start
}

function looksLikeVerse(lines:string[]){
  if(lines.length<3)return false
  const lengths=lines.map(line=>clean(line).length).filter(Boolean)
  if(lengths.length<3)return false
  const average=lengths.reduce((sum,value)=>sum+value,0)/lengths.length
  const longLines=lengths.filter(length=>length>72).length
  return average<=60&&longLines<=1
}

function explicitlyQuoted(lines:string[]){
  const text=lines.map(clean).filter(Boolean).join(' ')
  return /^[“\"‘]/.test(text)||/[”\"’]$/.test(text)||/^The following text is (?:from|adapted from)\b/i.test(text)
}

function parseChoices(lines:string[]){
  const choices:ReadingChoice[]=[]
  let current:ReadingChoice|null=null
  for(const raw of lines){
    const line=clean(raw)
    const match=line.match(LABELED_CHOICE)
    if(match){
      if(current)choices.push(current)
      current={label:match[1].toUpperCase(),text:match[2].trim()}
      continue
    }
    if(current)current.text=clean(`${current.text} ${line}`)
  }
  if(current)choices.push(current)
  return choices
}

export function parseReadingQuestion(lines:string[]):ParsedReadingQuestion{
  const source=lines.map(line=>line.trim()).filter(Boolean)
  const start=stemStart(source)
  const end=stemEnd(source,start)
  const stimulus=source.slice(0,start)
  const stem=source.slice(start,end+1).map(clean).join(' ')
  const choices=parseChoices(source.slice(end+1))
  const isVerse=looksLikeVerse(stimulus)
  return {stimulus,stem,choices,isVerse,isQuote:isVerse||explicitlyQuoted(stimulus)}
}

export default function ReadingQuestionLines({lines}:{lines:string[]}){
  const parsed=parseReadingQuestion(lines)
  return <div className="reading-question-content">
    {parsed.stimulus.length>0&&(parsed.isQuote
      ?<blockquote className={`reading-stimulus reading-quote${parsed.isVerse?' reading-verse':''}`}>
        {parsed.isVerse
          ?parsed.stimulus.map((line,index)=><span className="reading-verse-line" key={`verse-${index}`}><AlexRichText text={line}/></span>)
          :<p><AlexRichText text={parsed.stimulus.map(clean).join(' ')}/></p>}
      </blockquote>
      :<div className="reading-stimulus"><p><AlexRichText text={parsed.stimulus.map(clean).join(' ')}/></p></div>)}

    {parsed.stem&&<p className="reading-question-stem"><AlexRichText text={parsed.stem}/></p>}

    {parsed.choices.length>0&&<div className="reading-answer-options" role="list" aria-label="Answer choices">
      {parsed.choices.map(choice=><div className="reading-answer-choice" role="listitem" key={choice.label}>
        <span className="reading-choice-label" aria-hidden="true">{choice.label}</span>
        <span className="reading-choice-text"><AlexRichText text={choice.text}/></span>
      </div>)}
    </div>}
  </div>
}
