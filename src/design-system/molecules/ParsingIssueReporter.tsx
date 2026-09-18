import {useState} from 'react'
import {Flag} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import {createParsingIssueReport,type ParsingIssueContext} from '../../lib/parsingIssueReports'
import type {PracticeQuestion} from '../../types'

type Props={question:PracticeQuestion;context:ParsingIssueContext;compact?:boolean}

export default function ParsingIssueReporter({question,context,compact=false}:Props){
  const[open,setOpen]=useState(false)
  const[message,setMessage]=useState('')
  const[saving,setSaving]=useState(false)
  const[status,setStatus]=useState('')

  async function submit(){
    setSaving(true);setStatus('')
    try{
      const result=await createParsingIssueReport(question,context,message)
      setMessage('');setOpen(false);setStatus(result.syncedToAdmin?'Reported. It is now in the shared Parsing Issues queue.':'Saved on this device. Sign in to send reports to the shared Parsing Issues queue.')
    }catch(error){
      console.error('Parsing issue report failed',error)
      setStatus('The report could not be sent to the shared queue. Please try again.')
    }finally{setSaving(false)}
  }

  return <AlexBox sx={{display:'grid',gap:1}}>
    {!open&&<AlexButton tone="secondary" size="small" startIcon={<Flag size={15}/>} onClick={()=>{setOpen(true);setStatus('')}} sx={{justifySelf:'start'}}>Report parsing issue</AlexButton>}
    {open&&<AlexSurface sx={{p:1.5,border:'1px solid #E6E2DB',borderRadius:2,bgcolor:'#FBFAF8'}}>
      <AlexText sx={{fontSize:13.5,fontWeight:800,color:'#08275B'}}>Flag a parsing or formatting problem</AlexText>
      <AlexText sx={{fontSize:12.5,color:'#667085',mt:.35,mb:1.1}}>The question is attached automatically. Add an optional note about what looks wrong.</AlexText>
      <AlexTextField multiline minRows={2} maxRows={5} value={message} onChange={event=>setMessage(event.target.value.slice(0,1000))} placeholder="Optional: describe the parsing problem" inputProps={{maxLength:1000}}/>
      <AlexBox sx={{display:'flex',gap:1,mt:1.1,flexWrap:'wrap'}}>
        <AlexButton size="small" disabled={saving} onClick={submit}>{saving?'Saving…':'Submit report'}</AlexButton>
        <AlexButton size="small" tone="secondary" disabled={saving} onClick={()=>{setOpen(false);setMessage('')}}>Cancel</AlexButton>
      </AlexBox>
    </AlexSurface>}
    {status&&<AlexText role="status" sx={{fontSize:12.5,color:status.startsWith('Reported')||status.startsWith('Saved')?'#067647':'#B42318'}}>{status}</AlexText>}
  </AlexBox>
}
