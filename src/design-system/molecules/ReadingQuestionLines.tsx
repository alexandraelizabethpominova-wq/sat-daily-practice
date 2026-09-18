import AlexRichText from '../atoms/AlexRichText'
import ReadingDataTable from './ReadingDataTable'
import {READING_PARAGRAPH_BREAK} from '../../lib/readingQuestionFormat'
import {readingTableSpec} from '../../lib/readingTables'

const LABELED_CHOICE=/^([A-D])(?:[.)]\s*|\s+)(.+)$/i
const STANDALONE_CHOICE=/^([A-D])[.)]\s*$/i
const QUESTION_STEM=/^(Which|What|How|Why|According to|Based on|As used in|The student wants|To which|Which finding|Which quotation|Which choice|Which statement|Which response|The passage|The text|The main purpose|The author|The speaker)\b/i
const INTRO_START=/^The following text is (?:from|adapted from)\b/i
const CHOICE_ORDER=['A','B','C','D'] as const

export type ReadingChoice={label:string;text:string}
export type ParsedReadingQuestion={intro:string[];stimulusBlocks:string[][];stem:string;choices:ReadingChoice[];isQuote:boolean;isVerse:boolean}

function clean(value:string){return value.replace(/\s+/g,' ').trim()}
function isBreak(value:string){return value===READING_PARAGRAPH_BREAK}

function choiceParts(value:string){
  const line=clean(value)
  const full=line.match(LABELED_CHOICE)
  if(full)return {label:full[1].toUpperCase(),text:full[2].trim()}
  const standalone=line.match(STANDALONE_CHOICE)
  if(standalone)return {label:standalone[1].toUpperCase(),text:''}
  return null
}

function splitBlocks(lines:string[]){
  const blocks:string[][]=[]
  let current:string[]=[]
  for(const line of lines){
    if(isBreak(line)){if(current.length){blocks.push(current);current=[]};continue}
    current.push(line)
  }
  if(current.length)blocks.push(current)
  return blocks
}

function parseChoiceSequence(lines:string[]){
  const choices:ReadingChoice[]=[]
  let current:ReadingChoice|null=null
  let expectedIndex=0

  for(const raw of lines){
    if(isBreak(raw))continue
    const line=clean(raw)
    const parts=choiceParts(line)
    const expected=CHOICE_ORDER[expectedIndex]

    if(parts&&parts.label===expected){
      if(current)choices.push(current)
      current={label:parts.label,text:parts.text}
      expectedIndex++
      continue
    }

    if(current)current.text=clean(`${current.text} ${line}`)
  }

  if(current)choices.push(current)
  return choices
}

function findChoiceBlock(source:string[]){
  for(let start=source.length-1;start>=0;start--){
    if(isBreak(source[start]))continue
    const parts=choiceParts(source[start])
    if(parts?.label!=='A')continue
    const choices=parseChoiceSequence(source.slice(start))
    if(choices.map(choice=>choice.label).join('')==='ABCD')return {start,choices}
  }
  return null
}

function previousContentIndex(source:string[],from:number){
  for(let index=from;index>=0;index--){if(!isBreak(source[index]))return index}
  return -1
}

function stemBlockStart(source:string[],end:number){
  let blockStart=end
  while(blockStart>0&&!isBreak(source[blockStart-1]))blockStart--

  for(let index=blockStart;index<=end;index++){
    if(!isBreak(source[index])&&QUESTION_STEM.test(clean(source[index])))return index
  }

  for(let index=end;index>=0;index--){
    if(isBreak(source[index]))break
    if(QUESTION_STEM.test(clean(source[index])))return index
  }

  return blockStart
}

function findQuestionStructure(source:string[]){
  const choiceBlock=findChoiceBlock(source)
  if(!choiceBlock)return null

  let end=previousContentIndex(source,choiceBlock.start-1)
  while(end>=0&&!/[?]$/.test(clean(source[end]))){
    const previous=previousContentIndex(source,end-1)
    if(previous<0||isBreak(source[end-1]))break
    end=previous
  }
  if(end<0)return null

  const start=stemBlockStart(source,end)
  return {start,end,choices:choiceBlock.choices}
}

