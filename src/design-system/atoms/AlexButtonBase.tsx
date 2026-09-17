import {forwardRef} from 'react'
import {ButtonBase,type ButtonBaseProps} from '@mui/material'

const AlexButtonBase=forwardRef<HTMLButtonElement,ButtonBaseProps>(function AlexButtonBase(props,ref){
  return <ButtonBase ref={ref} {...props}/>
})

export default AlexButtonBase
