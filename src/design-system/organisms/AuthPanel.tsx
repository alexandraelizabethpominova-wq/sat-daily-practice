import {useState} from 'react'
import AlexButton from '../atoms/AlexButton'
import AlexTextField from '../atoms/AlexTextField'

type Props={
  configured:boolean
  email:string|null
  loading:boolean
  onSignIn:(email:string,password:string)=>Promise<void>
  onSignUp:(email:string,password:string)=>Promise<{needsEmailConfirmation:boolean}>
  onSignOut:()=>Promise<void>
}

export default function AuthPanel({configured,email,loading,onSignIn,onSignUp,onSignOut}:Props){
  const[mode,setMode]=useState<'signin'|'signup'>('signin')
  const[inputEmail,setInputEmail]=useState('')
  const[password,setPassword]=useState('')
  const[busy,setBusy]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')

  if(!configured){
    return <section className="card settings settings-grid">
      <div><p className="eyebrow">Cloud account</p><h2>Supabase is not configured</h2></div>
      <p className="muted">Add the Supabase URL and publishable key to the app environment to enable accounts and cloud history.</p>
    </section>
  }

  if(loading){
    return <section className="card settings settings-grid"><p className="muted">Checking account…</p></section>
  }

  if(email){
    return <section className="card settings settings-grid">
      <div><p className="eyebrow">Cloud account</p><h2>Signed in</h2><p className="muted">{email}</p></div>
      <p className="muted">Completed sessions are backed up to Supabase and restored when you sign in on another device.</p>
      <div className="settings-actions"><AlexButton tone="secondary" onClick={onSignOut}>Sign out</AlexButton></div>
    </section>
  }

  async function submit(event:React.FormEvent){
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try{
      if(mode==='signin'){
        await onSignIn(inputEmail.trim(),password)
      }else{
        const result=await onSignUp(inputEmail.trim(),password)
        if(result.needsEmailConfirmation)setMessage('Account created. Check your email to confirm it, then sign in.')
      }
      setPassword('')
    }catch(caught){
      setError(caught instanceof Error?caught.message:'Authentication failed.')
    }finally{
      setBusy(false)
    }
  }

  return <section className="card settings settings-grid">
    <div><p className="eyebrow">Cloud account</p><h2>{mode==='signin'?'Sign in':'Create account'}</h2><p className="muted">Use one account to keep your SAT practice history across devices.</p></div>
    <form className="settings-grid" onSubmit={submit}>
      <div className="settings-field"><AlexTextField label="Email" type="email" autoComplete="email" required value={inputEmail} onChange={event=>setInputEmail(event.target.value)}/></div>
      <div className="settings-field"><AlexTextField label="Password" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} required inputProps={{minLength:6}} value={password} onChange={event=>setPassword(event.target.value)}/></div>
      {error&&<p role="alert">{error}</p>}
      {message&&<p>{message}</p>}
      <div className="settings-actions">
        <AlexButton type="submit" disabled={busy}>{busy?'Working…':mode==='signin'?'Sign in':'Create account'}</AlexButton>
        <AlexButton type="button" tone="quiet" disabled={busy} onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setMessage('')}}>{mode==='signin'?'Create an account instead':'Back to sign in'}</AlexButton>
      </div>
    </form>
  </section>
}
