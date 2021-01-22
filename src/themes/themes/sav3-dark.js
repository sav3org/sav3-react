import createTheme from '../create-theme'

const lightPrimary = '#857990'

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#7a7380',
      main: '#4e4854',
      dark: '#26212b'
    },
    secondary: {
      // grey
      // main: '#a9a7a8',
      // blue
      main: '#484854'
    }
  },
  overrides: {
    MuiTypography: {
      colorPrimary: {
        // link colors are too dark
        color: lightPrimary
      }
    },
    MuiButton: {
      outlinedPrimary: {
        // outline buttons are too dark
        color: lightPrimary
      }
    }
  }
})

export default theme
