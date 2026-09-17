import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={icon:ReactNode;label:string;value:string}

export default function MetricCard({icon,label,value}:Props){
  return <AlexSurface sx={{p:2.2,border:'1px solid #E6E2DB',borderRadius:3,boxShadow:'0 8px 24px rgba(9,35,79,.045)'}}>
    <AlexBox sx={{display:'grid',gap:.8,color:'#6558F5'}}>{icon}</AlexBox>
    <AlexText sx={{mt:1,color:'#667085',fontSize:14}}>{label}</AlexText>
    <AlexText component="b" sx={{display:'block',mt:.5,fontSize:26,fontWeight:850,color:'#08275B'}}>{value}</AlexText>
  </AlexSurface>
}
