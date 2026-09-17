import {ChevronLeft,ChevronRight} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexText from '../atoms/AlexText'
import PracticeProgress from '../molecules/PracticeProgress'

type Props={
  moduleLabel:string
  subjectLabel:string
  current:number
  total:number
  canGoPrevious:boolean
  canGoNext:boolean
  isLast:boolean
  onPrevious:()=>void
  onNext:()=>void
}

export default function PracticeSessionHeader({moduleLabel,subjectLabel,current,total,canGoPrevious,canGoNext,isLast,onPrevious,onNext}:Props){
  return <AlexBox component="header" className="practice-topbar">
    <AlexBox className="practice-title"><AlexText component="span">SAT PRACTICE</AlexText><AlexText component="b">{moduleLabel}</AlexText></AlexBox>
    <AlexBox className="progress-block"><PracticeProgress label={subjectLabel} current={current} total={total}/></AlexBox>
    <AlexBox className="question-nav">
      <AlexButton tone="secondary" startIcon={<ChevronLeft size={18}/>} onClick={onPrevious} disabled={!canGoPrevious}>Previous</AlexButton>
      <AlexButton endIcon={<ChevronRight size={18}/>} onClick={onNext} disabled={!canGoNext}>{isLast?'Finish':'Next'}</AlexButton>
    </AlexBox>
  </AlexBox>
}
