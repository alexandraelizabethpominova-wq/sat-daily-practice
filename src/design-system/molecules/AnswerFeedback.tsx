import {CheckCircle2,XCircle} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexStack from '../atoms/AlexStack'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={correct:boolean;acceptedAnswer:string;elapsedLabel:string}

export default function AnswerFeedback({correct,acceptedAnswer,elapsedLabel}:Props){
  const tone=correct?{bg:'#ECFDF3',fg:'#027A48',icon:<CheckCircle2 size={18}/>}:{bg:'#FEF3F2',fg:'#B42318',icon:<XCircle size={18}/>}
  return <AlexSurface role="status" sx={{p:1.6,borderRadius:2.5,bgcolor:tone.bg,color:tone.fg}}>
    <AlexStack spacing={.65}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.8}}>{tone.icon}<AlexText component="b" sx={{fontWeight:850}}>{correct?'Correct':'Not quite'}</AlexText></AlexBox>
      <AlexText sx={{fontSize:13.5}}>Accepted answer: <b>{acceptedAnswer}</b></AlexText>
      <AlexText sx={{fontSize:13.5}}>Time: <b>{elapsedLabel}</b></AlexText>
    </AlexStack>
  </AlexSurface>
}
