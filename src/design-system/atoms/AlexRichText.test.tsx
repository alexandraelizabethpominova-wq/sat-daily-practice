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


describe('AlexRichText inline math markers',()=>{
  it('renders short SAT variable tokens without showing literal dollar delimiters',()=>{
    const {container}=render(<AlexRichText text={'In the $xy$-plane, points $A$ and $B$ lie on a circle.'}/>)
    expect(container.textContent).toContain('xy')
    expect(container.textContent).toContain('A')
    expect(container.textContent).toContain('B')
    expect(container.textContent).not.toContain('$')
    expect(container.querySelectorAll('.katex')).toHaveLength(3)
  })

  it('does not let an unrecognized dollar pair swallow later valid math',()=>{
    const {container}=render(<AlexRichText text={'Cost is $abc def$ and point $A$ is marked.'}/>)
    expect(container.textContent).toContain('$abc def$')
    expect(container.textContent).toContain('A')
    expect(container.querySelectorAll('.katex')).toHaveLength(1)
  })
})
