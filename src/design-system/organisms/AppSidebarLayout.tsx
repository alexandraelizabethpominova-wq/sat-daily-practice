import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import SideNavigation from '../molecules/SideNavigation'

type NavKey='study'|'practice-tests'|'practice-setup'|'question-bank'|'performance'|'resources'

type Props={
  active:NavKey
  collapsed:boolean
  onToggleCollapsed:()=>void
  onStudyPlan:()=>void
  onPracticeTests:()=>void
  onPracticeSetup:()=>void
  onQuestionBank:()=>void
  onPerformance:()=>void
  onResources:()=>void
  onSettings:()=>void
  accountLabel?:string
  accountDetail?:string
  signedIn?:boolean
  children:ReactNode
  contentBackground?:string
}

export default function AppSidebarLayout({active,collapsed,onToggleCollapsed,onStudyPlan,onPracticeTests,onPracticeSetup,onQuestionBank,onPerformance,onResources,onSettings,accountLabel='Sign in',accountDetail='',signedIn=false,children,contentBackground='#FFFFFF'}:Props){
  return <AlexBox sx={{minHeight:'100vh',display:'flex',bgcolor:contentBackground,color:'#08275B'}}>
    <SideNavigation
      collapsed={collapsed}
      onToggleCollapsed={onToggleCollapsed}
      onFooterClick={onSettings}
      footerLabel={accountLabel}
      footerDetail={accountDetail}
      signedIn={signedIn}
      primary={[
        {key:'study',label:'Study Plan',active:active==='study',onClick:onStudyPlan},
        {key:'practice-tests',label:'Practice Tests',active:active==='practice-tests',onClick:onPracticeTests},
        {key:'practice-setup',label:'Practice Setup',active:active==='practice-setup',onClick:onPracticeSetup},
        {key:'question-bank',label:'Question Bank',active:active==='question-bank',onClick:onQuestionBank},
        {key:'performance',label:'Performance',active:active==='performance',onClick:onPerformance},
      ]}
      secondary={[{key:'resources',label:'Resources',active:active==='resources',onClick:onResources}]}
    />
    <AlexBox sx={{minWidth:0,flex:1,minHeight:'100vh'}}>{children}</AlexBox>
  </AlexBox>
}
