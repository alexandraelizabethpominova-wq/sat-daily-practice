import QuestionVisualSlice from '../../components/QuestionVisualSlice'
import AlexBox from '../atoms/AlexBox'
import AlexDropdown from '../atoms/AlexDropdown'
import AlexNumberField from '../atoms/AlexNumberField'
import AlexSurface from '../atoms/AlexSurface'
import AlexSwitch from '../atoms/AlexSwitch'
import AlexText from '../atoms/AlexText'
import type {NormalizedCrop,QuestionVisualSpec} from '../../lib/questionVisuals'
import type {PracticeQuestion} from '../../types'

type Props={
  question:PracticeQuestion
  bytes:ArrayBuffer|null
  value:QuestionVisualSpec|null
  onChange:(value:QuestionVisualSpec|null)=>void
  lineCount:number
}

const DEFAULT_CROP:NormalizedCrop={x:.05,y:.05,width:.9,height:.4}

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}

export default function VisualCropEditor({question,bytes,value,onChange,lineCount}:Props){
  const crop=value?.crop??DEFAULT_CROP
  const updateCrop=(field:keyof NormalizedCrop,percent:number)=>{
    const next={...crop,[field]:percent/100}
    next.x=clamp(next.x,0,.95)
    next.y=clamp(next.y,0,.95)
    next.width=clamp(next.width,.05,1-next.x)
    next.height=clamp(next.height,.05,1-next.y)
    onChange({afterLine:value?.afterLine??-1,crop:next,exact:true})
  }
  const placementOptions=[
    {value:-1,label:'Before all question text'},
    ...Array.from({length:lineCount},(_,index)=>({value:index,label:`After text line ${index+1}`})),
  ]

  return <AlexSurface sx={{p:2,border:'1px solid #E6E2DB',borderRadius:2.5,bgcolor:'#FBFAF8'}}>
    <AlexSwitch
      label="Use a cropped source visual"
      checked={Boolean(value)}
      onChange={checked=>onChange(checked?{afterLine:-1,crop:DEFAULT_CROP,exact:true}:null)}
    />
    {value&&<AlexBox sx={{display:'grid',gap:1.5,mt:1.25}}>
      <AlexDropdown
        id={`visual-placement-${question.id}`}
        label="Visual placement"
        value={value.afterLine}
        options={placementOptions}
        onChange={afterLine=>onChange({...value,afterLine:Number(afterLine),exact:true})}
      />
      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr 1fr',md:'repeat(4,1fr)'},gap:1}}>
        <AlexNumberField label="Left %" value={Math.round(crop.x*100)} min={0} max={95} onChange={next=>updateCrop('x',next)}/>
        <AlexNumberField label="Top %" value={Math.round(crop.y*100)} min={0} max={95} onChange={next=>updateCrop('y',next)}/>
        <AlexNumberField label="Width %" value={Math.round(crop.width*100)} min={5} max={Math.round((1-crop.x)*100)} onChange={next=>updateCrop('width',next)}/>
        <AlexNumberField label="Height %" value={Math.round(crop.height*100)} min={5} max={Math.round((1-crop.y)*100)} onChange={next=>updateCrop('height',next)}/>
      </AlexBox>
      <AlexText sx={{fontSize:12.5,color:'#667085'}}>Crop percentages are relative to the detected question region. Adjust them while watching the preview.</AlexText>
      {bytes
        ?<AlexSurface sx={{p:1.25,border:'1px solid #D0D5DD',borderRadius:2,bgcolor:'#fff'}}><QuestionVisualSlice question={question} bytes={bytes} crop={crop} alt={`Crop preview for question ${question.number}`} expand={false}/></AlexSurface>
        :<AlexText sx={{fontSize:13,color:'#667085'}}>Add the question source PDF in Resources to preview and adjust the crop.</AlexText>}
    </AlexBox>}
  </AlexSurface>
}
