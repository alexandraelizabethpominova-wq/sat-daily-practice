import {useEffect,useMemo,useState} from 'react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexDropdown from '../atoms/AlexDropdown'
import AlexStatusChip from '../atoms/AlexStatusChip'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import {availablePracticeTests,moduleLabel,practiceTestLabel} from '../../lib/questionBank'
import {deleteParsingIssueReport,loadParsingIssueReports,setParsingIssueStatus,type ParsingIssueReport,type ParsingIssueStatus} from '../../lib/parsingIssueReports'
import type {PracticeTestFilter} from '../../types'

type StatusFilter='all'|ParsingIssueStatus

export default function ParsingIssuesDashboard(){
  const[reports,setReports]=useState<ParsingIssueReport[]>([])
  const[practiceTest,setPracticeTest]=useState<PracticeTestFilter>('all')
  const[statusFilter,setStatusFilter]=useState<StatusFilter>('all')
  const[loading,setLoading]=useState(true)
  const[error,setError]=useState('')

  async function refresh(){
    setLoading(true);setError('')
    try{setReports(await loadParsingIssueReports())}
    catch(reason){setError(reason instanceof Error?reason.message:'Unable to load parsing reports.')}
    finally{setLoading(false)}
  }

  useEffect(()=>{
    void refresh()
    const handler=()=>void refresh()
    window.addEventListener('sat-parsing-issues-updated',handler)
    return()=>window.removeEventListener('sat-parsing-issues-updated',handler)
  },[])

  const filtered=useMemo(()=>reports.filter(report=>
    (practiceTest==='all'||report.practiceTestId===practiceTest)&&(statusFilter==='all'||report.status===statusFilter)
  ),[reports,practiceTest,statusFilter])

  const testOptions=[{value:'all' as const,label:'All practice tests'},...availablePracticeTests().map(value=>({value,label:practiceTestLabel(value)}))]

  async function changeStatus(report:ParsingIssueReport,status:ParsingIssueStatus){
    try{await setParsingIssueStatus(report.id,status);setReports(items=>items.map(item=>item.id===report.id?{...item,status,updatedAt:new Date().toISOString()}:item))}
    catch(reason){setError(reason instanceof Error?reason.message:'Unable to update report.')}
  }

  async function remove(report:ParsingIssueReport){
    if(!window.confirm('Delete this parsing issue report?'))return
    try{await deleteParsingIssueReport(report.id);setReports(items=>items.filter(item=>item.id!==report.id))}
    catch(reason){setError(reason instanceof Error?reason.message:'Unable to delete report.')}
  }

  return <main className="shell">
    <AlexBox sx={{display:'flex',justifyContent:'space-between',alignItems:{xs:'flex-start',md:'flex-end'},gap:2,flexDirection:{xs:'column',md:'row'},mb:2.5}}>
      <AlexBox>
        <AlexText sx={{fontSize:12,textTransform:'uppercase',letterSpacing:'.12em',fontWeight:800,color:'#6558F5'}}>Quality review</AlexText>
        <AlexText component="h1" sx={{fontFamily:'Georgia, "Times New Roman", serif',fontSize:{xs:32,md:42},lineHeight:1.1,my:1,color:'#08275B'}}>Parsing Issues</AlexText>
        <AlexText sx={{color:'#667085',maxWidth:720}}>Shared queue of parsing and formatting problems reported by signed-in users. Everyone can review the queue and mark issues resolved for now.</AlexText>
      </AlexBox>
      <AlexBox sx={{display:'grid',gridTemplateColumns:{xs:'1fr',sm:'1fr 1fr'},gap:1,minWidth:{xs:'100%',md:430}}}>
        <AlexDropdown id="parsing-issues-test" label="Practice test" value={practiceTest} options={testOptions} onChange={setPracticeTest}/>
        <AlexDropdown id="parsing-issues-status" label="Status" value={statusFilter} options={[{value:'all',label:'All statuses'},{value:'open',label:'Open'},{value:'resolved',label:'Resolved'}]} onChange={setStatusFilter}/>
      </AlexBox>
    </AlexBox>

    {error&&<AlexSurface sx={{p:2,border:'1px solid #FDA29B',borderRadius:2,bgcolor:'#FFFBFA',mb:2}}><AlexText sx={{color:'#B42318',fontSize:14}}>{error}</AlexText></AlexSurface>}
    {loading?<AlexText sx={{color:'#667085'}}>Loading parsing issues…</AlexText>:filtered.length===0?<AlexSurface sx={{p:3,border:'1px solid #E6E2DB',borderRadius:3}}><AlexText component="h2" sx={{fontSize:19,fontWeight:800}}>No matching reports</AlexText><AlexText sx={{color:'#667085',mt:.5}}>Flag a question from practice, review, the Question Bank, or question statistics and it will appear in this shared queue.</AlexText></AlexSurface>:
    <AlexBox sx={{display:'grid',gap:1.25}}>
      {filtered.map(report=><AlexSurface key={report.id} sx={{p:{xs:2,md:2.5},border:'1px solid #E6E2DB',borderRadius:2.5}}>
        <AlexBox sx={{display:'flex',justifyContent:'space-between',gap:2,alignItems:'flex-start',flexWrap:'wrap'}}>
          <AlexBox>
            <AlexBox sx={{display:'flex',gap:.75,alignItems:'center',flexWrap:'wrap',mb:.5}}>
              <AlexStatusChip>{report.status}</AlexStatusChip>
              <AlexText sx={{fontSize:12,color:'#667085'}}>{practiceTestLabel(report.practiceTestId)} · {report.context.replace('-',' ')} · {report.isOwnReport?'your report':'shared report'}</AlexText>
            </AlexBox>
            <AlexText component="h2" sx={{fontSize:17,fontWeight:800,color:'#08275B'}}>{moduleLabel(report.module)} · Q{report.questionNumber}</AlexText>
            <AlexText sx={{fontSize:12,color:'#667085',mt:.35}}>Question ID: {report.questionId} · Reported {new Date(report.createdAt).toLocaleString()}</AlexText>
          </AlexBox>
          <AlexBox sx={{display:'flex',gap:.75,flexWrap:'wrap'}}>
            <AlexButton size="small" tone="secondary" onClick={()=>changeStatus(report,report.status==='open'?'resolved':'open')}>{report.status==='open'?'Mark resolved':'Reopen'}</AlexButton>
            <AlexButton size="small" tone="quiet" onClick={()=>remove(report)}>Delete</AlexButton>
          </AlexBox>
        </AlexBox>
        <AlexSurface sx={{mt:1.5,p:1.5,borderRadius:1.5,bgcolor:'#F7F6F2'}}>
          <AlexText sx={{fontSize:13.5,color:report.message?'#344054':'#98A2B3',fontStyle:report.message?'normal':'italic'}}>{report.message||'No note was provided.'}</AlexText>
        </AlexSurface>
      </AlexSurface>)}
    </AlexBox>}
  </main>
}
