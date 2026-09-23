export type ContentBounds={right:number;bottom:number}

export function nonWhiteContentBounds(
  pixels:Uint8ClampedArray,
  width:number,
  height:number,
  threshold=248,
):ContentBounds|null{
  let maxX=-1
  let maxY=-1

  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const offset=(y*width+x)*4
      const alpha=pixels[offset+3]
      if(alpha===0)continue
      const r=pixels[offset]
      const g=pixels[offset+1]
      const b=pixels[offset+2]
      if(r<threshold||g<threshold||b<threshold){
        if(x>maxX)maxX=x
        if(y>maxY)maxY=y
      }
    }
  }

  return maxX>=0&&maxY>=0?{right:maxX+1,bottom:maxY+1}:null
}
