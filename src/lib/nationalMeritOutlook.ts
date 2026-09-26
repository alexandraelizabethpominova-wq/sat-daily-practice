import type {ScoreEstimateConfidence,ScorePredictionBasis} from './performanceAnalytics'
import {estimateSectionPracticeScore} from './performanceAnalytics'

export type NationalMeritOutlook={
  projectedSelectionIndex:number
  qualifyingChance:number
  projectedReadingWriting:number
  projectedMath:number
  selectionIndexSigma:number
}

const MASSACHUSETTS_2028_CUTOFF_MIN=220
const MASSACHUSETTS_2028_CUTOFF_MAX=225
const MASSACHUSETTS_2028_CUTOFF_MIDPOINT=(MASSACHUSETTS_2028_CUTOFF_MIN+MASSACHUSETTS_2028_CUTOFF_MAX)/2
const MASSACHUSETTS_CUTOFF_SIGMA=(MASSACHUSETTS_2028_CUTOFF_MAX-MASSACHUSETTS_2028_CUTOFF_MIN)/Math.sqrt(12)

// College Board's approximate PSAT/NMSQT score ranges derived from measurement error.
const PSAT_RW_MEASUREMENT_SIGMA=20
const PSAT_MATH_MEASUREMENT_SIGMA=30

function projectedPsatSectionScore(successRate:number){
  // SAT Suite scores share a common vertical scale, but PSAT/NMSQT sections cap at 760.
  return Math.min(760,estimateSectionPracticeScore(successRate))
}

function erf(value:number){
  const sign=value<0?-1:1
  const x=Math.abs(value)
  const t=1/(1+.3275911*x)
  const y=1-(((((1.061405429*t-1.453152027)*t+1.421413741)*t-.284496736)*t+.254829592)*t)*Math.exp(-x*x)
  return sign*y
}

function normalCdf(value:number){
  return .5*(1+erf(value/Math.sqrt(2)))
}

export function buildNationalMeritOutlook(
  basis:ScorePredictionBasis|null,
  confidence:ScoreEstimateConfidence|null,
):NationalMeritOutlook|null{
  if(!basis||!confidence)return null
  const readingWriting=basis.sections.find(section=>section.subject==='english')
  const math=basis.sections.find(section=>section.subject==='math')
  if(!readingWriting||!math||readingWriting.questions<3||math.questions<3)return null

  const projectedReadingWriting=projectedPsatSectionScore(readingWriting.successRate)
  const projectedMath=projectedPsatSectionScore(math.successRate)
  const projectedSelectionIndex=Math.round((2*projectedReadingWriting+projectedMath)/10)

  // Convert recent whole-score instability into section-level uncertainty,
  // then combine it with practice-question sampling uncertainty and the
  // PSAT's own section measurement error.
  const sectionTrendSigma=confidence.trendSigmaPoints/Math.sqrt(2)
  const rwSigma=Math.sqrt(
    PSAT_RW_MEASUREMENT_SIGMA**2+
    confidence.readingWritingQuestionSigmaPoints**2+
    sectionTrendSigma**2
  )
  const mathSigma=Math.sqrt(
    PSAT_MATH_MEASUREMENT_SIGMA**2+
    confidence.mathQuestionSigmaPoints**2+
    sectionTrendSigma**2
  )

  // Selection Index = (2*RW + Math)/10.
  const selectionIndexSigma=Math.sqrt((2*rwSigma)**2+mathSigma**2)/10

  // The future Massachusetts cutoff is uncertain too, so compare two
  // distributions rather than treating the projected cutoff as fixed.
  const combinedSigma=Math.sqrt(selectionIndexSigma**2+MASSACHUSETTS_CUTOFF_SIGMA**2)
  const z=(projectedSelectionIndex-MASSACHUSETTS_2028_CUTOFF_MIDPOINT)/combinedSigma
  const rawChance=Math.round(100*normalCdf(z))
  const qualifyingChance=Math.max(2,Math.min(98,rawChance))

  return {
    projectedSelectionIndex,
    qualifyingChance,
    projectedReadingWriting,
    projectedMath,
    selectionIndexSigma:Math.round(selectionIndexSigma*10)/10,
  }
}
