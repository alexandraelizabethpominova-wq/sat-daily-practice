import type {ReactNode} from 'react'
import {IconButton,SvgIcon,Tooltip} from '@mui/material'

type Props={
  label:string
  title:ReactNode
}

function InfoIcon(){
  return <SvgIcon viewBox="0 0 24 24">
    <path d="M11 17h2v-6h-2v6Zm1-15a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-1-11h2V7h-2v2Z"/>
  </SvgIcon>
}

export default function AlexInfoTooltipButton({label,title}:Props){
  return <Tooltip
    title={title}
    arrow
    placement="top"
    enterDelay={120}
    slotProps={{popper:{sx:{zIndex:1600}},tooltip:{sx:{maxWidth:340,p:1.25,fontSize:12,lineHeight:1.45}}}}
  >
    <IconButton
      aria-label={label}
      size="small"
      sx={{p:.35,color:'inherit','& svg':{width:16,height:16}}}
    >
      <InfoIcon/>
    </IconButton>
  </Tooltip>
}
