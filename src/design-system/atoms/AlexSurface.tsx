import {Paper,type PaperProps} from '@mui/material'

export default function AlexSurface({elevation=0,sx,...props}:PaperProps){
  return <Paper
    elevation={elevation}
    sx={{borderRadius:'18px',...sx}}
    {...props}
  />
}
