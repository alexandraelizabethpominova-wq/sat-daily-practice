import {createTheme} from '@mui/material/styles'

export const alexTheme=createTheme({
  palette:{
    mode:'light',
    primary:{main:'#0B376D',dark:'#08275B',light:'#E8F2FF'},
    background:{default:'#F8F7F3',paper:'#FFFFFF'},
    text:{primary:'#08275B',secondary:'#5E6F87'},
    divider:'#D9D6CF'
  },
  shape:{borderRadius:10},
  typography:{
    fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button:{textTransform:'none',fontWeight:750},
    h1:{fontWeight:700,letterSpacing:'-0.025em'},
    h2:{fontWeight:700,letterSpacing:'-0.02em'}
  },
  components:{
    MuiCssBaseline:{styleOverrides:{body:{backgroundColor:'#F8F7F3'}}},
    MuiButton:{defaultProps:{disableElevation:true},styleOverrides:{root:{borderRadius:999,minHeight:38,paddingInline:18}}},
    MuiOutlinedInput:{styleOverrides:{root:{borderRadius:10,background:'#fff'}}},
    MuiFormLabel:{styleOverrides:{root:{fontWeight:700,color:'#344054'}}},
    MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}}
  }
})
