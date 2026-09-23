export const SOURCE_ZOOM_MIN=.75
export const SOURCE_ZOOM_MAX=2
export const SOURCE_ZOOM_STEP=.1

export function sourceViewerFitZoom(containerWidth:number){
  if(containerWidth>=680)return 1.2
  if(containerWidth>=480)return 1.1
  return 1
}

export function clampSourceZoom(value:number,min=SOURCE_ZOOM_MIN,max=SOURCE_ZOOM_MAX){
  return Math.min(max,Math.max(min,Math.round(value*100)/100))
}
