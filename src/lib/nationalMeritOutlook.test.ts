import {describe,expect,it} from 'vitest'
import {buildNationalMeritOutlook} from './nationalMeritOutlook'
import type {ScorePredictionBasis} from './performanceAnalytics'

function basis(rw:number,math:number):ScorePredictionBasis{
  return {
    sessionCount:10,
    questionCount:80,
    averageQuestionSuccessRate:Math.round((rw+math)/2),
    sections:[
      {subject:'english',label:'Reading & Writing',questions:40,successRate:rw},
      {subject:'math',label:'Math',questions:40,successRate:math},
    ],
  }
}

describe('National Merit outlook',()=>{
  it('projects a maximum PSAT Selection Index from very strong balanced performance',()=>{
    const outlook=buildNationalMeritOutlook(basis(100,100))
    expect(outlook).toMatchObject({
      projectedReadingWriting:760,
      projectedMath:760,
      projectedSelectionIndex:228,
      qualifyingChance:98,
    })
  })

  it('improves dynamically as section performance improves',()=>{
    const lower=buildNationalMeritOutlook(basis(90,90))
    const higher=buildNationalMeritOutlook(basis(95,95))
    expect(lower).not.toBeNull()
    expect(higher).not.toBeNull()
    expect(higher!.projectedSelectionIndex).toBeGreaterThan(lower!.projectedSelectionIndex)
    expect(higher!.qualifyingChance).toBeGreaterThan(lower!.qualifyingChance)
  })

  it('requires enough recent questions in both sections',()=>{
    const sparse:ScorePredictionBasis={
      ...basis(95,95),
      sections:[
        {subject:'english',label:'Reading & Writing',questions:2,successRate:95},
        {subject:'math',label:'Math',questions:40,successRate:95},
      ],
    }
    expect(buildNationalMeritOutlook(sparse)).toBeNull()
  })
})
