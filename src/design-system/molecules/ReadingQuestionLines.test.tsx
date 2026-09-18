import {render,screen,within} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import ReadingQuestionLines,{parseReadingQuestion} from './ReadingQuestionLines'

describe('ReadingQuestionLines',()=>{
  it('keeps verse line breaks and renders literary text as a quote block',()=>{
    const lines=[
      'One by one in the infinite meadows of heaven',
      'Blossomed the lovely stars, the forget-me-nots of the angels.',
      'At last came the Lady Moon, her face paler',
      'Than a white rose in the mist.',
      'Which choice best states the main purpose of the text?',
      'A) To portray the stars and moon as flowers in a meadow',
      'B) To explain why the moon appears pale',
      'C) To compare two scientific explanations',
      'D) To describe a daytime landscape',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.isVerse).toBe(true)
    expect(parsed.stimulus).toHaveLength(4)
    render(<ReadingQuestionLines lines={lines}/>)
    const quote=screen.getByRole('blockquote')
    expect(within(quote).getByText('One by one in the infinite meadows of heaven')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('reflows prose but keeps answer choices as separate styled rows',()=>{
    const lines=[
      'As a young historian in Australia in the 1950s, Jill Roe became dismayed',
      'that women were mostly ignored in works about Australian history.',
      'Roe helped establish the field of Australian women’s history.',
      'According to the text, what prompted Roe to study women’s history?',
      'A) Her desire to read about famous women who lived in Australia in the 1950s',
      'B) Her disappointment with the lack of scholarly attention paid to Australian women',
      'C) Her interest in the role of women’s groups in Australian politics',
      'D) Her plan to complete a biography of an Australian woman',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.isVerse).toBe(false)
    expect(parsed.stem).toContain('what prompted Roe')
    render(<ReadingQuestionLines lines={lines}/>)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText(/Her disappointment with the lack of scholarly attention/)).toBeInTheDocument()
  })
})
