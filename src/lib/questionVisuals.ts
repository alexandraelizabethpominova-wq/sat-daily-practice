import {PRACTICE_TEST_5_MATH1_VISUALS} from './practiceTest5Math1Layout'

export type NormalizedCrop={x:number;y:number;width:number;height:number}
export type QuestionVisualSpec={afterLine:number;crop:NormalizedCrop;exact?:boolean}

// Crops are normalized within the already-verified question crop, not the full PDF page.
// Keep these deliberately a little generous so axes, labels, and geometry annotations are not clipped.
export const QUESTION_VISUALS:Record<string,QuestionVisualSpec>={
  'rw1-13':{afterLine:-1,crop:{x:.04,y:.050,width:.92,height:.385}},
  'rw2-13':{afterLine:-1,crop:{x:.02,y:.065,width:.46,height:.36}},
  'practice-test-6:rw1-14':{afterLine:-1,crop:{x:.04,y:.035,width:.40,height:.39},exact:true},
  'practice-test-6:rw1-15':{afterLine:-1,crop:{x:.10,y:.035,width:.88,height:.375},exact:true},
  'practice-test-6:rw2-13':{afterLine:-1,crop:{x:.02,y:.02,width:.46,height:.56},exact:true},
  'practice-test-6:math1-5':{afterLine:-1,crop:{x:.08,y:.03,width:.84,height:.42},exact:true},
  'practice-test-6:math1-14':{afterLine:-1,crop:{x:.10,y:.03,width:.82,height:.55},exact:true},
  'practice-test-6:math1-15':{afterLine:-1,crop:{x:.06,y:.03,width:.88,height:.44},exact:true},
  'practice-test-6:math1-21':{afterLine:-1,crop:{x:.05,y:.03,width:.90,height:.61},exact:true},
  'practice-test-6:math1-23':{afterLine:-1,crop:{x:.08,y:.02,width:.84,height:.26},exact:true},
  'practice-test-6:math1-24':{afterLine:-1,crop:{x:.08,y:.02,width:.84,height:.35},exact:true},
  'practice-test-6:math2-2':{afterLine:-1,crop:{x:.15,y:.03,width:.70,height:.35},exact:true},
  'practice-test-6:math2-4':{afterLine:0,crop:{x:.17,y:.14,width:.70,height:.51},exact:true},
  'practice-test-6:math2-5':{afterLine:-1,crop:{x:.12,y:.03,width:.76,height:.50},exact:true},
  'practice-test-6:math2-26':{afterLine:-1,crop:{x:.12,y:.03,width:.76,height:.38},exact:true},
  'math1-1':{afterLine:-1,crop:{x:.08,y:.07,width:.84,height:.39}},
  'math1-9':{afterLine:0,crop:{x:.06,y:.09,width:.88,height:.29}},
  'math1-10':{afterLine:0,crop:{x:.08,y:.10,width:.84,height:.43}},
  'math1-12':{afterLine:-1,crop:{x:.10,y:.08,width:.80,height:.44}},
  'math2-1':{afterLine:0,crop:{x:.07,y:.10,width:.86,height:.43}},
  'math2-16':{afterLine:0,crop:{x:.07,y:.09,width:.86,height:.34}},
  'math2-22':{afterLine:-1,crop:{x:.08,y:.08,width:.84,height:.43}},
  'math2-24':{afterLine:0,crop:{x:.07,y:.11,width:.86,height:.35}},
}

const QUESTION_VISUAL_GROUPS:Record<string,QuestionVisualSpec[]>={
  'practice-test-6:math1-2':[
    {afterLine:0,crop:{x:.14,y:.065,width:.40,height:.27},exact:true},
    {afterLine:1,crop:{x:.03,y:.46,width:.94,height:.52},exact:true},
  ],
}

/**
 * Give source visuals a small safety margin before rendering. PDF artwork often extends a
 * few pixels beyond the text-derived crop, especially labels on diagrams. Keeping the
 * expansion here (rather than in CSS) guarantees the actual raster contains the full visual.
 */
export function expandNormalizedCrop(crop:NormalizedCrop,paddingX=.03,paddingY=.015):NormalizedCrop{
  const x=Math.max(0,crop.x-paddingX)
  const y=Math.max(0,crop.y-paddingY)
  const right=Math.min(1,crop.x+crop.width+paddingX)
  const bottom=Math.min(1,crop.y+crop.height+paddingY)
  return{x,y,width:right-x,height:bottom-y}
}

export function questionVisualSpecs(questionId:string):QuestionVisualSpec[]{
  const grouped=QUESTION_VISUAL_GROUPS[questionId]
  if(grouped)return grouped
  const match=questionId.match(/^practice-test-5:math1-(\d+)$/)
  if(match){
    const spec=PRACTICE_TEST_5_MATH1_VISUALS[Number(match[1])]
    return spec?[spec]:[]
  }
  const spec=QUESTION_VISUALS[questionId]
  return spec?[spec]:[]
}

export function questionVisualSpec(questionId:string){
  return questionVisualSpecs(questionId)[0]
}
