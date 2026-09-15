import {Box,ButtonBase,Stack,Typography} from '@mui/material'
import {BookOpen,ChartNoAxesColumnIncreasing,ClipboardList,Compass,Settings,Sparkles} from 'lucide-react'
import type {ReactNode} from 'react'

type Item={label:string;active?:boolean;onClick:()=>void;icon?:ReactNode}

type Props={
  brand?:string
  primary:Item[]
  secondary?:Item[]
  footer?:string
}

const defaultIcon=(label:string)=>{
  if(label==='Study Plan')return <Compass size={19}/>
  if(label==='Practice Tests')return <ClipboardList size={19}/>
  if(label==='Question Bank')return <BookOpen size={19}/>
  if(label==='Performance')return <ChartNoAxesColumnIncreasing size={19}/>
  if(label==='Resources')return <BookOpen size={19}/>
  return <Settings size={19}/>
}

export default function SideNavigation({brand='SAT',primary,secondary=[],footer='Alex'}:Props){
  return <Box component="aside" sx={{width:244,minWidth:244,minHeight:'100vh',bgcolor:'#08275B',color:'#fff',display:'flex',flexDirection:'column',px:1.5,py:2.5,position:{md:'sticky'},top:0,height:{md:'100vh'}}}>
    <ButtonBase onClick={primary[0]?.onClick} sx={{justifyContent:'flex-start',gap:1.1,color:'#fff',fontWeight:850,px:1.2,py:1.2,borderRadius:1.5,width:'100%'}}><Sparkles size={18} color="#C9FF98"/><Typography component="span" sx={{fontWeight:850}}>{brand}</Typography></ButtonBase>
    <Stack spacing=.45 sx={{mt:1.4}}>
      {primary.map(item=><ButtonBase key={item.label} onClick={item.onClick} sx={{justifyContent:'flex-start',gap:1.25,width:'100%',px:1.5,py:1.25,borderRadius:1.6,color:'#fff',bgcolor:item.active?'#12477F':'transparent','&:hover':{bgcolor:'#12477F'}}}>{item.icon??defaultIcon(item.label)}<Typography component="span" sx={{fontSize:14,fontWeight:650}}>{item.label}</Typography></ButtonBase>)}
    </Stack>
    {secondary.length>0&&<Box sx={{mt:2.4}}><Box sx={{display:'flex',alignItems:'center',gap:1.1,px:1.25,mb:1}}><Typography sx={{fontSize:10.5,letterSpacing:'.03em',whiteSpace:'nowrap',color:'#DCE7F7'}}>ADDITIONAL TOOLS</Typography><Box sx={{height:'1px',bgcolor:'#AFC2DD',flex:1}}/></Box><Stack spacing=.45>{secondary.map(item=><ButtonBase key={item.label} onClick={item.onClick} sx={{justifyContent:'flex-start',gap:1.25,width:'100%',px:1.5,py:1.25,borderRadius:1.6,color:'#fff',bgcolor:item.active?'#12477F':'transparent','&:hover':{bgcolor:'#12477F'}}}>{item.icon??defaultIcon(item.label)}<Typography component="span" sx={{fontSize:14,fontWeight:650}}>{item.label}</Typography></ButtonBase>)}</Stack></Box>}
    <Box sx={{mt:'auto',pt:2}}><Box sx={{borderRadius:2,bgcolor:'#0D356C',px:1.5,py:1.45,display:'flex',alignItems:'center',gap:1.2}}><Box sx={{width:32,height:32,borderRadius:'50%',bgcolor:'#BDF3B0',display:'grid',placeItems:'center',color:'#08275B',fontWeight:850}}>{footer.slice(0,1).toUpperCase()}</Box><Typography sx={{fontSize:13.5,fontWeight:700}}>{footer}</Typography><Settings size={17} style={{marginLeft:'auto'}}/></Box></Box>
  </Box>
}
