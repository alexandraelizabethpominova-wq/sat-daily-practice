import {readFileSync,readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,expect,it} from 'vitest'

const guardedLayers=['design-system/molecules','design-system/organisms','components'] as const
const directMuiImport=/from\s+['"]@mui\/material(?:\/[^'"]*)?['"]/m
const directNivoImport=/from\s+['"]@nivo\/(?:bar|line)(?:\/[^'"]*)?['"]/m

describe('atomic design boundaries',()=>{
  it.each(guardedLayers)('%s UI code consumes MUI through wrapper atoms',layer=>{
    const directory=resolve(process.cwd(),'src',layer)
    const files=readdirSync(directory).filter(file=>file.endsWith('.tsx')&&!file.endsWith('.test.tsx'))
    const directMuiImports=files.filter(file=>directMuiImport.test(readFileSync(resolve(directory,file),'utf8')))
    expect(directMuiImports,`${layer} must not import @mui/material directly`).toEqual([])
  })

  it.each(guardedLayers)('%s UI code consumes Nivo through wrapper atoms',layer=>{
    const directory=resolve(process.cwd(),'src',layer)
    const files=readdirSync(directory).filter(file=>file.endsWith('.tsx')&&!file.endsWith('.test.tsx'))
    const directNivoImports=files.filter(file=>directNivoImport.test(readFileSync(resolve(directory,file),'utf8')))
    expect(directNivoImports,`${layer} must not import Nivo chart packages directly`).toEqual([])
  })

  it('routes source PDF UI through the SourceViewer molecule',()=>{
    const layers=['design-system/molecules','design-system/organisms'] as const
    const offenders:string[]=[]
    for(const layer of layers){
      const directory=resolve(process.cwd(),'src',layer)
      for(const file of readdirSync(directory).filter(file=>file.endsWith('.tsx')&&!file.endsWith('.test.tsx')&&file!=='SourceViewer.tsx')){
        const source=readFileSync(resolve(directory,file),'utf8')
        if(/components\/SourceSlice/.test(source))offenders.push(`${layer}/${file}`)
      }
    }
    expect(offenders,'SourceSlice is low-level; compose it through SourceViewer').toEqual([])
  })

  it('uses grouped setting rows for Study Plan configuration',()=>{
    const source=readFileSync(resolve(process.cwd(),'src/design-system/molecules/PracticeGoalSettings.tsx'),'utf8')
    expect(source).toContain("./SettingsFieldGroup")
  })

  it('uses the shared SectionPanel molecule for Study Plan sections',()=>{
    const files=['StudyPlanGoalsPanel.tsx','StudyPlanRecommendation.tsx']
    for(const file of files){
      const source=readFileSync(resolve(process.cwd(),'src/design-system/organisms',file),'utf8')
      expect(source,`${file} should compose its section through SectionPanel`).toContain("../molecules/SectionPanel")
    }
  })

})