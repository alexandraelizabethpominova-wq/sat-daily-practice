import {Box} from '@mui/material'
import type {ReactNode} from 'react'
import SideNavigation from '../molecules/SideNavigation'

type NavKey='study'|'practice-tests'|'question-bank'|'performance'|'resources'

type Props={
  active:NavKey
  collapsed:boolean
  onToggleCollapsed:()=>void
  onStudyPlan:()=>void
  onPracticeTests:()=>void
  onQuestionBank:()=>void
  onPerformance:()=>void
  onResources:()=>void
  onSettings:()=>void
  children:ReactNode
  contentBackground?:string
}

export default function AppSidebarLayout({active,collapsed,onToggleCollapsed,onStudyPlan,onPracticeTests,onQuestionBank,onPerformance,onResources,onSettings,children,contentBackground='#FFFFFF'}:Props){
  return <Box sx={{minHeight:'100vh',display:'flex',bgcolor:contentBackground,color:'#08275B'}}>
    <SideNavigation
      collapsed={collapsed}
      onToggleCollapsed={onToggleCollapsed}
      onFooterClick={onSettings}
      primary={[
        {key:'study',label:'Study Plan',active:active==='study',onClick:onStudyPlan},
        {key:'practice-tests',label:'Practice Tests',active:active==='practice-tests',onClick:onPracticeTests},
        {key:'question-bank',label:'Question Bank',active:active==='question-bank',onClick:onQuestionBank},
        {key:'performance',label:'Performance',active:active==='performance',onClick:onPerformance},
      ]}
      secondary={[{key:'resources',label:'Resources',active:active==='resources',onClick:onResources}]}
    />
    <Box sx={{minWidth:0,flex:1,minHeight:'100vh'}}>{children}</Box>
  </Box>
}
