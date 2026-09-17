import {readFileSync,readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,expect,it} from 'vitest'

const guardedLayers=[
  ['design-system','molecules'],
  ['design-system','organisms'],
  ['components'],
] as const

const directMuiImport=/from\s+['"]@mui\/material(?:\/[^'"]*)?['"]/m

describe('atomic design boundaries',()=>{
  it.each(guardedLayers)('%s UI code consumes MUI through wrapper atoms',(...segments)=>{
    const directory=resolve(process.cwd(),'src',...segments)
    const files=readdirSync(directory).filter(file=>file.endsWith('.tsx')&&!file.endsWith('.test.tsx'))
    const directMuiImports=files.filter(file=>directMuiImport.test(readFileSync(resolve(directory,file),'utf8')))
    expect(directMuiImports,`${segments.join('/')} must not import @mui/material directly`).toEqual([])
  })
})
