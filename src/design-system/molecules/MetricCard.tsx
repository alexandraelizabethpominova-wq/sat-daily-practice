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
  return <AlexSurface sx={{
    p:compact?2:2.2,
    minHeight:compact?158:undefined,
    border:`1px solid ${palette.border}`,
    borderRadius:3,
    boxShadow:'0 8px 24px rgba(9,35,79,.035)',
    bgcolor:palette.bg,
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
  }}>
    <AlexBox sx={{
      display:'grid',
      placeItems:'center',
      width:compact?27:32,
      height:compact?27:32,
      borderRadius:'50%',
      bgcolor:'rgba(255,255,255,.76)',
      color:palette.icon,
      '& svg':{width:compact?16:20,height:compact?16:20},
    }}>{icon}</AlexBox>
    <AlexText sx={{
      mt:compact?1.65:1,
      color:compact?'#5B6575':'#667085',
      fontSize:compact?10.5:14,
      lineHeight:1.2,
      fontWeight:compact?800:400,
      textTransform:compact?'uppercase':'none',
      letterSpacing:compact?'.075em':0,
    }}>{label}</AlexText>
    <AlexText component="b" sx={{
      display:'block',
      mt:compact ? .55 : .5,
      fontFamily:compact?'Georgia, "Times New Roman", serif':'inherit',
      fontSize:compact?36:26,
      lineHeight:1,
      letterSpacing:compact?'-.025em':0,
      fontWeight:compact?700:850,
      color:'#08275B',
    }}>{value}</AlexText>
  </AlexSurface>
}
