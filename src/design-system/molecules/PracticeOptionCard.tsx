import {Box,Paper,Stack,Typography} from '@mui/material'
import type {ReactNode} from 'react'
import AlexStatusChip from '../atoms/AlexStatusChip'

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
  return <Paper elevation={0} sx={{bgcolor:'#F4F1EC',borderRadius:3,p:2,minHeight:420}}>
    <Box sx={{display:'flex',gap:1.4,alignItems:'center',px:.5,pt:.4,pb:1.8}}>
      <Box sx={{width:36,height:36,borderRadius:'50%',bgcolor:'#C7DFFF',display:'grid',placeItems:'center',flex:'0 0 auto',color:'#08275B'}}>{icon}</Box>
      <Box><Typography component="h3" sx={{fontSize:18,fontWeight:750,lineHeight:1.2,mb:.35}}>{title}</Typography><Typography sx={{fontSize:13.5,color:'#16315D'}}>{description}</Typography></Box>
    </Box>
    <Stack spacing={1.45}>
      {actions.map((item,index)=><Paper key={`${item.title}-${index}`} elevation={0} sx={{bgcolor:'#fff',borderRadius:2.2,minHeight:item.compact?154:156,p:2,display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:2,borderBottom:'1px dashed #C9D9EE'}}>
        <Stack spacing={1.05} sx={{alignSelf:'stretch',justifyContent:'flex-start',minWidth:0}}>
          {item.status&&<AlexStatusChip>{item.status}</AlexStatusChip>}
          <Typography component="b" sx={{fontSize:15.5,fontWeight:750,color:'#08275B'}}>{item.title}</Typography>
          {item.detail&&<Typography component="small" sx={{fontSize:12.5,color:'#687386',lineHeight:1.45}}>{item.detail}</Typography>}
        </Stack>
        <Box sx={{flex:'0 0 auto',alignSelf:'flex-end'}}>{item.action}</Box>
      </Paper>)}
    </Stack>
  </Paper>
}
