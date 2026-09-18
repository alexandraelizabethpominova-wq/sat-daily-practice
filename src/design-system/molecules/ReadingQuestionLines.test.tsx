import {render,screen,within} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import ReadingQuestionLines,{hasCompleteReadingChoices,parseReadingQuestion} from './ReadingQuestionLines'

describe('ReadingQuestionLines',()=>{
  it('keeps source attribution outside the quoted poem',()=>{
    const lines=[
      'The following text is from Walt Whitman’s 1860 poem “Calamus 24.”',
      'I HEAR it is charged against me that I seek to destroy institutions;',
      'But really I am neither for nor against institutions',
      '(What indeed have I in common with them?— Or what with the destruction of them?),',
      'Which choice best describes the overall structure of the text?',
      'A) The speaker questions an attitude, then summarizes his worldview.',
      'B) The speaker regrets his isolation from others.',
      'C) The speaker concedes his personal shortcomings.',
      'D) The speaker addresses a criticism, then announces an ambition.',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.intro).toBe('The following text is from Walt Whitman’s 1860 poem “Calamus 24.”')
    expect(parsed.stimulus[0]).toMatch(/^I HEAR/)
    render(<ReadingQuestionLines lines={lines}/>)
    expect(screen.getByText(/The following text is from Walt Whitman/).closest('blockquote')).toBeNull()
    expect(within(screen.getByRole('blockquote')).getByText(/I HEAR/)).toBeInTheDocument()
  })

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
    render(<ReadingQuestionLines lines={lines}/>)
    expect(within(screen.getByRole('blockquote')).getByText('One by one in the infinite meadows of heaven')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('accepts PDF choices extracted with or without closing punctuation after the label',()=>{
    const lines=[
      'It is by no means _______ to recognize the influence of Dutch painter Hieronymus Bosch.',
      'Which choice completes the text with the most logical and precise word or phrase?',
      'A substantial','B) satisfying','C. unimportant','D appropriate',
    ]
    expect(hasCompleteReadingChoices(lines)).toBe(true)
    expect(parseReadingQuestion(lines).choices.map(choice=>choice.text)).toEqual(['substantial','satisfying','unimportant','appropriate'])
  })

  it('reflows prose but keeps answer choices as separate rows',()=>{
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
    render(<ReadingQuestionLines lines={lines}/>)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText(/Her disappointment with the lack of scholarly attention/)).toBeInTheDocument()
  })
})
