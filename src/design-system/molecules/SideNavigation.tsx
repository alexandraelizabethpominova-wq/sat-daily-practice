import {Box,ButtonBase,IconButton,Stack,Tooltip,Typography} from '@mui/material'
import {BookOpen,ChartNoAxesColumnIncreasing,ChevronLeft,ChevronRight,ClipboardList,Compass,Settings,Sparkles} from 'lucide-react'
import type {ReactNode} from 'react'

type Item={key:string;label:string;active?:boolean;onClick:()=>void;icon?:ReactNode}

type Props={
  brand?:string
  primary:Item[]
  secondary?:Item[]
  footer?:string
  collapsed?:boolean
  onToggleCollapsed?:()=>void
  onFooterClick?:()=>void
}

const defaultIcon=(label:string)=>{
  if(label==='Study Plan')return <Compass size={19}/>
  if(label==='Practice Tests')return <ClipboardList size={19}/>
  if(label==='Question Bank')return <BookOpen size={19}/>
  if(label==='Performance')return <ChartNoAxesColumnIncreasing size={19}/>
  if(label==='Resources')return <BookOpen size={19}/>
  return <Settings size={19}/>
}

function NavItem({item,collapsed}:{item:Item;collapsed:boolean}){
  const button=<ButtonBase onClick={item.onClick} aria-label={item.label} sx={{justifyContent:collapsed?'center':'flex-start',gap:1.25,width:'100%',minHeight:42,px:collapsed?1:1.5,py:1.05,borderRadius:1.6,color:'#fff',bgcolor:item.active?'#12477F':'transparent','&:hover':{bgcolor:'#12477F'}}}>{item.icon??defaultIcon(item.label)}{!collapsed&&<Typography component="span" sx={{fontSize:14,fontWeight:650}}>{item.label}</Typography>}</ButtonBase>
  return collapsed?<Tooltip title={item.label} placement="right">{button}</Tooltip>:button
}

export default function SideNavigation({brand='SAT',primary,secondary=[],footer='Alex',collapsed=false,onToggleCollapsed,onFooterClick}:Props){
  const width=collapsed?76:244
  return <Box component="aside" sx={{width,minWidth:width,minHeight:'100vh',bgcolor:'#08275B',color:'#fff',display:'flex',flexDirection:'column',px:collapsed?1:1.5,py:2.2,position:'sticky',top:0,height:'100vh',transition:'width .18s ease, min-width .18s ease',zIndex:30}}>
    <Box sx={{display:'flex',alignItems:'center',gap:.5,mb:1.2}}>
      <ButtonBase onClick={primary[0]?.onClick} aria-label={brand} sx={{justifyContent:collapsed?'center':'flex-start',gap:1.1,color:'#fff',fontWeight:850,px:collapsed?0.8:1.2,py:1.1,borderRadius:1.5,flex:1,minWidth:0}}><Sparkles size={18} color="#C9FF98"/>{!collapsed&&<Typography component="span" sx={{fontWeight:850}}>{brand}</Typography>}</ButtonBase>
      {onToggleCollapsed&&<Tooltip title={collapsed?'Expand menu':'Collapse menu'} placement="right"><IconButton onClick={onToggleCollapsed} size="small" aria-label={collapsed?'Expand menu':'Collapse menu'} sx={{color:'#DCE7F7',width:30,height:30}}>{collapsed?<ChevronRight size={17}/>:<ChevronLeft size={17}/>}</IconButton></Tooltip>}
    </Box>
    <Stack spacing=.45>
      {primary.map(item=><NavItem item={item} collapsed={collapsed} key={item.key}/>) }
    </Stack>
    {secondary.length>0&&<Box sx={{mt:2.35}}>{!collapsed&&<Box sx={{display:'flex',alignItems:'center',gap:1.1,px:1.25,mb:1}}><Typography sx={{fontSize:10.5,letterSpacing:'.03em',whiteSpace:'nowrap',color:'#DCE7F7'}}>ADDITIONAL TOOLS</Typography><Box sx={{height:'1px',bgcolor:'#AFC2DD',flex:1}}/></Box>}<Stack spacing=.45>{secondary.map(item=><NavItem item={item} collapsed={collapsed} key={item.key}/>)}</Stack></Box>}
    <Box sx={{mt:'auto',pt:2}}><Tooltip title={collapsed?footer:''} placement="right"><ButtonBase onClick={onFooterClick} aria-label={`${footer} settings`} sx={{borderRadius:2,bgcolor:'#0D356C',px:collapsed?1:1.5,py:1.25,display:'flex',alignItems:'center',justifyContent:collapsed?'center':'flex-start',gap:1.2,width:'100%',color:'#fff'}}><Box sx={{width:32,height:32,borderRadius:'50%',bgcolor:'#BDF3B0',display:'grid',placeItems:'center',color:'#08275B',fontWeight:850,flex:'0 0 auto'}}>{footer.slice(0,1).toUpperCase()}</Box>{!collapsed&&<><Typography sx={{fontSize:13.5,fontWeight:700}}>{footer}</Typography><Settings size={17} style={{marginLeft:'auto'}}/></>}</ButtonBase></Tooltip></Box>
  </Box>
}
