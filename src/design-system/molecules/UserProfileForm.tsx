import {useEffect,useState} from 'react'
import AlexButton from '../atoms/AlexButton'
import AlexDropdown from '../atoms/AlexDropdown'
import AlexStack from '../atoms/AlexStack'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import type {UserProfile} from '../../lib/supabase'

type Props={
  profile:UserProfile
  busy:boolean
  onSave:(profile:UserProfile)=>Promise<void>|void
}

const gradeOptions=[
  {value:'',label:'Prefer not to say'},
  {value:'8',label:'8th grade'},
  {value:'9',label:'9th grade'},
  {value:'10',label:'10th grade'},
  {value:'11',label:'11th grade'},
  {value:'12',label:'12th grade'},
  {value:'other',label:'Other'},
]

export default function UserProfileForm({profile,busy,onSave}:Props){
  const[draft,setDraft]=useState(profile)
  useEffect(()=>setDraft(profile),[profile])
  const update=<K extends keyof UserProfile>(key:K,value:UserProfile[K])=>setDraft(current=>({...current,[key]:value}))

  return <AlexStack spacing={2}>
    <AlexText component="h3" sx={{fontSize:18,fontWeight:800,m:0}}>Profile</AlexText>
    <AlexText sx={{fontSize:13,color:'text.secondary'}}>These details are optional and only visible in your signed-in account.</AlexText>
    <AlexTextField label="Name" value={draft.displayName} onChange={event=>update('displayName',event.target.value)} placeholder="Your name"/>
    <AlexTextField label="School" value={draft.school} onChange={event=>update('school',event.target.value)} placeholder="School name"/>
    <AlexDropdown id="profile-grade" label="Grade" value={draft.grade} options={gradeOptions} onChange={value=>update('grade',value)}/>
    <AlexTextField label="Parent/guardian name" value={draft.parentGuardianName} onChange={event=>update('parentGuardianName',event.target.value)} placeholder="Optional"/>
    <AlexTextField label="Parent/guardian email" type="email" value={draft.parentGuardianEmail} onChange={event=>update('parentGuardianEmail',event.target.value)} placeholder="Optional"/>
    <AlexTextField label="About" value={draft.about} onChange={event=>update('about',event.target.value)} multiline minRows={3} placeholder="Anything useful about your SAT goals or study preferences"/>
    <AlexButton disabled={busy} onClick={()=>onSave(draft)} sx={{alignSelf:'flex-start'}}>Save profile</AlexButton>
  </AlexStack>
}
