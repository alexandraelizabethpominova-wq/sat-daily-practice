import AlexRichText from '../atoms/AlexRichText'
import ReadingDataTable from './ReadingDataTable'
import {READING_PARAGRAPH_BREAK} from '../../lib/readingQuestionFormat'
import {readingTableSpec} from '../../lib/readingTables'

const LABELED_CHOICE=/^([A-D])(?:[.)]\s*|\s+)(.+)$/i
const QUESTION_STEM=/^(Which|What|How|Why|According to|Based on|As used in|The student wants|To which|Which finding|Which quotation|Which choice|Which statement|Which response|The passage|The text|The main purpose|The author|The speaker)\b/i
const INTRO_START=/^The following text is (?:from|adapted from)\b/i

export type ReadingChoice={label:string;text:string}
export type ParsedReadingQuestion={intro:string[];stimulusBlocks:string[][];stem:string;choices:ReadingChoice[];isQuote:boolean;isVerse:boolean}

function clean(value:string){return value.replace(/\s+/g,' ').trim()}
function isBreak(value:string){return value===READING_PARAGRAPH_BREAK}
function choiceMatch(value:string){return clean(value).match(LABELED_CHOICE)}

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

function firstChoiceIndex(source:string[]){
  return source.findIndex(line=>!isBreak(line)&&Boolean(choiceMatch(line)))
}

function stemStart(source:string[],choiceIndex:number){
  const end=choiceIndex>=0?choiceIndex:source.length
  for(let index=end-1;index>=0;index--){if(!isBreak(source[index])&&QUESTION_STEM.test(clean(source[index])))return index}
  for(let index=end-1;index>=0;index--){if(!isBreak(source[index])&&/[?]$/.test(clean(source[index])))return index}
  return Math.max(0,end-1)
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

function parseChoices(lines:string[]){
  const choices:ReadingChoice[]=[]
  let current:ReadingChoice|null=null
  for(const raw of lines){
    if(isBreak(raw))continue
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
  const choiceIndex=firstChoiceIndex(source)
  const start=stemStart(source,choiceIndex)
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
  const stemEnd=choiceIndex>=0?choiceIndex:source.length
  const stem=source.slice(start,stemEnd).filter(line=>!isBreak(line)).map(clean).join(' ')
  const choices=choiceIndex>=0?parseChoices(source.slice(choiceIndex)):[]
  const isVerse=looksLikeVerse(intro)
  return {intro,stimulusBlocks,stem,choices,isVerse,isQuote:Boolean(intro.length)||isVerse||explicitlyQuoted(stimulusBlocks)}
}

export function hasCompleteReadingChoices(lines:string[]){return parseReadingQuestion(lines).choices.map(choice=>choice.label).join('')==='ABCD'}

function JoinedBlock({lines}:{lines:string[]}){return <p><AlexRichText text={lines.map(clean).join(' ')}/></p>}

export default function ReadingQuestionLines({lines,questionId}:{lines:string[];questionId?:string}){
  const parsed=parseReadingQuestion(lines)
  const table=questionId?readingTableSpec(questionId):undefined
  return <div className="reading-question-content">
    {table&&<ReadingDataTable table={table}/>} 
    {parsed.intro.length>0&&<div className="reading-intro">{splitBlocks(parsed.intro).map((block,index)=><JoinedBlock key={`intro-${index}`} lines={block}/>)}</div>}
    {parsed.stimulusBlocks.length>0&&(parsed.isQuote
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
