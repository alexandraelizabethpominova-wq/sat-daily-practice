import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type MetricTone='default'|'blue'|'cream'|'lavender'|'green'|'peach'
type Props={icon:ReactNode;label:string;value:string;tone?:MetricTone;compact?:boolean}

const TONES:Record<MetricTone,{bg:string;border:string;icon:string}>={
  default:{bg:'#fff',border:'#E6E1F2',icon:'#6D5DFB'},
  blue:{bg:'#EAF4FF',border:'#BBDDF8',icon:'#357EB8'},
  cream:{bg:'#FFF7D9',border:'#F1D97D',icon:'#806014'},
  lavender:{bg:'#EEE9FF',border:'#CFC5FF',icon:'#6D5DFB'},
  green:{bg:'#DFF8ED',border:'#A7E6C9',icon:'#2C8B67'},
  peach:{bg:'#FFE9E3',border:'#F4B9AA',icon:'#C65B45'},
}

export default function MetricCard({icon,label,value,tone='default',compact=false}:Props){
  const palette=TONES[tone]
  return <AlexSurface sx={{
    p:compact?2:2.2,
    minHeight:compact?158:undefined,
    border:`1px solid ${palette.border}`,
    borderRadius:4,
    boxShadow:'0 5px 0 rgba(57,43,105,.08)',
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
      fontFamily:compact?'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif':'inherit',
      fontSize:compact?36:26,
      lineHeight:1,
      letterSpacing:compact?'-.025em':0,
      fontWeight:compact?700:850,
      color:'#251B4B',
    }}>{value}</AlexText>
  </AlexSurface>
}
