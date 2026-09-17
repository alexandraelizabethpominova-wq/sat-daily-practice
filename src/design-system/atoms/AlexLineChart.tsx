import {ResponsiveLine,type LineSvgProps, type Serie} from '@nivo/line'

type Props=LineSvgProps<Serie>

export default function AlexLineChart(props:Props){
  return <ResponsiveLine {...props}/>
}
