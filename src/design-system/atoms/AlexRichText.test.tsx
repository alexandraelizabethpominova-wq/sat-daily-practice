import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import AlexRichText from './AlexRichText'

describe('AlexRichText underline markup',()=>{
  it('renders stored underline markup as semantic underlined text',()=>{
    render(<AlexRichText text="A <u>marked phrase</u> follows."/>)
    const marked=screen.getByText('marked phrase')
    expect(marked.tagName).toBe('U')
    expect(marked).toHaveClass('rich-underline')
  })

  it('keeps math rendering inside an underlined span',()=>{
    const {container}=render(<AlexRichText text={'<u>$x^2$</u>'}/>)
    expect(container.querySelector('u.rich-underline .katex')).toBeTruthy()
  })
})
