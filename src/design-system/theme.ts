import {createTheme} from '@mui/material/styles'

export const alexTheme=createTheme({
  palette:{
    mode:'light',
    primary:{main:'#6D5DFC',dark:'#5145CD',light:'#F2F0FF'},
    background:{default:'#F7F7FB',paper:'#FFFFFF'},
    text:{primary:'#111827',secondary:'#667085'},
    divider:'#E5E7EB'
  },
  shape:{borderRadius:14},
  typography:{
    fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button:{textTransform:'none',fontWeight:800},
    h1:{fontWeight:850,letterSpacing:'-0.04em'},
    h2:{fontWeight:800,letterSpacing:'-0.02em'}
  },
  components:{
    MuiButton:{defaultProps:{disableElevation:true},styleOverrides:{root:{borderRadius:12,minHeight:44,paddingInline:18}}},
    MuiOutlinedInput:{styleOverrides:{root:{borderRadius:12,background:'#fff'}}},
    MuiFormLabel:{styleOverrides:{root:{fontWeight:700,color:'#344054'}}},
    MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}}
  }
})
