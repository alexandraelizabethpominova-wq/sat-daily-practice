import {Box,type BoxProps} from '@mui/material'
import type {ReactNode} from 'react'

type Props=BoxProps&{children:ReactNode}

export default function AlexStatusChip({children,sx,...props}:Props){
  return <Box component="span" sx={{
    display:'inline-flex',alignItems:'center',width:'max-content',
    px:1.1,py:.55,borderRadius:999,
    bgcolor:'#E9E4FF',color:'#4B3FCE',
    border:'1px solid #D7CFFF',
    fontSize:'0.64rem',lineHeight:1,fontWeight:900,letterSpacing:'.08em',textTransform:'uppercase',
    ...sx
  }} {...props}>{children}</Box>
}
