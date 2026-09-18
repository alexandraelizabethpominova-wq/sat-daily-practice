import AlexAccordion from '../atoms/AlexAccordion'
import AlexBox from '../atoms/AlexBox'
import AlexNumberField from '../atoms/AlexNumberField'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import PracticeSettingField from './PracticeSettingField'
import type {Settings} from '../../types'

type Props={settings:Settings;onChange:(settings:Settings)=>void}

export default function PracticeGoalSettings({settings,onChange}:Props){
  return <AlexBox sx={{display:'grid',gap:.5}}>
    <PracticeSettingField
      label="Exam date"
      helperText="Used to calculate how much practice to do each day."
      control={<AlexTextField fullWidth size="small" type="date" label="Exam date" value={settings.targetExamDate??''} InputLabelProps={{shrink:true}} onChange={event=>onChange({...settings,targetExamDate:event.target.value})}/>}
    />
    <PracticeSettingField
      label="Target score"
      helperText="Your practice estimate is compared with this goal."
      control={<AlexTextField fullWidth size="small" type="number" label="Target score" value={settings.targetScore??''} inputProps={{min:400,max:1600,step:10}} placeholder="e.g. 1400" onChange={event=>{const value=event.target.value;onChange({...settings,targetScore:value?Number(value):undefined})}}/>}
    />

    <AlexAccordion
      sx={{mt:1}}
      summary={<AlexBox>
        <AlexText sx={{fontSize:14,fontWeight:800,color:'#08275B'}}>Advanced planning settings</AlexText>
        <AlexText sx={{fontSize:12.5,color:'#667085',mt:.15}}>Optional controls for coverage and pace estimates</AlexText>
      </AlexBox>}
    >
      <PracticeSettingField
        label="Question coverage"
        helperText="Percent of the available question bank you want to work through."
        control={<AlexNumberField fullWidth label="Coverage %" value={settings.targetCoveragePercent??100} min={1} max={100} onChange={targetCoveragePercent=>onChange({...settings,targetCoveragePercent})}/>}
      />
      <PracticeSettingField
        label="Fallback pace"
        helperText="Used until there is enough timing history to estimate your actual pace."
        control={<AlexNumberField fullWidth label="Minutes per question" value={settings.fallbackMinutesPerQuestion??2} min={.25} max={20} inputProps={{step:.25}} onChange={fallbackMinutesPerQuestion=>onChange({...settings,fallbackMinutesPerQuestion})}/>}
      />
    </AlexAccordion>
  </AlexBox>
}
