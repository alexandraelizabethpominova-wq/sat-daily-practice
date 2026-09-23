import {describe,expect,it} from 'vitest'
import {nonWhiteContentBounds} from './sourceImageTrim'

function pixels(width:number,height:number,marks:Array<[number,number]>){
  const data=new Uint8ClampedArray(width*height*4).fill(255)
  for(const [x,y] of marks){
    const offset=(y*width+x)*4
    data[offset]=20
    data[offset+1]=20
    data[offset+2]=20
    data[offset+3]=255
  }
  return data
}

describe('sourceImageTrim',()=>{
  it('finds the right and bottom edge of useful source content',()=>{
    expect(nonWhiteContentBounds(pixels(10,8,[[1,1],[6,5]]),10,8)).toEqual({right:7,bottom:6})
  })

  it('returns null for an empty white crop',()=>{
    expect(nonWhiteContentBounds(pixels(4,4,[]),4,4)).toBeNull()
  })
})
