import {readFileSync,readdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,expect,it} from 'vitest'

const layers=['molecules','organisms'] as const

describe('atomic design boundaries',()=>{
  it.each(layers)('%s consume MUI through wrapper atoms',layer=>{
    const directory=resolve(process.cwd(),'src','design-system',layer)
    const files=readdirSync(directory).filter(file=>file.endsWith('.tsx')&&!file.endsWith('.test.tsx'))
    const directMuiImports=files.filter(file=>readFileSync(resolve(directory,file),'utf8').includes("from '@mui/material'"))
    expect(directMuiImports,`${layer} must not import @mui/material directly`).toEqual([])
  })
})
