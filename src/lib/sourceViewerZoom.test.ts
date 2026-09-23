import {describe,expect,it} from 'vitest'
import {clampSourceZoom,sourceViewerFitZoom} from './sourceViewerZoom'

describe('sourceViewerZoom',()=>{
  it('uses mobile-first fit zoom values based on the viewer width',()=>{
    expect(sourceViewerFitZoom(360)).toBe(1)
    expect(sourceViewerFitZoom(520)).toBe(1.1)
    expect(sourceViewerFitZoom(760)).toBe(1.2)
  })

  it('clamps interactive zoom values',()=>{
    expect(clampSourceZoom(.4)).toBe(.75)
    expect(clampSourceZoom(1.36)).toBe(1.36)
    expect(clampSourceZoom(2.4)).toBe(2)
  })
})
