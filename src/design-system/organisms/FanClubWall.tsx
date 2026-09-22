import {useCallback,useEffect,useState} from 'react'
import {Heart,MessageCircle,Sparkles} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexStatusChip from '../atoms/AlexStatusChip'
import AlexSurface from '../atoms/AlexSurface'
import AlexText from '../atoms/AlexText'
import {loadPublicFeedback,type AppFeedbackVibe,type PublicFeedbackPost} from '../../lib/supabase'

const VIBE_META:Record<AppFeedbackVibe,{label:string;emoji:string;bg:string;border:string}>={
  'love-it':{label:'Love it',emoji:'💜',bg:'#F4F0FF',border:'#D7CFFF'},
  'pretty-good':{label:'Pretty good',emoji:'✨',bg:'#FFF7D9',border:'#F1D97D'},
  'needs-work':{label:'Needs work',emoji:'🛠️',bg:'#FFE9E3',border:'#F4B9AA'},
}

function timeLabel(value:string){
  const date=new Date(value)
  if(Number.isNaN(date.getTime()))return ''
  const now=Date.now()
  const diff=now-date.getTime()
  const minutes=Math.floor(diff/60000)
  if(minutes<1)return 'just now'
  if(minutes<60)return `${minutes}m ago`
  const hours=Math.floor(minutes/60)
  if(hours<24)return `${hours}h ago`
  const days=Math.floor(hours/24)
  if(days<7)return `${days}d ago`
  return date.toLocaleDateString(undefined,{month:'short',day:'numeric'})
}

