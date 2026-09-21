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
  return <AlexSurface sx={{p:2.25,border:'2px solid #E6E1F2',borderRadius:3.5,bgcolor:'#fff',display:'grid',gap:1.5,boxShadow:'0 5px 0 #E9E4F4',transition:'transform .14s ease, box-shadow .14s ease','&:hover':{transform:'translateY(-2px)',boxShadow:'0 7px 0 #DCD5EC'}}}>
    <AlexBox>
      <AlexText component="h3" sx={{m:0,fontSize:18,fontWeight:800,color:'#251B4B'}}>{title}</AlexText>
      <AlexText sx={{mt:.45,fontSize:13.5,color:'#6D6785'}}>
        {questionCount} questions · {practicedCount} practiced
      </AlexText>
    </AlexBox>
    <AlexButton onClick={onStart}>Lock in</AlexButton>
  </AlexSurface>
}
