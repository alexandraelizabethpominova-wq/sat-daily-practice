import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe,expect,it} from 'vitest'
import {ThemeProvider} from '@mui/material'
import {alexTheme} from '../theme'
import AlexFeedbackWidget from './AlexFeedbackWidget'

describe('AlexFeedbackWidget',()=>{
  it('opens the Alexified feedback drawer from the right-side button',async()=>{
    const user=userEvent.setup()
    render(<ThemeProvider theme={alexTheme}><AlexFeedbackWidget context="study"/></ThemeProvider>)

    await user.click(screen.getByRole('button',{name:'Open feedback form'}))

    expect(screen.getByRole('heading',{name:'Hi — it’s Alex.'})).toBeInTheDocument()
    expect(screen.getByText('Enjoy being Alexified? Tell me more!')).toBeInTheDocument()
    expect(screen.getByRole('textbox',{name:'Drop a line'})).toBeInTheDocument()
    expect(screen.getByRole('button',{name:'Send to Alex'})).toBeDisabled()
  })

  it('opens from the Alexified Fan Club event',async()=>{
    render(<ThemeProvider theme={alexTheme}><AlexFeedbackWidget context="study"/></ThemeProvider>)

    window.dispatchEvent(new CustomEvent('alexified-open-feedback'))

    expect(await screen.findByRole('heading',{name:'Hi — it’s Alex.'})).toBeInTheDocument()
    expect(screen.getByRole('textbox',{name:'Drop a line'})).toBeInTheDocument()
  })
})
