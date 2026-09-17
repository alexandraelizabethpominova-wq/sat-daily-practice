import {LinearProgress,type LinearProgressProps} from '@mui/material'

export default function AlexProgress({variant='determinate',...props}:LinearProgressProps){
  return <LinearProgress variant={variant} {...props}/>
}
