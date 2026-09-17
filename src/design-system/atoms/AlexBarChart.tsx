import {ResponsiveBar,type BarDatum,type ResponsiveBarSvgProps} from '@nivo/bar'

type Props=ResponsiveBarSvgProps<BarDatum>

export default function AlexBarChart(props:Props){
  return <ResponsiveBar {...props}/>
}
