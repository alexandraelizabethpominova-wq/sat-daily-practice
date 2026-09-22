import {useState} from 'react'
import {Heart,MessageCircle,Smile,Wrench,X} from 'lucide-react'
import AlexBox from '../atoms/AlexBox'
import AlexButton from '../atoms/AlexButton'
import AlexButtonBase from '../atoms/AlexButtonBase'
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

const ALEX_PHOTO=`${import.meta.env.BASE_URL}alex-feedback-avatar.jpg`

function AlexAvatar({size=44}:{size?:number}){
  return <AlexBox
    aria-hidden="true"
    sx={{
      position:'relative',
      width:size,
      height:size,
      flex:`0 0 ${size}px`,
      borderRadius:'50%',
    }}
  >
    <AlexBox
      component="img"
      src={ALEX_PHOTO}
      alt=""
      sx={{
        width:'100%',
        height:'100%',
        display:'block',
        objectFit:'cover',
        objectPosition:'center 42%',
        borderRadius:'50%',
        border:'2px solid #fff',
        boxShadow:'0 0 0 2px #251B4B, 0 4px 12px rgba(37,27,75,.20)',
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

  function reset(){
    setVibe(null)
    setMessage('')
    setSent(false)
    setError('')
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
      const stored=await submitAppFeedback({vibe,message:trimmed,context})
      if(!stored)throw new Error('Feedback storage is unavailable.')
      setSent(true)
      setMessage('')
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
      onClick={()=>{setOpen(true);setSent(false);setError('')}}
      sx={{
        position:'fixed',
        right:{xs:12,sm:18,md:22},
        bottom:{xs:12,sm:18,md:22},
        zIndex:1150,
        width:56,
        height:56,
        minWidth:56,
        p:0,
        borderRadius:'50%',
        bgcolor:'transparent',
        overflow:'visible',
        transition:'transform .16s ease, filter .16s ease',
        '&:hover':{
          transform:'translateY(-2px) scale(1.03)',
          filter:'brightness(1.03)',
        },
        '&:active':{transform:'translateY(0) scale(.98)'},
      }}
    >
      <AlexAvatar size={52}/>
      <AlexBox sx={{
        position:'absolute',
        right:-2,
        bottom:-1,
        width:22,
        height:22,
        borderRadius:'50%',
        display:'grid',
        placeItems:'center',
        bgcolor:'#6D5DFB',
        color:'#fff',
        border:'2px solid #fff',
        boxShadow:'0 2px 6px rgba(37,27,75,.22)',
      }}>
        <MessageCircle size={12} strokeWidth={2.5}/>
      </AlexBox>
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
            <AlexText sx={{mt:.6,fontSize:13.5,color:'#526B61',lineHeight:1.5}}>Your note made it to Alex. Keep getting Alexified.</AlexText>
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
