import {FormControlLabel,Switch,type SwitchProps} from '@mui/material'

type Props={
  label:string
  checked:boolean
  onChange:(checked:boolean)=>void
  disabled?:boolean
  switchProps?:Omit<SwitchProps,'checked'|'onChange'|'disabled'>
}

export default function AlexSwitch({label,checked,onChange,disabled=false,switchProps}:Props){
  return <FormControlLabel
    control={<Switch {...switchProps} checked={checked} disabled={disabled} onChange={(_,next)=>onChange(next)}/>} 
    label={label}
  />
}
