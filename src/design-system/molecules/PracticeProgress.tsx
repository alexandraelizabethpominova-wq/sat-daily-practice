import AlexBox from '../atoms/AlexBox'
import AlexProgress from '../atoms/AlexProgress'
import AlexText from '../atoms/AlexText'

type Props={label:string;current:number;total:number}

export default function PracticeProgress({label,current,total}:Props){
  const value=total?Math.min(100,Math.max(0,current/total*100)):0
  return <AlexBox sx={{minWidth:0,width:'100%'}}>
    <AlexBox sx={{display:'flex',justifyContent:'space-between',gap:2,alignItems:'center'}}>
      <AlexText component="b" sx={{fontSize:13.5,fontWeight:800,color:'#08275B'}}>{label}</AlexText>
      <AlexText sx={{fontSize:13,color:'#687386'}}>Question {current} of {total}</AlexText>
    </AlexBox>
    <AlexProgress value={value} aria-label={`${label} progress`} sx={{mt:.8,height:4,borderRadius:999,bgcolor:'#D9DEE7','& .MuiLinearProgress-bar':{bgcolor:'#0C3974'}}}/>
  </AlexBox>
}
