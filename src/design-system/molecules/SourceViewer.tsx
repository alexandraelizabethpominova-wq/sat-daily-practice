import {useEffect,useState} from 'react'
import {Maximize2,Minus,Plus} from 'lucide-react'
import AlexIconButton from '../atoms/AlexIconButton'
import SourceSlice from '../../components/SourceSlice'
import type {ModuleKey,PracticeTestId} from '../../types'

type Props={
  pdfKey:'questions'|'answers'
  bytes:ArrayBuffer
  page:number
  questionNumber:number
  alt:string
  label?:string
  minZoom?:number
  maxZoom?:number
  zoomStep?:number
  practiceTestId:PracticeTestId
  module?:ModuleKey
}

export default function SourceViewer({
  pdfKey,bytes,page,questionNumber,alt,label,
  minZoom=.7,maxZoom=1.8,zoomStep=.1,practiceTestId,module,
}:Props){
  const[zoom,setZoom]=useState(1)
  const viewLabel=label??(pdfKey==='questions'?'Question view':'Explanation view')

  useEffect(()=>{setZoom(1)},[pdfKey,page,questionNumber])

  const zoomOut=()=>setZoom(value=>Math.max(minZoom,+(value-zoomStep).toFixed(2)))
  const zoomIn=()=>setZoom(value=>Math.min(maxZoom,+(value+zoomStep).toFixed(2)))

  return <div className="source-viewer">
    <div className="source-viewer-toolbar">
      <span>{viewLabel}</span>
      <div>
        <AlexIconButton label="Zoom out" onClick={zoomOut} disabled={zoom<=minZoom}><Minus size={17}/></AlexIconButton>
        <span className="source-viewer-zoom-value">{Math.round(zoom*100)}%</span>
        <AlexIconButton label="Zoom in" onClick={zoomIn} disabled={zoom>=maxZoom}><Plus size={17}/></AlexIconButton>
        <AlexIconButton label={`Fit ${pdfKey==='questions'?'question':'explanation'} to screen`} onClick={()=>setZoom(1)} disabled={zoom===1}><Maximize2 size={16}/></AlexIconButton>
      </div>
    </div>
    <SourceSlice pdfKey={pdfKey} bytes={bytes} page={page} questionNumber={questionNumber} alt={alt} zoom={zoom} practiceTestId={practiceTestId} module={module}/>
  </div>
}
