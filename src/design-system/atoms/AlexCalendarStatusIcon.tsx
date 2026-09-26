import {SvgIcon,type SvgIconProps} from '@mui/material'

type Props=Omit<SvgIconProps,'children'>&{kind:'check'|'close'}

export default function AlexCalendarStatusIcon({kind,...props}:Props){
  return <SvgIcon viewBox="0 0 24 24" {...props}>
    {kind==='check'
      ?<path d="m9 16.2-3.5-3.5L4.1 14.1 9 19 20.3 7.7l-1.4-1.4z"/>
      :<path d="M18.3 5.7 12 12l-6.3-6.3-1.4 1.4L10.6 13.4l-6.3 6.3 1.4 1.4L12 14.8l6.3 6.3 1.4-1.4-6.3-6.3 6.3-6.3z"/>
    }
  </SvgIcon>
}
