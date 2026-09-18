import type {ReactNode} from 'react'
import {Accordion,AccordionDetails,AccordionSummary,type AccordionProps} from '@mui/material'

type Props=Omit<AccordionProps,'children'>&{
  summary:ReactNode
  children:ReactNode
}

export default function AlexAccordion({summary,children,sx,...props}:Props){
  return <Accordion
    disableGutters
    elevation={0}
    sx={sx?[
      {
        border:'1px solid #E4E7EC',
        borderRadius:'12px !important',
        overflow:'hidden',
        '&:before':{display:'none'},
      },
      ...(Array.isArray(sx)?sx:[sx]),
    ]:{
      border:'1px solid #E4E7EC',
      borderRadius:'12px !important',
      overflow:'hidden',
      '&:before':{display:'none'},
    }}
    {...props}
  >
    <AccordionSummary
      expandIcon={<span aria-hidden="true" style={{fontSize:18,lineHeight:1}}>⌄</span>}
      sx={{minHeight:48,px:2,'& .MuiAccordionSummary-content':{my:1}}}
    >
      {summary}
    </AccordionSummary>
    <AccordionDetails sx={{px:2,pt:0,pb:2}}>{children}</AccordionDetails>
  </Accordion>
}
