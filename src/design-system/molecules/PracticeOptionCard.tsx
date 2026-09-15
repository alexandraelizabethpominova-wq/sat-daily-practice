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
  return <article className="option-card">
    <div className="option-card-title">
      <span className="option-dot">{icon}</span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </div>
    <div className="section-actions">
      {actions.map((item,index)=><div className={`option-action${item.compact?' compact':''}`} key={`${item.title}-${index}`}>
        <div>
          {item.status&&<AlexStatusChip>{item.status}</AlexStatusChip>}
          <b>{item.title}</b>
          {item.detail&&<small>{item.detail}</small>}
        </div>
        {item.action}
      </div>)}
    </div>
  </article>
}
