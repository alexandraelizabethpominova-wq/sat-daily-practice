import type {ReactNode} from 'react'
import type {SxProps,Theme} from '@mui/material/styles'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import {dashboardCardTokens,dashboardTypography} from '../theme'

export type DashboardCardTone='blue'|'cream'|'green'|'peach'|'lavender'|'yellow'|'white'
export type DashboardCardVariant='metric'|'summary'|'mini'

type Props={
  tone:DashboardCardTone
  variant?:DashboardCardVariant
  icon?:ReactNode
  title:string
  value?:ReactNode
  subtitle?:ReactNode
  trailing?:ReactNode
  valueColor?:string
  sx?:SxProps<Theme>
}

const TONES:Record<DashboardCardTone,{bg:string;border:string;icon:string;title:string}>={
  blue:{bg:'#EEF6FF',border:'#D8E9FB',icon:'#286BA9',title:'#5B6575'},
  cream:{bg:'#FFF9E8',border:'#F2E4B8',icon:'#8A6818',title:'#5B6575'},
  green:{bg:'#EEFAE9',border:'#D8EDD0',icon:'#4E7C3E',title:'#5B6575'},
  peach:{bg:'#FFF1E8',border:'#F1DDD0',icon:'#A65D32',title:'#5B6575'},
  lavender:{bg:'#F5EEFF',border:'#E5D8F8',icon:'#7553A4',title:'#66428A'},
  yellow:{bg:'#FFF9DD',border:'#F2E4B8',icon:'#6B5A12',title:'#6B5A12'},
  white:{bg:'#FFFFFF',border:'#E4E7EC',icon:'#6558F5',title:'#5B6575'},
}

export default function DashboardCard({tone,variant='metric',icon,title,value,subtitle,trailing,valueColor,sx}:Props){
  const palette=TONES[tone]
  const iconBox=dashboardCardTokens.iconBox[variant]
  const iconSize=dashboardCardTokens.iconSize[variant]
  const valueSize=variant==='metric'
    ?dashboardTypography.metricValue
    :variant==='summary'
      ?dashboardTypography.heroScore
      :dashboardTypography.supportTitle

  return <AlexSurface sx={{
    position:'relative',
    minWidth:0,
    minHeight:0,
    height:'100%',
    border:`1px solid ${palette.border}`,
    borderRadius:dashboardCardTokens.radius,
    bgcolor:palette.bg,
    boxShadow:'none',
    p:dashboardCardTokens.padding[variant],
    display:'flex',
    flexDirection:'column',
    gap:dashboardCardTokens.gap,
    overflow:'hidden',
    ...sx,
  }}>
    <AlexBox sx={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:1,minWidth:0}}>
      <AlexBox sx={{display:'flex',alignItems:'center',gap:.6,minWidth:0}}>
        {icon&&<AlexBox sx={{
          width:iconBox,
          height:iconBox,
          flex:'0 0 auto',
          borderRadius:'50%',
          display:'grid',
          placeItems:'center',
          bgcolor:'rgba(255,255,255,.76)',
          color:palette.icon,
          '& svg':{width:iconSize,height:iconSize},
        }}>{icon}</AlexBox>}
        <AlexText sx={{
          minWidth:0,
          color:palette.title,
          fontSize:dashboardTypography.cardTitle,
          lineHeight:1.2,
          fontWeight:850,
          textTransform:'uppercase',
          letterSpacing:'.075em',
        }}>{title}</AlexText>
      </AlexBox>
      {trailing}
    </AlexBox>

    {value!==undefined&&<AlexText component="div" sx={{
      fontFamily:'Georgia, "Times New Roman", serif',
      fontSize:valueSize,
      lineHeight:1,
      letterSpacing:'-.02em',
      fontWeight:700,
      color:valueColor??'#08275B',
      minWidth:0,
    }}>{value}</AlexText>}

    {subtitle!==undefined&&<AlexText component="div" sx={{
      color:'#667085',
      fontSize:dashboardTypography.supportBody,
      lineHeight:1.35,
      minWidth:0,
    }}>{subtitle}</AlexText>}
  </AlexSurface>
}
