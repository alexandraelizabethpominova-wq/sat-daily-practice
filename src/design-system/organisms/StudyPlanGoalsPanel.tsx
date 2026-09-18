import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import PracticeGoalSettings from '../molecules/PracticeGoalSettings'
import type {Settings} from '../../types'

type Props={
  settings:Settings
  onChange:(settings:Settings)=>void
}

export default function StudyPlanGoalsPanel({settings,onChange}:Props){
  return <AlexSurface
    component="section"
    sx={{
      p:{xs:2.5,md:3},
      border:'1px solid #E4E7EC',
      borderRadius:3,
      bgcolor:'#fff',
    }}
  >
    <AlexBox sx={{mb:{xs:2,md:2.5}}}>
      <AlexText sx={{fontSize:12,fontWeight:850,textTransform:'uppercase',letterSpacing:'.07em',color:'#6558F5'}}>
        Goals
      </AlexText>
      <AlexText component="h2" sx={{mt:.5,fontSize:22,fontWeight:800,color:'#08275B'}}>
        Plan settings
      </AlexText>
      <AlexText sx={{mt:.75,fontSize:13.5,lineHeight:1.5,color:'#667085'}}>
        Set the exam date and score goal used to calculate your recommended daily practice.
      </AlexText>
    </AlexBox>

    <PracticeGoalSettings settings={settings} onChange={onChange}/>
  </AlexSurface>
}
