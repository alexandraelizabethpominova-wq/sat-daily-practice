import {fireEvent,render,screen} from '@testing-library/react'
import {describe,expect,it,vi} from 'vitest'
import AppSidebarLayout from './AppSidebarLayout'

describe('AppSidebarLayout',()=>{
  it('keeps Practice Setup and Question Bank as separate destinations',()=>{
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
        onPerformance={()=>undefined}
        onResources={()=>undefined}
        onSettings={()=>undefined}
      >
        <div>Practice setup content</div>
      </AppSidebarLayout>,
    )

    const practiceSetup=screen.getByRole('button',{name:'Practice Setup'})
    const questionBank=screen.getByRole('button',{name:'Question Bank'})

    expect(practiceSetup).toBeInTheDocument()
    expect(questionBank).toBeInTheDocument()

    fireEvent.click(practiceSetup)
    fireEvent.click(questionBank)

    expect(onPracticeSetup).toHaveBeenCalledTimes(1)
    expect(onQuestionBank).toHaveBeenCalledTimes(1)
  })
})
