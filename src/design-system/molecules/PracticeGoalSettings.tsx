import AlexBox from '../atoms/AlexBox'
import AlexNumberField from '../atoms/AlexNumberField'
import AlexTextField from '../atoms/AlexTextField'
import PracticeSettingField from './PracticeSettingField'
import type {Settings} from '../../types'

type Props={settings:Settings;onChange:(settings:Settings)=>void}

export default function PracticeGoalSettings({settings,onChange}:Props){
  return <AlexBox sx={{display:'grid',gap:.25}}>
    <PracticeSettingField
      label="Target exam date"
      helperText="Recommendations automatically recalculate as this date approaches."
      control={<AlexTextField fullWidth size="small" type="date" label="Exam date" value={settings.targetExamDate??''} InputLabelProps={{shrink:true}} onChange={event=>onChange({...settings,targetExamDate:event.target.value})}/>} 
    />
    <PracticeSettingField
      label="Practice-set goal"
      helperText="How many official practice sets you ultimately plan to work through. This is a goal, not the current bank size."
      control={<AlexNumberField fullWidth label="Target practice sets" value={settings.targetPracticeSets??1} min={1} max={50} onChange={targetPracticeSets=>onChange({...settings,targetPracticeSets})}/>} 
    />
    <PracticeSettingField
      label="Question-bank coverage goal"
      helperText="The recommendation uses this percentage of the questions that are actually available in the bank right now."
      control={<AlexNumberField fullWidth label="Coverage %" value={settings.targetCoveragePercent??100} min={1} max={100} onChange={targetCoveragePercent=>onChange({...settings,targetCoveragePercent})}/>} 
    />
    <PracticeSettingField
      label="Fallback pace"
      helperText="Used only until enough timed practice exists. Once you have enough attempts, your actual pace replaces this estimate."
      control={<AlexNumberField fullWidth label="Minutes per question" value={settings.fallbackMinutesPerQuestion??2} min={.25} max={20} inputProps={{step:.25}} onChange={fallbackMinutesPerQuestion=>onChange({...settings,fallbackMinutesPerQuestion})}/>} 
    />
  </AlexBox>
}
