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
    <AlexBox className="practice-title">
      <AlexText component="span">SAT PRACTICE</AlexText>
      <AlexText component="b">{moduleLabel}</AlexText>
    </AlexBox>
    <AlexBox className="progress-block"><PracticeProgress label={subjectLabel} current={current} total={total}/></AlexBox>
    <AlexBox className="question-nav">
      <AlexButton
        aria-label="Previous question"
        tone="secondary"
        startIcon={<ChevronLeft size={18}/>}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        sx={{minWidth:{xs:42,sm:'auto'},px:{xs:1.05,sm:2}}}
      >
        <AlexBox component="span" sx={{display:{xs:'none',sm:'inline'}}}>Previous</AlexBox>
      </AlexButton>
      <AlexButton
        aria-label={isLast?'Finish practice':'Next question'}
        endIcon={<ChevronRight size={18}/>}
        onClick={onNext}
        disabled={!canGoNext}
        sx={{minWidth:{xs:42,sm:'auto'},px:{xs:1.05,sm:2}}}
      >
        <AlexBox component="span" sx={{display:{xs:'none',sm:'inline'}}}>{isLast?'Finish':'Next'}</AlexBox>
      </AlexButton>
    </AlexBox>
  </AlexBox>
}
