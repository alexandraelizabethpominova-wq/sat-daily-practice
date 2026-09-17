import {ResponsiveBar} from '@nivo/bar'
import type {ComponentProps} from 'react'

type Props=ComponentProps<typeof ResponsiveBar>

export default function AlexBarChart(props:Props){
  return <ResponsiveBar {...props}/>
}