export default function FanClubWall(){
  const[posts,setPosts]=useState<PublicFeedbackPost[]>([])
  const[loading,setLoading]=useState(true)
  const[error,setError]=useState('')

  const refresh=useCallback(async()=>{
    setLoading(true)
    setError('')
    try{
      setPosts(await loadPublicFeedback())
    }catch(err){
      console.warn('Fan Club feedback load failed',err)
      setError('The Fan Club wall could not load right now.')
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    void refresh()
    const onPosted=()=>void refresh()
    window.addEventListener('alexified-feedback-posted',onPosted)
    return()=>window.removeEventListener('alexified-feedback-posted',onPosted)
  },[refresh])

  const openFeedback=()=>window.dispatchEvent(new CustomEvent('alexified-open-feedback'))

  return <main className="shell">
    <AlexSurface sx={{
      p:{xs:2.4,md:3.2},
      mt:2,
      mb:2.5,
      borderRadius:5,
      border:'2px solid #D9D1FF',
      bgcolor:'#EEE9FF',
      boxShadow:'0 6px 0 #D7CFFF',
      overflow:'hidden',
      position:'relative',
    }}>
      <AlexBox sx={{position:'absolute',right:-38,top:-46,width:150,height:150,borderRadius:'50%',bgcolor:'rgba(255,209,102,.42)'}}/>
      <AlexBox sx={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:{xs:'flex-start',md:'center'},gap:2,flexDirection:{xs:'column',md:'row'}}}>
        <AlexBox>
          <AlexStatusChip sx={{mb:1.2}}>BONUS MENU</AlexStatusChip>
          <AlexText component="h1" sx={{
            m:0,
            fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',
            fontSize:{xs:34,md:46},
            lineHeight:1,
            fontWeight:950,
            letterSpacing:'-.04em',
            color:'#251B4B',
          }}>
            Alexified Fan Club
          </AlexText>
          <AlexText sx={{mt:1.2,maxWidth:660,color:'#5B5278',fontSize:15.5,lineHeight:1.6}}>
            The wall of notes from people getting Alexified. Only feedback someone chooses to post publicly shows up here.
          </AlexText>
        </AlexBox>
        <AlexButton onClick={openFeedback} startIcon={<MessageCircle size={17}/>}>Drop a post</AlexButton>
      </AlexBox>
    </AlexSurface>

    {loading&&<AlexSurface sx={{p:3,borderRadius:4,border:'2px solid #E6E1F2',textAlign:'center'}}>
      <AlexText sx={{color:'#6D6785',fontWeight:750}}>Loading the wall...</AlexText>
    </AlexSurface>}

    {!loading&&error&&<AlexSurface sx={{p:3,borderRadius:4,border:'2px solid #F4B9AA',bgcolor:'#FFF5F2',textAlign:'center'}}>
      <AlexText sx={{color:'#923D31',fontWeight:800}}>{error}</AlexText>
      <AlexButton tone="secondary" sx={{mt:1.5}} onClick={()=>void refresh()}>Try again</AlexButton>
    </AlexSurface>}

    {!loading&&!error&&posts.length===0&&<AlexSurface sx={{
      p:{xs:3,md:5},borderRadius:4,border:'2px dashed #CFC5FF',bgcolor:'#FCFBFF',textAlign:'center'
    }}>
      <AlexBox sx={{width:58,height:58,borderRadius:'50%',bgcolor:'#EEE9FF',display:'grid',placeItems:'center',mx:'auto',color:'#6D5DFB'}}>
        <Heart size={27}/>
      </AlexBox>
      <AlexText component="h2" sx={{mt:1.5,fontSize:22,fontWeight:950,color:'#251B4B'}}>The wall is waiting for its first post.</AlexText>
      <AlexText sx={{mt:.7,color:'#6D6785'}}>Drop Alex a line and choose “Post to Alexified Fan Club.”</AlexText>
      <AlexButton sx={{mt:1.8}} onClick={openFeedback} startIcon={<Sparkles size={17}/>}>Be the first</AlexButton>
    </AlexSurface>}

    {!loading&&!error&&posts.length>0&&<AlexBox sx={{
      display:'grid',
      gridTemplateColumns:{xs:'1fr',sm:'repeat(2,minmax(0,1fr))',xl:'repeat(3,minmax(0,1fr))'},
      gap:1.7,
      pb:4,
    }}>
      {posts.map(post=>{
        const vibe=post.vibe?VIBE_META[post.vibe]:null
        return <AlexSurface key={post.id} sx={{
          p:2.2,
          borderRadius:4,
          border:'2px solid #E6E1F2',
          bgcolor:'#fff',
          boxShadow:'0 5px 0 rgba(57,43,105,.08)',
          display:'flex',
          flexDirection:'column',
          minHeight:185,
        }}>
          <AlexBox sx={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:1,mb:1.5}}>
            {vibe?<AlexBox sx={{
              display:'inline-flex',alignItems:'center',gap:.7,
              px:1.05,py:.58,borderRadius:999,
              bgcolor:vibe.bg,border:`1px solid ${vibe.border}`,
            }}>
              <AlexText component="span" sx={{fontSize:14,lineHeight:1}}>{vibe.emoji}</AlexText>
              <AlexText component="span" sx={{fontSize:10.5,fontWeight:900,color:'#51486A',textTransform:'uppercase',letterSpacing:'.05em'}}>{vibe.label}</AlexText>
            </AlexBox>:<AlexBox/>}
            <AlexText sx={{fontSize:11,color:'#8A849C'}}>{timeLabel(post.createdAt)}</AlexText>
          </AlexBox>

          <AlexText sx={{fontSize:15.5,lineHeight:1.6,color:'#30274B',fontWeight:650,whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>
            “{post.message}”
          </AlexText>

          <AlexBox sx={{display:'flex',alignItems:'center',gap:.8,mt:'auto',pt:2}}>
            <AlexBox sx={{width:28,height:28,borderRadius:'50%',bgcolor:'#FFD166',display:'grid',placeItems:'center',fontWeight:950,color:'#251B4B'}}>A</AlexBox>
            <AlexText sx={{fontSize:11.5,color:'#6D6785',fontWeight:800}}>Alexified Player</AlexText>
          </AlexBox>
        </AlexSurface>
      })}
    </AlexBox>}
  </main>
}
