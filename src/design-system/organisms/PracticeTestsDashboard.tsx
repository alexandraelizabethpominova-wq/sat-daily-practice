import {Box,Divider,Typography} from '@mui/material'
import type {ReactNode} from 'react'
import PracticeOptionCard from '../molecules/PracticeOptionCard'

type Props={
  questionCount:number
  mixedAction:ReactNode
  readingAction:ReactNode
  mathAction:ReactNode
}

const FullIcon=()=> <Box sx={{width:22,height:22,borderRadius:'50%',bgcolor:'#C7DFFF'}}/>
const SectionIcon=()=> <Box sx={{width:22,height:22,borderRadius:'50%',border:'3px solid #BFD9FF',position:'relative',overflow:'hidden'}}><Box sx={{position:'absolute',inset:'-3px -3px -3px 50%',bgcolor:'#D8E8FF'}}/></Box>

export default function PracticeTestsDashboard({questionCount,mixedAction,readingAction,mathAction}:Props){
  return <Box component="section" sx={{width:'100%',px:{xs:2.5,sm:4,lg:5.5},py:{xs:3,lg:4.2}}}>
    <Box sx={{maxWidth:1010,mx:'auto'}}>
      <Box>
        <Typography component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:30,lg:34},fontWeight:500,lineHeight:1.12,mb:1.4,color:'#08275B'}}>SAT Practice Tests</Typography>
        <Typography sx={{fontSize:{xs:15,lg:16},lineHeight:1.55,color:'#16315D',maxWidth:930}}>Take focused SAT practice tests, review your performance, and keep working on the questions that need the most attention.</Typography>
      </Box>
      <Divider sx={{my:4,borderColor:'#D8D5CF'}}/>
      <Box>
        <Typography component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:25,lg:28},fontWeight:500,lineHeight:1.2,mb:.35,color:'#08275B'}}>Practice Test Options</Typography>
        <Typography sx={{fontSize:14.5,color:'#16315D'}}>Choose a full mixed session or focus on one SAT section.</Typography>
        <Box sx={{display:'grid',gridTemplateColumns:{xs:'1fr',lg:'1fr 1fr'},gap:2.5,mt:3}}>
          <PracticeOptionCard title="Full practice session" description="Reading & Writing + Math" icon={<FullIcon/>} actions={[{status:'READY',title:'Start mixed SAT practice',detail:`${questionCount} questions using your adaptive question pool`,action:mixedAction}]} />
          <PracticeOptionCard title="Single section practice" description="Focus on one section at a time" icon={<SectionIcon/>} actions={[{status:'READY',title:'Reading & Writing practice',compact:true,action:readingAction},{status:'READY',title:'Math practice',compact:true,action:mathAction}]} />
        </Box>
      </Box>
    </Box>
  </Box>
}
