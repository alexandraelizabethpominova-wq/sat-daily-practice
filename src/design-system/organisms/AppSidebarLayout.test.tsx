import {fireEvent,render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import AppSidebarLayout from './AppSidebarLayout'

describe('AppSidebarLayout',()=>{
  it('keeps Loadout and Level Select as separate destinations',()=>{
    const onPracticeSetup=vi.fn()
    const onQuestionBank=vi.fn()

    render(
      <AppSidebarLayout
        active="practice-setup"
        collapsed={false}
        onToggleCollapsed={()=>undefined}
        onStudyPlan={()=>undefined}
        onPracticeTests={()=>undefined}
        onPracticeSetup={onPracticeSetup}
        onQuestionBank={onQuestionBank}
        onParsingIssues={()=>undefined}
        onPerformance={()=>undefined}
        onResources={()=>undefined}
        onSettings={()=>undefined}
      >
        <div>Practice setup content</div>
      </AppSidebarLayout>,
    )

    const practiceSetup=screen.getByRole('button',{name:'Loadout'})
    const questionBank=screen.getByRole('button',{name:'Level Select'})

    expect(practiceSetup).toBeInTheDocument()
    expect(questionBank).toBeInTheDocument()

    fireEvent.click(practiceSetup)
    fireEvent.click(questionBank)

    expect(onPracticeSetup).toHaveBeenCalledTimes(1)
    expect(onQuestionBank).toHaveBeenCalledTimes(1)
  })

  it('clamps the app and content wrappers to the viewport',()=>{
    render(
      <AppSidebarLayout
        active="study"
        collapsed={false}
        onToggleCollapsed={()=>undefined}
        onStudyPlan={()=>undefined}
        onPracticeTests={()=>undefined}
        onPracticeSetup={()=>undefined}
        onQuestionBank={()=>undefined}
        onParsingIssues={()=>undefined}
        onPerformance={()=>undefined}
        onResources={()=>undefined}
        onSettings={()=>undefined}
      >
        <div>Responsive content</div>
      </AppSidebarLayout>,
    )

    expect(screen.getByTestId('app-layout')).toHaveStyle({
      width:'100vw',
      maxWidth:'100vw',
      display:'grid',
    })
    expect(screen.getByTestId('app-content')).toHaveStyle({
      width:'100%',
      maxWidth:'calc(100vw - 244px)',
      overflowX:'hidden',
    })
  })

})
