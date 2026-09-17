import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexStack from '../atoms/AlexStack'
import AlexStatusChip from '../atoms/AlexStatusChip'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'

type Action={
  title:string
  detail?:string
  action:ReactNode
  status?:string
  compact?:boolean
}

type Props={
  title:string
  description:string
  icon?:ReactNode
  actions:Action[]
}

export default function PracticeOptionCard({title,description,icon,actions}:Props){
  return <AlexSurface sx={{bgcolor:'#F4F1EC',borderRadius:3,p:2,minHeight:420}}>
    <AlexBox sx={{display:'flex',gap:1.4,alignItems:'center',px:.5,pt:.4,pb:1.8}}>
      <AlexBox sx={{width:36,height:36,borderRadius:'50%',bgcolor:'#C7DFFF',display:'grid',placeItems:'center',flex:'0 0 auto',color:'#08275B'}}>{icon}</AlexBox>
      <AlexBox><AlexText component="h3" sx={{fontSize:18,fontWeight:750,lineHeight:1.2,mb:.35}}>{title}</AlexText><AlexText sx={{fontSize:13.5,color:'#16315D'}}>{description}</AlexText></AlexBox>
    </AlexBox>
    <AlexStack spacing={1.45}>
      {actions.map((item,index)=><AlexSurface key={`${item.title}-${index}`} sx={{bgcolor:'#fff',borderRadius:2.2,minHeight:item.compact?154:156,p:2,display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:2,borderBottom:'1px dashed #C9D9EE'}}>
        <AlexStack spacing={1.05} sx={{alignSelf:'stretch',justifyContent:'flex-start',minWidth:0}}>
          {item.status&&<AlexStatusChip>{item.status}</AlexStatusChip>}
          <AlexText component="b" sx={{fontSize:15.5,fontWeight:750,color:'#08275B'}}>{item.title}</AlexText>
          {item.detail&&<AlexText component="small" sx={{fontSize:12.5,color:'#687386',lineHeight:1.45}}>{item.detail}</AlexText>}
        </AlexStack>
        <AlexBox sx={{flex:'0 0 auto',alignSelf:'flex-end'}}>{item.action}</AlexBox>
      </AlexSurface>)}
    </AlexStack>
  </AlexSurface>
}
