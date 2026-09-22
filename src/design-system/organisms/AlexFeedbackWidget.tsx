import {useEffect,useState} from 'react'
import {Heart,MessageCircle,Smile,Wrench,X} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexButtonBase from '../atoms/AlexButtonBase'
import AlexCheckbox from '../atoms/AlexCheckbox'
import AlexDrawer from '../atoms/AlexDrawer'
import AlexIconButton from '../atoms/AlexIconButton'
import AlexText from '../atoms/AlexText'
import AlexTextField from '../atoms/AlexTextField'
import {submitAppFeedback,type AppFeedbackVibe} from '../../lib/supabase'

type Props={context?:string}

const VIBES:Array<{value:AppFeedbackVibe;label:string;icon:typeof Heart}>= [
  {value:'love-it',label:'Love it',icon:Heart},
  {value:'pretty-good',label:'Pretty good',icon:Smile},
  {value:'needs-work',label:'Needs work',icon:Wrench},
]

const ALEX_PHOTO='data:image/jpeg;base64,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'

function AlexAvatar({size=44}:{size?:number}){
  return <AlexBox
    aria-label="Alex"
    sx={{
      position:'relative',
      width:size,
      height:size,
      flex:`0 0 ${size}px`,
      borderRadius:'50%',
      bgcolor:'#FFD166',
      color:'#251B4B',
      display:'grid',
      placeItems:'center',
      fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',
      fontSize:size*.38,
      fontWeight:950,
      lineHeight:1,
      border:'2px solid #fff',
      boxShadow:'0 0 0 2px #251B4B, 0 4px 12px rgba(37,27,75,.20)',
      overflow:'hidden',
    }}
  >
    A
    <img
      src={ALEX_PHOTO}
      alt=""
      style={{
        position:'absolute',
        inset:0,
        width:'100%',
        height:'100%',
        display:'block',
        objectFit:'cover',
        objectPosition:'center 42%',
      }}
    />
  </AlexBox>
}

