import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexText from '../atoms/AlexText'

type Props={
  label:string
  helperText?:string
  control:ReactNode
}

export default function PracticeSettingField({label,helperText,control}:Props){
  return <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',md:'minmax(220px,1fr) minmax(260px,1fr)'},gap:{xs:1,md:3},alignItems:'center',py:1.25}}>
    <AlexBox>
      <AlexText component="div" sx={{fontWeight:750,color:'#08275B',fontSize:15.5}}>{label}</AlexText>
      {helperText&&<AlexText component="div" sx={{mt:.5,color:'#667085',fontSize:13.5,lineHeight:1.45}}>{helperText}</AlexText>}
    </AlexBox>
    <AlexBox sx={{minWidth:0}}>{control}</AlexBox>
  </AlexBox>
}
