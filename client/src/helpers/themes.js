import { createTheme } from '@mui/material/styles';

export const mainTheme = createTheme({
  typography: {
    fontFamily: [
      'prompt',
      'roboto',
    ].join(','),
    allVariants: {
      color: '#FFF'
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFE97F',
      contrastText: '#000'
    },
    secondary: {
      main: 'rgb(71, 77, 87)',
      contrastText: "rgb(234, 236, 239)"
    },
    warning: {
      main: '#f59100',
      contrastText: "#fff"
    },
    background: {
      default: '#1F1E1F',
      paper: '#1F1E1F'
    },
    text: {
      primary: '#FFF'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          lineHeight: 'inherit',
          padding: '10px 16px',
          fontFamily: 'prompt'
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          top: '50%',
          width: '25px'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            'webkitBoxShadow': '0 0 0 100px #282729 inset',
            'webkitTextFillColor': '#fff'
          }
        }
      }
    }
  }
})