export default function AlexFeedbackWidget({context}:Props){
  const[open,setOpen]=useState(false)
  const[vibe,setVibe]=useState<AppFeedbackVibe|null>(null)
  const[message,setMessage]=useState('')
  const[sending,setSending]=useState(false)
  const[sent,setSent]=useState(false)
  const[error,setError]=useState('')
  const[sourceContext,setSourceContext]=useState(context)
  const[postPublic,setPostPublic]=useState(false)

  useEffect(()=>{
    const openFromFanClub=()=>{
      setSourceContext('fan-club')
      setSent(false)
      setError('')
      setOpen(true)
    }
    window.addEventListener('alexified-open-feedback',openFromFanClub)
    return()=>window.removeEventListener('alexified-open-feedback',openFromFanClub)
  },[])

  function reset(){
    setVibe(null)
    setMessage('')
    setSent(false)
    setError('')
    setPostPublic(false)
  }

  async function submit(){
    const trimmed=message.trim()
    if(!trimmed){
      setError('Drop Alex a quick line first.')
      return
    }
    setSending(true)
    setError('')
    try{
      const stored=await submitAppFeedback({vibe,message:trimmed,context:sourceContext,isPublic:postPublic})
      if(!stored)throw new Error('Feedback storage is unavailable.')
      setSent(true)
      setMessage('')
      if(postPublic)window.dispatchEvent(new CustomEvent('alexified-feedback-posted'))
    }catch(err){
      console.warn('Feedback submit failed',err)
      setError('Could not send that one. Try again in a sec.')
    }finally{
      setSending(false)
    }
  }

  return <>
    <AlexButtonBase
      aria-label="Open feedback form"
      title="Tell Alex what you think"
      onClick={()=>{setSourceContext(context);setOpen(true);setSent(false);setError('')}}
      sx={{
        position:'fixed',
        right:{xs:12,sm:18,md:22},
        bottom:{xs:12,sm:18,md:22},
        zIndex:1150,
        width:52,
        height:52,
        minWidth:52,
        p:0,
        borderRadius:'50%',
        bgcolor:'#6D5DFB',
        color:'#fff',
        border:'2px solid #fff',
        boxShadow:'0 0 0 2px #4B3FCE, 0 5px 14px rgba(37,27,75,.24)',
        transition:'transform .16s ease, box-shadow .16s ease, background-color .16s ease',
        '&:hover':{
          transform:'translateY(-2px)',
          bgcolor:'#5F50E8',
          boxShadow:'0 0 0 2px #4B3FCE, 0 8px 18px rgba(37,27,75,.28)',
        },
        '&:active':{transform:'translateY(0) scale(.97)'},
      }}
    >
      <MessageCircle size={22} strokeWidth={2.4}/>
    </AlexButtonBase>

    <AlexDrawer
      anchor="right"
      open={open}
      onClose={()=>setOpen(false)}
      ModalProps={{keepMounted:true}}
      PaperProps={{
        sx:{
          width:{xs:'min(92vw,390px)',sm:390},
          maxWidth:'100vw',
          bgcolor:'#FCFBFF',
          borderLeft:'2px solid #E6E1F2',
          boxShadow:'-18px 0 50px rgba(37,27,75,.16)',
        }
      }}
    >
      <AlexBox sx={{minHeight:'100%',display:'flex',flexDirection:'column'}}>
        <AlexBox sx={{
          position:'relative',
          p:2.5,
          pb:3,
          bgcolor:'#EEE9FF',
          borderBottom:'2px solid #D9D1FF',
          overflow:'hidden',
        }}>
          <AlexBox sx={{position:'absolute',width:110,height:110,borderRadius:'50%',bgcolor:'rgba(255,209,102,.34)',right:-35,top:-42}}/>
          <AlexBox sx={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:2,position:'relative'}}>
            <AlexBox sx={{display:'flex',alignItems:'center',gap:1.6}}>
              <AlexAvatar size={72}/>
              <AlexBox>
                <AlexText sx={{fontSize:10.5,fontWeight:950,letterSpacing:'.11em',color:'#6D5DFB',textTransform:'uppercase'}}>Alexified feedback</AlexText>
                <AlexText component="h2" sx={{
                  m:0,mt:.35,
                  fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',
                  fontSize:25,fontWeight:950,lineHeight:1.08,color:'#251B4B'
                }}>Hi — it’s Alex.</AlexText>
              </AlexBox>
            </AlexBox>
            <AlexIconButton label="Close feedback" onClick={()=>setOpen(false)} sx={{color:'#251B4B'}}><X size={19}/></AlexIconButton>
          </AlexBox>
          <AlexText sx={{position:'relative',mt:2,fontSize:15.5,fontWeight:800,lineHeight:1.45,color:'#40365E'}}>
            Enjoy being Alexified? Tell me more!
          </AlexText>
          <AlexText sx={{position:'relative',mt:.55,fontSize:13.5,lineHeight:1.5,color:'#6D6785'}}>
            Drop me a line about what feels great, what feels weird, or what would make Alexified better.
          </AlexText>
        </AlexBox>

        <AlexBox sx={{p:2.5,display:'grid',gap:2.2,flex:1,alignContent:'start'}}>
          {sent?<AlexBox sx={{
            p:2.3,borderRadius:4,bgcolor:'#DFF8ED',border:'2px solid #A7E6C9',
            boxShadow:'0 4px 0 #B7DEC9',textAlign:'center'
          }}>
            <AlexText sx={{fontSize:28,lineHeight:1}}>💌</AlexText>
            <AlexText component="h3" sx={{mt:1,fontSize:19,fontWeight:950,color:'#251B4B'}}>Got it. Thanks!</AlexText>
            <AlexText sx={{mt:.6,fontSize:13.5,color:'#526B61',lineHeight:1.5}}>{postPublic?'Your note made it to Alex and the Fan Club wall.':'Your note made it to Alex. Keep getting Alexified.'}</AlexText>
            <AlexButton tone="secondary" sx={{mt:1.6}} onClick={reset}>Send another</AlexButton>
          </AlexBox>:<>
            <AlexBox>
              <AlexText sx={{fontSize:12,fontWeight:900,color:'#51486A',mb:1}}>How’s the vibe?</AlexText>
              <AlexBox sx={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:.8}}>
                {VIBES.map(option=>{
                  const Icon=option.icon
                  const selected=vibe===option.value
                  return <AlexButtonBase
                    key={option.value}
                    aria-pressed={selected}
                    onClick={()=>setVibe(option.value)}
                    sx={{
                      minHeight:82,p:.8,borderRadius:3,
                      border:'2px solid',
                      borderColor:selected?'#6D5DFB':'#E6E1F2',
                      bgcolor:selected?'#EEE9FF':'#fff',
                      color:selected?'#4B3FCE':'#5B5278',
                      display:'grid',placeItems:'center',gap:.45,textAlign:'center',
                      boxShadow:selected?'0 3px 0 #CFC5FF':'0 3px 0 #F0ECF7',
                      '&:hover':{bgcolor:selected?'#EEE9FF':'#FAF8FF'},
                    }}
                  >
                    <Icon size={20}/>
                    <AlexText component="span" sx={{fontSize:11,fontWeight:850,lineHeight:1.15}}>{option.label}</AlexText>
                  </AlexButtonBase>
                })}
              </AlexBox>
            </AlexBox>

            <AlexTextField
              label="Drop a line"
              placeholder="Tell Alex what you're thinking..."
              multiline
              minRows={6}
              value={message}
              onChange={event=>{setMessage(event.target.value);if(error)setError('')}}
              inputProps={{maxLength:2000}}
              helperText={error||`${message.length}/2000`}
              error={Boolean(error)}
              sx={{
                '& .MuiOutlinedInput-root':{alignItems:'flex-start',bgcolor:'#fff'},
                '& .MuiFormHelperText-root':{mx:.25},
              }}
            />

            <AlexBox sx={{p:1.35,borderRadius:3,bgcolor:'#F4F0FF',border:'1px solid #D7CFFF'}}>
              <AlexCheckbox
                label="Post to Alexified Fan Club"
                checked={postPublic}
                onChange={setPostPublic}
              />
              <AlexText sx={{mt:.35,ml:4,fontSize:11.5,lineHeight:1.45,color:'#746B8D'}}>
                Public post. Your account and email will not be shown on the wall.
              </AlexText>
            </AlexBox>

            <AlexButton
              onClick={submit}
              disabled={sending||!message.trim()}
              startIcon={<MessageCircle size={17}/>}
              sx={{minHeight:46}}
            >
              {sending?'Sending...':'Send to Alex'}
            </AlexButton>
            <AlexText sx={{fontSize:11.5,lineHeight:1.45,color:'#8A849C',textAlign:'center'}}>
              No email needed. Just your feedback.
            </AlexText>
          </>}
        </AlexBox>
      </AlexBox>
    </AlexDrawer>
  </>
}
