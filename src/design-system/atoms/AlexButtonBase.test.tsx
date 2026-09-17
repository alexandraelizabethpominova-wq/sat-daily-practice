import {createRef} from 'react'
import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import AlexButtonBase from './AlexButtonBase'

describe('AlexButtonBase',()=>{
  it('forwards its ref to the underlying button for MUI Tooltip compatibility',()=>{
    const ref=createRef<HTMLButtonElement>()
    render(<AlexButtonBase ref={ref}>Open</AlexButtonBase>)

    expect(screen.getByRole('button',{name:'Open'})).toBe(ref.current)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
