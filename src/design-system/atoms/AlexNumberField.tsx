import {TextField,type TextFieldProps} from '@mui/material'

type Props=Omit<TextFieldProps,'type'|'onChange'|'value'>&{
  value:number
  min?:number
  max?:number
  onChange:(value:number)=>void
}

export default function AlexNumberField({value,min,max,onChange,...props}:Props){
  return <TextField
    {...props}
    type="number"
    size="small"
    value={value}
    inputProps={{min,max,...props.inputProps}}
    onChange={e=>{
      const next=Number(e.target.value)
      if(Number.isNaN(next))return
      onChange(Math.max(min??-Infinity,Math.min(max??Infinity,next)))
    }}
  />
}
