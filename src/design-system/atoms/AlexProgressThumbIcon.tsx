import {SvgIcon,type SvgIconProps} from '@mui/material'

type Props=Omit<SvgIconProps,'children'>&{direction:'up'|'down'}

export default function AlexProgressThumbIcon({direction,...props}:Props){
  return <SvgIcon viewBox="0 0 24 24" {...props}>
    {direction==='up'
      ?<path d="M2 20h4V9H2v11Zm20-10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59A2 2 0 0 0 6 9v9c0 1.1.9 2 2 2h9c.82 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1Z"/>
      :<path d="M22 4h-4v11h4V4ZM2 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L10.83 23l6.58-6.59A2 2 0 0 0 18 15V6c0-1.1-.9-2-2-2H7c-.82 0-1.54.5-1.84 1.22L2.14 12.27c-.09.23-.14.47-.14.73v1Z"/>
    }
  </SvgIcon>
}
