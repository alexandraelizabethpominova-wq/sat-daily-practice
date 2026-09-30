import type {ReactNode} from 'react'
import DashboardCard,{type DashboardCardTone} from './DashboardCard'

type MetricTone='default'|'blue'|'cream'|'lavender'|'green'|'peach'
type Props={icon:ReactNode;label:string;value:string;tone?:MetricTone;compact?:boolean;valueColor?:string;valueFontSize?:number}

const toneMap:Record<MetricTone,DashboardCardTone>={
  default:'white',
  blue:'blue',
  cream:'cream',
  lavender:'lavender',
  green:'green',
  peach:'peach',
}

export default function MetricCard({icon,label,value,tone='default',compact=false,valueColor,valueFontSize}:Props){
  return <DashboardCard
    tone={toneMap[tone]}
    variant={compact?'metric':'hero'}
    icon={icon}
    title={label}
    value={value}
    valueColor={valueColor}
    sx={{
      height:compact?'100%':undefined,
      minHeight:compact?{xs:160,sm:0}:undefined,
      boxShadow:'0 8px 24px rgba(9,35,79,.035)',
      ...(valueFontSize?{'& > div:nth-of-type(2)':{fontSize:valueFontSize}}:{}),
    }}
  />
}
