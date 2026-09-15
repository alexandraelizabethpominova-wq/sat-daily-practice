import type {ReactNode} from 'react'

type Props={children:ReactNode;className?:string}

export default function AlexStatusChip({children,className=''}:Props){
  return <span className={`alex-status-chip ${className}`.trim()}>{children}</span>
}
