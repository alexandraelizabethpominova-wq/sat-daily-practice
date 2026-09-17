import {Paper,type PaperProps} from '@mui/material'

export default function AlexSurface({elevation=0,...props}:PaperProps){
  return <Paper elevation={elevation} {...props}/>
}
