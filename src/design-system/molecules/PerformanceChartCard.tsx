import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Props={
  title:string
  description?:string
  children:ReactNode
  minHeight?:number
}

export default function PerformanceChartCard({title,description,children,minHeight=300}:Props){
  return <AlexSurface sx={{p:{xs:2,md:2.5},border:'1px solid #E6E2DB',borderRadius:3,minWidth:0}}>
    <AlexText component="h2" sx={{fontSize:18,fontWeight:800,color:'#08275B'}}>{title}</AlexText>
    {description&&<AlexText sx={{fontSize:13,color:'#667085',mt:.5}}>{description}</AlexText>}
    <AlexBox sx={{height:minHeight,mt:2,minWidth:0}}>{children}</AlexBox>
  </AlexSurface>
}
