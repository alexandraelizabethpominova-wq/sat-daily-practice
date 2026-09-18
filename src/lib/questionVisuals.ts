export type NormalizedCrop={x:number;y:number;width:number;height:number}
export type QuestionVisualSpec={afterLine:number;crop:NormalizedCrop}

// Crops are normalized within the already-verified question crop, not the full PDF page.
// Keep these deliberately a little generous so axes, labels, and geometry annotations are not clipped.
export const QUESTION_VISUALS:Record<string,QuestionVisualSpec>={
  'rw1-13':{afterLine:-1,crop:{x:.04,y:.065,width:.92,height:.40}},
  'rw1-15':{afterLine:-1,crop:{x:.02,y:.065,width:.96,height:.125}},
  'rw1-17':{afterLine:-1,crop:{x:.01,y:.065,width:.98,height:.19}},
  'rw2-13':{afterLine:-1,crop:{x:.02,y:.065,width:.46,height:.36}},
  'math1-1':{afterLine:0,crop:{x:.06,y:.10,width:.88,height:.42}},
  'math1-9':{afterLine:0,crop:{x:.06,y:.09,width:.88,height:.29}},
  'math1-10':{afterLine:0,crop:{x:.08,y:.10,width:.84,height:.43}},
  'math1-12':{afterLine:-1,crop:{x:.10,y:.08,width:.80,height:.44}},
  'math2-1':{afterLine:0,crop:{x:.07,y:.10,width:.86,height:.43}},
  'math2-16':{afterLine:0,crop:{x:.07,y:.09,width:.86,height:.34}},
  'math2-22':{afterLine:-1,crop:{x:.08,y:.08,width:.84,height:.43}},
  'math2-24':{afterLine:0,crop:{x:.07,y:.11,width:.86,height:.35}},
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

export function questionVisualSpec(questionId:string){
  return QUESTION_VISUALS[questionId]
}