function legacyIntroSplit(lines:string[]){
  if(!lines.length||!INTRO_START.test(clean(lines[0])))return {intro:[] as string[],bodyBlocks:lines.length?[lines]:[]}
  const body=[...lines]
  const intro:string[]=[]
  while(body.length){
    const line=body.shift()!
    intro.push(line)
    if(/[.!?][”\"']?$/.test(clean(line)))break
  }
  return {intro,bodyBlocks:body.length?[body]:[]}
}

function looksLikeVerse(intro:string[]){
  return /\bpoem\b/i.test(intro.map(clean).join(' '))
}

function explicitlyQuoted(blocks:string[][]){
  const text=blocks.flat().map(clean).filter(Boolean).join(' ')
  return /^[“\"‘]/.test(text)||/[”\"’]$/.test(text)
}

export function parseReadingQuestion(lines:string[]):ParsedReadingQuestion{
  const source=lines.map(line=>line.trim()).filter(Boolean)
  const structure=findQuestionStructure(source)
  const start=structure?.start??Math.max(0,source.length-1)
  const end=structure?.end??start
  const rawStimulus=source.slice(0,start)
  const blocks=splitBlocks(rawStimulus)
  let intro:string[]=[]
  let stimulusBlocks=blocks

  if(blocks[0]?.length&&INTRO_START.test(clean(blocks[0][0]))){
    intro=blocks[0]
    stimulusBlocks=blocks.slice(1)
    if(!stimulusBlocks.length){
      const legacy=legacyIntroSplit(blocks[0])
      intro=legacy.intro
      stimulusBlocks=legacy.bodyBlocks
    }
  }

  const stem=source.slice(start,end+1).filter(line=>!isBreak(line)).map(clean).join(' ')
  const choices=structure?.choices??[]
  const isVerse=looksLikeVerse(intro)
  return {intro,stimulusBlocks,stem,choices,isVerse,isQuote:Boolean(intro.length)||isVerse||explicitlyQuoted(stimulusBlocks)}
}

export function hasCompleteReadingChoices(lines:string[]){return parseReadingQuestion(lines).choices.map(choice=>choice.label).join('')==='ABCD'}

function JoinedBlock({lines}:{lines:string[]}){return <p><AlexRichText text={lines.map(clean).join(' ')}/></p>}

type PairedTextSection={label:string;lines:string[]}

function pairedTextSections(blocks:string[][]):PairedTextSection[]|null{
  const lines=blocks.flat()
  const first=lines.findIndex(line=>/^Text\s+1$/i.test(clean(line)))
  const second=lines.findIndex(line=>/^Text\s+2$/i.test(clean(line)))
  if(first<0||second<=first)return null
  const firstLines=lines.slice(first+1,second).filter(line=>!isBreak(line))
  const secondLines=lines.slice(second+1).filter(line=>!isBreak(line))
  if(!firstLines.length||!secondLines.length)return null
  return[
    {label:'Text 1',lines:firstLines},
    {label:'Text 2',lines:secondLines},
  ]
}

function PairedTextPassages({sections}:{sections:PairedTextSection[]}){
  return <div className="reading-paired-texts">
    {sections.map(section=><section className="reading-paired-text" key={section.label}>
      <div className="reading-paired-label">{section.label}</div>
      <blockquote className="reading-quote reading-paired-quote"><JoinedBlock lines={section.lines}/></blockquote>
    </section>)}
  </div>
}

export default function ReadingQuestionLines({lines,questionId}:{lines:string[];questionId?:string}){
  const parsed=parseReadingQuestion(lines)
  const table=questionId?readingTableSpec(questionId):undefined
  const pairedTexts=pairedTextSections(parsed.stimulusBlocks)
  return <div className="reading-question-content">
    {table&&<ReadingDataTable table={table}/>} 
    {parsed.intro.length>0&&<div className="reading-intro">{splitBlocks(parsed.intro).map((block,index)=><JoinedBlock key={`intro-${index}`} lines={block}/>)}</div>}
    {pairedTexts
      ?<PairedTextPassages sections={pairedTexts}/>
      :parsed.stimulusBlocks.length>0&&(parsed.isQuote
        ?<blockquote role="blockquote" className={`reading-stimulus reading-quote${parsed.isVerse?' reading-verse':''}`}>
          {parsed.isVerse
            ?parsed.stimulusBlocks.flat().map((line,index)=><span className="reading-verse-line" key={`verse-${index}`}><AlexRichText text={line}/></span>)
            :parsed.stimulusBlocks.map((block,index)=><JoinedBlock key={`quote-${index}`} lines={block}/>)}
        </blockquote>
        :<div className="reading-stimulus">{parsed.stimulusBlocks.map((block,index)=><JoinedBlock key={`stimulus-${index}`} lines={block}/>)}</div>)}
    {parsed.stem&&<p className="reading-question-stem"><AlexRichText text={parsed.stem}/></p>}
    {parsed.choices.length>0&&<div className="reading-answer-options" role="list" aria-label="Answer choices">
      {parsed.choices.map(choice=><div className="reading-answer-choice" role="listitem" key={choice.label}>
        <span className="reading-choice-label" aria-hidden="true">{choice.label})</span>
        <span className="reading-choice-text"><AlexRichText text={choice.text}/></span>
      </div>)}
    </div>}
  </div>
}
