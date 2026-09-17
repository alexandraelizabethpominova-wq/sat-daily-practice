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
})
