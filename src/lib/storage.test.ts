import {describe,expect,it} from 'vitest'
import {DEFAULT_SETTINGS} from './storage'

describe('default practice settings',()=>{
  it('provides cloud settings defaults without browser persistence',()=>{
    expect(DEFAULT_SETTINGS).toMatchObject({
      mode:'both',
      questionsPerSession:10,
      showExplanations:true,
      shuffle:true,
      practiceTest:'all',
      selectionMode:'adaptive',
      failedOnly:false,
      failedEverOnly:false,
      targetPracticeSets:8,
      targetCoveragePercent:100,
      fallbackMinutesPerQuestion:2,
    })
  })

  it('uses a future default exam date',()=>{
    expect(DEFAULT_SETTINGS.targetExamDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(new Date(`${DEFAULT_SETTINGS.targetExamDate}T12:00:00`).getTime()).toBeGreaterThan(Date.now())
  })
})
