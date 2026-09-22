import {Button,type ButtonProps} from '@mui/material'

type Props=ButtonProps&{tone?:'primary'|'secondary'|'quiet'}

export default function AlexButton({tone='primary',sx,...props}:Props){
  const variant=tone==='primary'?'contained':tone==='secondary'?'outlined':'text'
  return <Button
    variant={variant}
    color="primary"
    sx={{
      fontWeight:850,
      minHeight:42,
      borderRadius:3.5,
      ...(tone==='secondary'&&{
        bgcolor:'#fff',
        borderWidth:2,
        '&:hover':{borderWidth:2,bgcolor:'#F5F2FF'},
      }),
      ...(tone==='quiet'&&{
        color:'#5B5278',
        '&:hover':{bgcolor:'#F0EDFA'},
      }),
      ...sx,
    }}
    {...props}
  />
}
