import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type MetricTone='default'|'blue'|'cream'|'lavender'|'green'|'peach'
type Props={icon:ReactNode;label:string;value:string;tone?:MetricTone;compact?:boolean}

const TONES:Record<MetricTone,{bg:string;border:string;icon:string}>={
  default:{bg:'#fff',border:'#E6E2DB',icon:'#6558F5'},
  blue:{bg:'#EEF6FF',border:'#D8E9FB',icon:'#286BA9'},
  cream:{bg:'#FFF9E8',border:'#F2E4B8',icon:'#8A6818'},
  lavender:{bg:'#F5EEFF',border:'#E5D8F8',icon:'#7553A4'},
  green:{bg:'#EEFAE9',border:'#D8EDD0',icon:'#4E7C3E'},
  peach:{bg:'#FFF1E8',border:'#F1DDD0',icon:'#A65D32'},
}

export default function MetricCard({icon,label,value,tone='default',compact=false}:Props){
  const palette=TONES[tone]
  return <AlexSurface sx={{p:compact?1.45:2.2,border:`1px solid ${palette.border}`,borderRadius:3,boxShadow:'0 8px 24px rgba(9,35,79,.035)',bgcolor:palette.bg}}>
    <AlexBox sx={{display:'grid',placeItems:'center',width:compact?28:32,height:compact?28:32,borderRadius:'50%',bgcolor:'rgba(255,255,255,.72)',color:palette.icon,'& svg':{width:compact?17:20,height:compact?17:20}}}>{icon}</AlexBox>
    <AlexText sx={{mt:compact ? .7 : 1,color:'#667085',fontSize:compact?12.5:14}}>{label}</AlexText>
    <AlexText component="b" sx={{display:'block',mt:compact ? .2 : .5,fontSize:compact?21:26,fontWeight:850,color:'#08275B'}}>{value}</AlexText>
  </AlexSurface>
}
