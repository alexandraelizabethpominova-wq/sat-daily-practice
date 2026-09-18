import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={
  title:string
  questionCount:number
  practicedCount:number
  onStart:()=>void
}

export default function PracticeTestCard({title,questionCount,practicedCount,onStart}:Props){
  return <AlexSurface sx={{p:2.25,border:'1px solid #E4E7EC',borderRadius:2.5,bgcolor:'#fff',display:'grid',gap:1.5}}>
    <AlexBox>
      <AlexText component="h3" sx={{m:0,fontSize:18,fontWeight:800,color:'#08275B'}}>{title}</AlexText>
      <AlexText sx={{mt:.45,fontSize:13.5,color:'#667085'}}>
        {questionCount} questions · {practicedCount} practiced
      </AlexText>
    </AlexBox>
    <AlexButton onClick={onStart}>Start</AlexButton>
  </AlexSurface>
}
