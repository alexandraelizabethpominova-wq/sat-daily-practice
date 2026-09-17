import {ResponsiveLine} from '@nivo/line'
import type {ComponentProps} from 'react'

type Props=ComponentProps<typeof ResponsiveLine>

export default function AlexLineChart(props:Props){
  return <ResponsiveLine {...props}/>
}
