import {useEffect,useRef,useState} from 'react'
import {Maximize2,Minus,Plus} from 'lucide-react'
import AlexIconButton from '../atoms/AlexIconButton'
import SourceSlice from '../../components/SourceSlice'
import {clampSourceZoom,SOURCE_ZOOM_MAX,SOURCE_ZOOM_MIN,SOURCE_ZOOM_STEP,sourceViewerFitZoom} from '../../lib/sourceViewerZoom'
import type {ModuleKey,PracticeTestId,SourceCrop} from '../../types'

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
  sourceCrop?:SourceCrop|null
}

export default function SourceViewer({
  pdfKey,bytes,page,questionNumber,alt,label,
  minZoom=SOURCE_ZOOM_MIN,maxZoom=SOURCE_ZOOM_MAX,zoomStep=SOURCE_ZOOM_STEP,practiceTestId,module,sourceCrop,
}:Props){
  const viewerRef=useRef<HTMLDivElement|null>(null)
  const manualZoomRef=useRef(false)
  const[fitZoom,setFitZoom]=useState(1)
  const[zoom,setZoom]=useState(1)
  const viewLabel=label??(pdfKey==='questions'?'Question view':'Explanation view')

  useEffect(()=>{
    const node=viewerRef.current
    if(!node)return

    const update=()=>{
      const next=clampSourceZoom(sourceViewerFitZoom(node.clientWidth),minZoom,maxZoom)
      setFitZoom(next)
      if(!manualZoomRef.current)setZoom(next)
    }

    update()

    if(typeof ResizeObserver!=='undefined'){
      const observer=new ResizeObserver(update)
      observer.observe(node)
      return()=>observer.disconnect()
    }

    window.addEventListener('resize',update)
    return()=>window.removeEventListener('resize',update)
  },[minZoom,maxZoom])

  useEffect(()=>{
    manualZoomRef.current=false
    setZoom(fitZoom)
  },[pdfKey,page,questionNumber,fitZoom])

  const zoomOut=()=>{
    manualZoomRef.current=true
    setZoom(value=>clampSourceZoom(value-zoomStep,minZoom,maxZoom))
  }
  const zoomIn=()=>{
    manualZoomRef.current=true
    setZoom(value=>clampSourceZoom(value+zoomStep,minZoom,maxZoom))
  }
  const fitToViewer=()=>{
    manualZoomRef.current=false
    setZoom(fitZoom)
  }

  return <div className="source-viewer" ref={viewerRef}>
    <div className="source-viewer-toolbar">
      <span>{viewLabel}</span>
      <div>
        <AlexIconButton label="Zoom out" onClick={zoomOut} disabled={zoom<=minZoom}><Minus size={17}/></AlexIconButton>
        <span className="source-viewer-zoom-value">{Math.round(zoom*100)}%</span>
        <AlexIconButton label="Zoom in" onClick={zoomIn} disabled={zoom>=maxZoom}><Plus size={17}/></AlexIconButton>
        <AlexIconButton label={`Fit ${pdfKey==='questions'?'question':'explanation'} to viewer`} onClick={fitToViewer} disabled={Math.abs(zoom-fitZoom)<.001}><Maximize2 size={16}/></AlexIconButton>
      </div>
    </div>
    <SourceSlice pdfKey={pdfKey} bytes={bytes} page={page} questionNumber={questionNumber} alt={alt} zoom={zoom} practiceTestId={practiceTestId} module={module} sourceCrop={sourceCrop}/>
  </div>
}
