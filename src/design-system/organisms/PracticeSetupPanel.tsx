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

  return <AlexSurface sx={{maxWidth:860,p:{xs:2.25,md:3.5},borderRadius:3,border:'1px solid #E4E7EC'}}>
    <AlexBox sx={{display:'grid',gap:.5,mb:2}}>
      <AlexText component="h2" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:24,fontWeight:500,color:'#08275B'}}>Build a practice session</AlexText>
      <AlexText sx={{fontSize:14,color:'#667085',lineHeight:1.5}}>Choose the source, subject, and question-selection behavior. The same settings are used anywhere a practice session starts.</AlexText>
    </AlexBox>

    <PracticeSettingField
      label="Practice test"
      helperText="Use questions from one official test or from every test currently in the question bank."
      control={<AlexDropdown id="practice-test" label="Question source" value={practiceTest} options={practiceTests} onChange={value=>onChange({...settings,practiceTest:value})}/>} 
    />

    <PracticeSettingField
      label="Subject"
      helperText="Practice both SAT sections or focus on one section."
      control={<AlexDropdown id="practice-subject" label="Subject" value={settings.mode} options={[{value:'both',label:'English + Math'},{value:'english',label:'English only'},{value:'math',label:'Math only'}]} onChange={mode=>onChange({...settings,mode})}/>} 
    />

    <PracticeSettingField
      label="Question selection"
      helperText="Adaptive prioritizes unseen and weaker questions. Random samples evenly from the eligible pool."
      control={<AlexDropdown id="practice-selection-mode" label="Selection mode" value={selectionMode} options={[{value:'adaptive',label:'Adaptive'},{value:'random',label:'Random'}]} onChange={value=>onChange({...settings,selectionMode:value})}/>} 
    />

    <PracticeSettingField
      label="Questions per session"
      helperText="The session uses up to this many eligible questions."
      control={<AlexNumberField fullWidth label="Questions per session" value={settings.questionsPerSession} min={1} max={30} onChange={questionsPerSession=>onChange({...settings,questionsPerSession})}/>} 
    />

    <PracticeSettingField
      label="Practice failed questions"
      helperText={failedQuestionCount?`${failedQuestionCount} currently failed question${failedQuestionCount===1?'':'s'} match these filters.`:'No failed questions currently match these filters.'}
      control={<AlexSwitch label="Failed questions only" checked={failedOnly} disabled={!failedQuestionCount&&!failedOnly} onChange={checked=>onChange({...settings,failedOnly:checked})}/>} 
    />

    <AlexBox sx={{mt:2.5,pt:2.5,borderTop:'1px solid #EAECF0'}}>
      <AlexText component="h3" sx={{fontSize:17,fontWeight:850,color:'#08275B',mb:.75}}>Study goal</AlexText>
      <PracticeGoalSettings settings={settings} onChange={onChange}/>
    </AlexBox>

    <AlexBox sx={{mt:2.5}}><StudyPlanRecommendation recommendation={recommendation}/></AlexBox>

    <AlexBox sx={{display:'flex',gap:1.25,flexWrap:'wrap',pt:2.5,mt:2.5,borderTop:'1px solid #EAECF0'}}>
      <AlexButton onClick={onStart} disabled={failedOnly&&failedQuestionCount===0}>Start with these settings</AlexButton>
      <AlexButton tone="secondary" onClick={onClearHistory}>Clear history & start fresh</AlexButton>
    </AlexBox>
  </AlexSurface>
}
