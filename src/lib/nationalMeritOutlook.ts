import type {ScorePredictionBasis} from './performanceAnalytics'
import {estimateSectionPracticeScore} from './performanceAnalytics'

export type NationalMeritOutlook={
  projectedSelectionIndex:number
  qualifyingChance:number
  projectedReadingWriting:number
  projectedMath:number
}

const MASSACHUSETTS_2028_CUTOFF_MIDPOINT=222.5
const OUTLOOK_SCALE=1.4

function projectedPsatSectionScore(successRate:number){
  // SAT Suite scores share a common vertical scale, but PSAT/NMSQT sections cap at 760.
  return Math.min(760,estimateSectionPracticeScore(successRate))
}

export function buildNationalMeritOutlook(basis:ScorePredictionBasis|null):NationalMeritOutlook|null{
  if(!basis)return null
  const readingWriting=basis.sections.find(section=>section.subject==='english')
  const math=basis.sections.find(section=>section.subject==='math')
  if(!readingWriting||!math||readingWriting.questions<3||math.questions<3)return null

  const projectedReadingWriting=projectedPsatSectionScore(readingWriting.successRate)
  const projectedMath=projectedPsatSectionScore(math.successRate)
  const projectedSelectionIndex=Math.round((2*projectedReadingWriting+projectedMath)/10)

  // Smooth probability centered on the current Massachusetts 2028 estimated cutoff range (220–225).
  // This is an outlook, not a guarantee; it intentionally never reaches 0% or 100%.
  const raw=100/(1+Math.exp(-(projectedSelectionIndex-MASSACHUSETTS_2028_CUTOFF_MIDPOINT)/OUTLOOK_SCALE))
  const qualifyingChance=Math.max(2,Math.min(98,Math.round(raw)))

  return {projectedSelectionIndex,qualifyingChance,projectedReadingWriting,projectedMath}
}
