import PracticeGoalSettings from '../molecules/PracticeGoalSettings'
import SectionPanel from '../molecules/SectionPanel'
import type {Settings} from '../../types'

type Props={
  settings:Settings
  onChange:(settings:Settings)=>void
}

export default function StudyPlanGoalsPanel({settings,onChange}:Props){
  return <SectionPanel
    eyebrow="Goals"
    title="Plan settings"
    description="Set the exam date and score goal used to calculate your recommended daily practice."
  >
    <PracticeGoalSettings settings={settings} onChange={onChange}/>
  </SectionPanel>
}
