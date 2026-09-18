import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import PracticeTestCard from '../molecules/PracticeTestCard'
import type {PracticeTestFilter} from '../../types'

type TestSummary={
  value:PracticeTestFilter
  label:string
  questionCount:number
  practicedCount:number
}

type Props={
  tests:TestSummary[]
  sessionSummary:string
  onStartTest:(value:PracticeTestFilter)=>void
  onOpenSetup:()=>void
}

export default function PracticeTestsDashboard({tests,sessionSummary,onStartTest,onOpenSetup}:Props){
  return <AlexBox component="section" sx={{width:'100%',px:{xs:2.5,sm:4,lg:5.5},py:{xs:3,lg:4.2}}}>
    <AlexBox sx={{maxWidth:960,mx:'auto'}}>
      <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:30,lg:36},fontWeight:500,lineHeight:1.12,m:0,color:'#08275B'}}>Practice tests</AlexText>
      <AlexText sx={{fontSize:15,color:'#667085',mt:1}}>Pick a question source and start with your current session setup.</AlexText>

      <AlexSurface sx={{mt:3,p:2,border:'1px solid #E4E7EC',borderRadius:2.5,bgcolor:'#F8FAFC',display:'flex',alignItems:{xs:'flex-start',sm:'center'},justifyContent:'space-between',gap:2,flexDirection:{xs:'column',sm:'row'}}}>
        <AlexBox>
          <AlexText sx={{fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:'.06em',color:'#667085'}}>Current setup</AlexText>
          <AlexText sx={{mt:.35,fontSize:14.5,fontWeight:700,color:'#08275B'}}>{sessionSummary}</AlexText>
        </AlexBox>
        <AlexButton tone="secondary" onClick={onOpenSetup}>Edit setup</AlexButton>
      </AlexSurface>

      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',md:'repeat(2,minmax(0,1fr))'},gap:1.5,mt:2}}>
        {tests.map(test=><PracticeTestCard
          key={test.value}
          title={test.label}
          questionCount={test.questionCount}
          practicedCount={test.practicedCount}
          onStart={()=>onStartTest(test.value)}
        />)}
      </AlexBox>
    </AlexBox>
  </AlexBox>
}
