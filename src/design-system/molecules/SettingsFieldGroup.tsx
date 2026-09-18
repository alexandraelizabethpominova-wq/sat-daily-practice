import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'

type Props={
  children:ReactNode
}

export default function SettingsFieldGroup({children}:Props){
  return <AlexBox
    sx={{
      border:'1px solid #E4E7EC',
      borderRadius:2,
      bgcolor:'#fff',
      px:{xs:2,md:2.5},
      py:.5,
      '& > * + *':{borderTop:'1px solid #EAECF0'},
    }}
  >
    {children}
  </AlexBox>
}
