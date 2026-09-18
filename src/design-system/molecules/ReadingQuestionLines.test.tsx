import {render,screen,within} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import ReadingQuestionLines,{hasCompleteReadingChoices,parseReadingQuestion} from './ReadingQuestionLines'
import {READING_PARAGRAPH_BREAK} from '../../lib/readingQuestionFormat'

describe('ReadingQuestionLines',()=>{
  it('keeps source attribution outside the quoted poem and preserves verse lines',()=>{
    const lines=[
      'The following text is from Walt Whitman’s 1860',
      'poem “Calamus 24.”',
      READING_PARAGRAPH_BREAK,
      'I HEAR it is charged against me that I seek to',
      'destroy institutions;',
      'But really I am neither for nor against institutions',
      '(What indeed have I in common with them?—',
      'Or what with the destruction of them?),',
      READING_PARAGRAPH_BREAK,
      'Which choice best describes the overall structure of',
      'the text?',
      READING_PARAGRAPH_BREAK,
      'A) The speaker questions an attitude, then summarizes his worldview.',
      'B) The speaker regrets his isolation from others.',
      'C) The speaker concedes his personal shortcomings.',
      'D) The speaker addresses a criticism, then announces an ambition.',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.intro.join(' ')).toContain('Walt Whitman')
    expect(parsed.stimulusBlocks[0][0]).toMatch(/^I HEAR/)
    expect(parsed.isVerse).toBe(true)
    render(<ReadingQuestionLines lines={lines}/>)
    expect(screen.getByText(/The following text is from Walt Whitman/).closest('blockquote')).toBeNull()
    const quote=screen.getByRole('blockquote')
    expect(within(quote).getByText(/I HEAR/)).toBeInTheDocument()
    expect(within(quote).getByText('destroy institutions;')).toBeInTheDocument()
  })

  it('keeps explanatory context with the intro for a poem',()=>{
    const lines=[
      'The following text is from the 1923 poem “Black Finger” by Angelina Weld Grimké, a Black American',
      'writer. A cypress is a type of evergreen tree.',
      READING_PARAGRAPH_BREAK,
      'I have just seen a most beautiful thing,',
      'Slim and still,',
      'Against a gold, gold sky,',
      READING_PARAGRAPH_BREAK,
      'Which choice best describes the overall structure of the text?',
      'A) First','B) Second','C) Third','D) Fourth',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.intro.join(' ')).toContain('A cypress is a type of evergreen tree.')
    expect(parsed.stimulusBlocks[0][0]).toBe('I have just seen a most beautiful thing,')
  })

  it('accepts PDF choices extracted with or without closing punctuation after the label',()=>{
    const lines=[
      'It is by no means _______ to recognize the influence of Dutch painter Hieronymus Bosch.',
      READING_PARAGRAPH_BREAK,
      'Which choice completes the text with the most logical and precise word or phrase?',
      READING_PARAGRAPH_BREAK,
      'A substantial','B) satisfying','C. unimportant','D appropriate',
    ]
    expect(hasCompleteReadingChoices(lines)).toBe(true)
    expect(parseReadingQuestion(lines).choices.map(choice=>choice.text)).toEqual(['substantial','satisfying','unimportant','appropriate'])
  })



  it('renders Reading data tables as structured tables without duplicating table text into the passage',()=>{
    const lines=[
      'Earth’s atmosphere is bombarded by cosmic dust originating from several sources.',
      'Some of the dust’s material vaporizes in the atmosphere in a process called ablation.',
      READING_PARAGRAPH_BREAK,
      'Which choice most effectively uses data from the table to complete the example?',
      READING_PARAGRAPH_BREAK,
      'A) iron from SPC dust is 20%.',
      'B) sodium from OCC dust is 100%.',
      'C) iron from HTC dust is 90%.',
      'D) sodium from AST dust is 75%.',
    ]
    render(<ReadingQuestionLines lines={lines} questionId="rw1-15"/>)
    expect(screen.getByText('Ablation Rates for Three Elements in Cosmic Dust, by Dust Source')).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('potassium')).toBeInTheDocument()
    expect(screen.getByText(/Earth’s atmosphere is bombarded by cosmic dust/)).toBeInTheDocument()
    expect(screen.getAllByText('20%')).toHaveLength(1)
  })

  it('keeps wrapped choice text attached to its answer label',()=>{
    const lines=[
      'Biologist Valentina Gómez-Bahamón and her team have investigated two subspecies.',
      READING_PARAGRAPH_BREAK,
      'Which finding, if true, would most directly support',
      'Gómez-Bahamón and her team’s hypothesis?',
      READING_PARAGRAPH_BREAK,
      'A) The feathers located on the wings of the migratory fork-tailed flycatchers have a narrower',
      'shape than those of the nonmigratory birds,',
      'which allows them to fly long distances.',
      READING_PARAGRAPH_BREAK,
      'B) Over several generations, the sound made by the feathers changes.',
      'C) Fork-tailed flycatchers communicate different messages.',
      'D) The breeding habits remained generally the same.',
    ]
    const parsed=parseReadingQuestion(lines)
    expect(parsed.choices).toHaveLength(4)
    expect(parsed.choices[0].text).toContain('which allows them to fly long distances.')
    render(<ReadingQuestionLines lines={lines}/>)
    expect(screen.getByText(/which allows them to fly long distances/).closest('[role="listitem"]')).not.toBeNull()
  })

  it('reflows prose paragraphs but keeps answer choices as separate rows',()=>{
    const lines=[
      'As a young historian in Australia in the 1950s, Jill Roe became dismayed',
      'that women were mostly ignored in works about Australian history.',
      READING_PARAGRAPH_BREAK,
      'Roe helped establish the field of Australian women’s history.',
      READING_PARAGRAPH_BREAK,
      'According to the text, what prompted Roe to study women’s history?',
      READING_PARAGRAPH_BREAK,
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
