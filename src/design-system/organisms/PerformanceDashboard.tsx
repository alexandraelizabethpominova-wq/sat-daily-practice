import {BarChart3,BookOpen,Clock3,Target} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import MetricCard from '../molecules/MetricCard'
import type {PerformanceSummary} from '../../lib/practiceGamification'

type Props={summary:PerformanceSummary;hasHistory:boolean;onClearHistory?:()=>void;compact?:boolean}

export default function PerformanceDashboard({summary,hasHistory,onClearHistory,compact=false}:Props){
  return <AlexBox>
    {!compact&&<AlexBox sx={{display:'flex',justifyContent:'space-between',alignItems:{xs:'flex-start',md:'flex-end'},gap:2,flexDirection:{xs:'column',md:'row'}}}>
      <AlexBox><AlexText sx={{fontSize:12,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:800,color:'#6558F5'}}>Performance</AlexText><AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:32,md:46},lineHeight:1.08,my:1,color:'#08275B'}}>Your practice trends</AlexText></AlexBox>
      {hasHistory&&onClearHistory&&<AlexButton tone="secondary" onClick={onClearHistory}>Clear history & start fresh</AlexButton>}
    </AlexBox>}
    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr',lg:'repeat(4,1fr)'},gap:1.75,mt:compact?0:2.5}}>
      <MetricCard icon={<Target/>} label="Accuracy" value={hasHistory?`${summary.accuracy}%`:'—'}/>
      <MetricCard icon={<Clock3/>} label="Avg. time" value={hasHistory?formatMs(summary.averageMs):'—'}/>
      <MetricCard icon={<BookOpen/>} label="Sessions" value={String(summary.sessions)}/>
      <MetricCard icon={<BarChart3/>} label="Questions seen" value={`${summary.questionsSeen}/${summary.totalQuestions}`}/>
    </AlexBox>
    {!hasHistory&&!compact&&<AlexSurface sx={{p:3.5,mt:2.5,border:'1px solid #E6E2DB',borderRadius:3}}><AlexText component="h2" sx={{fontSize:22,fontWeight:750,mb:1}}>Fresh start</AlexText><AlexText sx={{color:'#667085'}}>No practice history is stored yet. Your next session will begin building new statistics.</AlexText></AlexSurface>}
  </AlexBox>
}

function formatMs(ms:number){
  const seconds=Math.round(ms/1000)
  return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${seconds%60}s`
}
