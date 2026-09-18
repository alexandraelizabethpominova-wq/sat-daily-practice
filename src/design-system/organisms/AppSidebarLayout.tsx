import {useEffect,useState,type ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import SideNavigation from '../molecules/SideNavigation'
import {getCurrentAuthUser,loadUserProfile,subscribeToAuth,type AuthUser,type UserProfile} from '../../lib/supabase'

type NavKey='study'|'practice-tests'|'practice-setup'|'question-bank'|'parsing-issues'|'performance'|'resources'

type Props={
  active:NavKey
  collapsed:boolean
  onToggleCollapsed:()=>void
  onStudyPlan:()=>void
  onPracticeTests:()=>void
  onPracticeSetup:()=>void
  onQuestionBank:()=>void
  onParsingIssues:()=>void
  onPerformance:()=>void
  onResources:()=>void
  onSettings:()=>void
  children:ReactNode
  contentBackground?:string
}

export default function AppSidebarLayout({active,collapsed,onToggleCollapsed,onStudyPlan,onPracticeTests,onPracticeSetup,onQuestionBank,onParsingIssues,onPerformance,onResources,onSettings,children,contentBackground='#FFFFFF'}:Props){
  const[user,setUser]=useState<AuthUser|null>(null)
  const[profile,setProfile]=useState<UserProfile|null>(null)

  useEffect(()=>{
    let cancelled=false
    const refresh=async(nextUser?:AuthUser|null)=>{
      const resolved=nextUser===undefined?await getCurrentAuthUser():nextUser
      if(cancelled)return
      setUser(resolved)
      if(!resolved){setProfile(null);return}
      try{
        const nextProfile=await loadUserProfile()
        if(!cancelled)setProfile(nextProfile)
      }catch(error){
        console.warn('Profile load failed',error)
        if(!cancelled)setProfile(null)
      }
    }
    void refresh()
    const unsubscribe=subscribeToAuth(nextUser=>void refresh(nextUser))
    const handleProfileUpdated=()=>void refresh()
    window.addEventListener('sat-profile-updated',handleProfileUpdated)
    return()=>{cancelled=true;unsubscribe();window.removeEventListener('sat-profile-updated',handleProfileUpdated)}
  },[])

  const accountLabel=user?(profile?.displayName.trim()||user.email?.split('@')[0]||'Account'):'Sign in'
  const accountDetail=user?(profile?.grade?`Grade ${profile.grade}`:user.email??'Signed in'):''
  const sidebarWidth=collapsed?76:244

  return <AlexBox
    data-testid="app-layout"
    sx={{
      minHeight:'100vh',
      width:'100vw',
      maxWidth:'100vw',
      display:'grid',
      gridTemplateColumns:`${sidebarWidth}px minmax(0,1fr)`,
      overflowX:'hidden',
      bgcolor:contentBackground,
      color:'#08275B',
    }}
  >
    <SideNavigation
      collapsed={collapsed}
      onToggleCollapsed={onToggleCollapsed}
      onFooterClick={onSettings}
      footerLabel={accountLabel}
      footerDetail={accountDetail}
      signedIn={Boolean(user)}
      primary={[
        {key:'study',label:'Study Plan',active:active==='study',onClick:onStudyPlan},
        {key:'practice-tests',label:'Practice Tests',active:active==='practice-tests',onClick:onPracticeTests},
        {key:'practice-setup',label:'Practice Setup',active:active==='practice-setup',onClick:onPracticeSetup},
        {key:'question-bank',label:'Question Bank',active:active==='question-bank',onClick:onQuestionBank},
        {key:'parsing-issues',label:'Parsing Issues',active:active==='parsing-issues',onClick:onParsingIssues},
        {key:'performance',label:'Performance',active:active==='performance',onClick:onPerformance},
      ]}
      secondary={[{key:'resources',label:'Resources',active:active==='resources',onClick:onResources}]}
    />
    <AlexBox
      data-testid="app-content"
      sx={{
        minWidth:0,
        width:'100%',
        maxWidth:`calc(100vw - ${sidebarWidth}px)`,
        minHeight:'100vh',
        px:{xs:1.5,md:2},
        boxSizing:'border-box',
        overflowX:'hidden',
      }}
    >
      <AlexBox sx={{
        width:'100%',
        maxWidth:'100%',
        minWidth:0,
        mx:'auto',
        overflowX:'hidden',
        '& > *':{width:'100%',maxWidth:'100%',minWidth:0},
      }}>
        {children}
      </AlexBox>
    </AlexBox>
  </AlexBox>
}
