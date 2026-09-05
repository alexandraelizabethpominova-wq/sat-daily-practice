import {IconButton,type IconButtonProps,Tooltip} from '@mui/material'

type Props=IconButtonProps&{label:string}

export default function AlexIconButton({label,...props}:Props){
  return <Tooltip title={label}><span><IconButton aria-label={label} size="small" {...props}/></span></Tooltip>
}
