import {useState} from 'react'
import AlexButton from '../atoms/AlexButton'
import AlexStack from '../atoms/AlexStack'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import AuthCredentialsForm from '../molecules/AuthCredentialsForm'
import {isSupabaseConfigured,signInWithPassword,signOut,signUpWithPassword} from '../../lib/supabase'

type Props={
  email:string|null
}

const messageFromError=(error:unknown)=>error instanceof Error?error.message:'Something went wrong. Please try again.'

export default function AccountAuthPanel({email}:Props){
  const[mode,setMode]=useState<'signin'|'signup'>('signin')
  const[busy,setBusy]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')

  async function submit(nextEmail:string,password:string){
    setBusy(true)
    setError('')
    setMessage('')
    try{
      if(mode==='signup'){
        const result=await signUpWithPassword(nextEmail,password)
        setMessage(result.needsEmailConfirmation?'Check your email to confirm your account, then return here to sign in.':'Account created and signed in.')
      }else{
        await signInWithPassword(nextEmail,password)
        setMessage('Signed in. Your practice history will sync automatically.')
      }
    }catch(nextError){
      setError(messageFromError(nextError))
    }finally{
      setBusy(false)
    }
  }

  async function logout(){
    setBusy(true)
    setError('')
    setMessage('')
    try{
      await signOut()
      setMessage('Signed out. Your local practice data remains on this device.')
    }catch(nextError){
      setError(messageFromError(nextError))
    }finally{
      setBusy(false)
    }
  }

  return <AlexSurface sx={{p:{xs:2.25,md:3},border:'1px solid',borderColor:'divider',borderRadius:3}}>
    <AlexStack spacing={2.25}>
      <AlexStack spacing={.5}>
        <AlexText component="p" sx={{fontSize:12,fontWeight:800,letterSpacing:'.08em',textTransform:'uppercase',color:'text.secondary',m:0}}>Account & sync</AlexText>
        <AlexText component="h2" sx={{fontSize:24,fontWeight:850,m:0}}>Keep your SAT history across devices</AlexText>
        <AlexText sx={{fontSize:14,color:'text.secondary'}}>Sign in with the same account on each device to back up and restore completed practice sessions.</AlexText>
      </AlexStack>

      {!isSupabaseConfigured?<AlexText role="alert" sx={{color:'error.main'}}>Supabase is not configured for this build.</AlexText>:email?<AlexStack spacing={1.5}>
        <AlexText><b>Signed in as:</b> {email}</AlexText>
        {error&&<AlexText role="alert" sx={{fontSize:13,color:'error.main'}}>{error}</AlexText>}
        {message&&<AlexText role="status" sx={{fontSize:13,color:'success.main'}}>{message}</AlexText>}
        <AlexButton tone="secondary" disabled={busy} onClick={logout} sx={{alignSelf:'flex-start'}}>Sign out</AlexButton>
      </AlexStack>:<AuthCredentialsForm
        mode={mode}
        busy={busy}
        message={message}
        error={error}
        onSubmit={submit}
        onModeChange={nextMode=>{setMode(nextMode);setError('');setMessage('')}}
      />}
    </AlexStack>
  </AlexSurface>
}
