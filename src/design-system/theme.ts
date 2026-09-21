import {createTheme} from '@mui/material/styles'

export const alexTheme=createTheme({
  palette:{
    mode:'light',
    primary:{main:'#6D5DFB',dark:'#4B3FCE',light:'#EEE9FF',contrastText:'#FFFFFF'},
    secondary:{main:'#FF6B6B',dark:'#D94F5C',light:'#FFE7E5',contrastText:'#251B4B'},
    success:{main:'#35B983',light:'#DDF8EA'},
    warning:{main:'#F2B84B',light:'#FFF2C7'},
    background:{default:'#F8F7FF',paper:'#FFFFFF'},
    text:{primary:'#251B4B',secondary:'#6D6785'},
    divider:'#E6E1F2'
  },
  shape:{borderRadius:16},
  typography:{
    fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button:{textTransform:'none',fontWeight:850,letterSpacing:'-.01em'},
    h1:{fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',fontWeight:900,letterSpacing:'-0.035em'},
    h2:{fontFamily:'ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", system-ui, sans-serif',fontWeight:850,letterSpacing:'-0.025em'}
  },
  components:{
    MuiCssBaseline:{styleOverrides:{
      body:{
        backgroundColor:'#F8F7FF',
        backgroundImage:'radial-gradient(circle at 8% 4%, rgba(255,209,102,.18), transparent 24%), radial-gradient(circle at 92% 0%, rgba(109,93,251,.12), transparent 26%)'
      },
      '::selection':{background:'#DCD5FF',color:'#251B4B'}
    }},
    MuiButton:{
      defaultProps:{disableElevation:true},
      styleOverrides:{
        root:{
          borderRadius:14,
          minHeight:42,
          paddingInline:18,
          boxShadow:'none',
          transition:'transform .14s ease, box-shadow .14s ease, background-color .14s ease',
          '&:hover':{transform:'translateY(-1px)'},
          '&:active':{transform:'translateY(1px)'}
        },
        containedPrimary:{
          boxShadow:'0 4px 0 #4B3FCE',
          '&:hover':{boxShadow:'0 5px 0 #4B3FCE'}
        }
      }
    },
    MuiOutlinedInput:{styleOverrides:{root:{borderRadius:14,background:'#fff'}}},
    MuiFormLabel:{styleOverrides:{root:{fontWeight:800,color:'#514B69'}}},
    MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}}
  }
})
