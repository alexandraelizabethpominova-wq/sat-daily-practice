import {Box,Typography,type BoxProps} from '@mui/material'
import {Star} from 'lucide-react'
import AlexCalendarStatusIcon from './AlexCalendarStatusIcon'

export type AlexCalendarDayVariant='circle'|'star'
export type AlexCalendarDayMarker='check'|'close'

type Props=Omit<BoxProps,'children'|'sx'>&{
  day:number
  variant?:AlexCalendarDayVariant
  backgroundColor?:string
  borderColor?:string
  textColor?:string
  isToday?:boolean
  marker?:AlexCalendarDayMarker
}

export default function AlexCalendarDay({
  day,
  variant='circle',
  backgroundColor='#FAFAF8',
  borderColor='#E8E4DD',
  textColor='#08275B',
  isToday=false,
  marker,
  ...props
}:Props){
  const isStar=variant==='star'
  const markerIsCheck=marker==='check'

  return <Box
    component="span"
    sx={{
      width:'100%',
      aspectRatio:'1 / 1',
      maxWidth:{xs:38,xl:34},
      justifySelf:'center',
      borderRadius:isStar?0:'50%',
      border:isStar?'none':'1px solid',
      borderColor:isToday?'#6558F5':borderColor,
      bgcolor:isStar?'transparent':backgroundColor,
      color:textColor,
      display:'grid',
      placeItems:'center',
      position:'relative',
      boxShadow:!isStar&&isToday?'0 0 0 1px #6558F5 inset':'none',
      cursor:'help',
      outline:'none',
      '&:focus-visible':{boxShadow:'0 0 0 2px #6558F5'},
    }}
    {...props}
  >
    {isStar&&<Box
      aria-hidden="true"
      sx={{
        position:'absolute',
        left:'50%',
        top:'50%',
        width:44,
        height:44,
        display:'grid',
        placeItems:'center',
        transform:'translate(-50%,-53%)',
        zIndex:0,
      }}
    >
      <Star
        size={44}
        strokeWidth={1.7}
        fill="#F5C451"
        color={isToday?'#6558F5':'#9B6A00'}
      />
    </Box>}

    <Typography sx={{
      position:'relative',
      zIndex:2,
      fontSize:{xs:10,sm:11.5},
      fontWeight:isStar||isToday?900:700,
      lineHeight:1,
      color:isStar?'#08275B':'inherit',
      transform:isStar?'translateY(-1.5px)':'none',
    }}>{day}</Typography>

    {marker&&<Box
      aria-hidden="true"
      sx={{
        position:'absolute',
        zIndex:3,
        top:-2.5,
        right:-2.5,
        width:markerIsCheck?14:13,
        height:markerIsCheck?14:13,
        borderRadius:'50%',
        bgcolor:'#fff',
        border:'1px solid',
        borderColor:markerIsCheck?'#A6D8BE':'#F1B5B0',
        boxShadow:'0 1px 3px rgba(16,24,40,.14)',
        display:'grid',
        placeItems:'center',
      }}
    >
      <AlexCalendarStatusIcon
        kind={marker}
        sx={{
          width:markerIsCheck?10:9.5,
          height:markerIsCheck?10:9.5,
          color:markerIsCheck?'#027A48':'#B42318',
        }}
      />
    </Box>}
  </Box>
}
