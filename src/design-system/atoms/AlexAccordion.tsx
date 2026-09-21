import type {ReactNode} from 'react'
import {ChevronDown} from 'lucide-react'
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
      expandIcon={<ChevronDown aria-hidden="true" size={18} strokeWidth={1.8}/>} 
      sx={{
        minHeight:48,
        px:2,
        '& .MuiAccordionSummary-content':{my:1},
        '& .MuiAccordionSummary-expandIconWrapper':{color:'#667085'},
      }}
    >
      {summary}
    </AccordionSummary>
    <AccordionDetails sx={{px:2,pt:0,pb:2}}>{children}</AccordionDetails>
  </Accordion>
}
