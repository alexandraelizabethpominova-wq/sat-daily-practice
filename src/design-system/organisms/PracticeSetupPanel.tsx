import AlexAccordion from '../atoms/AlexAccordion'
import AlexButton from '../atoms/AlexButton'
import AlexBox from '../atoms/AlexBox'
import AlexDropdown from '../atoms/AlexDropdown'
import AlexNumberField from '../atoms/AlexNumberField'
import AlexSurface from '../atoms/AlexSurface'
import AlexSwitch from '../atoms/AlexSwitch'
import AlexText from '../atoms/AlexText'
import PracticeGoalSettings from '../molecules/PracticeGoalSettings'
import PracticeSettingField from '../molecules/PracticeSettingField'
import StudyPlanRecommendation from './StudyPlanRecommendation'
import type {PracticePlanRecommendation} from '../../lib/practicePlan'
import type {PracticeTestFilter,Settings} from '../../types'

type PracticeTestOption={value:PracticeTestFilter;label:string}

type Props={
  settings:Settings
  practiceTests:PracticeTestOption[]
  failedQuestionCount:number
  onChange:(settings:Settings)=>void
  onStart:()=>void
  onClearHistory:()=>void
  recommendation:PracticePlanRecommendation
}

export default function PracticeSetupPanel({settings,practiceTests,failedQuestionCount,onChange,onStart,onClearHistory,recommendation}:Props){
  const selectionMode=settings.selectionMode??'adaptive'
  const practiceTest=settings.practiceTest??'all'
  const failedOnly=settings.failedOnly??false
  const dailyLabel=recommendation.estimatedDailyMinutes>0
    ?`${recommendation.estimatedDailyMinutes} min/day`
    :'On track'

  return <AlexSurface sx={{maxWidth:860,p:{xs:2.25,md:3.5},borderRadius:3,border:'1px solid #E4E7EC'}}>
    <AlexBox sx={{display:'grid',gap:.5,mb:2}}>
      <AlexText component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:24,fontWeight:500,color:'#08275B'}}>Practice setup</AlexText>
      <AlexText sx={{fontSize:14,color:'#667085',lineHeight:1.5}}>Choose what to practice and how long each session should be.</AlexText>
    </AlexBox>

    <PracticeSettingField
      label="Practice test"
      helperText="Choose one test or mix all available questions."
      control={<AlexDropdown id="practice-test" label="Question source" value={practiceTest} options={practiceTests} onChange={value=>onChange({...settings,practiceTest:value})}/>}
    />

    <PracticeSettingField
      label="Subject"
      helperText="Practice both sections or focus on one."
      control={<AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'Reading & Writing + Math'},{value:'english',label:'Reading & Writing'},{value:'math',label:'Math'}]} onChange={mode=>onChange({...settings,mode})}/>}
    />

    <PracticeSettingField
      label="Question selection"
      helperText="Adaptive prioritizes unseen and weaker questions."
      control={<AlexDropdown id="practice-selection-mode" label="Selection mode" value={selectionMode} options={[{value:'adaptive',label:'Adaptive'},{value:'random',label:'Random'}]} onChange={value=>onChange({...settings,selectionMode:value})}/>}
    />

    <PracticeSettingField
      label="Questions per session"
      helperText="Up to this many eligible questions will be included."
      control={<AlexNumberField fullWidth label="Questions per session" value={settings.questionsPerSession} min={1} max={30} onChange={questionsPerSession=>onChange({...settings,questionsPerSession})}/>}
    />

    <PracticeSettingField
      label="Retry missed questions"
      helperText={failedQuestionCount?`${failedQuestionCount} missed question${failedQuestionCount===1?'':'s'} match the current filters.`:'No missed questions match the current filters.'}
      control={<AlexSwitch label="Missed questions only" checked={failedOnly} disabled={!failedQuestionCount&&!failedOnly} onChange={checked=>onChange({...settings,failedOnly:checked})}/>}
    />

    <AlexAccordion
      sx={{mt:2.25}}
      summary={<AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:2,width:'100%',pr:1}}>
        <AlexBox>
          <AlexText sx={{fontSize:14,fontWeight:850,color:'#08275B'}}>Study plan</AlexText>
          <AlexText sx={{fontSize:12.5,color:'#667085',mt:.15}}>Goals and recommended daily pace</AlexText>
        </AlexBox>
        <AlexText sx={{fontSize:14,fontWeight:850,color:'#6558F5',whiteSpace:'nowrap'}}>{dailyLabel}</AlexText>
      </AlexBox>}
    >
      <PracticeGoalSettings settings={settings} onChange={onChange}/>
      <AlexBox sx={{mt:2,pt:2,borderTop:'1px solid #EAECF0'}}>
        <StudyPlanRecommendation recommendation={recommendation} compact/>
      </AlexBox>
    </AlexAccordion>

    <AlexBox sx={{display:'flex',gap:1.25,flexWrap:'wrap',pt:2.5,mt:2.5,borderTop:'1px solid #EAECF0'}}>
      <AlexButton onClick={onStart} disabled={failedOnly&&failedQuestionCount===0}>Start practice</AlexButton>
      <AlexButton tone="quiet" onClick={onClearHistory}>Clear history</AlexButton>
    </AlexBox>
  </AlexSurface>
}
