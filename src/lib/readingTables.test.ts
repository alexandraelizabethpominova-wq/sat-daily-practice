import {describe,expect,it} from 'vitest'
import {readingTableSpec,stripEmbeddedReadingTableLines} from './readingTables'

describe('structured reading table round trips',()=>{
  const prose=[
    'Mycorrhizal fungi in soil benefits many plants, substantially increasing the mass of some.',
    'Which choice most effectively uses data from the table to complete the statement?',
    'A) first choice',
    'B) second choice',
    'C) third choice',
    'D) fourth choice',
  ]

  it('removes an extracted copy of the Q17 structured table before editing or saving',()=>{
    const corrupted=[
      'Effects of Mycorrhizal Fungi on 3 Plant Species',
      'Plant species',
      'Mycorrhizal host',
      'Average mass of plants grown in soil containing mycorrhizal fungi (in grams)',
      'Average mass of plants grown in soil treated to kill fungi (in grams)',
      'Corn yes 15.1 3.8',
      'Marigold yes 10.2 2.4',
      'Broccoli no 7.5 7',
      ...prose,
    ]
    expect(stripEmbeddedReadingTableLines('rw1-17',corrupted)).toEqual(prose)
  })

  it('leaves ordinary question prose untouched',()=>{
    expect(stripEmbeddedReadingTableLines('rw1-17',prose)).toEqual(prose)
  })

  it('does not change questions without a structured table definition',()=>{
    expect(stripEmbeddedReadingTableLines('rw1-14',prose)).toEqual(prose)
  })

  it('keeps Q17’s four-column table fitted to the review pane',()=>{
    const table=readingTableSpec('rw1-17')
    expect(table?.fitToPane).toBe(true)
    expect(table?.columnWidths).toEqual(['20%','23%','29%','28%'])
  })
})
