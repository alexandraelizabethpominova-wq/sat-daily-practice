import {BarChart3,BookOpen,Bug,ChevronLeft,ChevronRight,Gamepad2,Layers3,LogIn,Map,Settings,SlidersHorizontal,Sparkles,Trophy} from 'lucide-react'
import type {ReactNode} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexButtonBase from '../atoms/AlexButtonBase'
import AlexStack from '../atoms/AlexStack'
import AlexText from '../atoms/AlexText'
import AlexTooltip from '../atoms/AlexTooltip'

type Item={key:string;label:string;active?:boolean;onClick:()=>void;icon?:ReactNode}

type Props={
  brand?:string
  primary:Item[]
  secondary?:Item[]
  footerLabel?:string
  footerDetail?:string
  signedIn?:boolean
  collapsed?:boolean
  onToggleCollapsed?:()=>void
  onFooterClick?:()=>void
}

const defaultIcon=(key:string)=>{
  if(key==='study')return <Map size={19}/>
  if(key==='practice-tests')return <Trophy size={19}/>
  if(key==='practice-setup')return <SlidersHorizontal size={19}/>
  if(key==='question-bank')return <Layers3 size={19}/>
  if(key==='parsing-issues')return <Bug size={19}/>
  if(key==='performance')return <BarChart3 size={19}/>
  if(key==='resources')return <BookOpen size={19}/>
  return <Gamepad2 size={19}/>
}

function NavItem({item,collapsed}:{item:Item;collapsed:boolean}){
  const button=(
    <AlexButtonBase
      onClick={item.onClick}
      aria-label={item.label}
      sx={{
        justifyContent:collapsed?'center':'flex-start',gap:1.25,width:'100%',minHeight:42,
        px:collapsed?1:1.5,py:1.05,borderRadius:1.6,color:'#fff',
        bgcolor:item.active?'#6D5DFB':'transparent',boxShadow:item.active?'inset 0 0 0 1px rgba(255,255,255,.12), 0 3px 0 #4B3FCE':'none','&:hover':{bgcolor:item.active?'#6D5DFB':'#372B69'},
      }}
    >
      {item.icon??defaultIcon(item.key)}
      {!collapsed&&<AlexText component="span" sx={{fontSize:14,fontWeight:650}}>{item.label}</AlexText>}
    </AlexButtonBase>
  )
  return collapsed?<AlexTooltip title={item.label} placement="right">{button}</AlexTooltip>:button
}

export default function SideNavigation({brand='Alexified',primary,secondary=[],footerLabel='Sign in',footerDetail='',signedIn=false,collapsed=false,onToggleCollapsed,onFooterClick}:Props){
  const width=collapsed?76:244
  const tooltipLabel=signedIn?footerLabel:'Sign in'
  return <AlexBox component="aside" sx={{width,minWidth:width,minHeight:'100vh',bgcolor:'#251B4B',color:'#fff',display:'flex',flexDirection:'column',px:collapsed?1:1.5,py:2.2,position:'sticky',top:0,height:'100vh',transition:'width .18s ease, min-width .18s ease',zIndex:30}}>
    <AlexBox sx={{display:'flex',alignItems:'center',gap:.5,mb:1.2}}>
      <AlexButtonBase onClick={primary[0]?.onClick} aria-label={brand} sx={{justifyContent:collapsed?'center':'flex-start',gap:1.1,color:'#fff',fontWeight:850,px:collapsed?.8:1.2,py:1.1,borderRadius:1.5,flex:1,minWidth:0}}>
        <Sparkles size={18} color="#FFD166"/>
        {!collapsed&&<AlexBox sx={{display:'grid',minWidth:0,textAlign:'left'}}><AlexText component="span" sx={{fontWeight:900,fontSize:16,lineHeight:1.05}}>{brand}</AlexText><AlexText component="span" sx={{fontSize:8.5,fontWeight:850,letterSpacing:'.11em',color:'#CFC8ED',mt:.3}}>SAT PREP, ALEXIFIED</AlexText></AlexBox>}
      </AlexButtonBase>
      {onToggleCollapsed&&<AlexTooltip title={collapsed?'Expand menu':'Collapse menu'} placement="right">
        <AlexButtonBase onClick={onToggleCollapsed} aria-label={collapsed?'Expand menu':'Collapse menu'} sx={{color:'#E8E3FF',width:30,height:30,minWidth:30,borderRadius:'50%'}}>
          {collapsed?<ChevronRight size={17}/>:<ChevronLeft size={17}/>} 
        </AlexButtonBase>
      </AlexTooltip>}
    </AlexBox>

    <AlexStack spacing={.45}>{primary.map(item=><NavItem item={item} collapsed={collapsed} key={item.key}/>)}</AlexStack>

    {secondary.length>0&&<AlexBox sx={{mt:2.35}}>
      {!collapsed&&<AlexBox sx={{display:'flex',alignItems:'center',gap:1.1,px:1.25,mb:1}}>
        <AlexText sx={{fontSize:10.5,letterSpacing:'.03em',whiteSpace:'nowrap',color:'#E8E3FF'}}>BONUS MENU</AlexText>
        <AlexBox sx={{height:'1px',bgcolor:'#766D99',flex:1}}/>
      </AlexBox>}
      <AlexStack spacing={.45}>{secondary.map(item=><NavItem item={item} collapsed={collapsed} key={item.key}/>)}</AlexStack>
    </AlexBox>}

    <AlexBox sx={{mt:'auto',pt:2}}>
      <AlexTooltip title={collapsed?tooltipLabel:''} placement="right">
        <AlexButtonBase onClick={onFooterClick} aria-label={signedIn?`${footerLabel} account`:'Sign in'} sx={{borderRadius:2,bgcolor:'#30245E',px:collapsed?1:1.5,py:1.25,display:'flex',alignItems:'center',justifyContent:collapsed?'center':'flex-start',gap:1.2,width:'100%',color:'#fff'}}>
          {signedIn?<AlexBox sx={{width:32,height:32,borderRadius:'50%',bgcolor:'#7BE0B5',display:'grid',placeItems:'center',color:'#251B4B',fontWeight:850,flex:'0 0 auto'}}>{footerLabel.slice(0,1).toUpperCase()}</AlexBox>:<AlexBox sx={{width:32,height:32,borderRadius:'50%',bgcolor:'#6D5DFB',display:'grid',placeItems:'center',color:'#fff',flex:'0 0 auto'}}><LogIn size={17}/></AlexBox>}
          {!collapsed&&<AlexBox sx={{minWidth:0,flex:1,textAlign:'left'}}>
            <AlexText sx={{fontSize:13.5,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{signedIn?footerLabel:'Sign in'}</AlexText>
            {signedIn&&footerDetail&&<AlexText sx={{fontSize:10.5,color:'#CEC7EA',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{footerDetail}</AlexText>}
          </AlexBox>}
          {!collapsed&&signedIn&&<Settings size={17}/>} 
        </AlexButtonBase>
      </AlexTooltip>
    </AlexBox>
  </AlexBox>
}
