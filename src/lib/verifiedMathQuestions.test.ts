import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,expect,it} from 'vitest'
import {verifiedMathContent} from './verifiedMathQuestions'

describe('verified math question fidelity',()=>{
  it('matches the source expression for Math Module 1 Question 4 option A',()=>{
    expect(verifiedMathContent('math1-4')?.lines).toContain('A) $(3)(8)x=83$')
    expect(verifiedMathContent('math1-4')?.lines).not.toContain('A) $(3x)(8)=83$')
  })

  it('keeps inline KaTeX aligned and sized with surrounding SAT text',()=>{
    const css=readFileSync(resolve(process.cwd(),'src','structured.css'),'utf8')
    expect(css).toContain('.rich-math.inline{display:inline;margin:0 .04em;max-width:100%;vertical-align:baseline;line-height:inherit}')
    expect(css).toContain('.rich-math.inline .katex{font-size:1em;line-height:inherit;vertical-align:baseline}')
  })
})
