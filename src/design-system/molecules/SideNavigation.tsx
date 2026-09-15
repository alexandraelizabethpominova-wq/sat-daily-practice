import {Sparkles} from 'lucide-react'

type Item={label:string;active?:boolean;onClick:()=>void}

type Props={
  brand?:string
  primary:Item[]
  secondary?:Item[]
  footer?:string
}

export default function SideNavigation({brand='SAT',primary,secondary=[],footer='SAT Daily'}:Props){
  return <aside className="side-nav">
    <button className="side-brand" onClick={primary[0]?.onClick}><Sparkles size={18}/> {brand}</button>
    <div className="side-links">
      {primary.map(item=><button className={item.active?'active':''} onClick={item.onClick} key={item.label}>{item.label}</button>)}
      {secondary.length>0&&<><span>ADDITIONAL TOOLS</span>{secondary.map(item=><button className={item.active?'active':''} onClick={item.onClick} key={item.label}>{item.label}</button>)}</>}
    </div>
    <div className="side-footer">{footer}</div>
  </aside>
}
