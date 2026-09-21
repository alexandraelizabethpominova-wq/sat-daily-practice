import {BarChart3,BookOpen,Clock3,Target,TrendingUp} from 'lucide-react'
import AlexBarChart from '../atoms/AlexBarChart'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexLineChart from '../atoms/AlexLineChart'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import MetricCard from '../molecules/MetricCard'
import PerformanceChartCard from '../molecules/PerformanceChartCard'
import QuestionStatsTable from '../molecules/QuestionStatsTable'
import type {PerformanceAnalytics} from '../../lib/performanceAnalytics'

type Props={summary:PerformanceAnalytics;hasHistory:boolean;onClearHistory?:()=>void;compact?:boolean;questionsPdf?:ArrayBuffer|null;answersPdf?:ArrayBuffer|null}

const chartTheme={
  text:{fontSize:12,fill:'#475467'},
  axis:{ticks:{text:{fontSize:11,fill:'#667085'}},legend:{text:{fontSize:12,fill:'#475467'}}},
  grid:{line:{stroke:'#ECE8E1',strokeWidth:1}},
  tooltip:{container:{fontSize:12,borderRadius:8,boxShadow:'0 8px 30px rgba(16,24,40,.14)'}},
}

export default function PerformanceDashboard({summary,hasHistory,onClearHistory,compact=false,questionsPdf=null,answersPdf=null}:Props){
  const sectionAccuracy=summary.sections.filter(section=>section.attempts>0).map(section=>({section:section.label,success:section.successRate}))
  const sectionTime=summary.sections.filter(section=>section.attempts>0).map(section=>({section:section.label,seconds:Math.round(section.averageMs/1000)}))
  const questionStats=summary.questions.slice(0,18)
  const questionAccuracy=questionStats.map(question=>({question:`${question.subject==='math'?'Math':'R&W'} Q${question.questionNumber}`,success:question.successRate}))
  const questionTime=questionStats.map(question=>({question:`${question.subject==='math'?'Math':'R&W'} Q${question.questionNumber}`,seconds:Math.round(question.averageMs/1000)}))
  const sessionAccuracy=[{id:'Accuracy',data:summary.sessionMetrics.map((session,index)=>({x:`S${index+1}`,y:session.accuracy}))}]
  const scoreTrend=[{id:'Practice score estimate',data:summary.scoreTrend.map((point,index)=>({x:`S${index+1}`,y:point.score}))}]
  const latestDelta=summary.scoreTrend.length?summary.scoreTrend[summary.scoreTrend.length-1].delta:0

  if(compact)return <AlexBox sx={{display:'grid',gap:1.25,minWidth:0}}>
    <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:1.15}}>
      <MetricCard compact tone="blue" icon={<Target/>} label="Accuracy" value={hasHistory?`${summary.accuracy}%`:'—'}/>
      <MetricCard compact tone="cream" icon={<Clock3/>} label="Avg. time" value={hasHistory?formatMs(summary.averageMs):'—'}/>
      <MetricCard compact tone="green" icon={<BarChart3/>} label="Questions seen" value={`${summary.questionsSeen}/${summary.totalQuestions}`}/>
      <MetricCard compact tone="peach" icon={<TrendingUp/>} label="Score estimate" value={summary.latestScoreEstimate?String(summary.latestScoreEstimate):'—'}/>
    </AlexBox>
    {hasHistory&&summary.recommendation&&<AlexSurface sx={{p:1.7,border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#F7F5FF'}}>
      <AlexText sx={{fontSize:10.5,fontWeight:850,textTransform:'uppercase',letterSpacing:'.09em',color:'#6558F5'}}>Recommended focus</AlexText>
      <AlexText component="h2" sx={{fontSize:18,fontWeight:800,color:'#08275B',mt:.35}}>{summary.recommendation.label}</AlexText>
      <AlexText sx={{color:'#475467',fontSize:12.5,lineHeight:1.45,mt:.45}}>{summary.recommendation.reason}</AlexText>
    </AlexSurface>}
  </AlexBox>

  return <AlexBox>
    {!compact&&<AlexBox sx={{display:'flex',justifyContent:'space-between',alignItems:{xs:'flex-start',md:'flex-end'},gap:2,flexDirection:{xs:'column',md:'row'}}}>
      <AlexBox>
        <AlexText sx={{fontSize:12,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:800,color:'#6558F5'}}>Performance</AlexText>
        <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:32,md:46},lineHeight:1.08,my:1,color:'#08275B'}}>Your practice trends</AlexText>
        <AlexText sx={{color:'#667085',maxWidth:720}}>Track success rate, response time, repeat attempts, session progress, and a practice-only score estimate from your own history.</AlexText>
      </AlexBox>
      {hasHistory&&onClearHistory&&<AlexButton tone="secondary" onClick={onClearHistory}>Clear history & start fresh</AlexButton>}
    </AlexBox>}

    <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr',lg:'repeat(5,1fr)'},gap:1.75,mt:compact?0:2.5}}>
      <MetricCard tone={compact?'blue':'default'} icon={<Target/>} label="Accuracy" value={hasHistory?`${summary.accuracy}%`:'—'}/>
      <MetricCard tone={compact?'cream':'default'} icon={<Clock3/>} label="Avg. time" value={hasHistory?formatMs(summary.averageMs):'—'}/>
      <MetricCard tone={compact?'lavender':'default'} icon={<BookOpen/>} label="Sessions" value={String(summary.sessions)}/>
      <MetricCard tone={compact?'green':'default'} icon={<BarChart3/>} label="Questions seen" value={`${summary.questionsSeen}/${summary.totalQuestions}`}/>
      <MetricCard tone={compact?'peach':'default'} icon={<TrendingUp/>} label="Score estimate" value={summary.latestScoreEstimate?String(summary.latestScoreEstimate):'—'}/>
    </AlexBox>

    {!hasHistory&&!compact&&<AlexSurface sx={{p:3.5,mt:2.5,border:'1px solid #E6E2DB',borderRadius:3}}>
      <AlexText component="h2" sx={{fontSize:22,fontWeight:750,mb:1}}>Fresh start</AlexText>
      <AlexText sx={{color:'#667085'}}>No practice history is stored yet. Your next session will begin building question, section, timing, and session statistics.</AlexText>
    </AlexSurface>}

    {hasHistory&&summary.recommendation&&<AlexSurface sx={{p:{xs:2.25,md:2.75},mt:2.5,border:'1px solid #D8D2FF',borderRadius:3,bgcolor:'#F7F5FF'}}>
      <AlexText sx={{fontSize:12,fontWeight:850,textTransform:'uppercase',letterSpacing:'.09em',color:'#6558F5'}}>Recommended focus</AlexText>
      <AlexText component="h2" sx={{fontSize:22,fontWeight:800,color:'#08275B',mt:.5}}>{summary.recommendation.label}</AlexText>
      <AlexText sx={{color:'#475467',mt:.75}}>{summary.recommendation.reason}</AlexText>
    </AlexSurface>}

    {hasHistory&&!compact&&<>
      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',lg:'1fr 1fr'},gap:2,mt:2.5}}>
        <PerformanceChartCard title="Success by section" description="Correct answers as a percentage of all attempts in each section.">
          <AlexBarChart
            data={sectionAccuracy}
            keys={['success']}
            indexBy="section"
            margin={{top:10,right:20,bottom:52,left:54}}
            padding={0.36}
            valueScale={{type:'linear',min:0,max:100}}
            colors={['#6558F5']}
            borderRadius={5}
            enableGridY
            enableLabel
            label={value=>`${value.value}%`}
            axisBottom={{legend:'Section',legendPosition:'middle',legendOffset:42}}
            axisLeft={{legend:'Success %',legendPosition:'middle',legendOffset:-44}}
            theme={chartTheme}
            role="img"
            ariaLabel="Success rate by SAT section"
          />
        </PerformanceChartCard>
        <PerformanceChartCard title="Average time by section" description="Average response time across all attempts.">
          <AlexBarChart
            data={sectionTime}
            keys={['seconds']}
            indexBy="section"
            margin={{top:10,right:20,bottom:52,left:58}}
            padding={0.36}
            colors={['#12B76A']}
            borderRadius={5}
            enableLabel
            label={value=>`${value.value}s`}
            axisBottom={{legend:'Section',legendPosition:'middle',legendOffset:42}}
            axisLeft={{legend:'Seconds',legendPosition:'middle',legendOffset:-46}}
            theme={chartTheme}
            role="img"
            ariaLabel="Average response time by SAT section"
          />
        </PerformanceChartCard>
      </AlexBox>

      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',lg:'1fr 1fr'},gap:2,mt:2}}>
        <PerformanceChartCard title="Session success trend" description="Accuracy for each completed practice session.">
          <AlexLineChart
            data={sessionAccuracy}
            margin={{top:20,right:25,bottom:52,left:54}}
            xScale={{type:'point'}}
            yScale={{type:'linear',min:0,max:100,stacked:false,reverse:false}}
            curve="monotoneX"
            colors={['#6558F5']}
            lineWidth={3}
            pointSize={8}
            pointBorderWidth={2}
            useMesh
            enableArea
            areaOpacity={0.08}
            axisBottom={{legend:'Session',legendPosition:'middle',legendOffset:40}}
            axisLeft={{legend:'Accuracy %',legendPosition:'middle',legendOffset:-44}}
            theme={chartTheme}
            ariaLabel="Accuracy trend by practice session"
          />
        </PerformanceChartCard>
        <PerformanceChartCard title="Practice score estimate" description={summary.latestScoreEstimate?`Latest estimate ${summary.latestScoreEstimate}${latestDelta===0?'':` · ${latestDelta>0?'+':''}${latestDelta} since the prior scored session`}. This is a practice trend, not an official College Board score.`:'Complete at least 3 attempts in both sections to begin a practice score trend.'}>
          {scoreTrend[0].data.length?<AlexLineChart
            data={scoreTrend}
            margin={{top:20,right:25,bottom:52,left:58}}
            xScale={{type:'point'}}
            yScale={{type:'linear',min:400,max:1600,stacked:false,reverse:false}}
            curve="monotoneX"
            colors={['#F79009']}
            lineWidth={3}
            pointSize={8}
            pointBorderWidth={2}
            useMesh
            axisBottom={{legend:'Session',legendPosition:'middle',legendOffset:40}}
            axisLeft={{legend:'Estimated score',legendPosition:'middle',legendOffset:-48}}
            theme={chartTheme}
            ariaLabel="Practice SAT score estimate trend"
          />:<EmptyChart message="Not enough cross-section history yet."/>}
        </PerformanceChartCard>
      </AlexBox>

      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',xl:'1fr 1fr'},gap:2,mt:2}}>
        <PerformanceChartCard title="Question success" description="Weakest attempted questions first. Repeat attempts are included in each success rate." minHeight={Math.max(340,questionAccuracy.length*30)}>
          <AlexBarChart
            data={questionAccuracy}
            keys={['success']}
            indexBy="question"
            layout="horizontal"
            margin={{top:10,right:34,bottom:48,left:92}}
            padding={0.28}
            valueScale={{type:'linear',min:0,max:100}}
            colors={['#6558F5']}
            borderRadius={4}
            enableLabel
            label={value=>`${value.value}%`}
            axisBottom={{legend:'Success %',legendPosition:'middle',legendOffset:38}}
            axisLeft={{tickSize:0,tickPadding:8}}
            theme={chartTheme}
            role="img"
            ariaLabel="Success rate by question"
          />
        </PerformanceChartCard>
        <PerformanceChartCard title="Time by question" description="Average time spent on the same attempted questions." minHeight={Math.max(340,questionTime.length*30)}>
          <AlexBarChart
            data={questionTime}
            keys={['seconds']}
            indexBy="question"
            layout="horizontal"
            margin={{top:10,right:34,bottom:48,left:92}}
            padding={0.28}
            colors={['#12B76A']}
            borderRadius={4}
            enableLabel
            label={value=>`${value.value}s`}
            axisBottom={{legend:'Average seconds',legendPosition:'middle',legendOffset:38}}
            axisLeft={{tickSize:0,tickPadding:8}}
            theme={chartTheme}
            role="img"
            ariaLabel="Average response time by question"
          />
        </PerformanceChartCard>
      </AlexBox>

      <AlexBox sx={{mt:2}}><QuestionStatsTable questions={summary.questions} questionsPdf={questionsPdf} answersPdf={answersPdf}/></AlexBox>
    </>}
  </AlexBox>
}

function EmptyChart({message}:{message:string}){
  return <AlexBox sx={{height:'100%',display:'grid',placeItems:'center',textAlign:'center',px:3}}><AlexText sx={{color:'#667085'}}>{message}</AlexText></AlexBox>
}

function formatMs(ms:number){
  const seconds=Math.round(ms/1000)
  return seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m ${seconds%60}s`
}
